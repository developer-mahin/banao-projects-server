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

exports.getAllPost = async (req, res, next) => {
    try {

        const result = await Post.find({}).sort({ _id: -1 }).toArray()
        res.status(200).json({
            success: true,
            message: "successfully get the data",
            result
        })

    } catch (error) {
        next(error)
    }
}

exports.getPostByRole = async (req, res, next) => {
    try {
        const role = req.query.role
        const query = { postRole: role }
        const result = await Post.find(query).sort({ _id: -1 }).toArray()
        res.status(200).json({
            success: true,
            message: "successfully get the data",
            result
        })
    } catch (error) {
        next(error)
    }
}

exports.getPostDetails = async (req, res, next) => {
    try {
        const id = req.params.id
        const result = await Post.findOne({ _id: id })
        res.send(result)
        res.status(200).json({
            success: true,
            message: "successfully get the data",
            result
        })
    } catch (error) {
        next(error)
    }
}

exports.getSpecificUserPost = async (req, res, next) => {
    try {
        const email = req.query.email;
        const query = { userEmail: email }
        const result = await Post.find(query).toArray()
        res.status(200).json({
            success: true,
            message: "successfully comment added",
            result
        })
    } catch (error) {
        next(error)
    }
}

exports.getSpecificUserPostDetails = async (req, res, next) => {
    try {
        const name = req.query.name;
        const query = { userName: name }
        const result = await Post.find(query).toArray()

        res.status(200).json({
            success: true,
            message: "successfully comment added",
            result
        })
    } catch (error) {
        next(error)
    }
}

exports.addComment = async (req, res, next) => {
    try {
        const { id } = req.params
        const comment = req.body;
        const option = {
            $push: {
                comment: comment
            }
        }
        const result = await Post.findOneAndUpdate({ _id: id }, option)
        res.status(200).json({
            success: true,
            message: "successfully comment added",
            result
        })
    } catch (error) {
        next(error)
    }
}

exports.addLike = async (req, res, next) => {
    try {
        const { id } = req.params;
        const like = req.body;
        const option = {
            $push: {
                like: like.likes
            }
        }

        const result = await Post.findOneAndUpdate({ _id: id }, option)
        res.status(200).json({
            success: true,
            message: "successfully comment added",
            result
        })
    } catch (error) {
        next(error)
    }
}