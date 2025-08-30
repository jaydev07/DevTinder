const express = require("express");
const router = express.Router();
const userController = require("../../src/controller/user-controllers");
const { userAuth } = require("../../src/middlewares/auth");
const { editProfileValadation } = require("../../src/middlewares/validators");

router.get("/profile", userAuth, userController.getProfile);

router.get("/feed", userAuth, userController.getFeed);

router.patch("/profile/edit", userAuth, [ editProfileValadation() ], userController.editProfile);

module.exports = router;
