const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
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
        enum: {
            values: ['Male', 'Female', 'Others'],
            message: `{VALUE} is an incorrect gender`
        }
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

userSchema.index({ firstName: 1, lastName: 1 });

// Mongoose Schema Methods
// NOTE: Alway with normal function here rather than Array functions
userSchema.methods.getJWT = async function() {

    const user = this;

    const token = await jwt.sign(
        { _id: user._id }, 
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