import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const FlipBook = ({ onFlipComplete }) => {
  const [isFlipping, setIsFlipping] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showBook, setShowBook] = useState(false)
  const [pages, setPages] = useState([
    { id: 1, content: "翻开这本属于我们的故事书..." },
    { id: 2, content: "每一页都记录着珍贵的回忆" },
    { id: 3, content: "从相遇的那一天开始" },
    { id: 4, content: "到相知的每一刻" },
    { id: 5, content: "爱是我们书写的主题" },
  ])
  
  useEffect(() => {
    // 延迟显示书本
    const timer = setTimeout(() => {
      setShowBook(true)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  const handleFlip = () => {
    if (!isFlipping && !isFlipped) {
      setIsFlipping(true)
      
      // 立即触发回调，让全屏文书快速显示
      if (onFlipComplete) onFlipComplete()
      
      // 快速完成动画
      setTimeout(() => {
        setIsFlipping(false)
        setIsFlipped(true)
      }, 600)
    }
  }
  
  const handleResetFlip = () => {
    setIsFlipped(false)
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* 书本容器 */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipping ? -180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className={`relative w-full h-96 perspective-1000 ${showBook ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
      >
        {/* 书本正面 */}
        <div className={`absolute inset-0 w-full h-full backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          <div 
            onClick={handleFlip}
            className="relative w-full h-full cursor-pointer group"
          >
            {/* 书本封面 */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-300">
              {/* 封面装饰 */}
              <div className="absolute inset-4 border-4 border-white/30 rounded-xl"></div>
              <div className="absolute top-6 left-6 right-6 bottom-6 border-2 border-white/20 rounded-lg"></div>
              
              {/* 封面标题 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-6"
                >
                    💖
                </motion.div>
                <h3 className="text-3xl font-bold font-elegant text-center mb-4">
                  我们的故事书
                </h3>
                <p className="text-center text-white/80">
                  点击翻开这份心意
                </p>
                
                {/* 装饰边框 */}
                <div className="absolute bottom-8 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              </div>
              
              {/* 提示文字 */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm"
              >
                点击翻开 →
              </motion.div>
            </div>
            
            {/* 书本厚度效果 */}
            <div className="absolute -right-4 top-4 bottom-4 w-8 bg-gradient-to-r from-pink-600 to-purple-700 rounded-r-lg"></div>
          </div>
        </div>
        
        {/* 书本背面/内页 */}
        <div className={`absolute inset-0 w-full h-full backface-hidden transform rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <div className="relative w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-2xl overflow-hidden">
            {/* 书页纹理 */}
            <div className="absolute inset-0 paper-texture opacity-30"></div>
            
            {/* 书页内容 */}
            <div className="relative h-full p-8 overflow-y-auto">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-amber-900 font-elegant">
                  爱的篇章
                </h4>
                <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent my-4"></div>
              </div>
              
              <div className="space-y-4">
                {pages.map((page, index) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/50 rounded-lg border-l-4 border-pink-400"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl text-pink-500">📖</span>
                      <p className="text-amber-900">{page.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* 页码指示器 */}
              <div className="absolute bottom-4 right-4 text-amber-700">
                1-{pages.length}
              </div>
            </div>
            
            {/* 返回按钮 */}
            <button
              onClick={handleResetFlip}
              className="absolute top-4 left-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              title="合上书本"
            >
              <span className="text-2xl">🔙</span>
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* 翻页动画时的装饰效果 */}
      {isFlipping && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl"
          >
            📖
          </motion.div>
        </div>
      )}
      
      {/* 提示文字 */}
      {!isFlipped && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 text-gray-600"
        >
          点击书本查看3D翻页效果
        </motion.p>
      )}
    </div>
  )
}

export default FlipBook