const mongoose = require('mongoose');

const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MongoDB_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection failed");
    }
}

module.exports = connectDb;