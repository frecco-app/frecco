const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController.js');
const cookieController = require('../controllers/cookieController.js');

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

router.post('/signup', userController.encrypt, userController.createUser, (req, res) => {
  res.sendStatus(200);
  // Render some sort of success message?
});

router.post('/login',
  userController.verifyUser,
  userController.authenticate,
  cookieController.encrypt,
  (req, res) => res.status(200).json(res.locals.cookie));

router.post('/submitreview', userController.submitReview, (req, res) => {
  res.status(200).json('Submitted.');
});

router.post('/follow', userController.follow, (req, res) => {
  res.status(200).json('Followed');
});

router.get('/', (req, res) => {
  res.sendStatus(200);
});

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
