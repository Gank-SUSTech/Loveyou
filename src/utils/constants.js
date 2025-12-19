// 网站配置常量
export const SITE_CONFIG = {
  title: "给最爱的你 | 我的浪漫告白",
  description: "一个充满爱意的个人表白网站，记录我们的爱情故事",
  author: "充满爱意的你",
  email: "19924524801@qq.com",
  siteUrl: "https://your-netlify-site.netlify.app"
}

// 场景配置
export const SCENE_CONFIG = {
  1: {
    name: "FBI警告页",
    bgColor: "from-red-900 via-red-800 to-black",
    music: "scene1-bg.mp3",
    duration: 0.5
  },
  2: {
    name: "浪漫书信页",
    bgColor: "from-pink-50 via-purple-50 to-blue-50",
    music: "scene2-bg.mp3",
    duration: 0.7
  },
  3: {
    name: "上传祝福页",
    bgColor: "from-purple-50 to-pink-50",
    music: "scene3-bg.mp3",
    duration: 0.5
  }
}

// 装饰位置配置（您可以在这些位置添加图片）
export const DECORATION_SPOTS = [
  {
    id: 1,
    position: { top: "10%", left: "5%" },
    size: { width: "64px", height: "64px" },
    type: "heart",
    default: "💖",
    // 您可以在这里替换为图片URL
    imageUrl: null
  },
  {
    id: 2,
    position: { top: "15%", right: "8%" },
    size: { width: "80px", height: "80px" },
    type: "sparkle",
    default: "✨",
    imageUrl: null
  },
  {
    id: 3,
    position: { bottom: "20%", left: "10%" },
    size: { width: "48px", height: "48px" },
    type: "star",
    default: "🌟",
    imageUrl: null
  },
  {
    id: 4,
    position: { bottom: "30%", right: "15%" },
    size: { width: "96px", height: "96px" },
    type: "flower",
    default: "🌸",
    imageUrl: null
  }
]

// 管理员配置
export const ADMIN_CONFIG = {
  secretKey: "love_secret_2024",
  adminParam: "admin=true",
  viewPasscode: "iloveyou"
}