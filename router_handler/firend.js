const db = require('../db/indexDb.js')

exports.checkMyFriends = async (req, res) => {
  try {
    // const myInfo = await getmyFirends(req.user.id)
    const myInfo = await getEveryUser(req.user.id)
    res.sendCallBack('获取好友列表成功', myInfo, 0)
  } catch (err) {
    res.sendCallBack(err)
  }
}
exports.checkMyFriendsChats = async (req, res) => {
  try {
    console.log(req.user.id);
    const results = await getmyFirendsChats(req.user.id, req.body.receiver_id)
    res.sendCallBack('获取聊天记录成功', results, 0)
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
function getmyFirendsChats(sender_id, receiver_id) {
  return new Promise((resolve, reject) => {
    let front = `sender_id = ${sender_id} AND receiver_id = ${receiver_id}`
    let after = `sender_id = ${receiver_id} AND receiver_id = ${sender_id}`
    let sqlStr = `select * from chattings where (${front}) or (${after})`
    console.log(sqlStr);
    db.query(sqlStr, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}
function getEveryUser(id) {
  return new Promise((resolve, reject) => {
    let sqlStr = 'select * from userInfo where id != ?'
    db.query(sqlStr, id, (err, results) => {
      if (err) reject(err)
      resolve(results.map(item => {
        delete item.password
        return item
      }))
    })
  })
}