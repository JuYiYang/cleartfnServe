const mysql = require('mysql')

const db = mysql.createPool({
  host: '10.0.224.17', // wechat  10.0.224.17
  user: 'root',
  password: '031006Clear_serve', // 公司fn库 123  // 本机库 生日 // wechat 密码 生日 + Clear_serve
  database: 'cleartfn',
})

module.exports = db
