const db = require('../db/indexDb.js')

exports.getQueryUserInfo = (query, targetName) => {
  return new Promise((resolve, reject) => {
    db.query(`select * from userInfo where ${query} = ?`, targetName, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}
