const Categories = require('./model')

const index = async (req, res, next) => {
    try {
        let categories = await Categories.find()
        return res.json(categories)
    } catch (error) {
        next(error)
    }
}

const store = async (req, res, next) => {
    let payload = req.body
    try {
        let postCategories = await new Categories(payload)
        postCategories.save()
        return res.json(postCategories)
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
    let payload = req.body
    const { id } = req.params
    try {
        let updateCategories = await Categories.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
        return res.json(updateCategories)
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
    const { id } = req.params
    try {
        let deleteCategory = await Categories.findByIdAndDelete(id)
        return res.json(deleteCategory)
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

module.exports = {
    index,
    store,
    update,
    destroy
}