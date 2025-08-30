const express = require("express");
const router = express.Router();
const userController = require("../../src/controller/user-controllers");
const { userAuth } = require("../../src/middlewares/auth");

router.get("/profile", userAuth, userController.getProfile);

router.get("/feed", userAuth, userController.getFeed);

router.patch("/users/:userId", userController.updateUser);

module.exports = router;
