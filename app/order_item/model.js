const mongoose= require("mongoose");
const {model, Schema} = mongoose

const orderItemSchema = Schema({
    name: {
        type: String,
        minLength: [5, 'panjang nama minimal 5 karakter'],
        required: [true, 'nama harus diisi']
    },
    price: {
        type: Number,
        required: [true, 'Harga item harus diisi']
    },
    quantity: {
        type: Number,
        required: [true, 'Kuantitas harus diisi'],
        min: [1, 'Kuantitas tidak boleh kosong']
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    Order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
})

module.exports = model('OrderItem', orderItemSchema)