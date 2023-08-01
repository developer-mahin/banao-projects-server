const express = require("express")
const app = express();
const cors = require("cors")
const morgan = require("morgan")
const createError = require("http-errors")
const xssClean = require("xss-clean")
const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "To many request at a time please try again later"
})


app.use(limiter)
app.use(express.json())
app.use(cors())
app.use(xssClean())
app.use(morgan("dev"))



const userRoute = require("./routes/user-routes")
app.use("/api/v1/auth", userRoute)





app.get("/", (req, res, next) => {
    res.send("Hello server")
})

app.get("/", async (req, res, next) => {
    console.log("Job Hunter server is running".yellow.bold)
    res.status(200).json({
        message: "welcome to the server"
    })
})

app.use((req, res, next) => {
    next(createError(404, "Routes not found"))
})

app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        success: false,
        message: err.message
    })
})

module.exports = app;