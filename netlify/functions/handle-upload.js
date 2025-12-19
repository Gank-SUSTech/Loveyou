// Netlify Serverless Function - 处理表单提交
// Note: Using native fetch available in Node 18+

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

// 发送邮件通知函数
async function sendEmailNotification(data) {
  // 使用EmailJS、SendGrid或其他邮件服务
  // 这里以EmailJS为例，需要配置服务ID、模板ID和用户ID
  
  const emailData = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_USER_ID,
    template_params: {
      to_email: '19924524801@qq.com',
      from_name: data.name,
      message: data.message,
      user_email: data.email,
      date: new Date(data.timestamp).toLocaleString('zh-CN'),
      submission_id: Date.now().toString(36)
    }
  }
  
  // 实际部署时需要取消注释并配置环境变量
  /*
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  })
  
  if (!response.ok) {
    throw new Error(`邮件发送失败: ${response.statusText}`)
  }
  */
  
  // 开发模式下模拟成功
  console.log('开发模式：模拟邮件发送', emailData.template_params)
  return Promise.resolve()
}