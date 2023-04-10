const path = require('path')
const fs = require('fs')
const config = require('../config')
const Product = require('./model')
const Category = require('../category/model')
const Tag = require('../tag/model')
const { dbHost, dbPort } = require('../config')

const store = async (req, res, next) => {
    try {
        let payload = req.body

        // => relasi dengan category
        if (payload.category) {
            let category = await Category.find({ name: { $regex: payload.category, $options: 'i' } })
            if (category) {
                payload = { ...payload, category: category[0]._id }
            }
        } else {
            delete payload.category
        }

        // => relasi dengan tags
        if (payload.tags && payload.tags.length > 0) {
            let tags = await Tag.find({ name: { $in: payload.tags } })
            if (tags) {
                payload = { ...payload, tags: tags.map(tag => tag._id) }
                console.log(payload)
            }
        } else {
            delete payload.tags
        }
        //------
        if (req.file) {
            let tmp_path = req.file.path
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
            let filename = req.file.filename + '.' + originalExt
            let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`)

            const src = fs.createReadStream(tmp_path)
            const dest = fs.createWriteStream(target_path)
            src.pipe(dest)

            src.on('end', async () => {
                try {
                    let product = new Product({ ...payload, image_url: `${dbHost}:${dbPort}/${filename}` })
                    await product.save()
                    return res.json(product)
                } catch (error) {
                    fs.unlinkSync(tmp_path)
                    if (error && error.name === 'ValidationError') {
                        return res.json({
                            error: 1,
                            message: error.message,
                            fields: error.errors
                        })
                    }
                    next(error)
                }

            })

            src.on('error', async () => {
                next(error)
            })

        } else {
            let product = new Product({ ...payload })
            product.save()
            return res.json(product)
        }
    } catch (error) {
        if (error && error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            })
        }
        res.json(error)
        next(error)
    }

}

const update = async (req, res, next) => {
    try {
        let payload = req.body
        let { id } = req.params

        // update karena relasi dengan category
        if (payload.category) {
            let category = await Category.find({ name: { $regex: payload.category, $options: 'i' } })
            if (category) {
                payload = { ...payload, category: category[0]._id }
            }
        } else {
            delete payload.category
        }

        // => relasi dengan tags
        if (payload.tags && payload.tags.length > 0) {
            let tags = await Tag.find({ name: { $in: payload.tags } })
            if (tags) {
                payload = { ...payload, tags: tags.map(tag => tag._id) }
            }
        } else {
            delete payload.tags
        }

        if (req.file) {
            let tmp_path = req.file.path
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
            let filename = req.file.filename + '.' + originalExt
            let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`)

            const src = fs.createReadStream(tmp_path)
            const dest = fs.createWriteStream(target_path)
            src.pipe(dest)

            src.on('end', async () => {
                try {

                    let product = await Product.findById(id)
                    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`

                    if (fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage)
                    }

                    product = await Product.findByIdAndUpdate(id, { ...payload, image_url: filename }, {
                        new: true,
                        runValidators: true
                    })
                    return res.json(product)
                } catch (error) {
                    fs.unlinkSync(tmp_path)
                    if (error && error.name === 'ValidationError') {
                        return res.json({
                            error: 1,
                            message: error.message,
                            fields: error.errors
                        })
                    }
                    next(error)
                }

            })

            src.on('error', async () => {
                next(error)
            })

        } else {
            let product = await Product.findByIdAndUpdate(id, payload, {
                new: true,
                runValidators: true
            })
            return res.json(product)
        }
    } catch (error) {
        if (error && error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            })
        }

        next(error)
    }

}

const index = async (req, res, next) => {
    try {
        let { skip = 0, limit = 12, q = '', category = '', tags = [] } = req.query

        let paramsFilter = {}

        if (q.length) {
            paramsFilter = { ...paramsFilter, name: { $regex: q, $options: 'i' } }
        }

        if (category.length) {
            category = await Category.findOne({ name: { $regex: `${category}`, $options: 'i' } })

            if (category) {
                paramsFilter = { ...paramsFilter, category: category._id }
            } else {
                paramsFilter = { ...paramsFilter, category: { $in: [] } }
            }
        }

        if (tags.length > 0) {

            tags = await Tag.find({ name: { $in: tags } })
            if (tags) {
                paramsFilter = { ...paramsFilter, tags: { $in: tags.map(tag => tag._id) } }
            }
        }

        let count = await Product.find(paramsFilter).countDocuments()
        let product = await Product
            .find(paramsFilter)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate('category')
            .populate('tags')
        return res.json({
            data: product,
            count
        })
    } catch (error) {
        next(error)
    }
}

const view = async (req, res, next) => {
    try {
        let { id } = req.params
        let product = await Product
            .findById(id)
            .populate('category')
            .populate('tags')
        return res.json(product)
    } catch (error) {
        next(error)
    }
}

const destroy = async (req, res, next) => {
    try {
        let { id } = req.params
        let product = await Product.findByIdAndDelete(id)

        let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`

        if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
        }

        return res.json(product)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    store,
    index,
    update,
    view,
    destroy
}