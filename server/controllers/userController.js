const bcrypt = require('bcrypt');
const db = require('../models/models.js');

const userController = {};

// Queries user information from user_id
userController.query = (req, res, next) => {
  const queryStr = `SELECT * FROM users
                    WHERE id = $1`;
  const params = [res.locals.userId];

  db.query(queryStr, params)
    .then((data) => {
      [res.locals.user] = data.rows;
      return next();
    })

    .catch(() => next({
      log: 'There was a problem querying user information',
      status: 500,
      message: { err: 'There was a problem querying user information' }
    }));
};

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

  const str = `SELECT * FROM users
               WHERE username = $1`;
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
  const params = [res.locals.userId];

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
 *     "username":
 *     "location": , eg paris
 *     "category": , eg attraction
 *     "rating": integer from 1 to 5,
 *     "recommendation": , eg eiffel tower <- can think of a better name if confusing
 *     "review_text": eg it was pointy
 *   }
 */
userController.submitReview = (req, res, next) => {
  const {
    location, category, rating, recommendation, reviewText, userId
  } = { ...req.body, userId: res.locals.userId };

  const str = `INSERT INTO reviews (location, category, rating, recommendation, review_text, created_by)
               VALUES ($1, $2, $3, $4, $5, $6)
               RETURNING *`;

  const params = [location, category, rating, recommendation, reviewText, userId];

  db.query(str, params)
    .then((data) => {
      if (data.rows !== []) {
        [res.locals.review] = data.rows;
        res.locals.review.username = res.locals.username;
        return next();
      }

      return next({
        log: 'There was a problem submitting a review',
        status: 400,
        message: { err: 'There was a problem with submitting a review' }
      });
    })

    .catch(() => next({
      log: 'There was a problem submitting a review',
      status: 500,
      message: { err: 'There was a problem submitting a review' }
    }));
};

// Get friends of user as arr
userController.getFollowers = (req, res, next) => {
  const queryStr = `SELECT fr.username
                    FROM (
                      SELECT user_id FROM follows
                      WHERE followed_user = $1
                    ) fl
                    INNER JOIN users fr
                    ON fl.user_id = fr.id`;
  const params = [res.locals.review.created_by];

  db.query(queryStr, params)
    .then((data) => {
      res.locals.followers = data.rows;
      return next();
    })

    .catch(() => next({
      log: 'There was a problem finding followers',
      status: 500,
      message: { err: 'There was a problem finding followers' }
    }));
};

// Emit review through socket channel
userController.emitReview = (req, res, next) => {
  const followers = [...res.locals.followers, { username: res.locals.username }];
  for (let i = 0; i < followers.length; i++) {
    const { username } = followers[i];
    req.socket.to(username).emit('post', res.locals.review);
  }
  return next();
};

/*
 * When user sees a rendered list of reviews, maybe can hit an X button next to the
 * one they want to delete, which sends to server a get request which expects format
 * of req.body to be in format of one of the reviews that server sends back to
 * front-end in array (from filterReview)
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
  const str = `DELETE from reviews
               WHERE id = $1`;
  const params = [req.body.id];
  db.query(str, params)
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
  const { userId } = res.locals;
  const { followedUser } = req.body;
  const str = `INSERT INTO follows (user_id, followed_user)
               VALUES ($1, $2)`;
  const params = [userId, followedUser];
  db.query(str, params)
    .then(() => {
      res.locals.followed = followedUser;
      return next();
    })
    .catch((err) => next(err));
};


/* Category should be a dropdown, city/location from user text input, Rating minimum filter
 * (1-5 stars) Expects req.body to be in same format as submitReview with values either null
 * if left blank (which would show all the posts) or send through req body:
 *   {
 *     "location": , eg paris
 *     "category": , eg attraction
 *     "rating": integer from 1 to 5,
 *      "userid": <- this might be in cookies or something,
 *     "toggleFollowing": empty if user only wants to see posts by those they are following
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
  // const { location, category, rating } = req.body;
  const str = `SELECT r.*, u.username
               FROM reviews r LEFT JOIN users u
               ON r.created_by = u.id`; // initial query string given no constraints
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


userController.likeReview = (req, res, next) => {
  // when user likes a review, increment # of likes on the review and add new row to the likes table
  if (req.body.isLiked === false) {
    const str = 'INSERT INTO likes (user_id, review_id) VALUES ($1, $2);';
    const str2 = 'UPDATE reviews SET likes = likes + 1 WHERE id = $1';
    const params = [res.locals.userID, req.body.review_id];
    db.query(str, params)
      .then(db.query(str2, params))
      .then(() => next())
      .catch((err) => next(err));
  }
  // do the opposite to unlike: decrement and delete
  else {
    console.log('bye');
  }
};

// Get posts that user currently likes
userController.getLikes = (req, res, next) => {
  const str = `SELECT * FROM likes WHERE user_id = ${res.locals.userId}`;
  db.query(str)
    .then((result) => {
      // result.rows is an array of objects; each obj is a row in the likes table
      // mapping to get only an array of review_ids that the user currently likes
      res.locals.likes = result.rows.map((el) => el.review_id);
      return next();
    })
    .catch((err) => next(err));
};


module.exports = userController;
