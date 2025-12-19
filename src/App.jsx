import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Scene1Warning from './components/Scene1Warning'
import Scene2Letter from './components/Scene2Letter'
import Scene3Upload from './components/Scene3Upload'
import MusicPlayer from './components/MusicPlayer'
import HeartRain from './components/HeartRain'

function App() {
  const [currentScene, setCurrentScene] = useState(1)
  const [showHeartRain, setShowHeartRain] = useState(false)
  const [globalMusicEnabled, setGlobalMusicEnabled] = useState(true)
  
  // 场景切换动画配置
  const sceneTransitions = {
    1: { 
      enter: { x: 0, opacity: 1 },
      exit: { x: -100, opacity: 0 }
    },
    2: { 
      enter: { x: 0, opacity: 1 },
      exit: { x: 100, opacity: 0 }
    },
    3: { 
      enter: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 }
    }
  }

  const handleSceneChange = (sceneNumber) => {
    setCurrentScene(sceneNumber)
  }

  const handleUploadSuccess = () => {
    setShowHeartRain(true)
    // 5秒后自动隐藏爱心雨
    setTimeout(() => setShowHeartRain(false), 5000)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 全局爱心雨效果 */}
      {showHeartRain && <HeartRain />}
      
      {/* 全局音乐播放器 */}
      <div className="fixed top-4 right-4 z-50">
        <MusicPlayer 
          scene={currentScene} 
          enabled={globalMusicEnabled}
          onToggle={() => setGlobalMusicEnabled(!globalMusicEnabled)}
        />
      </div>

      <AnimatePresence mode="wait">
        {currentScene === 1 && (
          <motion.div
            key="scene1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Scene1Warning onEnter={() => handleSceneChange(2)} />
          </motion.div>
        )}

        {currentScene === 2 && (
          <motion.div
            key="scene2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.7 }}
          >
            <Scene2Letter onContinue={() => handleSceneChange(3)} />
          </motion.div>
        )}

        {currentScene === 3 && (
          <motion.div
            key="scene3"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Scene3Upload 
              onSuccess={handleUploadSuccess}
              onBack={() => handleSceneChange(2)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 场景指示器 */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            onClick={() => handleSceneChange(num)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentScene === num 
                ? 'bg-pink-500 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`跳转到场景 ${num}`}
          />
        ))}
      </div>
    </div>
  )
}

export default App