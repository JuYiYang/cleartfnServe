
let clients = [] // 连接用户数组
exports.chat = (ws, req) => {
  ws.on('message', function (msg) {
    const data = JSON.parse(msg)
    switch (data.type) {
      case 'connect':
        connection(ws, data)
        break;
      case 'buttObj':
        buttObj(ws, data)
        break;
      case 'buttObjMsg':
        buttObjMsg(ws, data)
        break;
    }
    getUserIds('MESSAGE')
    ws.send(JSON.stringify(data))
  });
  // 移除离线人员
  ws.on('close', (v) => {
    clients = clients.filter(item => item.id != ws.id)
    getUserIds('CLOSE')
  })
}
// 用户发起连接
function connection(ws, data) {
  const idx = clients.find(item => item.id == data.data.sender_id)
  if (!idx) {
    ws.id = data.data.sender_id
    clients.push(ws)
  }
}
// 用户指定连接
function buttObj(ws, data) {
  console.log(data);
}

// 用户指定连接发送消息
function buttObjMsg(ws, { data }) {
  let targetWs = clients.find(item => item.id == data.Value.receiver_id)

  if (!targetWs) {
    console.log('发送失败');
    ws.send(JSON.stringify({
      type: "err",
      data: {}
    }))
    return
  }
  console.log(123456);
  targetWs.send(JSON.stringify({
    type: 'buttObjMsgServe',
    data: {
      sender_id: ws.id,
      receiver_id: data.Value.receiver_id,
      content: data.Value.content
    }
  }))
  console.log('已想目标id为' + targetWs.id + '发送消息');
}
// 获取在线用户ids
function getUserIds(msg) {
  let a = []
  a = clients.map(item => item.id)
  console.log(a, '在线ids----' + msg);
}