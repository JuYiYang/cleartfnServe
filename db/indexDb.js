const mysql = require('mysql')

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '123', // 公司fn库 123  // 本机库 生日
  database: 'cleartfn',
})

module.exports = db
