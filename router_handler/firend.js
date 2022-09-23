const db = require("../db/indexDb.js");
const dayjs = require("dayjs");
const dbSqlFn = require("../utils/dbSql");
// 查询我的好友
exports.checkMyFriends = async (req, res) => {
  try {
    // const myInfo = await getmyFirends(req.user.id)
    const myInfo = await getEveryUser(req.user.id);
    res.sendCallBack("获取好友列表成功", myInfo, 0);
  } catch (err) {
    res.sendCallBack(err);
  }
};
// 查询我与好友的聊天记录
exports.checkMyFriendsChats = async (req, res) => {
  try {
    console.log(req.user.id);
    const results = await getmyFirendsChats(req.user.id, req.body.receiver_id);
    res.sendCallBack("获取聊天记录成功", results, 0);
  } catch (err) {
    res.sendCallBack(err);
  }
};
// 模糊查询可搜索的好友
exports.checkAssignUser = async (req, res) => {
  try {
    const results = await getAssignUser(req.body.query);
    res.sendCallBack("获取好友列表成功", results, 0);
  } catch (err) {
    res.sendCallBack(err);
  }
};
// 发起好友申请
exports.addFirend = async (req, res) => {
  try {
    const result = await addFirend(req.user.id, req.body);
    res.sendCallBack("待好友同意~", result, 0);
  } catch (err) {
    res.sendCallBack(err);
  }
};
// 查询用户的好友申请
exports.queryFriend = async (req, res) => {
  try {
    const result = await queryFriend(req.user.id);
    res.sendCallBack("查询成功", result, 0);
  } catch (err) {
    res.sendCallBack(err);
  }
};
// 同意 or 拒绝 好友申请
exports.refusedAgree = async (req, res) => {
  try {
    const result = await refusedAgree(req.user.id, req.body);
    res.sendCallBack("操作成功", result, 0);
  } catch (err) {
    reject(err);
  }
};
function getmyFirends(id) {
  return new Promise((resolve, reject) => {
    let sqlStr = "select * from userInfo where id = ?";
    db.query(sqlStr, id, (err, result) => {
      if (err) reject(err);

      let sqlQuery = `select * from userInfo where id in (${result[0].firendIds})`;
      db.query(sqlQuery, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  });
}
function getmyFirendsChats(sender_id, receiver_id) {
  return new Promise((resolve, reject) => {
    let front = `sender_id = ${sender_id} AND receiver_id = ${receiver_id}`;
    let after = `sender_id = ${receiver_id} AND receiver_id = ${sender_id}`;
    let sqlStr = `select * from chattings where (${front}) or (${after})`;
    console.log(sqlStr);
    db.query(sqlStr, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}
function getEveryUser(id) {
  return new Promise((resolve, reject) => {
    let sqlStr = "select * from userInfo where id != ?";
    db.query(sqlStr, id, (err, results) => {
      if (err) reject(err);
      resolve(
        results.map((item) => {
          delete item.password;
          return item;
        })
      );
    });
  });
}
function getAssignUser(query) {
  return new Promise((resolve, reject) => {
    let sqlStr = `select * from userInfo where email like '%${query}%' or username like '%${query}%' or nickname like '%${query}%'`;
    db.query(sqlStr, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}
function addFirend(id, data) {
  let Val = {
    ...data,
    sourceId: id,
    status: 0,
    createTime: dayjs().valueOf(),
  };
  let sqlQuery = `select * from addFriends where sourceId = ${Val.sourceId} AND receiverId = ${Val.receiverId}`;
  let sqlStr = "INSERT INTO  addFriends SET ?";
  return new Promise(async (resolve, reject) => {
    try {
      const queryResult = await dbSqlFn(sqlQuery);
      if (queryResult.length != 0) reject("等待对方同意中，请勿骚扰~");
      resolve(dbSqlFn(sqlStr, Val));
    } catch (err) {
      // dbSqlFn
      reject(err);
    }
  });
}
async function queryFriend(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = "select * from addFriends where receiverId = ?";
      let sqlQuery = "select * from userInfo where id = ?";
      const result = await dbSqlFn(sql, id);
      // const resultIds = await result.map(async (item) => await dbSqlFn(sqlQuery, item.sourceId))
      let resultInfo = [];

      // result.forEach(async (item) => {
      //   resultInfo.push(... await dbSqlFn(sqlQuery, item.sourceId))
      //   console.log(resultInfo.length);
      // })
      for (let i = 0; i < result.length; i++) {
        resultInfo.push(...(await dbSqlFn(sqlQuery, result[i].sourceId)));
        delete resultInfo[i].password;
        delete resultInfo[i].firendIds;
      }
      resolve(resultInfo);
    } catch (err) {
      reject(err);
    }
  });
}
async function refusedAgree(id, data) {
  return new Promise((resolve, reject) => {
    resolve({ id, data });
  });
}
