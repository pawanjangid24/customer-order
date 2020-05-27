const express = require('express')
const router = new express.Router();
const Order = require('../models/order')
const auth = require('../middleware/auth')
const Customer = require('../models/customer')
const mongoose = require('mongoose')

router.post('/order', auth, async (req, res) => {
    const order = new Order({
        ...req.body,
        "user information": req.user
    })
    try{
        await order.save()
        res.send(order)
    }catch(e){
        res.status(500).send(e)
    }
})

router.put('/:orderid/comment', auth, async(req, res) => {
    try{
        const user = await Customer.findById(req.user._id)
        const role = user.role

        if(role.toLowerCase() !== 'admin'){
            return res.status(401).send('not a valid user')
        }

        const updates = Object.keys(req.body)
        const allowedUpdates = ['comment']

        const isValid = updates.every(update => {
            return allowedUpdates.includes(update)
        })

        if(!isValid){
            return res.status(400).send('invalid update')
        }

        const order = await Order.findById(req.params.orderid)
        order.comments = order.comments.concat(req.body)
        await order.save()
        
        res.send(order)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/:orderid/comment/:commentid/reply', auth, async(req, res) => {
    try{
        const user = await Customer.findById(req.user._id)
        const role = user.role

        if(role.toLowerCase() !== 'admin'){
            return res.status(401).send('not a valid user')
        }

        const updates = Object.keys(req.body)
        const allowedUpdates = ['reply']

        const isValid = updates.every(update => {
            return allowedUpdates.includes(update)
        })

        if(!isValid){
            return res.status(400).send('invalid update')
        }

        const order = await Order.findById(req.params.orderid)

        const comments = order.comments
        const commentid = req.params.commentid
        
        for(var i = 0; i < comments.length; i++){
            if(comments[i]._id == commentid){
                order.comments[i].reply = req.body.reply
            }
        }
        
        await order.save()
        res.send(order)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/orders', async(req, res) => {
    try{
        const order = await Order.find()
        res.send(order)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/order/:id/comment', async(req, res) => {
    try{
        const order = await Order.findById(req.params.id)
        res.send(order.comments)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/order/:id', async(req, res) => {
    try{
        const order = await Order.findByIdAndDelete(req.params.id)
        res.send(order)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router