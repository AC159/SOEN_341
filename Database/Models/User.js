let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// This file defines the User objects that will be saved to the db

let UserSchema = new Schema({
    _id: {type: String},
    avatar: {type: String},
    email: {type: String, required: true},
    name: {type: String, required: true, unique: true},
    images: Array,
    following: Array,
    followers: Array,
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
