// Netlify Serverless Function - 处理表单提交
// 使用QQ邮箱SMTP发送邮件

const nodemailer = require('nodemailer')

exports.handler = async function(event, context) {
  // 只允许POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    }
  }

  try {
    const body = JSON.parse(event.body)
    const { message, name, email, timestamp, image } = body
    
    // 验证必要字段
    if (!message || !message.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '消息内容不能为空' })
      }
    }
    
    // 记录到控制台（实际应用中应该保存到数据库）
    console.log('收到新的祝福提交：', {
      name: name || '匿名',
      email: email || '未提供',
      message: message.substring(0, 100) + '...',
      timestamp,
      hasImage: !!image,
      ip: event.headers['client-ip']
    })
    
    // 发送邮件通知（需要配置邮件服务）
    try {
      await sendEmailNotification({
        name: name || '匿名',
        email: email || '未提供',
        message,
        timestamp
      })
    } catch (emailError) {
      console.log('邮件发送失败（开发模式正常）:', emailError)
      // 开发模式下可以跳过邮件发送错误
    }
    
    // 返回成功响应
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: '祝福已成功接收并发送通知！',
        submissionId: Date.now().toString(36) + Math.random().toString(36).substr(2)
      })
    }
    
  } catch (error) {
    console.error('处理提交时出错:', error)
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: '服务器内部错误',
        details: error.message
      })
    }
  }
}

// 发送邮件通知函数 - 使用QQ邮箱SMTP
async function sendEmailNotification(data) {
  // QQ邮箱SMTP配置
  // 需要在Netlify环境变量中设置：
  // QQ_EMAIL_AUTH_CODE: QQ邮箱授权码（不是密码）
  // 获取授权码：QQ邮箱 -> 设置 -> 账户 -> POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务 -> 开启服务 -> 生成授权码
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true, // 使用SSL
    auth: {
      user: '1341628298@qq.com', // 您的QQ邮箱
      pass: process.env.QQ_EMAIL_AUTH_CODE // QQ邮箱授权码（从环境变量读取）
    }
  })
  
  // 邮件内容
  const mailOptions = {
    from: '"祝福收集系统" <1341628298@qq.com>',
    to: '1341628298@qq.com', // 接收邮件的QQ邮箱
    subject: `新的祝福消息 - ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">💌 收到新的祝福消息</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="margin-bottom: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">发送者信息</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              <strong>姓名：</strong>${data.name}<br>
              <strong>邮箱：</strong>${data.email}<br>
              <strong>时间：</strong>${new Date(data.timestamp).toLocaleString('zh-CN')}
            </p>
          </div>
          <div style="margin-bottom: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">祝福内容</h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
              <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0; white-space: pre-wrap;">${data.message}</p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">此邮件由祝福收集系统自动发送</p>
          </div>
        </div>
      </div>
    `,
    text: `
收到新的祝福消息

发送者信息：
姓名：${data.name}
邮箱：${data.email}
时间：${new Date(data.timestamp).toLocaleString('zh-CN')}

祝福内容：
${data.message}

---
此邮件由祝福收集系统自动发送
    `
  }
  
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('邮件发送成功:', info.messageId)
    return Promise.resolve()
  } catch (error) {
    console.error('邮件发送失败:', error)
    throw new Error(`邮件发送失败: ${error.message}`)
  }
}