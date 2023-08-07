const express = require("express");
const router = express.Router()

const userController = require("../controllers/user-controller")



router
    .route("/signup")
    .post(userController.signUp)
router
    .route("/signIn")
    .post(userController.signIn)
router
    .route("/logout")
    .post(userController.logout)

router
    .route("/verify/:token")
    .get(userController.verifyUser)

router
    .route("/anUserDetails")
    .get(userController.getAnUserDetails)

module.exports = router;