const bcrypt = require('bcrypt');

const cookieController = {};

// Encrypts user_id and stores hash on res.locals.cookie
cookieController.encrypt = (req, res, next) => {
  const { username } = res.locals.user;

  bcrypt.hash(username, 10)
    .then((hash) => {
      res.locals.cookie = hash;
      return next();
    })
    // For bcrypt internal errors
    .catch(() => next({
      log: 'A problem occured encrypting authentication cookie',
      status: 500,
      message: { err: 'A problem occured encrypting authentication cookie' }
    }));
};

// Sets authentication cookie
cookieController.setSSID = (req, res, next) => {
  try {
    res.cookie('xpgnssid', res.locals.cookie);
    return next();
  } catch {
    return next({
      log: 'A problem occured setting authentication cookie',
      status: 500,
      message: { err: 'A problem occured setting authentication cookie' }
    });
  }
};

cookieController.removeSSID = (req, res, next) => {
  try {
    res.clearCookie('xpgnssid');
    return next();
  } catch {
    return next({
      log: 'A problem occured removing authentication cookie',
      status: 500,
      message: { err: 'A problem occured removing authentication cookie' }
    });
  }
};

module.exports = cookieController;
