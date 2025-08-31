const express = require("express");
const router = express.Router();
const userController = require("../../src/controllers/user-controllers");
const { userAuth } = require("../../src/middlewares/auth");
const { editProfileValadation } = require("../../src/middlewares/user-validations");

router.get("/profile", userAuth, userController.getProfile);

router.get("/feed", userAuth, userController.getFeed);

router.patch("/profile/edit", userAuth, [ editProfileValadation() ], userController.editProfile);

router.get("/requests/received", userAuth, userController.getRequests);

module.exports = router;
