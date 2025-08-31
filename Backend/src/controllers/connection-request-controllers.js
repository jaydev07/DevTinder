const { validationResult } = require("express-validator");
const connectionRequestServices = require("../services/connection-request-services");
const HttpError = require("../../src/utils/http-error");

const sendRequest = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError(errors?.array()[0].msg);
        }

        const toUserId = req.params?.toUserId;
        const status = req.params?.status;
        const fromUserId = req.user._id;

        if (toUserId == fromUserId) {
            throw new HttpError('User cannot send the connection request to himself', 400);
        }

        const connectionRequestId = await connectionRequestServices.sendRequest(fromUserId, toUserId, status);

        res.status(200).json({
            id: connectionRequestId
        })
    }catch(err) {
        throw new HttpError(err.message, err.status);
    }
}

const reviewRequest = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError(errors?.array()[0].msg, 400);
        }

        const status = req.params?.status;
        const connectionRequestId = req.params?.connectionRequestId;
        const userId = req.user._id;

        const connectionRequest = await connectionRequestServices.reviewRequest(status, connectionRequestId, userId);

        res.status(200).json(connectionRequest);
    }catch(err) {
        throw new HttpError(err.message, err.status);
    }
}

module.exports = {
    sendRequest,
    reviewRequest
}