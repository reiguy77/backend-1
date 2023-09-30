const jwt = require("jsonwebtoken");
const db = require("../models");
const UserToken = db.userToken;

const generateTokens = async (user) => {
    try {
        const payload = { _id: user.email };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "14m" }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "30d" }
        );
        if(user._id){
            
        }
        const userToken = await UserToken.findOne({ userId: user._id });
        if (userToken) await userToken.remove();

        await new UserToken({ userId: user._id, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports =  generateTokens;