const Joi = require("joi");

const userValidationSchema = Joi.object({
    username: Joi.string()
    .min(3)
    .max(30)
    .trim()
    .required()
    .messages({
        "string.empty": "Username is required.",
        "string.min": "Username must be at least 3 characters long.",
        "string.max": "Username cannot be longer than 30 characters.."
    }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required.",
            "string.email": "Please provide valid email address."
        }),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'))
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 8 characters long.",
            "string.pattern.base": "Password must include at least one letter, one number and one special character."
        }),
    isAdmin: Joi.boolean()
        .default(false)
});

const signinValidationSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required.",
            "string.email": "Please provide a valid email address."
        }),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'))
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 8 characters long.",
            "string.pattern.base": "Password must include at least one letter, one number, and one special character."
        }),
});


module.exports = {
    userValidationSchema,
    signinValidationSchema
}