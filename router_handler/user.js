
const db = require('../db/indexDb.js')
// 发送邮件
const sendEmail = require('../utils/sendEmail.js');
// 生成发送邮箱格式 
const createEmailBody = require('../utils/emailTxt')
// 生成code 
const createCode = require('../utils/randomCode');
// 加密算法
const bcrypt = require('bcryptjs')
// 生成token 
const jwt = require('jsonwebtoken')
// 导入token config
const jwtKey = require('../config/jwtConfig')
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

    const userInfo = JSON.parse(JSON.stringify(req.body))

    delete userInfo.verifyCode

    userInfo.password = bcrypt.hashSync(userInfo.password, 10) // 32长度会报错 未知
    db.query(setSqlStr, userInfo, async (error, result) => {
      if (error) return res.sendCallBack(error)
      if (result.affectedRows == 1) {
        res.sendCallBack('注册成功', 0)
      } else {
        res.sendCallBack('注册失败，未知的错误~')
      }
    })
  })
  // code = null
}

// login
exports.login = (req, res) => {
  if (!req.body.username && !req.body.nickname) return res.sendCallBack('请添加完整登陆信息')

  const sqlQueryUSerStr = 'select * from userInfo where username = ? or email =?'

  db.query(sqlQueryUSerStr, [req.body?.username, req.body?.email], async (err, results) => {

    if (err) return res.sendCallBack(err)

    if (results.length == 0) return res.sendCallBack('账户不存在')

    if (req.body.password != results[0].password) return res.sendCallBack('密码错误')

    const token = jwt.sign({ ...req.body, password: '' }, jwtKey, {
      expiresIn: '10h', // token 有效期为 10 个小时
    })

    const resultInfo = await getQueryUserInfo('username', req.body.email || req.body.username)

    resultInfo[0].token = 'Bearer ' + token

    delete resultInfo[0].password

    res.sendCallBack('登陆成功', ...resultInfo)
  })
}

const getQueryUserInfo = (query, targetName) => {
  return new Promise((resolve, reject) => {
    db.query(`select * from userInfo where ${query} = ?`, targetName, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}