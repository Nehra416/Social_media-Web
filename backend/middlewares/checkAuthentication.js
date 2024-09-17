const jwt = require("jsonwebtoken")

const checkAuthentication = (req, res, next) => {
    try {
        const token = req.cookies.token;
        // const token = req.headers.token;
        if (!token) {
            return res.status(401).json({
                message: `User is not SignIn`,
                sucess: false
            })
        }
        const payload = jwt.verify(token, process.env.SECRET_KEY)

        if (!payload) {
            return res.status(401).json({
                message: `Invalid token`,
                sucess: false
            })
        }

        // req.user = payload;
        req.id = payload._id;
        next()
    } catch (error) {
        console.log("Error is in the checkAuthentication : ", error)
    }
}

module.exports = checkAuthentication;