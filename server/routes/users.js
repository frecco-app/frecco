const express = require ('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const db = require('../models/models.js');



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

router.post('/signup', userController.encrypt, userController.createUser, (req,res) => {
  res.sendStatus(200);
  // Render some sort of success message?
});

router.post('/login', userController.getUser, userController.authenticate, (req,res) => {
  res.sendStatus(200);
  res.redirect('/loginpage') //
  // Render some sort of success message?
});


router.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' }, 
  };
  const errorObj = Object.assign(defaultErr, err);
  return res.status(errorObj.status).send(errorObj.message);
}


module.exports = router;