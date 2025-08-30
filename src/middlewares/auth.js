const jwt = require("jsonwebtoken");
const User = require("../models/User");
const HttpError = require("../utils/http-error");

const userAuth = async (req, res, next) => {
    try {

        // Check if the jwt token is present in the cookie
        const { token } = req.cookies;
        if (!token) {
            throw new HttpError('Token not found', 401);
        }

        // Verified the jwt and Decoded the information
        const verifiedToken = await jwt.verify(token, 'jaydev');

        // Checked if the user exists
        const user = await User.findOne({ id: verifiedToken.id });
        if (!user) {
            throw new HttpError("User not found, login again", 404);
        }

        // Attached user object in the request and called the next function
        req.user = user;
        next();
        
    } catch(err) {
        console.log("Auth middleware error: ", err);
        throw new HttpError(err.message || 'Internal Server Error', err.status || 500);
    }
}

module.exports = {
    userAuth
};