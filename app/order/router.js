const router = require('express').Router()
const { police_check } = require('../../middlewares')
const controller = require('./controller')

router.post('/orders', police_check('create', 'Order'), controller.store)
router.get('/orders', police_check('read', 'Order'), controller.index)

module.exports = router