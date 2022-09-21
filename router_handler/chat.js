const db = require("../db/indexDb");
let clients = [] // 连接用户数组

exports.chat = (ws, req, res) => {
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
        buttObjMsg(ws, data, res)
        break;
    }
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
  const idx = clients.find(item => item.id == data.data.userId)
  clients = clients.filter(item => item.id)
  if (!idx) {
    ws.id = data.data.sender_id
    clients.push(ws)
    getUserIds('MESSAGE')
  }
}
// 用户指定连接
function buttObj(ws, data) {
  console.log(data);
}

// 用户指定连接发送消息
async function buttObjMsg(ws, { data }) {
  let targetWs = clients.find(item => item.id == data.Value.targetId)
  if (!targetWs) {
    ws.send(JSON.stringify({
      type: 'buttTakeObjMsg',
      data: '没有与用户建立上连接'
    }))
    return
  }
  const resultObj = {
    sender_id: data.sender_id,
    receiver_id: data.Value.receiver_id,
    content: data.Value.content,
    createTime: new Date().getTime(),
  }

  try {
    await setDbchatting(resultObj)
  } catch {
    ws.send(JSON.stringify({
      type: 'buttTakeObjMsg',
      data: '失败'
    }))
  }
  targetWs.send(JSON.stringify({
    type: 'buttTakeObjMsg',
    data: resultObj,
  }))
}
// 获取在线用户ids
function getUserIds(msg) {
  let a = []
  a = clients.map(item => item.id)
  console.log(a, '在线ids----' + msg);
}
function setDbchatting(data) {
  return new Promise((resolve, reject) => {
    const setSqlStr = 'INSERT INTO chattings SET ?'
    db.query(setSqlStr, data, (err, result) => {
      if (err) {
        console.log(err);
        reject(err)
      }
      resolve((Array(10).join("0") + result.insertId).slice(-10))
    })
  })
}