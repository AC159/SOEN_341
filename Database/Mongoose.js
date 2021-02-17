var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  id: {type: String, required: true, unique: true};
  password: {type: String, required: true};
  images: Array;
  follows: Array;
  followers: Array;
  likes: Array;
})

mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});
module.exports = mongoose.model('User', UserSchema);
