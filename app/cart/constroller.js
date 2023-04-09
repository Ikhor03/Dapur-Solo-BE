const product = require('../product/model')
const CartItem = require('../cart_item/model')

const update = async (req, res, next) => {
    try {
        const  {items}  = req.body
        const productsIds = items.map(item => item._id)
        const products = await product.find({ _id: { $in: productsIds } }).exec()
        let cartItems = items.map(item => {
            let relatedProducts = products.find(product => product._id.toString() === item._id)
            return {
                product: relatedProducts._id,
                price: relatedProducts.price,
                image_url: relatedProducts.image_url,
                name: relatedProducts.name,
                user: req.user._id,
                quantity: item.quantity
            }
        })
        
        await CartItem.deleteMany({user: req.user._id})
        await CartItem.bulkWrite(cartItems.map(item => {
            return {
                updateOne: {
                    filter: {
                        user: req.user._id,
                        product: item.product
                    },
                    update: item,
                    upsert: true
                }
            }
        }))

        res.status(200).send({message: 'Cart updated Successfully', data: cartItems})

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
        let items = await CartItem.find({ user: req.user._id }).populate('product')
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