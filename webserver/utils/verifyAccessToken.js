const jwt = require("jsonwebtoken");

const verifyAccessToken = (accessToken) => {
    const privateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    return new Promise((resolve, reject) => {
        jwt.verify(accessToken, privateKey, (err, tokenDetails) => {
            if (err)
                {   
                    return reject({ error: true, message: "Invalid access token" });
                }
            resolve({
                tokenDetails,
                error: false,
                message: "Valid access token",
            });
        });
    });
};

module.exports = verifyAccessToken;