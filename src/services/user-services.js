const HttpError = require("../../src/utils/http-error");
const User = require("../../src/models/User");

const getProfile = async (input) => {
    try {
        return input.user;
    }catch(err) {
        console.log(err);
        throw new HttpError(err.message, 500);
    }
};

const getFeed = async (input) => {
    try {
        const users = await User.find({});
        return users;
    } catch(err) {
        throw new HttpError(err.message || "internal Server Error", err.status || 500);
    }
};

const editProfile = async (input, userId) => {
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
        return user;
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