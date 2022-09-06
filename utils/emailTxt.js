
const sendEmailTxt = (to, code, html = null) => {
  if (!to) throw new Error('收件人邮箱格式有误');
  let emailTxt = html || {
    title: "清除官方验证码",
    body: `
              <h1>您好：</h1>
              <p style="font-size: 18px;color:#000;">
                  您的验证码为：
                  <span style="font-size: 16px;color:#f00;"> ${code}， </span>
                  您当前正在清除浮动官方注册账号，验证码告知他人将会导致数据信息被盗，请勿泄露
              </p>
              <p style="font-size: 1.5rem;color:#999;">❥(^_-)❥(^_-)❥(^_-)❥(^_-)❥(^_-)</p>
              `
  }
  return {
    from: "juyiyang1@qq.com", // 发件人地址
    to, // 收件人地址，多个收件人可以使用逗号分隔
    subject: emailTxt.title, // 邮件标题
    html: emailTxt.body // 邮件内容
  };
}
module.exports = sendEmailTxt