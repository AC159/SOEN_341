var express = require('express');
var router = express.Router();
const multer = require('multer');
const uploadImage = require('../cloudStorage/helpers');
const bcrypt = require('bcryptjs');
const User = require('../Database/Models/User.js');


// Middleware to check for image size an
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Max image size is 10mb
  },
})


/* GET users listing. */

router.get('/', function(req, res) {

  // Fetch users here from database

  res.send({
    'users': ['AC', 'WY', 'NY', 'KL', 'RM']
  });


});


//  Route to save users to database
router.post('/signup', async function (req, res) {

    // Create new user:

    const user = new User({
      email: req.body.email,
      name: req.body.name,
      images: [],
      follows: [],
      followers: [],
      likes: []
    });

    try {

      await user.save();
      res.status(201).send({ user });

    } catch (error) {
      res.status(400).send({ error });
    }

})


// The 'name' property of the html "input" element must be named "image" and it will be stored in "req.file":
router.post('/images', upload.single('image'), async function(req, res, next) {

  try {

    const imageUrl = await uploadImage(req.file);

    // todo: save the public image url in the user object

    res.status(200).json({
      message: "Upload was successful!",
      data: imageUrl
    }).send();

  } catch (error) {
    res.send(error);
  }

});


// Users that aren't logged in are routed to /signup when they click Sign Up in the nav bar
// They are asked for their email, a password, and a confirmation of that password
router.post('/signup', function(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    req.checkBody('email', 'Required').notEmpty();
    req.checkBody('password', 'Required').notEmpty();
    req.checkBody('confirmPassword', 'Required; Passwords must match').equals(req.body.password);

    let newUser = new User({
      id:password,
      password:password
    });

    bcrypt.getSalt(10, function (salt) {
      bcrypt.hash(newUser.password, salt, function(hashedPassword){
        newUser.password = hashedPassword;
        newUser.save;
      });
    });

  }
  catch (error){

    res.send(error);
    res.render('SignUp');

  }
});


module.exports.router = router;

