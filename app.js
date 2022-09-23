const express = require('express')

const app = express()

const expressWs = require('express-ws')(app);

const port = '3000'
// return
// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))
// 导入配置文件
const jwtKey = require('./config/jwtConfig')

const jwt = require('jsonwebtoken')
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
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT.expressjwt({ secret: jwtKey, algorithms: ["HS256"] }).unless({ path: [/^\/api\//, /^\/chat\//] }))

app.use((req, res, next) => {
  let token = req.headers.authorization
  if (!token) {
    next()
  } else {
    let ovToken = JSON.parse(JSON.stringify(token)).split(' ')[1]
    jwt.verify(ovToken, jwtKey, (err, decoded) => {
      if (err) {
        console.log(`JWT: ${err.message}`)
        return res
          .status(401)
          .json({ status: false, error: 'Token is not valid' })
      }
      req.user = decoded
      next()
    })
  }
})
// 导入并使用用户路由模块
const userRouter = require('./router/user')

app.use('/api', userRouter)

// 导入用户信息模块
const userInfoRouter = require('./router/userInfo')

app.use('/user', userInfoRouter)

// 导入上传服务
const uploadFileRouter = require('./router/uploadFile')

app.use('/upload', uploadFileRouter)
// 导入聊天室
const chatsRouter = require('./router/chat')

app.use('/chat', chatsRouter)
// 好友列表
const friendsRouter = require('./router/firend')

app.use('/firend', friendsRouter)

const { getTokenReq } = require('./utils/wx_serve')
app.get('/abc', (req, res) => {
  const result = getTokenReq()
  res.send(result)
})
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') return res.sendCallBack('身份认证已过期......', null, 1000)
  res.sendCallBack(err)
})
app.listen(port, () => {
  console.log(port);
})