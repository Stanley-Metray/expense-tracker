const mongoose = require('mongoose');

const url = process.env.DB_HOST;

const connectDB = async (startServer) => {
    try {
        await mongoose.connect(url);
        startServer();
    } catch (error) {
        console.log(error);
    }
};

module.exports = { connectDB, mongoose };
