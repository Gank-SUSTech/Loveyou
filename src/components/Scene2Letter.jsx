import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import FlipBook from './FlipBook'

// 这是您可以后续轻松修改的书信内容配置
const letterContent = {
  title: "致我最爱的你",
  date: "2026年1月2日",
  paragraphs: [
    "亲爱的焉宝，",
    "你真的好厉害啊啊啊，怎么才发现这个隐藏款中的隐藏款啊！！！",
    "在抖音上看到，有暗恋女生送的笔中隐藏信件男生没看见表白，这不得后悔一辈子？",
    "嘿嘿嘿，我厉害吧这是我学的HTML写的，怎么样？",
    "想你，真的想你，想你想到心痛，想你想到流泪。",
    "见不到焉包的时候我就看old的照片，越看越想你，越看越爱你。（其实也是焉包太好看了≧ ﹏ ≦）",
    "什么时候能看到焉包再出cos，其实我想一个人看hhhhhh，焉包专属于我的hhhhh",
    "焉焉，有时候好对不起你，最近没有多和宝宝沟通，没有注意到宝宝情绪。",
    "焉包有时候我觉得宝宝有点像我妈妈（不是说我是妈宝男的意思），就是感觉宝宝真的对我很重要，盐包也是很关心我，",
    "我们有时候虽然会吵架（宝宝不理我的时候），但是真的有种家人的感觉，宝宝真的很照顾我，很关心我，很爱我。",
    "宝宝之前让我挺起背来，当时感觉挺好笑的，但看了网上大家都有这种感觉，被说的时候可能感觉挺烦，但其实是真正被女朋友关心的体现（被妈妈唠叨时的感觉）。",
    "焉包真的是我的唯一，我也会对盐包负责任的，像家人一样对盐包好，希望我们能够一直走到最后。",
    "我想大声告诉你：我爱你，焉包，不仅因为宝宝漂漂亮亮的，更是因为我觉得我们能相互照顾。",
    "未来的路，让我们一起走下去，好吗？",
  ],
  closing: "永远爱你的",
  signature: "晨包",
  ps: "P.S. 你愿意让我们的故事继续书写下去吗？"
}

// 您可以在这里添加装饰图片的位置和配置
const decorationSpots = [
  { id: 1, top: "10%", left: "5%", size: "w-16 h-16", content: "💖" },
  { id: 2, top: "15%", right: "8%", size: "w-20 h-20", content: "✨" },
  { id: 3, bottom: "20%", left: "10%", size: "w-12 h-12", content: "🌟" },
  { id: 4, bottom: "30%", right: "15%", size: "w-24 h-24", content: "🌸" },
  // 您可以继续添加更多装饰位置
  // { id: 5, top: "50%", left: "50%", size: "w-32 h-32", content: "🦋" },
]

