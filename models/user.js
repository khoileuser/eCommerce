const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Define schema
const userSchema = mongoose.Schema({
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    username: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        maxLength: 15,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9]+$/.test(value)
            },
            message: props => `${props.value} is not a valid username. It should contain only letters and digits, and and be 8-15 characters long.`
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    profile: {
        type: String,
        required: true
    },
    vendor: {
        accountType: Boolean,
        vendorName: {
            type: String,
            minLength: 5,
        },
        vendorAddress: {
            type: String,
            minLength: 5,
        }
    },
    customer: {
        accountType: Boolean,
        customerName: {
            type: String,
            minLength: 5
        },
        customerAddress: {
            type: String,
            minLength: 5
        }
    },
    shipper: {
        accountType: Boolean,
        hub: {
            type: String,
        }
    }
})

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this

    if (user.isModified('password')) {
        if (user.password < 8 || user.password > 20 || ! /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(user.password)) {
            throw new Error({ error: `${user.password} is not a valid password. It should contain at least one uppercase letter, one lowercase letter, one digit, one special character (!@#$%^&*), and be 8-20 characters long.` })
        }
        else {
            user.password = await bcrypt.hash(user.password, 8)
        }
    }
    next()
})

userSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({ _id: user._id }, "1convitxoera2caicanh")
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (username, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ username })
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

// Define models based on the schema
const User = mongoose.model('User', userSchema)

module.exports = User