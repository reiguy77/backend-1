const db = require("../models");
const UserToken = db.userToken;
const jwt = require("jsonwebtoken");
const { refreshTokenBodyValidation } = require("../utils/validationSchema.js");
const verifyRefreshToken = require("../utils/verifyRefreshToken.js");
const verifyAccessToken = require("../utils/verifyAccessToken.js");

// get new access token
exports.getNewToken =  async (req, res) => {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error)
    {
        console.log('Error with refresh token body validation',error);
        return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    }
    verifyRefreshToken(req.body.refresh_token)
        .then(({ tokenDetails }) => {
            const payload = { tokenDetails };
            const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_PRIVATE_KEY,
            );
            res.status(200).json({
                error: false,
                accessToken, 
                message: "Access token created successfully",
            });
        })
        .catch((err) => {
            console.log('error verifying refresh token', err)
            res.status(400).json(err)
        });
}

exports.verifyAccessToken = async(req, res) => {
    verifyAccessToken(req.body.access_token).then(({ tokenDetails }) => {
        const payload = { tokenDetails };
        res.status(200).json({
            error: false,
            message: "Valid access token",
        });
    })
    .catch((err) => {
        console.log(err)
        res.status(400).json(err)
    });
}

// logout
exports.delete =  async (req, res) => {
    try {
        const { error } = refreshTokenBodyValidation(req.body);
        if (error)
            return res
                .status(400)
                .json({ error: true, message: error.details[0].message });

        const userToken = await UserToken.findOne({ token: req.body.refreshToken });
        if (!userToken)
            return res
                .status(200)
                .json({ error: false, message: "Logged Out Sucessfully" });

        await userToken.remove();
        res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}
