const express = require('express')

const router = express.Router()

// 生成验证码
const userHandlerRouter = require('../router_handler/user.js')

router.get('/verifyCode', userHandlerRouter.verifyCode)

module.exports = router