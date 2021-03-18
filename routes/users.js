var express = require('express');
var router = express.Router();
const multer = require('multer');
const cloudHelpers = require('../cloudStorage/helpers');
const Post = require('../Database/Models/Post');
const User = require('../Database/Models/User.js');


// Middleware to check for image size an
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Max image size is 10mb
  },
})

router.get('/:uid/followers', async (req, res) => {
  const users = await User.find({});
  return res.json(users);
})

/* GET a user's information:
*
* REQUEST PARAMS: req.body.name
*
*  */

router.get('/:uid', async function(req, res) {

  // Fetch user here from database
  const user = await User.findById(req.params.uid).populate('followers', '_id name avatar').populate('following', '_id name avatar');
  return res.json(user);
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
    console.log(req.body)

    const user = new User({
      _id: req.body.uid,
      email: req.body.email,
      name: req.body.name,
      avatar: "",
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



// Route to post a profile picture
/* POST an avatar for a user:
*
* REQUEST PARAMS: req.body.name + avatar file with name 'avatar'
*
*  */

// The 'name' property of the html "input" element must be named "avatar" and it will be stored in "req.file":
router.post('/avatar', upload.single('avatar'), async function(req, res, next) {

  try {

    if (!req.body.uid) {
      res.status(401).json({ error: "Not Authorized. Authentication required" });
    }
    // Upload the image to google cloud and returns a public image url
    const avatarUrl = await cloudHelpers.uploadImage(req.file);
    console.log("e")
    console.log(avatarUrl);
    const filter = { "_id": req.body.uid };

    // Update user (append the new imageUrl to the images array)
    let user = await User.findOneAndUpdate(filter, { "avatar": avatarUrl }, { new: true });

    res.status(200).json({
      user: user, // return updated user object
      message: "Upload was successful!",
      data: avatarUrl // New avatarUrl url
    });

  } catch (error) {
    console.log(error);
    res.send(error);
  }

});


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
* REQUEST PARAMS: req.body.uid + req.body.following_uid
*
*  */

router.post('/follow', async function (req, res) {

    try {

      // Append to the 'following' field the name of the user the current user want to follow
      await User.findOneAndUpdate({ _id: req.body.uid },
          { "$addToSet": { following: req.body.following_uid } }, { new: true });

      let user = await User.findOne({ _id: req.body.uid }).populate('followers', '_id name avatar').populate('following', '_id name avatar');

      // Append to the 'followers' field of the other (followed) user the name of the current user
      await User.findOneAndUpdate({ _id: req.body.following_uid },
          { "$addToSet": { followers: req.body.uid  }}, { new: true });

      let followedUser = await User.findOne({ _id: req.body.following_uid }).populate('followers', '_id name avatar').populate('following', '_id name avatar');

      res.status(200).json({
        user: user,
        followedUser: followedUser
      });

    } catch (error) {
      res.send(error);
    }

})

/* POST request to unfollow a user:
*
* REQUEST PARAMS: req.body.uid + req.body.following_uid
*
*  */

router.post('/unfollow', async function (req, res) {

  try {

    await User.updateOne({ _id: req.body.uid },
        { "$pullAll": { following: [req.body.following_uid] } });

    let user = await User.findOne({ _id: req.body.uid }).populate('followers', '_id name avatar').populate('following', '_id name avatar');

    await User.updateOne({ _id: req.body.following_uid },
        { "$pullAll": { followers: [req.body.uid] }}, { new: true });

    let followedUser = await User.findOne({ _id: req.body.following_uid }).populate('followers', '_id name avatar').populate('following', '_id name avatar');

    res.status(200).json({
      user: user,
      followedUser: followedUser
    });

  } catch (error) {
    res.send(error);
  }

})

router.get('/search/:filter', async function (req, res) {

  try {

    const users = await User.find({ name: req.params.filter });

    // todo: only send back a max of 10 values ??

    res.status(200).json({
      users
    });

  } catch (error) {
    res.send(error);
  }


});


module.exports.router = router;

