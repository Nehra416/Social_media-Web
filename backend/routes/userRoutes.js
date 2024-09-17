const express = require("express")
const { signUp, signIn, signOut, getProfile, editProfile, getSuggestedUsers, followOrUnfollow } = require("../controllers/userController")
const checkAuthentication = require("../middlewares/checkAuthentication")
const upload = require("../middlewares/multer")
const router = express.Router()

router.post("/signup", signUp)
router.post("/signin", signIn)
router.get("/signout", signOut)
router.get("/profile/:id", checkAuthentication, getProfile)
// router.post("/profile/edit", checkAuthentication, upload.single('profilePicture'), editProfile)
router.post("/profile/edit", checkAuthentication, editProfile)
router.get("/suggested", checkAuthentication, getSuggestedUsers)
router.post("/followOrUnfollow/:id", checkAuthentication, followOrUnfollow)

module.exports = router;