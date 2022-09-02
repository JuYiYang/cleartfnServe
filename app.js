const express = require('express')

const app = express()

const port = '3000'

// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())

// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))

// 导入并使用用户路由模块
const userRouter = require('./router/user')

app.use('/api', userRouter)

app.use((err, req, res, next) => {
  res.send({
    code: 1,
    message: err
  })
  next()
})

app.listen(port, () => {
  console.log(port);
})