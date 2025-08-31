const express = require("express");
const router = express.Router();
const userController = require("../../src/controllers/user-controllers");
const { userAuth } = require("../../src/middlewares/auth");
const { editProfileValadation, feedValidation } = require("../../src/middlewares/user-validations");

router.get("/profile", userAuth, userController.getProfile);

router.get("/feed", userAuth, [ feedValidation() ], userController.getFeed);

router.patch("/profile/edit", userAuth, [ editProfileValadation() ], userController.editProfile);

router.get("/requests/received", userAuth, userController.getRequests);

router.get("/connections", userAuth, userController.getConnections);

module.exports = router;
