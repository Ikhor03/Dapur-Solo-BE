const mongoose = require('mongoose')
const {model, Schema} = mongoose

cartItemSchema  = Schema({
    name : {
        type: String,
        minLength: [5, 'Panjang nama item minimal 5 karakter'],
        required: [true, 'Nama item harus diisi']

    },
    qty: {
        type: Number,
        required: [true, 'Quantity harus diisi'],
        min: [1, 'Quantity tidak boleh kosong']
    },
    price: {
        type: Number,
        default: 0
    },
    image_url: String,

    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',

    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Products'
    }
})

module.exports = model('CartItems', cartItemSchema)