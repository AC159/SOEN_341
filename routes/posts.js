const router = require('express').Router();
const multer = require('multer');
const cloudHelpers = require('../cloudStorage/helpers');
const Post = require('../Database/Models/Post');
const User = require('../Database/Models/User.js');

// Middleware to check for image size
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // Max image size is 10mb
    },
  })


// Route to post a new picture
/* POST a picture for a user:
*
* REQUEST PARAMS: req.body.uid + req.body.caption + image file with name 'image'
*
*  */

router.post('/new', upload.single('image'), async function(req, res, next) {
    try {
  
      // Upload the image to google cloud and returns a public image url
      const imageUrl = await cloudHelpers.uploadImage(req.file);
      // Update user (append the new imageUrl to the images array)
      let post = new Post({
        imageUrl,
        comments: [],
        likes: [],
        owner: req.body.uid,
        caption: req.body.caption
      })
      await post.save();
      let user = await User.findByIdAndUpdate(req.body.uid, { "$push": { images: post._id}}, { new: true });
  
      res.status(200).json({
        user: user, // return updated user object
        message: "Upload was successful!",
        data: imageUrl // New image url
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
    await Post.findOne({"imageUrl": req.body.imageUrl} , async function (error, image) {

      if (error) {
        res.status(404).send(error);
      }
      image.comments.push({ person: req.body.name, content: req.body.comment, uid: req.body.uid});
      await Post.replaceOne({ "imageUrl": req.body.imageUrl }, image);

      res.status(200).json({
        image: image // return updated image object
      });

    });

  } catch (error) {
    res.send(error);
  }

});

  /* DELETE an image for a user:
*
* REQUEST PARAMS: req.body.imageUrl
*
*  */

router.delete('/:id', async function (req, res) {

    try {
      // Delete user image in mongodb
      const post = await Post.findById(req.params.id);
      User.findOne({ _id: post.owner }, async function (error, user) {
  
        for (let i = 0; i < user.images.length; i++) {
          if (user.images[i] === req.params.id) {
            user.images.splice(i, 1); // Delete the image from user object
            break;
          }
        }
  
        const response = await User.replaceOne({ _id: post.owner }, user);
  
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
  
  });


// Route to get a post
/* GET a post for a user:
*
* REQUEST PARAMS: req.params.uid
*
*  */

router.get('/:uid', async (req, res) => {
  const posts = await Post.find({owner: req.params.uid}).populate('owner', '_id name avatar');
  return res.json(posts);
});



/* GET all posts from database:
*
* REQUEST PARAMS: No params
*
*/
router.get('/', async (req, res) => {
    const posts = await Post.find({}).populate('owner', '_id name avatar');
    return res.json(posts);
});


// Route to like a post
/* POST a like on a post:
*
* REQUEST PARAMS: req.body.name + req.body.postID
*
*  */

const likeFunction = async (req) => {

  try {

    let post = await Post.findOneAndUpdate({ _id: req.body.postID },
        { "$addToSet": { likes: req.body.name } }, { new: true });

    return {
      message: 'success',
      post
    }

  } catch (error) {
    return {
      error,
      message: 'error'
    }
  }

}

router.post('/like', async (req, res) => {

  let response = await likeFunction(req);

  if (response.message !== 'error') {

    res.status(200).json({
      post: post
    });

  } else {
    res.send(error);
  }

});


// Route to unlike a post
/* POST an unlike on a post:
*
* REQUEST PARAMS: req.body.name + req.body.postID
*
*  */

router.post('/unlike', async (req, res) => {

  try {

    let post = await Post.findOneAndUpdate({ _id: req.body.postID },
        { "$pull": { likes: req.body.name } }, { new: true });

    res.status(200).json({
      post: post
    });

  } catch (error) {
    res.send(error);
  }

});
  
module.exports = {
  router,
  likeFunction: likeFunction
};
