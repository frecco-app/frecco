const bcrypt = require('bcrypt');

const cookieController = {};

cookieController.encrypt = (req, res, next) => {
  const { username } = res.locals.user;

  bcrypt.hash(username, 10)
    .then((hash) => {
      res.locals.cookie = hash;
      return next();
    })
    // For bcrypt internal errors
    .catch((err) => next({
      log: 'A problem occured encrypting authentication cookie',
      status: 400,
      message: { err: 'A problem occured encrypting authentication cookie' }
    }));
};

cookieController.setSSIDCookie = (res, req, next) => {
  res.cookie('ssid', '');
};

cookieController.removeSSIDCookie = () => {

};

module.exports = cookieController;
