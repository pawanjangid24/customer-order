const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowerCase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('please provide a valid Email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password can not contain "password"')
            }
        }
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

customerSchema.methods.generateAuthToken = async function(){
    const customer = this
    const token = jwt.sign({_id: customer._id.toString()}, 'thisismysecret')
    customer.tokens = customer.tokens.concat({token})
    await customer.save()
    return token
}

customerSchema.statics.findByCredentials = async (email, password) => {
        const customer = await Customer.findOne({email})
        if(!customer){
            throw new Error('unable to login')
        }
        const isMatch = await bcrypt.compare(password, customer.password)
        if(!isMatch){
            throw new Error('not a valid user')
        }
        return customer
}

customerSchema.methods.toJSON = function(){
    const customer = this
    const userObject = customer.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer