const bcrypt = require('bcrypt');

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

module.exports = userController;
