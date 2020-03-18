const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController.js');
const cookieController = require('../controllers/cookieController.js');
const sessionController = require('../controllers/sessionController.js');

/*
* Sign up for new user; expects res.locals.newUser to be
 *   {
 *     "firstname":
 *     "lastname":
 *     "username":
 *     "password": <plain text>
 *   }
 *
*/

router.get('/', (req, res) => {
  res.sendStatus(200);
});

// Endpoint for user signup
router.post('/signup',
  userController.encrypt,
  userController.create,
  (req, res) => res.sendStatus(200));

// Endpoint for user login
router.post('/login',
  userController.verify,
  userController.authenticate,
  cookieController.encrypt,
  cookieController.setSSID,
  sessionController.start,
  (req, res) => res.sendStatus(200));

router.post('/submitreview',
  userController.submitReview,
  (req, res) => res.status(200).json('Submitted.'));

router.post('/follow',
  userController.follow,
  (req, res) => res.status(200).json('Followed'));

router.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' }
  };
  const errorObj = Object.assign(defaultErr, err);
  return res.status(errorObj.status).send(errorObj.message);
});


module.exports = router;
