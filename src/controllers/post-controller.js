const Post = require("../models/post");

exports.addPost = async (req, res, next) => {
    try {
        const postData = req.body;
        console.log(postData)
        const result = await Post.create(postData)

        res.status(203).json({
            success: true,
            message: "Successfully post data",
            result
        })

    } catch (error) {
        next(error)
    }
}