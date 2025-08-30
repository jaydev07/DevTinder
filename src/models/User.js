const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

// Mongoose Schema Methods
// NOTE: Alway with normal function here rather than Array functions
userSchema.methods.getJWT = async function() {

    const user = this;

    const token = await jwt.sign(
        { id: user.id }, 
        'jaydev', 
        {  expiresIn: '1h' }
    );

    return token;
}

userSchema.methods.validatePassword = async function (inputPassword) {

    const user = this;
    const passwordHash = user.password

    const isCorrect = await bcrypt.compare(inputPassword, passwordHash);

    return isCorrect
}

module.exports = mongoose.model('User', userSchema);