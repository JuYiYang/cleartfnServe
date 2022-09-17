const db = require('../db/indexDb.js')

exports.checkMyFriends = async (req, res) => {
  try {
    const myInfo = await getmyFirends(req.user.id)
    res.sendCallBack('获取好友列表成功',myInfo,0)
  } catch (err) {
    res.sendCallBack(err)
  }
}

function getmyFirends(id) {
  return new Promise((resolve, reject) => {
    let sqlStr = 'select * from userInfo where id = ?'
    db.query(sqlStr, id, (err, result) => {
      if (err) reject(err)

      let sqlQuery = `select * from userInfo where id in (${result[0].firendIds})`

      db.query(sqlQuery, (err, results) => {
        if (err) reject(err)
        resolve(results)
      })
    })
  })
}