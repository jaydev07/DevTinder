const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    id: { 
        type: String,
        required: true
    },
    firstName: { 
        type: String,
        required: true,
        minLength: 4
    },
    lastName: { 
        type: String,
    },
    email: { 
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error("Invalid email")
            }
        }
    },
    password: { 
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others'],
    },
    photoUrl: {
        type: String,
        // validate(value) {
        //     if (!validator.isDataURI(value)) {
        //         throw new Error("Invalid photo url");
        //     }
        // }
    },
    about: {
        type: String
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);