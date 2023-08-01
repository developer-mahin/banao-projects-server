const express = require("express");
const router = express.Router()

const userController = require("../controllers/user-controller")



router
    .route("/signup")
    .post(userController.signUp)


router
    .route("/verify/:token")
    .get(userController.verifyUser)


module.exports = router;