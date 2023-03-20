const mongoose = require ('mongoose')
const {model, Schema} = mongoose

categorySchema = Schema({
    name : {
        type: String,
        minlength: [3, 'Minimal kategori adalah 3 karakter'],
        maxlength: [20, 'Maksimal kategori adalah 20 karakter'],
        required: [true, 'Kategori harus diisi']
    }
})

module.exports = model('Category', categorySchema)