const db = require('../models/models.js');

const sessionController = {};

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

sessionController.verify = (req, res, next) => {
  const queryStr = 'SELECT * FROM sessions';
  db.query(queryStr)
    .then((data) => {
      res.locals.ssid = data.rows[0];
      return next();
    });
};

sessionController.end = (req, res, next) => {

};

module.exports = sessionController;
