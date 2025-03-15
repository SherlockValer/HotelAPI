const mongoose = require('mongoose')

require('dotenv').config()

const hotelUri = process.env.MONGODB

async function connectDB () {
    await mongoose
        .connect(hotelUri)
        .then(() => {
            console.log("Connected to database")
        })
        .catch((error) => {
            console.log(error)
        })
}

module.exports = {connectDB}

