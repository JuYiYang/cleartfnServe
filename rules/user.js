const res = require('express/lib/response')
const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */
let schema = {
  "string.empty": "必填",
  "any.required": "必填",
  "string.alphanum": '只能包含a-zA-Z0-9',
  "string.max": '长度不能超过10',
}
const passwordJoi = joi.string().alphanum().min(4).max(8).required()

const usernameJoi = joi.string().max(10).required()

const emailJoi = joi.string().email().required().messages(schema)

const verifyCodeJoi = joi.string().max(4).required()

exports.getVerifyCode_rules = {
  body: {
    email: emailJoi,
  }
}

exports.userInfo_reules = {
  body: {
    username: usernameJoi,
    password: passwordJoi,
    email:emailJoi,
    verifyCode:verifyCodeJoi
  }
}