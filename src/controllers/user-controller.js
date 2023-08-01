const { createJsonWebToken } = require("../utils/createJsonWebToken")
const bcrypt = require("bcryptjs")
const { emailVerification } = require("../utils/emailVerification")
const User = require("../models/users")
const jwt = require("jsonwebtoken")
const createError = require("http-errors")

exports.signUp = async (req, res, next) => {
    try {

        const { name, email, password, confirmPassword, photo, coverPhoto, education, headLine, info, status } = req.body

        const isUserExit = await User.exists({ email: email })
        if (isUserExit) {
            throw createError(400, "user already exist with this email address please try another email address")
        }


        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        const userData = {
            name,
            email,
            photo,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            status: "active"
        }

        const token = createJsonWebToken(userData, process.env.ACCESS_TOKEN, "10m")

        try {

            const mailData = {
                email: email,
                subject: "Account Activation Email",
                html: `
                <h2>Hello ${name} !</h2>
                <p>Please activate your account to click here </p>
                <a
                style="padding:10px 20px; color:green; background:cyan; border-radius:5px;text-decoration:none"
                href="${process.env.SERVER_URL}api/v1/auth/verify/${token}"
                target="_blank"
                >
                Click here to activate
                </a>
                `
            }

            const mail = await emailVerification(mailData)

        } catch (error) {
            next(createError(500, "failed to send verification email "))
            return
        }

        res.status(200).json({
            success: true,
            message: "Please go to your email and compete the verification process",
            token
        })

    } catch (error) {
        next(error)
    }
}

exports.verifyUser = async (req, res, next) => {
    try {

        const token = req.params.token
        if (!token) {
            throw new Error(404, "token not found!")
        }
        console.log("token", token)

        try {

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)

            console.log(decoded)

            const isUserExit = await User.exists({ email: decoded.email })
            if (isUserExit) {
                throw createError(400, "user already with this email address please try another email address")
            }
            const user = await User.create(decoded)
            // res.status(201).send({
            //     success: true,
            //     message: "successfully created the user",
            //     user
            // })

            res.send(`
            
            <h1 style="text-align:center">Hello ${decoded.name}</h1>
            <h2 style="text-align:center">You are now a verified user</h2>

            `)
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw createError(401, "Token expired")
            }
            if (error.name === "JsonWebTokenError") {
                throw createError(401, "Invalid token")
            }
            else {
                throw error
            }
        }

        res.send("you are now verified user")
    } catch (error) {
        next(error)
    }
}