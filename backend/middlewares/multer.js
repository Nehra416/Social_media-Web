const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./public/uploads"))
    },
    filename: function (req, file, cb) {
        // const fileName = `${Date.now()}-${file.originalname}`zzzzz
        // cb(null, fileName)
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

module.exports = upload;