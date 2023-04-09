const { subject } = require('@casl/ability')
const { policyFor } = require('../../utils')
const Invoice = require('./model')

const show = async (req, res, next) => {
    
    try {
        let { order_id } = req.params
        let invoice = await Invoice.findOne({ order: order_id })
            .populate('order')
            .populate('user')

        let policy = policyFor(req.user)
        let SubjectInvoice = subject('Invoice', { ...invoice, user_id: invoice.user._id })
        console.log(req.user)
        if (!policy.can('read', SubjectInvoice)) {
            return res.json({
                error: 1,
                message: 'Anda tidak memiliki akses untuk melihat invoice ini'
            })
        }        
        return res.json(invoice)
    } catch (err) {
        console.log(err)
        return res.json({
            error: 1,
            message: 'Error when getting invoice',
            fields: err
        })
    }
}

module.exports = {
    show
}