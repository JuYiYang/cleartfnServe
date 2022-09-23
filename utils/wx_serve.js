const axios = require('axios')

const appid = 'wxb50adf0398f0617b'
const secret = '3bb2ac3383bbe2029f799725fe253724'

const getTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token'

const access_token = null

exports.getTokenReq = () => {
  return new Promise((resolve, reject) => {
    axios.get(getTokenUrl, {
      params: {
        appid,
        secret,
        grant_type: 'client_credential'
      }
    }).then((res) => {
      console.log(res.data);
      access_token = res.data.access_token
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}