const HttpError = require("../../src/utils/http-error");
const User = require("../../src/models/User");

const getProfile = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json(user);
    }catch(err) {
        console.log(err);
        throw new HttpError(err.message, 500);
    }
};

const getFeed = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch(err) {
        console.log("Error while creating user: ", err.message);
        throw new HttpError(err.message || "internal Server Error", err.status || 500);
    }
};

const updateUser = async (req, res) => {

    try {

        const userId = req.params.userId;
        const input = req.body;

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
};

module.exports = {
    getProfile,
    getFeed,
    updateUser
}