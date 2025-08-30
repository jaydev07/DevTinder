const express = require('express');
const { ulid } = require("ulid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const { connectDB } = require("../src/config/database");
const User = require("../src/models/User");
const { signupValidation } = require("./middlewares/validators");
const HttpError = require("../src/utils/http-error");
const { userAuth } = require("../src/middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", [ signupValidation() ], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new HttpError(errors?.array()[0].msg, 400); 
    }

    const input = req.body;
    try {

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
});

app.post("/login", async (req, res) => {
    try {

        const {email, password} = req.body;

        // Varify Email and check user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new HttpError('Invalid credentials', 401);
        }
        
        // Verify Password
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            throw new HttpError('Invalid credentials', 401);
        }

        // Create JWT token
        const token = await jwt.sign(
            { id: user.id }, 
            'jaydev', 
            {  expiresIn: '0d' }
        );

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
});

app.patch("/users/:userId", async (req, res) => {
    const userId = req.params.userId;
    const input = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { id: userId },
            {
                $set: input
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );
        res.status(200).json({ user });
    } catch(err) {
        console.log(err.message);
        throw new HttpError(err.message, 500);
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json(user);
    }catch(err) {
        console.log(err);
        throw new HttpError(err.message, 500);
    }
});

app.get("/feed", userAuth, async (req, res) => {
    try {

        console.log("UserId from auth handler: ", req.user);

        const users = await User.find({});
        res.status(200).json(users);
    } catch(err) {
        console.log("Error while creating user: ", err.message);
        throw new HttpError(err.message || "internal Server Error", err.status || 500);
    }
});

app.use((req, res) => {
    res.status(404).json({
        message: "Not Found"
    })
});

app.use((err, req, res, next) => {
    // console.log(err.message, err.status);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});

connectDB()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    }).catch(err => {
        console.log("Error connecting to database: ", err);
    });