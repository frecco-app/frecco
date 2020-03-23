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
  userController.getReviews,
  (req, res) => res.status(200).json([
    res.locals.user.id, res.locals.user.username, res.locals.user.firstname, res.locals.reviews
  ]));

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

<<<<<<< HEAD
router.post('/like',
  sessionController.verify,
  userController.likeReview,
  (req, res) => res.sendStatus(200));

router.get('/getreview', userController.getReviews, (req, res) => {
  res.status(200).json(res.locals.reviews);
=======
router.get('/getreview',
  sessionController.verify,
  userController.getReviews,
  (req, res) => res.status(200).json(res.locals.reviews));

router.get('/getusers', userController.getUsers, (req, res) => {
  res.status(200).json(res.locals.followedUsers);
>>>>>>> dev
});

router.get('/getlikes', sessionController.verify, userController.getLikes, (req, res) => {
  res.status(200).json(res.locals.likes);
});

module.exports = router;
