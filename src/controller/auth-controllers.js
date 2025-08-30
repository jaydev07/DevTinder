const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { ulid } = require("ulid");

const HttpError = require("../../src/utils/http-error");
const User = require("../../src/models/User");

const signup = async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError(errors?.array()[0].msg, 400); 
        }

        const input = req.body;
        // Hashing the password before storing it
        const passwordHash = await bcrypt.hash(input.password, 10);

        const newUser = new User({
            id: ulid(),
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

        res.status(200).json({
            id: newUser.id
        });
    } catch(err) {
        console.log("Error while creating user: ", err);
        throw new HttpError(err.message);
    }
}

const login = async (req, res) => {
    try {

        const {email, password} = req.body;

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

        // Send cookie with expiry
        res.status(200)
            .cookie(
                'token', 
                token, 
                { expires: new Date(Date.now() + 3600000) }
            ).json({ user });

    } catch(err) {
        console.log("Error: ", err);
        throw new HttpError(err.message, err?.status);
    }
}

module.exports = {
    signup,
    login
}