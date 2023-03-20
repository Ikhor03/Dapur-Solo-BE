const { subject } = require('@casl/ability')
const { policyFor } = require('../../utils')
const Invoice = require('./model')

const show = async (req, res, next) => {
    
    try {
        let policy = policyFor(req.user)
        let SubjectInvoice = subject('Invoice', { ...Invoice, user_id: Invoice.user._id })
        if (!policy.can('read', SubjectInvoice)) {
            return res.json({
                error: 1,
                message: 'Anda tidak memiliki akses untuk melihat invocice ini'
            })
        }
        
        let { order_id } = req.params
        let invoice = await Invoice.findOne({ order: order_id })
        .populate('order')
        .populate('Users')
        
        console.log(invoice);
        res.json(invoice)
    } catch (err) {
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