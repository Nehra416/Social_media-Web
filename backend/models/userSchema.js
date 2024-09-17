const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    profilePicture: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Custom']
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    post: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    bookmark: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ]
}, { timestamps: true })

const User = mongoose.model("user", userSchema)

module.exports = User;