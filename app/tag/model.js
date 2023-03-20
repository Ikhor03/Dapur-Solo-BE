const mongoose = require ('mongoose')
const {model, Schema} = mongoose

const tagSchema = Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, 'tag minimal 3 karakter'],
        maxlength: [20, 'tag maksimal 20 karakter']
    }
})

module.exports = model('Tags', tagSchema)