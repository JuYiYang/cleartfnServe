const db = require('../db/indexDb.js')

const { getQueryUserInfo } = require('../sqlUtils/index')
// 获取用户信息
exports.getMyInfo = (req, res) => {
  if (!req.user.id) {
    return res.sendCallBack('身份认证失败~', null, 1000)
  }
  const sqlStr = 'select * from userInfo where id=?'
  
  db.query(sqlStr, req.user.id, (err, results) => {
    if (err) return res.sendCallBack(err)
    if (results.length != 1) return res.sendCallBack('用户不存在')
    delete results[0].password
    res.sendCallBack('获取用户信息成功', ...results, 0)
  })
}
// 修改基本用户信息
exports.editMyInfo = async (req, res) => {
  const result = await getQueryUserInfo('id', req.body.id)

  if (result.length != 1) return res.sendCallBack('不存在该用户')

  const sqlStr = 'update userInfo set? where id=?'

  const reqData = JSON.parse(JSON.stringify(req.body))

  db.query(sqlStr, [reqData, req.body.id], (err, result) => {

    if (err) return res.sendCallBack('更新失败', err)

    res.sendCallBack('更新成功', null, 0)

  })
}