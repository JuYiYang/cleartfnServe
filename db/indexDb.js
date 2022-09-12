const mysql = require('mysql')

const db = mysql.createPool({
  host: 'www.cleartfn.top', // wechat  10.0.224.17
  user: 'cleartfn',
  password: '031006', // 公司fn库 123  // 本机库 10 // wechat 密码 10 Clear_serve
  database: 'cleartfn',
})

module.exports = db
