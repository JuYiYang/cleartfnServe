const express = require('express')

const router = express.Router()

const { chat } = require('../router_handler/caht')

router.ws('/chat',chat);

module.exports = router
