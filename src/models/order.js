const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    "item description": {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    "user information": {
        type: mongoose.Schema.Types.Array,
        required: true
    },
    comments: [{
        comment: {
            type: String
        },
        reply:{
            type: String
        }
    }]
}, {
    timestamps: true
})

orderSchema.methods.toJSON = function(){
    const order = this
    const orderObject = order.toObject()

    delete orderObject['user information'][0][0].password
    delete orderObject['user information'][0][0].tokens
    return orderObject
}

const Order = mongoose.model('Order', orderSchema)

module.exports = Order