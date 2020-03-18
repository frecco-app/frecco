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
      status: 500,
      message: { err: 'A problem occured encrypting authentication cookie' }
    }));
};

cookieController.setSSID = (req, res, next) => {
  try {
    res.cookie('ssid', res.locals.cookie);
    return next();
  } catch {
    return next({
      log: 'A problem occured setting authentication cookie',
      status: 500,
      message: { err: 'A problem occured setting authentication cookie' }
    });
  }
};

cookieController.removeSSID = () => {

};

module.exports = cookieController;
