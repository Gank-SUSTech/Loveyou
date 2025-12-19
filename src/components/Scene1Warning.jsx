import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const Scene1Warning = ({ onEnter }) => {
  const [isGlitching, setIsGlitching] = useState(false)
  const [buttonPulse, setButtonPulse] = useState(true)
  const tvNoiseRef = useRef(null)
  
  // 模拟电视雪花效果
  useEffect(() => {
    const canvas = tvNoiseRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    let animationId
    
    const drawNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data
      
      for (let i = 0; i < data.length; i += 4) {
        // 少量随机像素点模拟CRT电视噪点
        if (Math.random() > 0.98) {
          const value = Math.random() * 255
          data[i] = value     // R
          data[i + 1] = value // G
          data[i + 2] = value // B
          data[i + 3] = 30    // Alpha
        } else {
          data[i + 3] = 0
        }
      }
      
      ctx.putImageData(imageData, 0, 0)
      animationId = requestAnimationFrame(drawNoise)
    }
    
    drawNoise()
    
    // 随机触发文字故障效果
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 200)
      }
    }, 3000)
    
    return () => {
      cancelAnimationFrame(animationId)
      clearInterval(glitchInterval)
    }
  }, [])
  
  const handleConfirm = () => {
    // 触发白色闪光效果
    const flash = document.createElement('div')
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: white;
      z-index: 9999;
      opacity: 0;
      animation: flash 0.5s ease-out;
    `
    
    const style = document.createElement('style')
    style.textContent = `
      @keyframes flash {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
      }
    `
    
    document.head.appendChild(style)
    document.body.appendChild(flash)
    
    // 闪光后进入下一场景
    setTimeout(() => {
      document.body.removeChild(flash)
      document.head.removeChild(style)
      onEnter()
    }, 500)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-black overflow-hidden scanlines tv-flicker">
      {/* 电视雪花效果层 */}
      <canvas 
        ref={tvNoiseRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      
      {/* 屏幕边缘效果 */}
      <div className="absolute inset-0 border-8 border-gray-900 rounded-lg pointer-events-none"></div>
      <div className="absolute inset-4 border-4 border-gray-700 rounded pointer-events-none"></div>
      
      {/* 闪烁的红点 */}
      <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl"
        >
          {/* FBI警告标志 */}
          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-red-600 blur-xl opacity-50"></div>
            <h1 className={`relative text-6xl md:text-8xl font-fbi tracking-wider text-white ${isGlitching ? 'glitch-text' : ''}`}>
              FBI WARNING
            </h1>
          </div>
          
          {/* 警告内容 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-black/80 border-4 border-red-700 p-8 rounded-lg backdrop-blur-sm"
          >
            <div className="space-y-6 text-white font-mono">
              <p className="text-2xl md:text-3xl leading-relaxed">
                Federal Bureau of Investigation
              </p>
              
              <div className="h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 my-6"></div>
              
              <p className="text-xl md:text-2xl leading-relaxed">
                根据《美国法典》第18章第2257条之规定，<br/>
                此网站内容涉及私人情感表达，
                <span className="text-yellow-300 font-bold"> 可能引发强烈心动反应</span>。
              </p>
              
              <p className="text-xl md:text-2xl leading-relaxed mt-6">
                你已确认你已满十八周岁，<br/>
                点击进入该网站不受美利坚联邦保护！
              </p>
              
              <p className="text-lg text-gray-300 mt-8">
                (本页面纯属娱乐，内容甜蜜安全无公害)
              </p>
            </div>
          </motion.div>
          
          {/* 确认按钮 */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20, 
              delay: 1 
            }}
            className="mt-12"
          >
            <button
              onClick={handleConfirm}
              onMouseEnter={() => setButtonPulse(false)}
              onMouseLeave={() => setButtonPulse(true)}
              className={`btn-warning text-2xl px-12 py-6 ${buttonPulse ? 'animate-pulse-glow' : ''}`}
            >
              <span className="flex items-center justify-center gap-3">
                <span>我确定！</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  →
                </motion.span>
              </span>
            </button>
          </motion.div>
          
          {/* 免责声明 */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-gray-400 text-sm mt-12 max-w-2xl mx-auto"
          >
            ※ 本网站不含任何敏感内容，仅为浪漫表白用途<br/>
            ※ 继续访问即表示您自愿接受甜蜜暴击<br/>
            ※ 如有任何不适，请立即联系您所爱之人获取解药
          </motion.p>
        </motion.div>
      </div>
      
      {/* 扫描线效果 */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i}
            className="h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"
            style={{ 
              top: `${i * 4}%`,
              opacity: 0.1 + Math.random() * 0.2
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Scene1Warning