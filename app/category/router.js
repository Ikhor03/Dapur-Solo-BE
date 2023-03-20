const router = require('express').Router()
const { police_check } = require('../../middlewares')
const controller = require('./controller')

router.get('/categories', controller.index)
router.post('/categories', police_check('create', 'Category'), controller.store)
router.put('/categories/:id', police_check('update', 'Category'), controller.update)
router.delete('/categories/:id', police_check('delete', 'Category'), controller.destroy)

module.exports = router