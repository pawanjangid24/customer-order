const jwt = require('jsonwebtoken')
const Customer = require('../models/customer')

const auth = async (req, res, next) => {

    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'thisismysecret')
        const customer = await Customer.findOne({_id: decode._id, 'tokens.token':token})
        if(!customer){
            return res.status(500).send('not a valid user')
        }
        req.token = token
        req.user = customer
        next()
    }catch(e){
        res.status(401).send({error: 'not a valid token'})
    }
}

module.exports = auth