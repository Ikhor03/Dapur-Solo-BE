const User = require('../user/model')
const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config')
const { getToken } = require('../../utils')


const register = (req, res, next) => {
    try {
        let payload = req.body
        let user = new User(payload)
        user.save()
        return res.json(user)
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err)
    }
}

const localStrategy = async (email, password, done) => {
    try {
        let user = await User.findOne({ email })
            .select('-__v -createdAt -updatedAt -token')
        if (!user) return done()
        if (bcrypt.compareSync(password, user.password)) {
            ({ password, ...userWithoutPassword } = user.toJSON())
            return done(null, userWithoutPassword)
        }
    } catch (err) {
        done(err, null)
    }
}

const login = (req, res, next) => {
    passport.authenticate('local', async function (err, user) {
        if (err) return next(err)
        if (!user) return res.json({ error: 1, response: 'Email atau password salah' })

        let signed = jwt.sign(user, config.secretkey)

        await User.findByIdAndUpdate(user._id, { $push: { token: signed } })

        res.json({
            message: 'Login Successfully',
            user,
            token: signed
        })
    })(req, res, next)
}

const logout = async (req, res, next) => {
    let token = getToken(req)

    let user = await User
        .findOneAndUpdate(
            { token: { $in: token } },
            { $pull: { token: token } },
            { useFindAndModify: false }
        )

    if (!token || !user) {
        return res.json({
            error: 1,
            message: 'No User Found!'
        })
    }

    return res.json({
        error: 0,
        message: 'Logout Berhasil'
    })
}

module.exports = {
    register,
    localStrategy,
    login,
    logout
}