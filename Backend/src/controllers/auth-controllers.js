const { validationResult } = require("express-validator");
const HttpError = require("../../src/utils/http-error");
const authServices = require("../../src/services/auth-services");

const signup = async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError(errors?.array()[0].msg, 400); 
        }

        const userId = await authServices.signup(req.body);

        res.status(200).json({
            _id: userId
        });
    } catch(err) {
        console.log("Error while creating user: ", err);
        throw new HttpError(err.message, err.status);
    }
}

const login = async (req, res) => {
    try {

        const [token, user] = await authServices.login(req.body);

        // Send cookie with expiry
        res.status(200)
            .cookie(
                'token', 
                token, 
                { expires: new Date(Date.now() + 3600000) }
            ).json(user);

    } catch(err) {
        throw new HttpError(err.message, err.status);
    }
}

const logout = async (req, res) => {

    try {
        // Clean up the sessions from the database

        await authServices.logout(req);

        // Remove the cookie
        res.status(200).cookie("token", null, {
            expires: new Date(Date.now())
        }).json({
            message: "Logout Successfull"
        });
    }catch(err) {
        throw new HttpError(err.message, err.status);
    }
}

module.exports = {
    signup,
    login,
    logout
}