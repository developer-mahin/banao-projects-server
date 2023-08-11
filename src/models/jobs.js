const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types


const jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    responsibilities: {
        type: String,
        required: true
    },
    workplace: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    candidate: [
        {
            id: {
                type: ObjectId,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            CTC: {
                type: String,
                required: true
            },
            salary: {
                type: String,
                required: true
            },
            experience: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            noticePeriod: {
                type: String,
                required: true
            },
            resume: {
                type: String,
                required: true
            },
        }
    ],
    date: String,
},
    {
        timestamps: true
    }
)



const Jobs = mongoose.model("Jobs", jobSchema)
module.exports = Jobs