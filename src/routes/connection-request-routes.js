const express = require("express");
const router = express.Router();
const connectionRequestControllers = require("../../src/controller/connection-request-controllers");
const { userAuth } = require("../../src/middlewares/auth");
const { sendConnectionRequestValidation } = require("../../src/middlewares/validators");

router.post('/send/:status/:toUserId', userAuth, [ sendConnectionRequestValidation() ], connectionRequestControllers.sendRequest);

module.exports = router;