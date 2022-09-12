const express = require('express')

const router = express.Router()

const uploadImg_handel = require('../router_handler/uploadFile')

router.post('/uploadImg', uploadImg_handel.uploadImg)

module.exports = router