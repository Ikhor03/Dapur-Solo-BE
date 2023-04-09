const Order = require('./model')
const { Types } = require('mongoose')
const OrderItem = require('../order_item/model')
const CartItem = require('../cart_item/model')
const DeliveryAddress = require('../deliveryAddress/model')

const store = async (req, res, next) => {
    try {
        let { delivery_fee, delivery_address } = req.body
        let items = await CartItem.find({ user: req.user._id }).populate('product')
        // console.log(items)
        // console.log(req.user)  
        if (items.length === 0) {
            return res.json({
                error: 1,
                message: 'You are not create orders because you have not items in cart'
            })
        }

        let address = await DeliveryAddress.findById(delivery_address)
        let order = new Order({
            _id: new Types.ObjectId(),
            status: 'waiting_payment',
            delivery_fee: delivery_fee,
            delivery_address: {
                provinsi: address.provinsi,
                kabupaten: address.kabupaten,
                kecamatan: address.kecamatan,
                kelurahan: address.kelurahan,
                detail: address.detail
            },
            user: req.user._id,
            // order_items: 
        })

        let orderItems = await OrderItem.insertMany(items.map(item => ({
            ...item,
            name: item.product.name,
            quantity: parseInt(item.quantity),
            price: parseInt(item.price),
            order: order._id,
            product: item.product._id
        })))

        orderItems.forEach(item => order.order_items.push(item))
        order.save()
        await CartItem.deleteMany({ user: req.user._id })

        res.status(200).send({message: "Add order successfully", data: order})

    } catch (err) {
        if (err && err.name === 'ValidationError') {
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
        let { skip = 0, limit = 10 } = req.query
        let count = await Order.find({ user: req.user._id }).countDocuments()
        let orders = await Order.find({ user: req.user._id })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate('order_items')
            .sort('-createdAt')

            return res.json({
                data: orders.map(order => order.toJSON({virtuals: true})),
                count
            })
    } catch (err) {
        if (err && err.name === 'ValidationError') {
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
    store,
    index
}