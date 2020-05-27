const express = require('express')
const app = express()
require('./db/mongoose')
const customerRouter = require('./routers/customer')
const orderRouter = require('./routers/order')

app.use(express.json())
app.use(customerRouter)
app.use(orderRouter)

module.exports = app