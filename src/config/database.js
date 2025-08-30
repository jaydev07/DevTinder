const mongoose = require("mongoose");

const connectDB = async () => {
    return await mongoose.connect("mongodb+srv://jaydev:Jaydev123@namastenode.klqcnhe.mongodb.net/interview");
}

module.exports = {connectDB};