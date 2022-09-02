
// 发送邮件
const sendEmail = require('../utils/sendEmail.js');
// 生成发送邮箱格式 
const createEmailBody = require('../utils/emailTxt')
// 生成code 
const createCode = require('../utils/randomCode')

let code; // 验证码 校验用

exports.verifyCode = (req, res) => {
  code = createCode
  sendEmail.send(createEmailBody(req.body.recipients, code))
  res.send(code)
}