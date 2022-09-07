const db = require('../db/indexDb.js')
//获取用户信息
exports.getMyInfo = (req, res) => {
  console.log(req.body);
  const sqlStr = 'select * from userInfo where id=?'
  db.query(sqlStr, req.body.id, (err, results) => {
    if (err) return res.sendCallBack(err)
    if (results.length != 1) return res.sendCallBack('用户不存在')
    delete results[0].password
    res.sendCallBack('获取用户信息成功', ...results)
  })
}