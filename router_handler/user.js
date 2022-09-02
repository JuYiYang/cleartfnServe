
const db = require('../db/indexDb.js')
// 发送邮件
const sendEmail = require('../utils/sendEmail.js');
// 生成发送邮箱格式 
const createEmailBody = require('../utils/emailTxt')
// 生成code 
const createCode = require('../utils/randomCode')

let code; // 验证码 校验用
// db.query('select * from userInfo ', (err, result) => {
//   console.log(result);
// }
// )
// 发送验证码
exports.verifyCode = (req, res) => {
  if (!req.body.email) {
    res.send({
      code: 1,
      msg: '请输入邮箱号'
    })
  }
  code = createCode()
  sendEmail.send(createEmailBody(req.body.email, code))
  res.send(code)
}
// login 存入此账户
exports.userRegister = (req, res) => {
  console.log(req.body.verifyCode == code);
  if (!code) {
    res.send({ code: 1, msg: '验证码不存在' })
    return
  }
  if (req.body.verifyCode != code) {
    res.send({ code: 1, msg: '验证码错误' })
    return
  }
  code = null
  res.send({
    code: 0,
    msg: '登录成功',
    data: {
      name: req.body.email,
      pas: req.body.password
    }
  })
}
exports.getUserName = (req, res) => {
  // 定义 SQL 语句，查询用户名是否被占用
  const sqlStr = 'select * from user where username=?'
  db.query(sqlStr, userinfo.username, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      // return res.send({ status: 1, message: err.message })
      return res.cc(err)
    }
    // 判断用户名是否被占用
    if (results.length > 0) {
      // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
      return res.cc('用户名被占用，请更换其他用户名！')
    }
    console.log(results);
  })
}