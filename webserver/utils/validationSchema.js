const Joi = require('joi')
const joiPasswordComplexity =  require("joi-password-complexity");

const signUpBodyValidation = (body) => {
    const schema = Joi.object({
        userName: Joi.string().required().label("User Name"),
        email: Joi.string().email().required().label("Email"),
        password: joiPasswordComplexity().required().label("Password"),
    });
    return schema.validate(body);
};

const logInBodyValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(body);
};

const refreshTokenBodyValidation = (body) => {
    const schema = Joi.object({
        refresh_token: Joi.string().required().label("refresh_token"),
    });
    return schema.validate(body);
};

module.exports =  {
    signUpBodyValidation,
    logInBodyValidation,
    refreshTokenBodyValidation,
};