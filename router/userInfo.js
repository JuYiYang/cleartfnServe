const express = require('express')

const router = express.Router()

const handlerFn = require('../router_handler/userinfo')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')

const { getUserInfo_rules, editUserInfo_rules } = require('../rules/userInfoRules')

router.post('/getMyInfo', expressJoi(getUserInfo_rules), handlerFn.getMyInfo)
router.put('/editMyInfo', expressJoi(editUserInfo_rules), handlerFn.editMyInfo)
module.exports = router