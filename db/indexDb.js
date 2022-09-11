const mysql = require('mysql')

const db = mysql.createPool({
  host: '127.0.0.1', // wechat  10.0.224.17
  user: 'root',
  password: '031006', // 公司fn库 123  // 本机库 生日 // wechat 密码 生日 + Clear_serve
  database: 'cleartfn',
})

module.exports = db
