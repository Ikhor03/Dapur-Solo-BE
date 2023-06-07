const router = require('express').Router()
const { police_check } = require('../../middlewares')
const controller = require('./constroller')

router.put('/cart', police_check('update', 'Cart'), controller.update)
router.post('/cart', controller.update)
router.get('/cart', police_check('read', 'Cart'), controller.index)

module.exports = router