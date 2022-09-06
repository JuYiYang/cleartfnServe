
const db = require('../db/indexDb.js')
// 发送邮件
const sendEmail = require('../utils/sendEmail.js');
// 生成发送邮箱格式 
const createEmailBody = require('../utils/emailTxt')
// 生成code 
const createCode = require('../utils/randomCode');
const { result } = require('@hapi/joi/lib/base');
let code; // 验证码 校验用
// 发送验证码
exports.verifyCode = async (req, res) => {
  code = createCode()
  try {
    // const result = await sendEmail.send(createEmailBody(req.body.email, code))
    // if (result != 1) res.sendCallBack('发送验证码失败~')
    res.sendCallBack(code)
  } catch (err) {
    code = null
    res.sendCallBack('服务繁忙,五分钟后重试')
  }
}
// 注册账号
exports.userRegister = (req, res) => {
  // if (!code || req.body.verifyCode != code) {
  //   res.sendCallBack('验证码错误或不存在')
  //   return
  // }
  const sqlStr = 'select * from userInfo where email = ? or username =?'
  // const insertSqlStr = 'INSERT INTO userinfo (email,username,password) VALUES(?,?,?)'
  const setSqlStr = 'INSERT INTO userinfo SET ?'
  
  db.query(sqlStr, [req.body.email, req.body.username], (err, results) => {

    if (err) return res.sendCallBack(err)

    if (results.length) return res.sendCallBack('邮箱或者用户名被人占用，')

    delete req.body.verifyCode

    db.query(setSqlStr, req.body, async (error, result) => {
      if (error) return res.sendCallBack(error)
      if (result.affectedRows == 1) {
        res.sendCallBack('添加成功', ...await getQueryUserInfo('username', req.body.username), 0)
      } else {
        res.sendCallBack('添加失败~')
      }
    })
  })
  // code = null
}

const getQueryUserInfo = (query, targetName) => {
  return new Promise((resolve, reject) => {
    db.query(`select * from userInfo where ${query} = ?`, targetName, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}