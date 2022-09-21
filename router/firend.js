const express = require('express')

const router = express.Router()


const { checkMyFriends,checkMyFriendsChats } = require('../router_handler/firend')

router.get('/getMyFriends', checkMyFriends);

router.post('/getMyFriendsChats',checkMyFriendsChats)

module.exports = router