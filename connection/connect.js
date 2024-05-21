const mongoose = require('mongoose');

// const url = "mongodb+srv://stanleymetray:lclaKnptDdnU5IXh@cluster0.mpfuqkg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const url = "mongodb+srv://stanleymetray:lclaKnptDdnU5IXh@cluster0.mpfuqkg.mongodb.net/e-tracker?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async (startServer) => {
    try {
        await mongoose.connect(url);
        startServer();
    } catch (error) {
        console.log(error);
    }
};

module.exports = { connectDB, mongoose };
