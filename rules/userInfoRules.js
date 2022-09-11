const { id } = require('@hapi/joi/lib/base')
const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

const userInfoJoi = joi.required()
const usernameJoi = joi.string()
const headerJoi = joi.string()
const nicknameJoi = joi.string()
const idJoi = joi.string().required()
exports.getUserInfo_rules = {
  body: {
    id: idJoi
  }
}
exports.editUserInfo_rules = {
  body: {
    id: idJoi,
    username: usernameJoi,
    header: headerJoi,
    nickname: nicknameJoi,
  }
}