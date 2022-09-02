const express = require('express')

const app = express()

const port = '3000'
// 导入并使用用户路由模块
const userRouter = require('./router/user')

app.use('/api', userRouter)

app.listen(port, () => {
  console.log(port);
})