var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res) {

  res.send({
    'users': ['AC', 'WY', 'NY', 'KL', 'RM']
  });

});

module.exports = router;
