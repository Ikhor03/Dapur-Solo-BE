const router = require('express').Router()
const controller = require('./controller')

router.get('/invoice/:order_id', controller.show)
router.put('/invoice/:order_id', controller.update)

module.exports = router