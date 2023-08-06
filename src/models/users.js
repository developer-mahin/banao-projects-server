const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")


const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        // unique: true,
        validate: [validator.isEmail, "Please provide a valid email"],
        lowercase: true
    },
    name: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        minlength: [3, "Name can't be less than 3 character"],
        maxLength: [31, "Name can't be less than 3 character"],
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        validator: (value) => validator.isStrongPassword(value, {
            minlength: 6,
            minLowerCase: 2,
            minUpperCase: 1,
            minSymbol: 1
        }),
    },
    confirmPassword: {
        type: String,
        required: [true, "Confirm password is required"],
        validator: {
            function(value) {
                return value === this.password
            },
            message: "password doesn't matched"
        }
    },

    photo: {
        type: String,
        validate: [validator.isURL, "Please provide a valid url"]
    },
    coverPhoto: {
        type: String,
        validate: [validator.isURL, "Please provide a valid url"]
    },
    education: String,
    headLine: String,

    info: {
        tag: String,
        website: {
            type: String,
            validate: [validator.isURL, "Please provide a valid url"]
        },
        country: String,
        city: String
    },

    status: {
        type: String,
        enum: ["active", "blocked", "disabled"],
        default: "active"
    },

},
    {
        timestamps: true
    }
)


userSchema.pre("save", function (next) {
    const password = this.password;
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    this.password = hashedPassword;
    this.confirmPassword = undefined;
    next();
})


const User = mongoose.model("user", userSchema)
module.exports = User