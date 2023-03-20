const mongoose = require('mongoose')
const { model, Schema } = mongoose
const bcrypt = require('bcrypt')

const userSchema = Schema({
    full_name: {
        type: String,
        required: [true, 'nama harus diisi'],
        minlength: [3, 'Panjang nama harus diantara 3 sampai 255 karakter'],
        maxlength: [255, 'Panjang nama harus diantara 3 sampai 255 karakter']
    },
    id: Number,
    email: {
        type: String,
        required: [true, 'email harus diisi'],
        maxlength: [255, 'Panjang email harus diantara 3 sampai 255 karakter']
    },
    password: {
        type: String,
        required: [true, 'password harus diisi'],
        minlength: [8, 'Panjang pasword harus diantara 8 sampai 255 karakter'],
        maxlength: [255, 'Panjang pasword harus diantara 3 sampai 255 karakter']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    token: [String]
}, { timestamps: true})

//validasi email
userSchema.path('email').validate(function (email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regex.test(email)
}, attr => `${attr.value} harus merupakan email yang valid`)

//validasi email sudah ada atau belum
userSchema.path('email').validate(async function (email) {
    try {
        const checkEmail = await this.model('Users').count({ email })
        return !checkEmail
    } catch (err) {
        throw err
    }
}, attr => `${attr.value} sudah terdaftar`)

//bcrypt
const HASH_ROUND = 10
userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
})

module.exports = model('Users', userSchema)