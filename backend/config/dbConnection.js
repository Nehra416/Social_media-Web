const mongoose = require("mongoose")

const Connection = async () => {
    await mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("MongoDb is Connected"))
        .catch((error) => console.log("Error in MongoDb : ", error))
}

module.exports = Connection;