const Scene2Letter = ({ onContinue }) => {
  const [showLetter, setShowLetter] = useState(false)
  const [currentParagraph, setCurrentParagraph] = useState(0)
  const [flipCompleted, setFlipCompleted] = useState(false)
  const [floatingHearts, setFloatingHearts] = useState([])
  const sceneRef = useRef(null)
  
  useEffect(() => {
    // 页面加载后开始展示动画
    const timer = setTimeout(() => {
      setShowLetter(true)
      startTypewriterEffect()
    }, 1000)
    
    // 创建飘动的小爱心
    const heartInterval = setInterval(() => {
      if (floatingHearts.length < 15) {
        const newHeart = {
          id: Date.now(),
          left: Math.random() * 100,
          size: Math.random() * 20 + 10,
          duration: Math.random() * 3 + 2
        }
        setFloatingHearts(prev => [...prev, newHeart])
      }
    }, 800)
    
    // 移除爱心
    const cleanupInterval = setInterval(() => {
      setFloatingHearts(prev => {
        if (prev.length > 10) {
          return prev.slice(1)
        }
        return prev
      })
    }, 2000)
    
    return () => {
      clearTimeout(timer)
      clearInterval(heartInterval)
      clearInterval(cleanupInterval)
    }
  }, [floatingHearts.length])
  
  const startTypewriterEffect = () => {
    let paragraphIndex = 0
    const typeInterval = setInterval(() => {
      if (paragraphIndex < letterContent.paragraphs.length) {
        setCurrentParagraph(paragraphIndex + 1)
        paragraphIndex++
      } else {
        clearInterval(typeInterval)
      }
    }, 800)
  }
  
  const handleFlipComplete = () => {
    setFlipCompleted(true)
  }
  
  const handleContinue = () => {
    onContinue()
  }

  return (
    <div 
      ref={sceneRef}
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden"
    >
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 paper-texture opacity-20"></div>
      
      {/* 飘动的爱心 */}
      {floatingHearts.map(heart => (
        <motion.div
          key={heart.id}
          className="absolute text-pink-300"
          style={{
            left: `${heart.left}%`,
            top: '110%',
            fontSize: `${heart.size}px`
          }}
          animate={{
            y: [-20, -window.innerHeight],
            x: [0, Math.sin(heart.id) * 50],
            rotate: [0, 360],
            opacity: [1, 0]
          }}
          transition={{
            duration: heart.duration,
            ease: "linear"
          }}
          onAnimationComplete={() => {
            setFloatingHearts(prev => prev.filter(h => h.id !== heart.id))
          }}
        >
          ❤️
        </motion.div>
      ))}
      
      {/* 闪烁的星星 */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-200"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 10 + 8}px`
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ✨
        </motion.div>
      ))}
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-elegant text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
            爱的告白书
          </h1>
          <p className="text-xl text-gray-600">
            翻开这本书，里面有我想对你说的一切...
          </p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* 3D翻页书本 */}
          <div className="lg:w-1/2">
            <FlipBook onFlipComplete={handleFlipComplete} />
          </div>
          
          {/* 书信内容展示区 */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: showLetter ? 1 : 0, x: showLetter ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:w-1/2 max-w-2xl"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border-8 border-pink-100 relative overflow-hidden">
              {/* 信纸纹理 */}
              <div className="absolute inset-0 paper-texture opacity-10"></div>
              
              {/* 装饰元素 - 这些位置您可以后续替换为图片 */}
              {decorationSpots.map(spot => (
                <div
                  key={spot.id}
                  className={`absolute ${spot.size} flex items-center justify-center animate-float`}
                  style={{
                    top: spot.top,
                    left: spot.left,
                    right: spot.right,
                    bottom: spot.bottom,
                    animationDelay: `${spot.id * 0.5}s`
                  }}
                >
                  <div className="text-4xl animate-spin-slow">
                    {spot.content}
                  </div>
                </div>
              ))}
              
              {/* 书信内容 */}
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-handwriting text-pink-600 mb-2">
                    {letterContent.title}
                  </h2>
                  <p className="text-gray-500 italic">{letterContent.date}</p>
                </div>
                
                <div className="h-1 bg-gradient-to-r from-pink-200 via-purple-200 to-pink-200 mb-8"></div>
                
                <div className="space-y-6 text-gray-700 text-lg leading-relaxed font-elegant">
                  {letterContent.paragraphs.slice(0, currentParagraph).map((para, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="text-xl"
                    >
                      {para}
                    </motion.p>
                  ))}
                  
                  {currentParagraph >= letterContent.paragraphs.length && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mt-12 text-right"
                      >
                        <p className="text-2xl font-handwriting text-pink-600 mb-2">
                          {letterContent.closing}
                        </p>
                        <p className="text-3xl font-handwriting text-purple-600 border-b-2 border-purple-300 pb-2 inline-block">
                          {letterContent.signature}
                        </p>
                      </motion.div>
                      
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="mt-8 text-center text-gray-600 italic text-lg"
                      >
                        {letterContent.ps}
                      </motion.p>
                    </>
                  )}
                </div>
                
                {/* 装饰分隔线 */}
                <div className="flex items-center justify-center my-12">
                  <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent flex-grow"></div>
                  <div className="mx-4 text-2xl animate-bounce-slow">💌</div>
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-grow"></div>
                </div>
                
                {/* 继续按钮 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: flipCompleted ? 1 : 0, 
                    scale: flipCompleted ? 1 : 0.8 
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <p className="text-gray-600 mb-6 text-xl">
                    你也想表达爱意吗？点击此处向他传递你的心愿！
                  </p>
                  <button
                    onClick={handleContinue}
                    className="btn-romantic text-2xl px-12 py-6 group"
                  >
                    <span className="flex items-center justify-center gap-3">
                      传递我的心意
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="group-hover:translate-x-2 transition-transform"
                      >
                        →
                      </motion.span>
                    </span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* 页脚说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-center mt-12 text-gray-500"
        >
          <p className="text-lg">
            💝 此页面所有装饰元素均可替换为您喜欢的图片 💝
          </p>
          <p className="mt-2">
            只需在 <code className="bg-pink-100 px-2 py-1 rounded">decorationSpots</code> 数组中替换content为图片URL
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Scene2Letter