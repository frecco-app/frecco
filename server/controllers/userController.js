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
  .catch (err => next(err));
}








module.exports = userController;
