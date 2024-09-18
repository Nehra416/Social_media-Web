require('dotenv').config();
const express = require("express");
const { app, server } = require("./socket/socket.js");
const PORT = process.env.PORT || 5000;

const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const ___dirname = path.resolve(); // Make sure to use this consistently

app.use(express.static(path.resolve("./public")));

// Require Routes...
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const messageRoutes = require("./routes/messageRoutes");

// MongoDB Connection...
const Connection = require("./config/dbConnection");
Connection();

// Middlewares...
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.URL,
    credentials: true // Allow cookies to be sent
}));

// Routes...
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/message", messageRoutes);

// Serve the static files of the React app from the server
app.use(express.static(path.join(___dirname, "/frontend/dist")));

// If client requests any other path, serve the frontend
app.get("*", (req, res) => {
    res.sendFile(path.resolve(___dirname, "frontend", "dist", "index.html"));
});

// Start the server
server.listen(PORT, () => console.log(`Server is started at PORT: ${PORT}`));
