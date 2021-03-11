let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// This file defines the User objects that will be saved to the db

let PostSchema = new Schema({
    imageUrl: {
        type: String
    },
    comments: [{
        type: String
    }],
    likes: [{
        type: String
    }]
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
