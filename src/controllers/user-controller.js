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

        const token = createJsonWebToken(userData, process.env.ACTIVATION_KEY, "10m")

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

            const decoded = jwt.verify(token, process.env.ACTIVATION_KEY)

            console.log(decoded)

            const isUserExit = await User.exists({ email: decoded.email })
            if (isUserExit) {
                throw createError(400, "user already with this email address please try another email address")
            }
            await User.create(decoded)

            res.send(`

            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body
                style="background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)), url(https://i.ibb.co/wYYTcPF/JOB-HUNTER-removebg-preview.png); 
                background-position: center; background-repeat: no-repeat; background-size: contain;  display: flex; align-items:  center; justify-content: center; height: 98vh; color: white;">
                <div>
                    <h1 style="text-align:center ; font-size: 70px; margin: 0;">Hello ${decoded.name}</h1>
                    <p style="text-align:center ;font-size: 50px; margin: 0;">You are now a verified user</p>
                    <p style="text-align:center ;font-size: 40px; margin: 0;">Please login your with your account</p>
                    <div style="display: flex; align-items: center; justify-content: center; margin-top: 20px;">
                        <a href="http://localhost:3000/login"
                            style="padding: 12px 20px; background-color: aqua; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 30px;">Login</a>
                    </div>
                </div>
            </body>
            </html>
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

exports.signIn = async (req, res, next) => {

    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            throw createError(404, "User not found with this email address. Please register first")
        }

        const isPasswordMatched = bcrypt.compare(password, user.password)
        if (!isPasswordMatched) {
            throw createError(401, "Email/Password does'nt matched please try with valid email and password")
        }

        if (user.status !== "active") {
            throw createError(400, "You are a blocked user. Please contact with authority")
        }

        const accessToken = createJsonWebToken(
            { email, _id: user._id },
            process.env.ACCESS_KEY,
            "365d"
        )

        res.cookie("accessToken", accessToken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })

        res.status(200).json({
            success: true,
            message: "user login successfully",
            user,
            accessToken,
        })

    } catch (error) {
        next(error)
    }

}

exports.logout = async (req, res, next) => {

    try {

        res.clearCookie("access_token")
        res.status(200).json({
            success: true,
            message: "user logged out successfully"
        })

    } catch (error) {
        next(error)
    }

}

exports.getAnUserDetails = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await User.findOne({ _id: id })
        res.status(200).json({
            success: true,
            message: "successfully get an user details",
            user: result
        })

    } catch (error) {
        next(error)
    }
}