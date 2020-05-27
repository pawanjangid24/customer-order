const express = require('express')
const router = new express.Router()
const Customer = require('../models/customer')

router.post('/customer/login', async(req, res) => {
    const email = req.body.email
    const password = req.body.password

    try{
        const customer = await Customer.findByCredentials(email, password);

        const token = await customer.generateAuthToken()
        res.send({customer, token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/customer', async(req, res) => {
    const customer = new Customer(req.body)
    console.log(customer)
    try{
        await customer.save();
        const token = await customer.generateAuthToken()
        res.send({customer, token})
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/customers', async(req, res) => {
    try{
        const customers = await Customer.find();
        res.send(customers)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/customer/:id', async(req, res) => {
    try{
        const customer = await Customer.findByIdAndDelete(req.params.id)
        res.send(customer)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router