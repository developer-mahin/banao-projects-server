const jwt = require("jsonwebtoken")
const createError = require("http-errors")

exports.verifyJsonWebToken = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization
        if (!authHeader) {
            throw createError(401, "Unauthorized Access")
        }
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.ACCESS_KEY, function (err, decoded) {
            if (err) {
                throw createError(403, "Forbidden access")
            }
            req.decoded = decoded
        })

        next()
    } catch (error) {
        return next(error)
    }
}