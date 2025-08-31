const express = require("express");
const router = express.Router();
const authController = require("../../src/controllers/auth-controllers");
const { signupValidation } = require("../middlewares/user-validations");
const { userAuth } = require("../../src/middlewares/auth");

router.post("/signup", [ signupValidation() ], authController.signup);

router.post("/login", authController.login);

router.post("/logout", userAuth, authController.logout);

module.exports = router;