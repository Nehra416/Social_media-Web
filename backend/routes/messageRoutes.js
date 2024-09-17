const express = require("express");
const { sendMessage, getMessage } = require("../controllers/messageController");
const checkAuthentication = require("../middlewares/checkAuthentication");
const router = express.Router();

router.post("/send/:id", checkAuthentication, sendMessage)
router.get("/all/:id", checkAuthentication, getMessage)

module.exports = router;