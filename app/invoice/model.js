const mongoose = require('mongoose')
const {model, Schema} = mongoose 

const invoiceSchema = Schema({
    sub_total : {
        type: Number,
        required: [true, 'Sub_total harus diisi']
    },
    delivery_fee: {
        type: Number,
        required: [true, 'Delivery_fee harus diisi']
    },
    delivery_address: {
        provinsi: {type: String, required: [true, 'Provinsi harus diisi']},
        kabupaten: {type: String, required: [true, 'kabupaten harus diisi']},
        kecamatan : {type: String, required: [true, 'Pkecamatan harus diisi']},
        kelurahan: {type: String, required: [true, 'kelurahan harus diisi']},
        detail: {type: String}
    },
    total: {
        type: Number,
        required: [true, 'Total harga harus diisi']
    },
    payment_status: {
        type: String,
        enum: ['waiting_payment', 'paid'],
        default: 'waiting_payment'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
})

module.exports = model('Invoice', invoiceSchema)