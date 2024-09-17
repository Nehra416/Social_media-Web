const Post = require("../models/postSchema");
const User = require("../models/userSchema");
const Comment = require("../models/commentSchema");
const { getRecieverSocketId, io } = require("../socket/socket");

const addNewPost = async (req, res) => {
    try {
        const { caption, image } = req.body;
        // console.log("caption is the :", caption)
        // console.log("caption is the :", req.body)
        // console.log("caption is the :", req.file)
        // const image = req.file;
        const authorId = req.id;

        if (!image) return res.status(400).json({ message: "Image required" })

        const post = await Post.create({
            caption,
            // image: req.file.originalname,
            image: image,
            author: authorId,
        })

        const user = await User.findById(authorId);
        if (user) {
            user.post.push(post._id);
            await user.save();
        }

        await post.populate({ path: "author", select: "-password" }); // ???????????????
        return res.status(201).json({
            message: "New post Added",
            success: true,
            post
        })

    } catch (error) {
        console.log("Error is in the addNewPost controllers : ", error)
    }
}

const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find({}) // sort wil not effect the post...???
            .populate({ path: "author", select: "username profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "username profilePicture"
                }
            })

        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log("Error is in the getAllPost controller : ", error)
    }
}

const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({ path: "author", select: "username, profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "username, profilePicture"
                }
            })

        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log("Error is in the getUserPost controller : ", error)
    }
}

const likePost = async (req, res) => {
    try {
        const whoLike = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(400).json({ message: "Post not found", success: false })

        // logic for like
        await post.updateOne({ $addToSet: { likes: whoLike } }) // addtoset ke vaja se ek banda ek hi like ker sakta h only ?????????????
        await post.save();

        // socket io for realtime notification
        const user = await User.findById(whoLike).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if (postOwnerId !== whoLike) {
            // tabhi hm notification send kare ge
            const notification = {
                type: 'like',
                userId: whoLike,
                userDetails: user,
                postId,
                message: 'Your Post is liked'
            }
            const postOwnerSocketId = getRecieverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification)

        }

        return res.status(200).json({ message: "Post liked", success: true })
    } catch (error) {
        console.log("Error is in the likePost controller : ", error)
    }
}

const dislikePost = async (req, res) => {
    try {
        const whoLike = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(400).json({ message: "Post not found", success: false })
        // logic
        await post.updateOne({ $pull: { likes: whoLike } }) // ?????????????
        await post.save();

        // socket.io
        const user = await User.findById(whoLike).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if (postOwnerId !== whoLike) {
            // tabhi hm notification send kare ge
            const notification = {
                type: 'dislike',
                userId: whoLike,
                userDetails: user,
                postId,
                message: 'Your Post is liked'
            }
            const postOwnerSocketId = getRecieverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification)

        }

        return res.status(200).json({ message: "Post disliked", success: true })
    } catch (error) {
        console.log("Error is in the dislikePost controller : ", error)
    }
}

const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userWhoComments = req.id;

        // console.log(req.body)
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: "text is required", success: true })

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found", success: false });

        // create comment...
        const comment = await Comment.create({
            text,
            author: userWhoComments,
            post: postId
        });

        // populate the comment...
        const commentUser = await comment.populate({
            path: "author",
            select: "username profilePicture"
        })

        post.comments.push(comment._id)
        await post.save();

        return res.status(200).json({
            message: "Comment Added",
            comment: commentUser,
            success: true
        })

    } catch (error) {
        console.log("Error is in the addComment controller : ", error)
    }
}

const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId })
            .populate("author", "username profilePicture");

        if (!comments) return res.status(404).json({
            message: "No comments found for this post",
            success: false
        })

        return res.status(200).json({ success: true, comments })
    } catch (error) {
        console.log("Error is in the getCommentsOfPost controller : ", error)
    }
}

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found", success: false })

        if (post.author.toString() !== authorId) return res.status(403).json({ message: "Unauthorized" })

        // delete post...
        await Post.findByIdAndDelete(postId);

        // remove post id from the user's post...
        let user = await User.findById(authorId)
        user.post = user.post.filter(id => id.toString() !== postId)
        await user.save();

        // delete comments of this post...
        await Comment.deleteMany({ post: postId })

        return res.status(200).json({
            message: "Post deleted",
            success: true
        })

    } catch (error) {
        console.log("Error is in the deletePost controller : ", error)
    }
}

const bookmarkPost = async (req, res) => {
    try {
        const authorId = req.id;
        const postId = req.params.id;

        const post = await Post.findById(postId)
        if (!post) return res.status(404).json({
            message: "Post not found", success: false
        })

        const user = await User.findById(authorId);
        if (user.bookmark.includes(post._id)) {
            // when we unBookmarked post...
            await user.updateOne({ $pull: { bookmark: post._id } })
            await user.save();
            return res.status(200).json({ type: "unSaved", message: "Post removed from bookmarked", success: true })
        } else {
            // when we bookmark post...
            await user.updateOne({ $addToSet: { bookmark: post._id } })
            await user.save();
            return res.status(200).json({ type: "saved", message: "Post bookmarked", success: true })
        }

    } catch (error) {
        console.log("Error is in the bookmarkPost controller : ", error)
    }
}

module.exports = {
    addNewPost,
    getAllPost,
    getUserPost,
    likePost,
    dislikePost,
    addComment,
    getCommentsOfPost,
    deletePost,
    bookmarkPost
}