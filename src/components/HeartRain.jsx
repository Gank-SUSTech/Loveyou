import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const HeartRain = () => {
  const [hearts, setHearts] = useState([])
  
  useEffect(() => {
    // 创建爱心雨
    const createHeart = () => {
      const id = Date.now() + Math.random()
      const heart = {
        id,
        x: Math.random() * 100, // 水平位置百分比
        size: Math.random() * 24 + 16, // 爱心大小
        duration: Math.random() * 2 + 1, // 下落时间
        delay: Math.random() * 0.5, // 延迟开始
        type: Math.floor(Math.random() * 5) // 爱心类型
      }
      return heart
    }
    
    // 初始创建一批爱心
    const initialHearts = Array.from({ length: 15 }).map(createHeart)
    setHearts(initialHearts)
    
    // 持续添加新爱心
    const interval = setInterval(() => {
      setHearts(prev => {
        const newHeart = createHeart()
        // 保持最多30个爱心
        if (prev.length > 30) {
          return [...prev.slice(1), newHeart]
        }
        return [...prev, newHeart]
      })
    }, 300)
    
    // 5秒后停止添加新爱心
    const stopTimer = setTimeout(() => {
      clearInterval(interval)
      
      // 渐出效果
      setTimeout(() => {
        setHearts([])
      }, 2000)
    }, 5000)
    
    return () => {
      clearInterval(interval)
      clearTimeout(stopTimer)
    }
  }, [])
  
  // 不同类型的爱心
  const heartTypes = ['❤️', '💖', '💗', '💓', '💞', '💕', '🧡', '💛', '💚', '💙', '💜']
  
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* 背景覆盖层 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gradient-to-b from-pink-200/30 to-purple-200/30"
      />
      
      {/* 中央感谢信息 */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 15 
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-center"
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-4 border-pink-200 max-w-md">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-6xl mb-4"
          >
            💝
          </motion.div>
          <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-3">
            感谢你的祝福！
          </h3>
          <p className="text-gray-700 text-lg">
            你的心意已经成功送达<br/>
            对方很快就能感受到你的温暖~
          </p>
          
          {/* 庆祝动画 */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity 
            }}
            className="mt-6 text-4xl"
          >
            🎉
          </motion.div>
        </div>
      </motion.div>
      
      {/* 爱心雨 */}
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.x}%`,
            top: '-50px',
            fontSize: `${heart.size}px`
          }}
          initial={{ 
            y: -50, 
            x: 0, 
            opacity: 0, 
            rotate: 0 
          }}
          animate={{ 
            y: '110vh',
            x: Math.sin(heart.id) * 50,
            opacity: [0, 1, 1, 0],
            rotate: 360
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            ease: "linear"
          }}
          onAnimationComplete={() => {
            // 动画完成后移除爱心
            setHearts(prev => prev.filter(h => h.id !== heart.id))
          }}
        >
          {heartTypes[heart.type % heartTypes.length]}
        </motion.div>
      ))}
      
      {/* 闪烁的背景爱心 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`bg-${i}`}
          className="absolute text-pink-300/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 60 + 40}px`
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  )
}

export default HeartRain