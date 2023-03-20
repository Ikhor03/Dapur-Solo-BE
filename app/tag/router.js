const router = require('express').Router()
const { police_check } = require('../../middlewares')
const controller = require('./controller')

router.get('/tags', controller.index)
router.post('/tags', police_check('create', 'Tags'), controller.store)
router.put('/tags/:id', police_check('update', 'Tags'), controller.update)
router.delete('/tags/:id', police_check('delete', 'Tags'), controller.destroy)

module.exports = router