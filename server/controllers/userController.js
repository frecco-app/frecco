const bcrypt = require('bcrypt');
const db = require('../models/models.js');

const userController = {};

/*
 * Expects format of req.body to be be:
 *   {
 *     "firstname":
 *     "lastname":
 *     "username":
 *     "password": <plain text>
 *   }
 */
userController.encrypt = (req, res, next) => {
  const { password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      res.locals.user = { ...req.body, password: hash };
      return next();
    })
    .catch((err) => next(err)); // For bcrypt internal errors
};

/*
 * Expects format of req.body and res.locals.user to both be:
 *   {
 *     "firstname":
 *     "lastname":
 *     "username":
 *     "password":
 *   }
 *   Where "password" is plain text in req.body and hashed in res.locals.user
 */
userController.authenticate = (req, res, next) => {
  bcrypt.compare(req.body.password, res.locals.user.password)
    .then((result) => {
      // If password correct, move to next middleware
      if (result) return next();

      // If password incorrect, call global error handler
      return next({
        log: 'Username or password incorrect',
        status: 400,
        message: { err: 'Username or password incorrect' }
      });
    })
    .catch((err) => next(err)); // For bcrypt internal errors
};

/*
* Creates the user and saves in database
* Expects format of req.body and 
*
*/

userController.createUser = (req, res, next) => {
  const {lastname, firstname, username} = req.body;
  const password = res.locals.user.password;
  const str = 'INSERT into "user" (lastname, firstname, username, password) VALUES ($1, $2, $3, $4);';
  const params = [lastname, firstname, username, password];
  db.query(str, params)
    .then(data => {
      return next();
    })
    .catch((err) => next(err))
};

/*
* Verifies the user
*
*/

userController.getUser = (req, res, next) => {
  const { username } = req.body;
  const str = 'SELECT * from "user" WHERE username = $1;';
  const params = [username];
  db.query(str, params)
    .then((data) => {
      res.locals.user = { 'password': data.rows[0].password };
      // console.log(res.locals.user);
      return next();
    })
    .catch ((err) => next(err));
};

/* Expects format of req.body and to  be:
 *   {
 *     "username":  <- this should probably be in req.cookies or something
 *     "location": , eg paris
 *     "category": , eg attraction
 *     "rating": integer from 1 to 5,
 *     "recommenation": , eg eiffel tower <- can think of a better name if confusing
 *     "review_text": eg it was pointy
 * 
 *   }
 
 */
userController.submitReview = (req, res, next) => {
  const { username, location, category, rating, recommendation, review_text } = req.body;
  const str = `INSERT INTO "review" (created_by, location, category, rating, recommendation, review_text)
               VALUES ($1, $2, $3, $4, $5, $6);`;
  const params = [username, location, category, rating, recommendation, review_text];
  db.query(str, params)
  .then((data) => {
    console.log(data);
    return next();
  })
  .catch((err) => next(err));

}

/* Expects format of req.body for user1 to follow user2:
 *   {
 *     "username":  <- his should probably be in req.cookies or something,
 *     "user2 id or username:  
 *     
 *  }
 * 
 * However you want to get to to us - could be req.params in case 1, req.body in case 2 below
 *    1. user1 can visit user2's profile. on user2's profile, there's a "follow" button (if user1 visits profile/user2, serve SELECT * from review WHERE created_by = user2)
 *    2. or is there just a search bar on user1's homepage to follow  user2?
 * 
 *  
 
 */

userController.follow = (req, res, next) => {
  const { user_id, followedUser } =  req.body;
  const str = `INSERT INTO "follows" (user_id, followed_user) VALUES ($1, $2)`;
  const params = [user_id, followedUser]
  db.query(str, params)
    .then((data) => {
      return next();
    })
    .catch((err) => next(err));
};


/* Category should be a dropdown, city/location from user text input, Rating minimum filter (1-5 stars)
 * Expects req.body to be in same format as submitReview with values either null if left blank (which would show all the posts) or send through req body:
 *   {
 *     "location": , eg paris 
 *     "category": , eg attraction
 *     "rating": integer from 1 to 5,
 *
 *   }
 * Returns an array of review posts with objects:
 *   {
        "id": 3,
        "created_by": "100",
        "location": "London",
        "category": "Attraction",
        "rating": 4,
        "recommendation": "Stonehenge",
        "review_text": "Saw some rocks outside of London",
        "likes": null
    },
*/

userController.filterReview = (req, res, next) => {
  const { location, category, rating } = req.body;
  let str = 'SELECT * from review '; // initial query string given no constraints
  const filterObj = {'location': location, 'category': category, 'rating >': rating};
  const filterArr = [location, category, rating];
  // check if any of the elements are populated (if all the elements are NOT empty)
  if (!filterArr.every((element) => element === '')) {
    str += 'WHERE'; // add a WHERE to query string if detects there is a constraint passed
    // filters through object and concatenates e.g. "location = 'London' AND" if value is not empty
    for (let key in filterObj) {
      if (filterObj[key] !== '') str+= ` ${key}= '${filterObj[key]}' AND`
    }
    str = str.slice(0, -4); // removes trailing 'AND'
  }
  str += 'ORDER BY likes DESC;'; // appends ranking filter by highest likes and final semicolon necessary for query command

  db.query(str)
    .then((data) => {
      res.locals.reviews = data.rows;
      return next();
    })
    .catch((err) => next(err));
};


module.exports = userController;
