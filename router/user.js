const express = require('express')

const router = express.Router()

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')

// user模块api
const userHandlerRouter = require('../router_handler/user.js')
// 导入 用户验证 
const { userInfo_reules, getVerifyCode_rules, login_rules } = require('../rules/user')

router.post('/verifyCode', expressJoi(getVerifyCode_rules), userHandlerRouter.verifyCode)

router.post('/userRegister', expressJoi(userInfo_reules), userHandlerRouter.userRegister)

router.post('/login', expressJoi(login_rules), userHandlerRouter.login)
module.exports = router