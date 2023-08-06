const express = require("express");
const router = express.Router();
const postController = require("../controllers/post-controller");
const { isLoginUser } = require("../middlewares/isLoginMiddleware");
const { verifyJsonWebToken } = require("../middlewares/verifyJsonWebToken");


router
    .route("/add-post")
    .post(verifyJsonWebToken, postController.addPost)


module.exports = router;