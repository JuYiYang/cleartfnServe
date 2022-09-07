const express = require('express')

const app = express()

const port = '3000'
// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))
// 导入配置文件
const jwtKey = require('./config/jwtConfig')

// 解析 token 的中间件
const expressJWT = require('express-jwt')

app.use((req, res, next) => {
  res.sendCallBack = function (err, data = null, status = 1) {
    res.send({
      status,
      data,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})
// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())

// 导入并使用用户路由模块
const userRouter = require('./router/user')

app.use('/api', userRouter)
console.log(expressJWT);
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
// app.use(expressJWT({ secret: jwtKey }).unless({ path: [/^\/api\//] }))

app.get('/abc', (req, res) => {
  res.send('123')
})

app.use((err, req, res, next) => {

  if (err.name === 'UnauthorizedError') return res.sendCallBack('身份认证已过期......')
  res.sendCallBack(err)
})
app
app.listen(port, () => {
  console.log(port);
})