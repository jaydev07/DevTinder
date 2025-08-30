const express = require("express");
const router = express.Router();
const authController = require("../../src/controller/auth-controllers");
const { signupValidation } = require("../middlewares/validators");

router.post("/signup", [ signupValidation() ], authController.signup);

router.post("/login", authController.login);

module.exports = router;