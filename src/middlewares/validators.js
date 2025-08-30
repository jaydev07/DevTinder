const { body } = require("express-validator");

const signupValidation = () => {
    return [
        body('firstName')
            .notEmpty().withMessage("First Name should be atleast 4 length.")
            .isLength({ min: 4 }).withMessage("First Name should be atleast 4 length."),

        body('email')
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Invalid Email"),

        body('age')    
            .if(body('age').exists()).isLength({ min: 18 }).withMessage("Age should be greater than 18")
    ]
}

module.exports = {
    signupValidation
}