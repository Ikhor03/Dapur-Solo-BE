const { Schema, model } = require("mongoose");

const deliveryAddresSchema = Schema({
    nama: {
        type: String,
        required: [true, 'Nama alamat harus disisi'],
        maxLength: [255, 'Panjang nama alamat maksimal 255 karakter']
    },
    kelurahan: {
        type: String,
        required: [true, 'Nama alamat harus disisi'],
        maxLength: [255, 'Panjang nama kelurahan maksimal 255 karakter']
    },
    kecamatan: {
        type: String,
        required: [true, 'Nama alamat harus disisi'],
        maxLength: [255, 'Panjang nama kecamatan maksimal 255 karakter']
    },
    kabupaten: {
        type: String,
        required: [true, 'Nama alamat harus disisi'],
        maxLength: [255, 'Panjang nama kabupaten maksimal 255 karakter']
    },
    provinsi: {
        type: String,
        required: [true, 'Nama alamat harus disisi'],
        maxLength: [255, 'Panjang nama provinsi maksimal 255 karakter']
    },
    detail: {
        type: String,
        required: [true, 'Nama alamat harus disisi'],
        maxLength: [1000, 'Panjang alamat detail maksimal 1000 karakter']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }

}, { timestamps: true })

module.exports = model('DeliveryAddress', deliveryAddresSchema)