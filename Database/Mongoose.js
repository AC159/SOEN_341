let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  id: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  images: Array,
  follows: Array,
  followers: Array,
  likes: Array
})


mongoose.connect(process.env.MONGODB_CLUSTER_URL, { useNewUrlParser: true });
module.exports = mongoose.model('User', UserSchema);
