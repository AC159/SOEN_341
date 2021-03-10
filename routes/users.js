var express = require('express');
var router = express.Router();
const multer = require('multer');
const cloudHelpers = require('../cloudStorage/helpers');
const User = require('../Database/Models/User.js');


// Middleware to check for image size an
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Max image size is 10mb
  },
})


/* GET a user's information:
*
* REQUEST PARAMS: req.body.name
*
*  */

router.get('/', async function(req, res) {

  // Fetch user here from database
  const users = await User.find({});
  res.json(users);

});


//  Route to save/create users to database

/* POST to create a user
*
* REQUEST PARAMS: req.body.email and req.body.name
*
*  */

router.post('/signup', async function (req, res) {

    if (!req.body.email || !req.body.name) {
      res.status(401).json({ error: "Name and email required" });
    }

    // Create new user:

    const user = new User({
      email: req.body.email,
      name: req.body.name,
      images: [],
      following: [],
      followers: []
    });

    try {

      await user.save();
      res.status(201).send({ user });

    } catch (error) {
      res.status(400).send({ error });
    }

})

/* POST an image for a user:
*
* REQUEST PARAMS: req.body.name + image file with name 'image'
*
*  */

// The 'name' property of the html "input" element must be named "image" and it will be stored in "req.file":
router.post('/images', upload.single('image'), async function(req, res, next) {

  if (!req.body.name) {
    res.status(401).json({ error: "Not Authorized. Authentication required." });
  }

  try {

    // Upload the image to google cloud and returns a public image url
    const imageUrl = await cloudHelpers.uploadImage(req.file);

    const filter = { "name": req.body.name };

    // Update user (append the new imageUrl to the images array)
    let user = await User.findOneAndUpdate(filter, { "$push": { images: { imageUrl: imageUrl, comments: [], likes: [] }}}, { new: true });

    res.status(200).json({
      user: user, // return updated user object
      message: "Upload was successful!",
      data: imageUrl // New image url
    });

  } catch (error) {
    res.send(error);
  }

});


/* DELETE an image for a user:
*
* REQUEST PARAMS: req.body.name + req.body.imageUrl
*
*  */

router.delete('/images', async function (req, res) {

  try {

    if (!req.body.name) {
      res.status(401).json({ error: "Not Authorized. Authentication required." });
    }

    // Delete user image in mongodb
    User.findOne({ name: req.body.name }, async function (error, user) {

      for (let i = 0; i < user.images.length; i++) {
        if (user.images[i].imageUrl === req.body.imageUrl) {
          user.images.splice(i, 1); // Delete the image from user object
          break;
        }
      }

      const response = await User.replaceOne({ name: req.body.name }, user);

      // Delete the image in google cloud bucket
      const data = await cloudHelpers.deleteImage(req.body.imageUrl);

      res.status(200).json({
        user: user, // return updated user object
        data: data
      });

    });

  } catch (error) {
    res.send(error);
  }

})



// Route to post a profile picture
/* POST an avatar for a user:
*
* REQUEST PARAMS: req.body.name + avatar file with name 'avatar'
*
*  */

// The 'name' property of the html "input" element must be named "avatar" and it will be stored in "req.file":
router.post('/avatar', upload.single('avatar'), async function(req, res, next) {

  try {

    if (!req.body.name) {
      res.status(401).json({ error: "Not Authorized. Authentication required" });
    }

    // Upload the image to google cloud and returns a public image url
    const avatarUrl = await uploadImage(req.file);

    const filter = { "name": req.body.name };

    // Update user (append the new imageUrl to the images array)
    let user = await User.findOneAndUpdate(filter, { "avatar": avatarUrl }, { new: true });

    res.status(200).json({
      user: user, // return updated user object
      message: "Upload was successful!",
      data: avatarUrl // New avatarUrl url
    });

  } catch (error) {
    res.send(error);
  }

});



/* POST a comment for an image:
*
* REQUEST PARAMS: req.body.imageUrl + req.body.comment + req.body.ImageOwnerName + req.body.name
*
* req.body.ImageOwnerName is the name of the OWNER OF THE PICTURE, NOT the person who comments
* req.body.name is the username of the person who comments
*  */

router.post('/comment', async function (req, res) {

  try {

    if (!req.body.ImageOwnerName) {
      res.status(401).json({ error: "Not Authorized. Authentication required." });
    }

    // Find the user of the picture that was commented on
    await User.findOne({ "name": req.body.ImageOwnerName }, async function (error, user) {

      if (error) {
        res.status(404).send(error);
      }

      // Append the comment to the corresponding image
      for (let i = 0; i < user.images.length; i++) {
          if (user.images[i].imageUrl === req.body.imageUrl) {
            user.images[i].comments.push({ username: req.body.name, comment: req.body.comment});
          }
        }

      const response = await User.replaceOne({ "name": req.body.ImageOwnerName }, user);

      res.status(200).json({
        user: user // return updated user object
      });

    });

  } catch (error) {
    res.send(error);
  }

})


/* POST a like for an image:
*
* REQUEST PARAMS: req.body.imageUrl + req.body.ImageOwnerName + req.body.name
*
* ImageOwnerName is the name of the OWNER OF THE PICTURE, NOT the person who likes
* req.body.name is the username of the person who likes the image
*  */

router.post('/like', async function (req, res) {

  // todo: maybe add a query parameter to remove a like for a picture ?

  try {

    if (!req.body.ImageOwnerName) {
      res.status(401).json({ error: "Not Authorized. Authentication required." });
    }

    // Find the user of the picture that was commented on
    await User.findOne({ "name": req.body.ImageOwnerName }, async function (error, user) {

      if (error) {
        res.status(404).send(error);
      }

      // Append the name of the user who liked the picture
      for (let i = 0; i < user.images.length; i++) {
        if (user.images[i].imageUrl === req.body.imageUrl) {
          user.images[i].likes.push(req.body.name);
        }
      }

      const response = await User.replaceOne({ "name": req.body.ImageOwnerName }, user);

      res.status(200).json({
        user: user // return updated user object
      });

    });

  } catch (error) {
    res.send(error);
  }

})


/* POST request to follow a user:
*
* REQUEST PARAMS: req.body.name + req.body.usernameToFollow
*
*  */

router.post('/follow', async function (req, res) {

  // todo: verify that the follower and the following users exist

    try {

      // Append to the 'following' field the name of the user the current user want to follow
      let user = await User.findOneAndUpdate({ name: req.body.name },
          { "$push": { following: req.body.usernameToFollow } }, { new: true });

      // Append to the 'followers' field of the other (followed) user the name of the current user
      let followedUser = await User.findOneAndUpdate({ name: req.body.usernameToFollow },
          { "$push": { followers: req.body.name  }}, { new: true });

      res.status(200).json({
        user: user
      });

    } catch (error) {
      res.send(error);
    }

})


module.exports.router = router;

