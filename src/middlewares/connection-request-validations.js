const { body, param } = require("express-validator");
const HttpError = require("../../src/utils/http-error");

const sendConnectionRequestValidation = () => {
    return [
        param("status")
            .custom(status => {
                const validStatus = ['interested', 'ignored'];
                if (!validStatus.includes(status)) {
                    throw new HttpError(`Status: ${status} is invalid`, 400)
                }
                return true;
            }),

        param("toUserId")
            .isMongoId().withMessage("Invalid user id")
    ]
}

const reviewRequestValidation = () => {
    return [
        param('status')
            .custom(status => {
                const validStatus = ['accepted', 'rejected'];
                if (!validStatus.includes(status)) {
                    throw new HttpError(`Status: ${status} is invalid`, 400)
                }
                return true;
            }),

        param('connectionRequestId')
            .isMongoId().withMessage('Invalid connection request id')
    ]
}

module.exports = {
    sendConnectionRequestValidation,
    reviewRequestValidation
}