const deliveryAddresses = require('./model')

const store = async (req, res, next) => {
    try {
        let payload = req.body
        let user = req.user
        let address = new deliveryAddresses({ ...payload, user: user._id })
        await address.save()
        return res.json(address)
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errorrs
            })
        }
        next(err)
    }
}

const index = async (req, res, next) => {
    try {
        let {limit= 10, skip= 0} = req.params
        let count = await deliveryAddresses.find({user: req.user._id}).countDocuments()

        let addresses = await deliveryAddresses
        .find({user: req.user._id})
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .sort('-createdAt')
        res.json({data: addresses, count})
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errorrs
            })
        }
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errorrs
            })
        }
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        let payload = req.body
        let user = req.user
        let {id} = req.params
        let address = await deliveryAddresses.findByIdAndUpdate(id, {...payload, user: user._id}
            , {new: true, runValidators: true})
        res.json(address)
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errorrs
            })
        }
        next(err)
    }
}

const destroy = async (req, res, next) => {
    try {
        let {id} = req.params
        let address = await deliveryAddresses.findByIdAndDelete(id)
        res.json(address)
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errorrs
            })
        }
        next(err)
    }
}

module.exports = {
    store,
    index,
    update,
    destroy
}