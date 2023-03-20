const router = require('express').Router()
const { police_check } = require('../../middlewares')
const controller = require('./controller')

router.post('/addresses', police_check('create', 'DeliveryAddress'), controller.store)
router.get('/addresses', police_check('view', 'DeliveryAddress') ,controller.index)
router.put('/addresses/:id', police_check('update', 'DeliveryAddress'), controller.update)
router.delete('/addresses/:id', police_check('delete', 'DeliveryAddress'), controller.destroy)


module.exports = router