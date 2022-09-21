const express = require('express')

const router = express.Router()


const { checkMyFriends } = require('../router_handler/firend')

router.get('/getMyFriends', checkMyFriends);

module.exports = router