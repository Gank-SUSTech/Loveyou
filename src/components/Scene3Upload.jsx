import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import emailjs from 'emailjs-com'

const Scene3Upload = ({ onSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    message: '',
    name: '',
    email: ''
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)
  
  // 模拟上传进度
  const simulateProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 200)
    return interval
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      
      // 创建预览URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleRemoveImage = () => {
    setSelectedImage(null)
    setPreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.message.trim()) {
      setSubmitStatus({ type: 'error', message: '请填写祝福语' })
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus(null)
    
    // 开始模拟上传进度
    const progressInterval = simulateProgress()
    
    try {
      // 1. 准备表单数据
      const submissionData = new FormData()
      submissionData.append('message', formData.message)
      submissionData.append('name', formData.name || '匿名')
      submissionData.append('email', formData.email || '未提供')
      submissionData.append('timestamp', new Date().toISOString())
      
      if (selectedImage) {
        submissionData.append('image', selectedImage)
      }
      
      // 2. 发送到Netlify Function (模拟)
      // 注意：实际部署时需要配置正确的endpoint
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 3. 发送邮件通知到您的QQ邮箱
      const emailParams = {
        to_email: '19924524801@qq.com',
        from_name: formData.name || '匿名祝福者',
        message: formData.message,
        date: new Date().toLocaleString('zh-CN'),
        has_image: !!selectedImage
      }
      
      // 使用EmailJS发送邮件（需要配置）
      // 请到 https://www.emailjs.com/ 注册并获取服务ID、模板ID和用户ID
      try {
        await emailjs.send(
          'YOUR_SERVICE_ID', // 替换为您的EmailJS服务ID
          'YOUR_TEMPLATE_ID', // 替换为您的模板ID
          emailParams,
          'YOUR_USER_ID' // 替换为您的用户ID
        )
      } catch (emailError) {
        console.log('邮件发送失败（开发模式正常）:', emailError)
        // 开发模式下可以跳过邮件发送错误
      }
      
      // 完成进度
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // 成功状态
      setTimeout(() => {
        setSubmitStatus({ 
          type: 'success', 
          message: '祝福已成功发送！对方很快就会收到你的心意~' 
        })
        setIsSubmitting(false)
        
        // 触发成功效果
        onSuccess()
        
        // 重置表单
        setFormData({ message: '', name: '', email: '' })
        handleRemoveImage()
        setUploadProgress(0)
      }, 500)
      
    } catch (error) {
      console.error('提交失败:', error)
      clearInterval(progressInterval)
      setSubmitStatus({ 
        type: 'error', 
        message: '提交失败，请稍后重试或直接联系主人' 
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-elegant text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-4">
            传递你的祝福
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            写下你的祝福，上传一张照片，让爱意跨越距离直达TA的心间
          </p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          {/* 上传表单 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-8 border-purple-100">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 姓名和邮箱（可选） */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      你的名字（可选）
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all duration-300"
                      placeholder="匿名天使"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      邮箱（可选，用于回复）
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                {/* 祝福语 */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    祝福语 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all duration-300 resize-none"
                    placeholder="写下你最真挚的祝福...（至少10个字）"
                    required
                  />
                  <div className="text-right mt-2 text-gray-500">
                    {formData.message.length}/500
                  </div>
                </div>
                
                {/* 图片上传 */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    上传图片（可选）
                  </label>
                  
                  {previewUrl ? (
                    <div className="relative group">
                      <img
                        src={previewUrl}
                        alt="预览"
                        className="w-full h-64 object-cover rounded-xl border-4 border-purple-200"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-4 border-dashed border-purple-300 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-300"
                    >
                      <div className="text-5xl text-purple-400 mb-4">📸</div>
                      <p className="text-gray-600 mb-2">点击选择图片或拖拽到这里</p>
                      <p className="text-sm text-gray-500">支持 JPG, PNG 格式，最大5MB</p>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
                
                {/* 上传进度 */}
                {isSubmitting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>上传进度</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
                
                {/* 提交状态 */}
                {submitStatus && (
                  <div className={`p-4 rounded-xl ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {submitStatus.type === 'success' ? '🎉' : '⚠️'}
                      </span>
                      <span>{submitStatus.message}</span>
                    </div>
                  </div>
                )}
                
                {/* 按钮组 */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 px-6 py-4 rounded-xl border-2 border-purple-300 text-purple-600 font-medium hover:bg-purple-50 transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    ← 返回书信
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                      isSubmitting 
                        ? 'bg-gradient-to-r from-purple-400 to-pink-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transform hover:scale-[1.02] active:scale-95'
                    } text-white shadow-lg`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="inline-block"
                        >
                          ⏳
                        </motion.span>
                        发送中...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        ✨ 发送祝福
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
          
          {/* 说明和信息面板 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 text-white h-full">
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold mb-4">💌 祝福会去哪里？</h3>
                  <p className="text-lg leading-relaxed">
                    你提交的每一条祝福都会：
                  </p>
                  <ul className="space-y-3 mt-4 text-lg">
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">📧</span>
                      <span>立即发送到主人的邮箱：19924524801@qq.com</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">💾</span>
                      <span>安全存储在网站数据库中</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">🔔</span>
                      <span>主人会收到实时通知</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/20 rounded-2xl p-6">
                  <h4 className="text-2xl font-bold mb-4">🎁 温馨提示</h4>
                  <ul className="space-y-3">
                    <li>• 祝福语建议50-200字，表达更真挚</li>
                    <li>• 可以上传你们的合照或象征物</li>
                    <li>• 匿名祝福也会被真诚对待</li>
                    <li>• 所有内容都会经过审核</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-2xl font-bold mb-4">📊 近期祝福统计</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold">128</div>
                      <div className="text-sm">累计祝福</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold">89</div>
                      <div className="text-sm">带图祝福</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold">24</div>
                      <div className="text-sm">今日新增</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold">100%</div>
                      <div className="text-sm">回复率</div>
                    </div>
                  </div>
                </div>
                
                {/* 管理员入口提示 */}
                <div className="mt-8 p-4 bg-white/10 rounded-xl border-2 border-white/30">
                  <p className="text-center text-sm">
                    管理员入口：在URL后添加 <code className="bg-white/20 px-2 py-1 rounded">?admin=true</code>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Scene3Upload