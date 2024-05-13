require('dotenv').config();
const express = require('express')
const next = require('next')
const axios = require('axios')
const cron = require('node-cron')
const { PrismaClient } = require('@prisma/client')

const config = {
    dev: process.env.NODE_ENV == 'development',
    hostname: '127.0.0.1',
    port: process.env.PORT || 3005
}
const app = next(config)



app.prepare().then(() => {
    const server = express()
    server.use(express.static('public'))
    server.all('*', (req, res) => app.getRequestHandler()(req, res))
    server.listen(config.port, (err) => {
        if (err) throw err
        console.log(`Server is running on ${config.hostname} port ${config.port}`)
    })
})
