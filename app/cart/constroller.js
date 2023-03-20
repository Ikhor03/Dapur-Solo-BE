const product = require('../product/model')
const cartItem = require('../cart_item/model')

const update = async (req, res, next) => {
    try {
        const { items } = req.body
        const productsIds = items.map(item => product._id)
        const products = product.find({ id: { $in: productsIds } })
        let cartItems = items.map(item => {
            let relatedProducts = products.find(product => product._id.toString() === item.product._id)
            return {
                product: relatedProducts.Id,
                price: relatedProducts.price,
                image_url: relatedProducts.image_url,
                name: relatedProducts.name,
                user: req.user._id,
                qty: item.qty
            }
        })
        
        await cartItem.deleteMany({user: req.user._id})
        await cartItem.bulkWrite(cartItems.map(item => {
            return {
                updateOne: {
                    filter: {
                        user: req.user._id,
                        product: item.product
                    }
                },
                update: item,
                upsert: true
            }
        }))

    } catch (err) {
        if(err && err.name === 'ValidationError') {
            return {
                error: 1,
                message: err.message,
                fields: err.errors
            }
        }
        next(err)
    }
}

const index = async (req, res, next) => {
    try {
        let items = await cartItem.find({user: req.user._id}).populate('Products')
        res.json(items)
    } catch (err) {
        if(err && err.name === 'ValidationError') {
            return {
                error: 1,
                message: err.message,
                fields: err.errors
            }
        }
        next(err)
    }
}

module.exports = {
    index,
    update
}