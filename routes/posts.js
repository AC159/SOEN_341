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
        owner: req.body.uid
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

router.get('/', async (req, res) => {
    const posts = await Post.find({});
    return res.json(posts)
})
  
module.exports.router = router;
