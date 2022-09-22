const express = require('express')

const router = express.Router()


const { checkMyFriends, checkMyFriendsChats, checkAssignUser } = require('../router_handler/firend')

router.get('/getMyFriends', checkMyFriends);

router.post('/getMyFriendsChats', checkMyFriendsChats)

router.post('/getAssignUser', checkAssignUser)
module.exports = router