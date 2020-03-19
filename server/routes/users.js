const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController.js');
const cookieController = require('../controllers/cookieController.js');
const sessionController = require('../controllers/sessionController.js');

router.get('/', (req, res) => {
  res.sendStatus(204);
});

/*
 * Sign up for new user
 * Expects req.body to be:
 *   {
 *     "firstname":
 *     "lastname":
 *     "username":
 *     "password": <plain text>
 *   }
 */
router.post('/signup',
  userController.encrypt,
  userController.create,
  (req, res) => res.redirect(307, './login'));

/*
 * Login user
 * Expects req.body to be:
 *   {
 *     "username":
 *     "password": <plain text>
 *   }
 */
router.post('/login',
  userController.verify,
  userController.authenticate,
  cookieController.encrypt,
  cookieController.setSSID,
  sessionController.start,
  (req, res) => res.sendStatus(204));

// Endpoint for user logout
router.post('/logout',
  sessionController.verify,
  sessionController.end,
  cookieController.removeSSID,
  (req, res) => res.sendStatus(204));

// Endpoint for user delete
router.post('/delete',
  sessionController.verify,
  userController.destroy,
  (req, res) => res.redirect(307, './logout'));

router.post('/submitreview',
  userController.submitReview,
  (req, res) => res.status(200).json('Submitted.'));

router.post('/follow',
  userController.follow,
  (req, res) => res.status(200).json('Followed'));

router.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' }
  };
  const errorObj = Object.assign(defaultErr, err);
  return res.status(errorObj.status).send(errorObj.message);
});


module.exports = router;
