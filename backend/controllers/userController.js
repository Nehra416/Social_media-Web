const User = require("../models/userSchema");
const Post = require("../models/postSchema");
const jwt = require("jsonwebtoken")


const signUp = async (req, res) => {
    try {
        // take data which is send by the client
        const { username, email, password } = req.body;

        // checking that all field are filled 
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All Fields are Required",
                success: false
            })
        }

        // checking that already a user is exist on this username
        const userByName = await User.findOne({ username })
        if (userByName) {
            return res.status(400).json({
                message: "Already a account is created by this Username",
                success: false
            })
        }

        // checking that already a user is exist on this email
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "Already a account is created on this Email",
                success: false
            })
        }

        // create a new account of client
        await User.create({
            username, email, password
        })

        // send a message of success in response 
        return res.status(201).json({
            message: "Account is created Successfully...",
            success: true
        })

    } catch (error) {
        console.log(`Error is in userController's signUp function : ${error}`)
    }
}

const signIn = async (req, res) => {
    try {
        // take data which is send by the client
        const { email, password } = req.body;

        // checking that all field are filled 
        if (!email || !password) {
            return res.status(400).json({
                message: "All Fields are Required",
                success: false
            })
        }

        // checking that can a account is created on this email
        const user = await User.findOne({ email })

        // if user is not found then return its req with a response of no account found
        if (!user) {
            return res.status(400).json({
                message: "No Account is exist on this Email",
                success: false
            })
        }

        // if user is found then compare the stored password and password of client
        const pwd = user.password
        if (pwd !== password) {
            return res.status(400).json({
                message: "Incorect Password",
                success: false
            })
        }

        // if client is login then make a payload(object) which carry its id & email 
        const payload = {
            _id: user._id,
            email: user.email,
            // username: user.username,
        }

        // take all the data of user from the database for send to the client as a response
        const userData = {
            _id: user._id,
            username: user.username,
            // email: user.email,
            profilePicture: user.profilePicture,
            // bio: user.bio,
            // gender: user.gender,
            // followers: user.followers,
            // following: user.following,
            // post: user.post,
            bookmark: user.bookmark,
        }

        
        // takes the posts from the database which is created by the user
        // const populatedPosts = await Promise.all(
        //     user.post.map(async (postId) => {
        //         const post = await Post.findById(postId)
        //         if (post.author.equals(user._id)) {
        //             return post;
        //         }
        //         return null;
        //     })
        // )
        // console.log("populated post is : ", populatedPosts)

        // create a unique token to send to the client's browser which carry payload 
        const token = jwt.sign(payload, process.env.SECRET_KEY)
        return res.cookie('token', token).json({
            message: `Welcome ${user.username}`,
            success: true,
            userData,
            // populatedPosts,
        })

    } catch (error) {
        console.log(`Error is in userController's signIn function : ${error}`)
    }
}


const signOut = (req, res) => {
    try {
        // send a empty token to the user which replace the existance token and then expire emidiate
        return res.cookie('token', '', { maxAge: 0 }).json({
            message: 'SignOut out Successfully',
            success: true,
        })
    } catch (error) {
        console.log(`Error is in userController's signOut function : ${error}`)
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        // let edited 
        const userProfile = await User.findById(userId).select("-password").populate("post").populate("bookmark")
        // console.log("userprofile : ",userProfile)
        return res.status(200).json({
            userProfile,
            success: true
        })
    } catch (error) {
        console.log(`Error is in userController's getProfile function : ${error}`)
    }
}

const editProfile = async (req, res) => {
    try {
        const userId = req.id // from the token payload
        const { bio, gender, profilePicture } = req.body;
        // console.log("req.body is ",req.body);

        // at present we don't use multer
        // console.log(req.file)
        // const profilePicture = req.file?.filename;

        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(404).json({
                message: "User not Found",
                success: false
            })
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = profilePicture

        await user.save();

        return res.status(200).json({
            message: "Profile is Updated",
            success: true,
            user
        })

    } catch (error) {
        console.log(`Error is in userController's editProfile function : ${error}`)
    }
}

const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password")
        if (!suggestedUsers) {
            return res.status(400).json({
                message: "User Suggestion is currently Unavilable"
            })
        }

        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })

    } catch (error) {
        console.log("Error in the getSuggestedUsers : ", error)
    }
}

const followOrUnfollow = async (req, res) => {
    try {
        const whoFollow = req.id;
        const followWhom = req.params.id;
        if (whoFollow === followWhom) {
            return res.status(400).json({
                message: "You can't follow or unfollow yourself",
                success: false
            })
        }

        const user = await User.findById(whoFollow)
        const secondUser = await User.findById(followWhom)

        if (!user || !secondUser) {
            return res.status(400).json({
                message: "One of the both user is missing",
                success: false
            })
        }

        const isFollowing = user.following.includes(followWhom)
        if (isFollowing) {
            // unfollow logic...
            await Promise.all([
                User.updateOne({ _id: whoFollow }, { $pull: { following: followWhom } }),
                User.updateOne({ _id: followWhom }, { $pull: { followers: whoFollow } }),
            ])
            return res.status(200).json({
                message: "Unfollow Succesfully",
                success: true
            })
        } else {
            // follow logic...
            await Promise.all([
                User.updateOne({ _id: whoFollow }, { $push: { following: followWhom } }),
                User.updateOne({ _id: followWhom }, { $push: { followers: whoFollow } })
            ])
            return res.status(200).json({
                message: "Follow Succesfully",
                success: true
            })
        }
    } catch (error) {
        console.log("Error in follow or unfollow controller : ", error)
    }
}

module.exports = {
    signUp, signIn, signOut, getProfile, editProfile, getSuggestedUsers, followOrUnfollow
}