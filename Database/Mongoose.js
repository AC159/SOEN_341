var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  id: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  images: Array,
  follows: Array,
  followers: Array,
  likes: Array,
})

mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});
module.exports = mongoose.model('User', UserSchema);
let mongoose = require('mongoose');
const chalk = require('chalk');
require("dotenv").config({ path: ".env" })


// This file contains the connection method to connect and save objects to the db
mongoose.connect(process.env.MONGODB_CLUSTER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => {
      console.log(chalk.green('Successfully connected to cluster...'))
    })
    .catch((error) => {
      console.log(chalk.red('Unable to connect to cluster...'));
    });

