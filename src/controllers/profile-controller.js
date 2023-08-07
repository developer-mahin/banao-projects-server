const User = require("../models/users");

exports.getUserProfile = async (req, res, next) => {
    try {
        const email = req.query.email;
        const user = await User.findOne({ email: email })
        res.status(200).json({
            success: true,
            message: "user get successfully",
            user
        })
    } catch (error) {
        next(error)
    }
}

exports.editContact = async (req, res, next) => {
    try {

        const { id } = req.params;
        const info = req.body;
        const option = { upsert: true }
        const updatedDoc = {
            $set: {
                info: info
            }
        }
        const result = await User.findOneAndUpdate({ _id: id }, updatedDoc, option)
        res.status(203).json({
            success: true,
            message: "user updated successfully",
            result
        })

    } catch (error) {
        next(error)
    }
}

exports.editInfo = async (req, res, next) => {
    try {
        const { id } = req.params
        const option = { upsert: true }
        const { name, headLine, education } = req.body;
        const updatedDoc = {
            $set: {
                name,
                headLine,
                education
            }
        }

        const result = await User.findOneAndUpdate({ _id: id }, updatedDoc, option)
        res.status(201).json({
            success: true,
            message: "updated successfully",
            result
        })

    } catch (error) {
        next(error)
    }
}

exports.updateProfilePic = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { image } = req.body;
        const option = { upsert: true }
        const updatedDoc = {
            $set: {
                photo: image,
            }
        }

        const result = await User.findOneAndUpdate({ _id: id }, updatedDoc, option)
        res.status(201).json({
            success: true,
            message: "successfully updated profile pic",
            result,
        })


    } catch (error) {
        next(error)
    }
}

exports.updateCoverPhoto = async (req, res, next) => {
    try {

        const { id } = req.params;
        const { coverPhoto } = req.body;
        const option = { upsert: true }
        const updatedDoc = {
            $set: {
                coverPhoto
            }
        }

        const result = await User.findOneAndUpdate({ _id: id }, updatedDoc, option)
        res.status(201).json({
            success: true,
            message: "successfully updated profile pic",
            result,
        })


    } catch (error) {
        next(error)
    }
}