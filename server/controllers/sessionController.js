const db = require('../models/models.js');

const sessionController = {};

// Adds authentication cookie and user_id to sessions table
sessionController.start = (req, res, next) => {
  const { cookie } = res.locals;
  const { id } = res.locals.user;

  const queryStr = `INSERT INTO sessions (ssid, user_id)
                    VALUES ($1, $2)`;
  const params = [cookie, id];

  db.query(queryStr, params)
    .then(() => next())
    .catch(() => next({
      log: 'A problem occured creating a session',
      status: 500,
      message: { err: 'A problem occured creating a session' }
    }));
};

// Verifies that authentication cookie and sends user_id as response
sessionController.verify = (req, res, next) => {
  const queryStr = `SELECT user_id FROM sessions
                    WHERE ssid = $1`;
  const params = [req.cookies.xpgnssid];

  db.query(queryStr, params)
    .then((data) => {
      // Responds with user_id
      res.locals.user_id = data.rows[0].user_id;
      return next();
    })
    .catch(() => next({
      log: 'You must be logged in to complete that action',
      status: 400,
      message: { err: 'You must be logged in to complete that action' }
    }));
};

// Removes authentication cookie and user_id from sessions table
sessionController.end = (req, res, next) => {
  const queryStr = `DELETE FROM sessions
                    WHERE ssid = $1`;
  const params = [req.cookies.xpgnssid];

  db.query(queryStr, params)
    .then(() => next())
    .catch(() => next({
      log: 'A problem occured ending the session',
      status: 500,
      message: { err: 'A problem occured ending the session' }
    }));
};

module.exports = sessionController;
