const bcrypt = require('bcrypt');
const db = require('../models/models.js');

const userController = {};

// Encrypts user password
userController.encrypt = (req, res, next) => {
  const { password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      res.locals.user = { ...req.body, password: hash };
      return next();
    })

    // Internal bcrypt error
    .catch(() => next({
      log: 'Incorrect input format',
      status: 400,
      message: { err: 'Incorrect input format' }
    }));
};

// Adds user to user table
userController.create = (req, res, next) => {
  const {
    firstname, lastname, username, password
  } = res.locals.user;

  const queryStr = `INSERT INTO users (firstname, lastname, username, password)
                    VALUES ($1, $2, $3, $4)`;
  const params = [firstname, lastname, username, password];

  db.query(queryStr, params)
    .then(() => next())
    .catch(() => next({
      log: 'Username already exists',
      status: 400,
      message: { err: 'Username already exists' }
    }));
};

// Verifies that user exists and returns row from users table
userController.verify = (req, res, next) => {
  const { username, password } = req.body;

  const str = 'SELECT * from users WHERE username = $1;';
  const params = [username];

  db.query(str, params)
    .then((data) => {
      // If user exists, send data to next middleware
      if (data.rows !== []) {
        [res.locals.user] = data.rows;
        res.locals.password = password;
        return next();
      }

      // If user does not exist, call global error handler
      return next({
        log: 'Username or password incorrect',
        status: 400,
        message: { err: 'Username or password incorrect' }
      });
    })

    // Internal server error
    .catch(() => next({
      log: 'A problem occured verifying user',
      status: 500,
      message: { err: 'A problem occured verifying user' }
    }));
};

// Compares plain text password on res.locals.password to hashed password
userController.authenticate = (req, res, next) => {
    bcrypt.compare(res.locals.password, res.locals.user.password)
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

      // Formatting error
      .catch(() => next({
        log: 'Incorrect input format',
        status: 400,
        message: { err: 'Incorrect input format' }
      }));
};

// Removes user from users table
userController.destroy = (req, res, next) => {
  const queryStr = `DELETE FROM users
                    WHERE id = $1`;
  const params = [res.locals.user_id];

  db.query(queryStr, params)
    .then(() => next())
    .catch(() => next({
      log: 'A problem occured removing account',
      status: 500,
      message: { err: 'A problem occured removing account' }
    }));
};

/* Expects format of req.body and to  be:
 *   {
 *     "username":  <- this should probably be in req.cookies or something
 *     "location": , eg paris
 *     "category": , eg attraction
 *     "rating": integer from 1 to 5,
 *     "recommendation": , eg eiffel tower <- can think of a better name if confusing
 *     "review_text": eg it was pointy
 *
 *   }
 */
userController.submitReview = (req, res, next) => {
  const {
    location, category, rating, recommendation, review_text
  } = req.body;
  const str = `INSERT INTO "review" (created_by, location, category, rating, recommendation, review_text)
               VALUES ($1, $2, $3, $4, $5, $6);`;
  const params = [res.locals.user_id, location, category, rating, recommendation, review_text];
  db.query(str, params)
    .then(() => next())
    .catch(() => next({
      log: 'problem with db query',
      status: 500,
      message: {err: 'problem with db query'}
    }));
};

/* 
 * When user sees a rendered list of reviews, maybe can hit an X button next to the one they want to delete, which sends to server a get request which expects format of req.body to be in format of one of the reviews that server sends back to front-end in array (from filterReview) 
 *   {
 *       "id": 3,
 *       "created_by": "100",
 *       "location": "London",
 *       "category": "Attraction",
 *       "rating": 4,
 *       "recommendation": "Stonehenge",
 *       "review_text": "Saw some rocks outside of London",
 *       "likes": null
 *
 *   }
 */

userController.deleteReview = (req, res, next) => {
  const { id } = req.body;
  const str = `DELETE from "review" WHERE id = ${id};`;
  db.query(str)
    .then(() => next())
    .catch((err) => next(err));
};

/* Expects format of req.body for user1 to follow user2:
 *   {
 *     "username":  <- this should probably be in req.cookies or something,
 *     "user2 id or username:
 *  }
 *
 * However you want to get to to us - could be req.params in case 1, req.body in case 2 below
 *    1. user1 can visit user2's profile. on user2's profile, there's a "follow" button (if user1
 *       visits profile/user2, serve SELECT * from review WHERE created_by = user2)
 *    2. or is there just a search bar on user1's homepage to follow  user2?
 */

userController.follow = (req, res, next) => {
  const { followedUser } = req.body;
  console.log('userController.follow', followedUser);
  const str = 'INSERT INTO "follows" (user_id, followed_user) VALUES ($1, $2);';
  const params = [res.locals.user_id, followedUser];
  db.query(str, params)
    .then(() => next())
    .catch((err) => next(err));
};


/* Category should be a dropdown, city/location from user text input, Rating minimum filter (1-5 stars)
 * Expects req.body to be in same format as submitReview with values either null if left blank (which would show all the posts) or send through req body:
 *   {
 *     "location": , eg paris 
 *     "category": , eg attraction
 *     "rating": integer from 1 to 5,
 *      "userid": <- this might be in cookies or something,
 *     "toggleFollowing": has a value if user only wants to see posts by those s/he is following, otherwise empty
 *   }
 * Returns an array of review posts with multiple objects in format of:
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

userController.getReviews = (req, res, next) => {
  //const { location, category, rating } = req.body;
  let str = `SELECT review.*, u.username from review 
            LEFT JOIN users as u ON review.created_by = u.id`; // initial query string given no constraints
  // const filterObj = { 'location': location, 'category': category, 'rating >': rating };
  // const filterArr = [location, category, rating];
  // // check if any of the elements are populated (if all the elements are NOT empty)
  // if (!filterArr.every((element) => element === '')) {
  //   str += 'WHERE'; // add a WHERE to query string if detects there is a constraint passed
  //   // filters through object and concatenates e.g. "location = 'London' AND" if value is not empty
  //   for (let key in filterObj) {
  //     if (filterObj[key] !== '') str+= ` ${key}= '${filterObj[key]}' AND`
  //   };
  //   str = str.slice(0, -4); // removes trailing 'AND'
  // }
  // str += 'ORDER BY likes DESC;'; // appends ranking filter by highest likes and final semicolon necessary for query command
  db.query(str)
    .then((data) => {
      res.locals.reviews = data.rows;
      return next();
    })
    .catch((err) => next(err));
};


module.exports = userController;
