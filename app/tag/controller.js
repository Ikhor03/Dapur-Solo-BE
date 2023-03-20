const tags = require('./model')

const index = async (req, res, next) => {
    try {
        let tag = await tags.find()
        return res.json(tag)
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

const store = async (req, res, next) => {
    let payload = req.body
    try {
        let postTag = new tags(payload)
        postTag.save()
        res.json(postTag)
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

const update = async (req, res, next) => {
    const { id } = req.params
    const payload = req.body

    try {
        const updateTag = await tags.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
        return res.json(updateTag)
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

const destroy = async (req, res, next) => {
    const {id} = req.params
    try {
        const deleteTag = await tags.findByIdAndDelete(id)
        return res.json(deleteTag)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    index,
    store,
    update,
    destroy
}