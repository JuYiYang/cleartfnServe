
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
    res.sendCallBack(code, null, 0)
  } catch (err) {
    code = null
    console.log(req.body.email + 'send error');
    res.sendCallBack('服务繁忙,五分钟后重试')
  }
}
// 注册账号
exports.userRegister = (req, res) => {
  console.log(code);
  if (!code || req.body.verifyCode != code) {
    res.sendCallBack('验证码错误或不存在')
    return
  }
  const sqlStr = 'select * from userInfo where email = ? '
  // const insertSqlStr = 'INSERT INTO userinfo (email,username,password) VALUES(?,?,?)'
  const setSqlStr = 'INSERT INTO userInfo SET ?'

  db.query(sqlStr, [req.body.email], (err, results) => {

    if (err) return res.sendCallBack(err)

    if (results.length) return res.sendCallBack('该邮箱已经被别人使用了~')

    const userInfo = JSON.parse(JSON.stringify(req.body))

    delete userInfo.verifyCode

    userInfo.password = bcrypt.hashSync(userInfo.password, 10) // 32长度会报错 未知
    db.query(setSqlStr, userInfo, async (error, result) => {
      if (error) return res.sendCallBack(error)
      if (result.affectedRows == 1) {
        code = null
        res.sendCallBack('注册成功', null, 0)
      } else {
        res.sendCallBack('注册失败，未知的错误~')
      }
    })
  })
}

// login
exports.login = (req, res) => {
  // if (!req.body.username && !req.body.nickname) return res.sendCallBack('请添加完整登陆信息')

  const sqlQueryUSerStr = 'select * from userInfo where email =?'

  db.query(sqlQueryUSerStr, [req.body?.email], async (err, results) => {

    if (err) return res.sendCallBack(err)

    if (results.length == 0) return res.sendCallBack('账户不存在')

    if (!bcrypt.compareSync(req.body.password, results[0].password)) return res.sendCallBack('密码错误')

    const resultInfo = await getQueryUserInfo('email', req.body.email || req.body.username)

    const token = jwt.sign({ ...resultInfo[0], password: '' }, jwtKey, {
      expiresIn: '24h', // token 有效期为 10 个小时
    })


    res.sendCallBack('登陆成功', { token: 'Bearer ' + token }, 0)
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