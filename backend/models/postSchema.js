const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
    caption: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        require: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
})

const Post = mongoose.model("post", postSchema)

module.exports = Post;