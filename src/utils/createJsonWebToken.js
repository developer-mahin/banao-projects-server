const jwt = require("jsonwebtoken")

exports.createJsonWebToken = (payload, secretKey, expiresIn) => {

    if (typeof payload !== "object" || !payload) {
        throw new Error("payload must be a none empty object")
    }
    if (typeof secretKey !== "string" || secretKey === "") {
        throw new Error("secret key must be a none empty string")
    }

    try {

        const token = jwt.sign(payload, secretKey, {
            expiresIn
        })
        return token


    } catch (error) {
        throw new Error("failed to sing up with jwt", error)
    }

}