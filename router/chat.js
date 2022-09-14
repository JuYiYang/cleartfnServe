const express = require('express')

const router = express.Router()

const { chat } = require('../router_handler/caht')

router.get('/joinChat', chat)

module.exports = router
