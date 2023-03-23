const router = require('express').Router()
const controller = require('./controller')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy

passport.use(new localStrategy({ usernameField: 'email' }, controller.localStrategy))
router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/logout', controller.logout)

module.exports = router