const express = require("express");
const router = express.Router();
const authController = require("../../src/controller/auth-controllers");
const { signupValidation } = require("../middlewares/validators");
const { userAuth } = require("../../src/middlewares/auth");

router.post("/signup", [ signupValidation() ], authController.signup);

router.post("/login", authController.login);

router.post("/logout", userAuth, authController.logout);

module.exports = router;