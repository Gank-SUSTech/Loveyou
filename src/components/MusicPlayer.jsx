import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'

// 音乐文件配置 - 请将音乐文件放入 public/music/ 目录
// 三个场景共用同一个背景音乐
const backgroundMusic = '/music/bg.mp3'

const sceneMusic = {
  1: backgroundMusic, // 统一背景音乐
  2: backgroundMusic, // 统一背景音乐
  3: backgroundMusic, // 统一背景音乐
}

const MusicPlayer = ({ scene, enabled, onToggle }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [currentTrack, setCurrentTrack] = useState(null)
  const soundRef = useRef(null)

  useEffect(() => {
    // 初始化音乐（三个场景共用同一个音乐文件）
    if (enabled && sceneMusic[scene]) {
      const newTrack = sceneMusic[scene]
      
      // 如果还没有加载音乐，创建Howl实例
      if (!soundRef.current) {
        soundRef.current = new Howl({
          src: [newTrack],
          volume: volume,
          loop: true,
          autoplay: isPlaying,
          onload: () => {
            console.log(`背景音乐加载完成`)
          },
          onplayerror: () => {
            // 如果音乐文件不存在，静默处理
            console.log(`背景音乐文件未找到，请将音乐文件放入 public/music/bg.mp3`)
          }
        })

        setCurrentTrack(newTrack)
      }
      // 如果音乐已加载，切换场景时不重新加载（因为使用同一个文件）
    }

    return () => {
      // 组件卸载时才清理，切换场景时不清理
    }
  }, [scene, enabled])

  useEffect(() => {
    // 控制播放/暂停
    if (soundRef.current) {
      if (isPlaying && enabled) {
        soundRef.current.play()
      } else {
        soundRef.current.pause()
      }
    }
  }, [isPlaying, enabled])

  useEffect(() => {
    // 更新音量
    if (soundRef.current) {
      soundRef.current.volume(volume)
    }
  }, [volume])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
  }

  const handleToggleEnabled = () => {
    onToggle()
    if (!enabled) {
      // 如果从禁用状态启用，自动开始播放
      setIsPlaying(true)
    }
  }

  // 如果没有启用音乐，显示简化版本
  if (!enabled) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggleEnabled}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        title="开启音乐"
      >
        <div className="text-2xl">🔇</div>
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-200 min-w-[280px]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-pulse">
            {isPlaying ? '🎵' : '🎶'}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">背景音乐</h3>
            <p className="text-sm text-gray-600">
              当前：场景 {scene} - 统一背景音乐
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggleEnabled}
          className="text-gray-500 hover:text-gray-700"
          title="关闭音乐"
        >
          ✕
        </button>
      </div>

      {/* 播放控制 */}
      <div className="flex items-center gap-4 mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className={`p-3 rounded-full ${
            isPlaying 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <div className="text-2xl">
            {isPlaying ? '⏸️' : '▶️'}
          </div>
        </motion.button>

        <div className="flex-1">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>音量</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500"
          />
        </div>
      </div>

      {/* 可视化效果 */}
      {isPlaying && (
        <div className="flex items-end justify-center h-8 gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 bg-gradient-to-t from-purple-400 to-pink-400 rounded-t"
              animate={{
                height: `${10 + Math.sin(Date.now() / 200 + i) * 15}px`
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
      )}

      {/* 场景指示器 */}
      <div className="flex justify-center gap-2 mt-4">
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={`w-2 h-2 rounded-full ${
              scene === num 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default MusicPlayer