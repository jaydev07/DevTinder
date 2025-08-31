const { body, param, query } = require("express-validator");
const HttpError = require("../../src/utils/http-error");

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

const editProfileValadation = () => {
    return [
        body("email")
            .custom(email => {
                if (email !== undefined) {
                    throw new HttpError("Email should not be updated", 400);
                }
                return true;
            }),

        body("password")
            .not().exists().withMessage("Password should not be updated")
    ]
}

const feedValidation = () => {
    return [
        query("count")
            .exists().withMessage("Count should be greater than 0")
            .isInt({ min: 1 }).withMessage("Count should be greater than 0"),

        query("page")
            .exists().withMessage("Page should be greater than 0")
            .isInt({ min: 1 }).withMessage("Page should be greater than 0"),
    ]
}

module.exports = {
    signupValidation,
    editProfileValadation,
    feedValidation
}