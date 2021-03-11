const router = require('express').Router();
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

  /* DELETE an image for a user:
*
* REQUEST PARAMS: req.body.name + req.body.imageUrl
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
  
  })

router.get('/', async (req, res) => {
    const posts = await Post.find({});
    return res.json(posts)
})
  
module.exports.router = router;
