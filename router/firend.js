const express = require("express");

const router = express.Router();

const {
  checkMyFriends,
  checkMyFriendsChats,
  checkAssignUser,
  addFirend,
  queryFriend,
  refusedAgree,
} = require("../router_handler/firend");

router.get("/getMyFriends", checkMyFriends);

router.post("/getMyFriendsChats", checkMyFriendsChats);

router.post("/getAssignUser", checkAssignUser);

router.post("/addFirend", addFirend);

router.get("/queryFriend", queryFriend);

router.put("/refusedAgree", refusedAgree);

module.exports = router;
