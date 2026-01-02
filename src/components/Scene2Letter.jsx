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
  const [showFullLetter, setShowFullLetter] = useState(false)
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
    // 翻书完成后，延迟显示全屏文书
    setTimeout(() => {
      setShowFullLetter(true)
    }, 500)
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
      
      {/* 初始状态：显示标题和书本 */}
      {!showFullLetter && (
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
          
          <div className="flex justify-center">
            {/* 3D翻页书本 */}
            <div className="w-full max-w-2xl">
              <FlipBook onFlipComplete={handleFlipComplete} />
            </div>
          </div>
        </div>
      )}
      
      {/* 全屏文书显示 */}
      {showFullLetter && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex items-center justify-center p-4 md:p-8 relative z-10"
        >
          <div className="w-full max-w-5xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-16 border-8 border-pink-100 relative overflow-hidden">
            {/* 信纸纹理 */}
            <div className="absolute inset-0 paper-texture opacity-10"></div>
            
            {/* 图片位置 - 顶部 */}
            <div className="relative z-10 mb-8">
              <img 
                src="/images/3.jpg" 
                alt="顶部图片" 
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
            
            {/* 书信内容 */}
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-handwriting text-pink-600 mb-2">
                  {letterContent.title}
                </h2>
                <p className="text-gray-500 italic text-lg">{letterContent.date}</p>
              </div>
              
              <div className="h-1 bg-gradient-to-r from-pink-200 via-purple-200 to-pink-200 mb-8"></div>
              
              {/* 文书内容区域 */}
              <div className="space-y-8 mb-8">
                {/* 第一段文字 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="sticky top-4">
                      <img 
                        src="/images/1.jpg" 
                        alt="左侧图片" 
                        className="w-full h-64 object-cover rounded-xl shadow-lg"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="space-y-6 text-gray-700 text-lg md:text-xl leading-relaxed font-elegant">
                      {letterContent.paragraphs.slice(0, Math.ceil(letterContent.paragraphs.length / 2)).map((para, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          {para}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 第二段文字 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="space-y-6 text-gray-700 text-lg md:text-xl leading-relaxed font-elegant">
                      {letterContent.paragraphs.slice(Math.ceil(letterContent.paragraphs.length / 2)).map((para, index) => (
                        <motion.p
                          key={index + Math.ceil(letterContent.paragraphs.length / 2)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: (index + Math.ceil(letterContent.paragraphs.length / 2)) * 0.1 }}
                        >
                          {para}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="sticky top-4">
                      <img 
                        src="/images/2.jpg" 
                        alt="右侧图片" 
                        className="w-full h-64 object-cover rounded-xl shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 签名部分 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-12 text-right"
              >
                <p className="text-2xl md:text-3xl font-handwriting text-pink-600 mb-2">
                  {letterContent.closing}
                </p>
                <p className="text-3xl md:text-4xl font-handwriting text-purple-600 border-b-2 border-purple-300 pb-2 inline-block">
                  {letterContent.signature}
                </p>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-8 text-center text-gray-600 italic text-lg md:text-xl"
              >
                {letterContent.ps}
              </motion.p>
              
              {/* 装饰分隔线 */}
              <div className="flex items-center justify-center my-12">
                <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent flex-grow"></div>
                <div className="mx-4 text-2xl animate-bounce-slow">💌</div>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-grow"></div>
              </div>
              
              {/* 继续按钮 */}
              <div className="text-center">
                <p className="text-gray-600 mb-6 text-xl md:text-2xl">
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
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Scene2Letter