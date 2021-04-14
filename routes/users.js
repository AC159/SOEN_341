const express = require('express');
const router = express.Router();
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
});

router.get('/:uid/followers', async (req, res) => {
  const users = await User.find({});
  return res.json(users);
});

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

const deleteUser = async (uid) => {

  try {

    await User.deleteOne({ _id: uid });
    return { message: 'User has been deleted' };

  } catch (error) {
    return { error, message: 'error' };
  }

}

const createUser = async (req) => {

  if (!req.body.email || !req.body.name) {
    return;
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
    return { user, message: 'Everything is clear!' };

  } catch (error) {
    return { error, message: 'error' };
  }
}

router.post('/signup', async function (req, res) {

    let response = await createUser(req);

    if (response.message === 'error') {
      res.status(404).send(response.error);
    }
    else if (response.message === 'Everything is clear!') {
      res.status(201).send(response.user);
    }
    else {
      res.status(401).json({ error: "Name and email required" });
    }

});

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

    // Fetch the old avatar url of the user if any:
    const user = await User.findOne({ "_id": req.body.uid });

    // Remove old avatar image if any:
    if (user.avatar) {
      const response = await cloudHelpers.deleteImage(user.avatar);
      console.log('Delete avatar response: ', response);
    }

    // Upload the image to google cloud and returns a public image url
    const avatarUrl = await cloudHelpers.uploadImage(req.file);

    // Update user with new avatar and save
    user.avatar = avatarUrl;
    await user.save();

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

/* POST request to follow a user:
*
* REQUEST PARAMS: req.body.uid + req.body.following_uid
*
*  */

const followFunction = async (req) => {

  try {

    if (!req.body.uid || !req.body.following_uid) {
      return {
        message: 'error when following a user'
      }
    }

    // Append to the 'following' field the name of the user the current user want to follow
    await User.findOneAndUpdate({ _id: req.body.uid },
        { "$addToSet": { following: req.body.following_uid } }, { new: true });

    let user = await User.findOne({ _id: req.body.uid }).populate('followers', '_id name avatar').populate('following', '_id name avatar');

    // Append to the 'followers' field of the other (followed) user the name of the current user
    await User.findOneAndUpdate({ _id: req.body.following_uid },
        { "$addToSet": { followers: req.body.uid  }}, { new: true });

    let followedUser = await User.findOne({ _id: req.body.following_uid }).populate('followers', '_id name avatar').populate('following', '_id name avatar');

    return {
      user: user,
      followedUser: followedUser,
      message: 'User followed successfully'
    }

  } catch (error) {
    return {
      message: 'error when following a user',
      error
    }
  }

}

router.post('/follow', async function (req, res) {

  let response = await followFunction(req);

  if (response.message !== 'error when following a user') {
    res.status(200).json({
      user: response.user,
      followedUser: response.followedUser
    });
  }
  else {
    res.send(response.error);
  }

});


/* POST request to unfollow a user:
*
* REQUEST PARAMS: req.body.uid + req.body.following_uid
*
*  */

const unfollowFunction = async (req) => {

  try {

    if (!req.body.uid || !req.body.following_uid) {
      return {
        message: 'error when unfollowing a user'
      }
    }

    await User.updateOne({ _id: req.body.uid },
        { "$pullAll": { following: [req.body.following_uid] } });

    let user = await User.findOne({ _id: req.body.uid }).populate('followers', '_id name avatar').populate('following', '_id name avatar');

    await User.updateOne({ _id: req.body.following_uid },
        { "$pullAll": { followers: [req.body.uid] }}, { new: true });

    let followedUser = await User.findOne({ _id: req.body.following_uid }).populate('followers', '_id name avatar').populate('following', '_id name avatar');

    return {
      user,
      followedUser,
      message: 'Operation successful'
    }

  } catch (error) {
    return {
      error,
      message: 'error when unfollowing a user'
    }
  }

}

router.post('/unfollow', async function (req, res) {

  let response = await unfollowFunction(req);

  if (response.message !== 'error when unfollowing a user') {
    res.status(200).json({
      user: response.user,
      followedUser: response.followedUser
    });
  }
  else {
    res.send(response.error);
  }

});

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


module.exports = {
  router: router,
  createUser: createUser,
  deleteUser: deleteUser,
  followFunction: followFunction,
  unfollowFunction: unfollowFunction
};

