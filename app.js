const express = require('express')

const app = express()

const port = '3000'
// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.sendCallBack = function (err,data=null,status = 1) {
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

app.listen(port, () => {
  console.log(port);
})