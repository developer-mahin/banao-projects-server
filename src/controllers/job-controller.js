const Jobs = require("../models/jobs");
const createError = require("http-errors")

exports.addJob = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data) {
            throw createError(404, "Data not found")
        }
        const result = await Jobs.insertOne(data)
        res.status(203).json({
            success: true,
            message: "successfully added job",
            result
        })
    } catch (error) {
        next(error)
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const result = await Jobs.find({}).toArray()
        res.status(203).json({
            success: true,
            message: "successfully added job",
            result
        })
    } catch (error) {
        next(error)
    }
}

exports.getASingleJob = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await Jobs.findOne({ _id: id })
        res.status(203).json({
            success: true,
            message: "successfully added job",
            result
        })
    } catch (error) {
        next(error)
    }
}

exports.applyJob = async (req, res, next) => {
    try {
        const formData = req.body;
        if (!formData) {
            throw createError(404, "Data Not found")
        }
        const { id } = req.body;
        const findData = await jobCollection.findOne(query)
        const option = {
            $push: {
                candidate: formData
            }
        }
        const result = await Jobs.findOneAndUpdate({ _id: id }, option)
        res.status(203).json({
            success: true,
            message: "successfully added job",
            result
        })
    } catch (error) {
        next(error)
    }
}