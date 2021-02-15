var express = require('express');
var router = express.Router();
const multer = require('multer');
const uploadImage = require('../cloudStorage/helpers');

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


// The 'name' property of the html "input" element must be named "image" and it will be stored in "req.file":
router.post('/images', upload.single('image'), async function(req, res, next) {

  try {

    const imageUrl = await uploadImage(req.file);

    res.status(200).json({
      message: "Upload was successful!",
      data: imageUrl
    }).send();

  } catch (error) {
    res.send(error);
  }

});

module.exports.router = router;

