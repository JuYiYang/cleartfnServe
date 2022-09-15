exports.chat = (ws, req) => {
  ws.on('message', function (msg) {
    console.log(msg);
    const data = JSON.parse(msg)
    ws.send(JSON.stringify(data))
  });
}