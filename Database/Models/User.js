let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// This file defines the User objects that will be saved to the db

let UserSchema = new Schema({
    // id: {type: String}, this id will be autogenerated by mongodb
    email: {type: String, required: true},
    name: {type: String, required: true},
    images: Array,
    follows: Array,
    followers: Array,
    likes: Array
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
