const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController.js');
const cookieController = require('../controllers/cookieController.js');
const sessionController = require('../controllers/sessionController.js');

// Gets user info from cookie
router.get('/',
  sessionController.verify,
  userController.query,
  (req, res) => res.status(200).json(res.locals.user));

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
  sessionController.verify,
  userController.submitReview,
  userController.getFollowers,
  userController.emitReview,
  (req, res) => res.sendStatus(204));

router.post('/follow',
  sessionController.verify,
  userController.follow,
  (req, res) => res.status(200).json(res.locals.followed));

router.get('/getreview', userController.getReviews, (req, res) => {
  res.status(200).json(res.locals.reviews);
});

module.exports = router;
