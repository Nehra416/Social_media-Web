const express = require("express")
// const app = express()
const { app, server } = require("./socket/socket.js")

require('dotenv').config();
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")
// gives the current directory path
const ___dirname = path.resolve();
// console.log(___dirname)

app.use(express.static(path.resolve("./public")))

// require Routes...
const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes")
const messageRoutes = require("./routes/messageRoutes")

const PORT = process.env.PORT || 5000;

// MongoDb Connection...
const Connection = require("./config/dbConnection");
Connection()

// Middlewares...
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // Allow cookies to be sent
}));

// Routes...
app.use("/user", userRoutes)
app.use("/post", postRoutes)
app.use("/message", messageRoutes)


// Serve the static files of the React app from the server
app.use(express.static(path.join(___dirname, "/frontend/dist")));
// if client req on other path then the above 3 paths of backend then the frontend will be served
app.get("*", (req, res) => {
    res.sendFile(path.resolve(___dirname, "frontend", "dist", "index.html"));
})

server.listen(PORT, () => console.log(`Server is Started at PORT : ${PORT}`))