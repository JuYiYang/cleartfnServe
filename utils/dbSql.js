// import db from "../db/indexDb"
const db = require('../db/indexDb')

module.exports = function (sql, data = null) {
  return new Promise((resolve, reject) => {
    console.log(sql);
    db.query(sql, data, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}