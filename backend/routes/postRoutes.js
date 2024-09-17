const express = require("express");
const { addNewPost, getAllPost, getUserPost, likePost, dislikePost, getCommentsOfPost, bookmarkPost, deletePost, addComment } = require("../controllers/postController");
const checkAuthentication = require("../middlewares/checkAuthentication");
const upload = require("../middlewares/multer");
const router = express.Router();

// use get post on the base of data send or not (acc to change or not something in server)
// router.post("/add", checkAuthentication, upload.single('image'), addNewPost)
router.post("/add", checkAuthentication, addNewPost)
router.get("/all", checkAuthentication, getAllPost)
router.get("/userPost", checkAuthentication, getUserPost)
router.get("/like/:id", checkAuthentication, likePost)
router.get("/dislike/:id", checkAuthentication, dislikePost)
router.post("/comment/:id", checkAuthentication, addComment)
router.get("/allComments/:id", checkAuthentication, getCommentsOfPost)
router.delete("/deletePost/:id", checkAuthentication, deletePost)
router.get("/bookmarkPost/:id", checkAuthentication, bookmarkPost)

module.exports = router;