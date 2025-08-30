const HttpError = require("../../src/utils/http-error");
const { validationResult } = require("express-validator");
const userServices = require("../../src/services/user-services");

const getProfile = async (req, res) => {
    try {
        const user = await userServices.getProfile(req);
        res.status(200).json(user);
    }catch(err) {
        console.log(err);
        throw new HttpError(err.message, 500);
    }
};

const getFeed = async (req, res) => {
    try {
        const users = await userServices.getFeed(req);
        res.status(200).json(users);
    } catch(err) {
        console.log("Error while creating user: ", err.message);
        throw new HttpError(err.message || "internal Server Error", err.status || 500);
    }
};

const editProfile = async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError(errors?.array()[0].msg, 400);
        }

        const user = await userServices.editProfile(req.body, req.user.id);

        res.status(200).json({ user });
    } catch(err) {
        console.log(err.message);
        throw new HttpError(err.message, 500);
    }
};

module.exports = {
    getProfile,
    getFeed,
    editProfile
}