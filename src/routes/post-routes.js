const express = require("express");
const router = express.Router();
const postController = require("../controllers/post-controller");
const { isLoginUser } = require("../middlewares/isLoginMiddleware");
const { verifyJsonWebToken } = require("../middlewares/verifyJsonWebToken");


router
    .route("/add-post")
    .post(verifyJsonWebToken, postController.addPost)

router
    .route("/all-post")
    .get(verifyJsonWebToken, postController.getAllPost)

router
    .route("/role-of-post")
    .get(verifyJsonWebToken, postController.getPostByRole)

router
    .route("/specific-user-post")
    .patch(verifyJsonWebToken, postController.getSpecificUserPost)

router
    .route("/specific-user-post-details")
    .patch(verifyJsonWebToken, postController.getSpecificUserPostDetails)

router
    .route("/post-details/:id")
    .get(verifyJsonWebToken, postController.getPostDetails)

router
    .route("/like/:id")
    .get(verifyJsonWebToken, postController.addLike)

router
    .route("/add-comment/:id")
    .patch(verifyJsonWebToken, postController.addComment)


module.exports = router;