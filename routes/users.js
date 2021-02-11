var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send({
    'message': 'Message from server at /users'
  });
});

module.exports = router;
