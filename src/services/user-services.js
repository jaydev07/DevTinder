const HttpError = require("../../src/utils/http-error");
const User = require("../models/User");
const ConnectionRequest = require("../../src/models/ConnectionRequest");

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
            { _id: userId },
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

const getRequests = async (userId) => {
    try {
        // const requests = await ConnectionRequest.find({
        //     toUserId: userId,
        //     status: "interested"
        // }).populate('fromUserId toUserId', ["firstName", "lastName"]);

        const requests = await ConnectionRequest.aggregate([
            { 
                $match: {
                    toUserId: userId,
                    status: "interested"
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'fromUserId',
                    foreignField: '_id',
                    as: "fromUser"
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'toUserId',
                    foreignField: '_id',
                    as: 'toUser'
                }
            },
            {
                $unwind: {
                    path: "$fromUser"
                }
            },
            {
                $unwind: {
                    path: "$toUser"
                }
            },
            {
                $project: {
                    "fromUser.email": 0,
                    "fromUser.password": 0,
                    "toUser.email": 0,
                    "toUser.password": 0,
                }
            }
        ]);

        return requests;
    }catch(err) {
        throw new HttpError(err.message, 500);
    }
}

const getConnections = async (userId) => {
    try {

        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: userId },
                { fromUserId: userId }
            ],
            status: "accepted"
        })
        .populate('fromUserId', ['_id', 'firstName', 'lastName', 'age', 'photoUrl', 'skills', 'gender'])
        .populate('toUserId', ['_id', 'firstName', 'lastName', 'age', 'photoUrl', 'skills', 'gender']);

        const data = connections.map(row => {
            console.log(row.fromUserId, userId);
            if (row.fromUserId._id.toString() === userId.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        return data;
    }catch(err) {
        throw new HttpError(err.message, 500);
    }
}

module.exports = {
    getProfile,
    getFeed,
    editProfile,
    getRequests,
    getConnections
}