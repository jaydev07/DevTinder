const bcrypt = require("bcrypt");

const HttpError = require("../../src/utils/http-error");
const User = require("../models/User");

const signup = async (input) => {

    try {
        // Hashing the password before storing it
        const passwordHash = await bcrypt.hash(input.password, 10);

        const newUser = new User({
            firstName: input.firstName,
            lastName: input?.lastName,
            email: input.email,
            password: passwordHash,
            age: input?.age,
            gender: input?.gender,
            photoUrl: input?.photoUrl,
            about: input?.about,
            skills: input?.skills,
            createdAt: Date.now(),
        });

        await newUser.save();

        return newUser._id;
    } catch(err) {
        console.log("Error while creating user: ", err);
        throw new HttpError(err.message, 500);
    }
}

const login = async (input) => {
    try {

        const {email, password} = input;

        // Varify Email and check user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new HttpError('Invalid credentials', 401);
        }
        
        // Validate Password
        // const correctPassword = await bcrypt.compare(password, user.password);
        const isPasswordCorrect = await user.validatePassword(password);

        if (!isPasswordCorrect) {
            throw new HttpError('Invalid credentials', 401);
        }

        // Create JWT token
        const token = await user.getJWT();

        return [token, user];
    } catch(err) {
        console.log("Error: ", err);
        throw new HttpError(err.message, 500);
    }
}

const logout = async (input) => {

    try {
        // Clean up the sessions from the database

        return;
    }catch(err) {
        console.log("Error while logout: ", err);
        throw new HttpError(err.message, 500);
    }
}

module.exports = {
    signup,
    login,
    logout
}