const mongoose = require("mongoose")
const validator = require("validator")
const { ObjectId } = mongoose.Schema.Types


const postSchema = mongoose.Schema({

    userName: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        minlength: [3, "Name can't be less than 3 character"],
        maxLength: [31, "Name can't be less than 3 character"],
        lowercase: true
    },

    description: String,
    postRole: String,
    userPhoto: {
        type: String,
        validate: [validator.isURL, "Please provide a valid url"]
    },
    // userId: {
    //     type: ObjectId,
    //     ref: "User"
    // },

    comment: [
        {
            comment: {
                type: String,
                required: [true, "comment is required"]
            },
            userName: {
                type: String,
                required: [true, "User name is required"]
            },
            userPhoto: {
                type: String,
                validate: [validator.isURL, "Please provide a valid url"]
            }

        }
    ],
    like: [

    ],
    image: {
        type: String,
        validate: [validator.isURL, "Please provide a valid url"]
    },
    date: String,
},
    {
        timestamps: true
    }
)



const Post = mongoose.model("Post", postSchema)
module.exports = Post