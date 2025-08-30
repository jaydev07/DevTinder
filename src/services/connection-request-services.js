const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../../src/models/User");
const HttpError = require("../../src/utils/http-error");

const sendRequest = async (fromUserId, toUserId, status) => {
    try {

        //Using Promis.all to check parallelly
        const userExists = new Promise(async (resolve, reject) => {
            const user = await User.findById(toUserId)
            if (!user) {
                reject(new HttpError("User don't exists", 500));
            }

            resolve();
        });

        const requestExists = new Promise(async (resolve, reject) => {
            const request = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId}
                ]
            });
            if (request) {
                reject(new HttpError("Connection request already exists", 500));
            }

            resolve();
        });

        await Promise.all([ userExists, requestExists ]);
        
        // const userExists = await User.findById(toUserId);
        // if (!userExists) {
        //     throw new HttpError("User don't exists", 500);
        // }

        // const requestExists = await ConnectionRequest.findOne({
        //     $or: [
        //         { fromUserId, toUserId },
        //         { fromUserId: toUserId, toUserId: fromUserId}
        //     ]
        // });
        // if (requestExists) {
        //     throw new HttpError("Connection request already exists", 500);
        // }

        const newConnectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        await newConnectionRequest.save();

        return newConnectionRequest._id;

    }catch(err) {
        throw new HttpError(err.message, 500);
    }
}

module.exports = {
    sendRequest
}