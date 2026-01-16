/**
 * 浏览器指纹工具函数
 */

import CryptoJS from 'crypto-js'

// 扩展Navigator类型以支持可能的属性
declare global {
  interface Navigator {
    deviceMemory?: number;
  }
}

// 定义WebGL指纹信息的接口
interface WebGLFingerprintInfo {
  vendor?: string;
  renderer?: string;
  version?: string;
  shadingLanguageVersion?: string;
  unmaskedVendor?: string;
  unmaskedRenderer?: string;
  error?: string;
}

// 定义插件信息的接口
interface PluginInfo {
  name: string;
  description: string;
  filename: string;
  version?: string;
}

// 定义浏览器指纹信息的接口
interface BrowserFingerprint {
  userAgent: string;
  language: string;
  languages: readonly string[];
  platform: string;
  hardwareConcurrency: number;
  deviceMemory: number;
  screen: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    colorDepth: number;
    pixelDepth: number;
  };
  timezone: string;
  timezoneOffset: number;
  viewport: {
    width: number;
    height: number;
    outerWidth: number;
    outerHeight: number;
  };
  features: {
    cookieEnabled: boolean;
    doNotTrack: string | null;
    onLine: boolean;
    javaEnabled: boolean;
    webdriver: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    webGL: boolean;
    canvas: boolean;
  };
  canvasFingerprint: string;
  webglFingerprint: WebGLFingerprintInfo;
  fonts: string[];
  plugins: PluginInfo[];
}

/**
 * 获取 Canvas 指纹
 * @returns {string} Canvas 指纹字符串
 */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      return 'canvas_context_error'
    }
    
    // 设置canvas尺寸
    canvas.width = 200
    canvas.height = 50
    
    // 绘制一些图形和文本
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    
    ctx.fillStyle = '#069'
    ctx.fillText('Hello, World! 🌍', 2, 15)
    
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
    ctx.fillText('CCXC Fingerprint', 4, 30)
    
    return canvas.toDataURL()
  } catch (e) {
    return 'canvas_error'
  }
}

/**
 * 获取 WebGL 指纹
 * @returns {WebGLFingerprintInfo} WebGL 指纹信息
 */
function getWebGLFingerprint(): WebGLFingerprintInfo {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) {
      return { error: 'webgl_not_supported' }
    }
    
    // 类型断言为WebGLRenderingContext
    const webglContext = gl as WebGLRenderingContext
    const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info')
    
    return {
      vendor: webglContext.getParameter(webglContext.VENDOR) as string,
      renderer: webglContext.getParameter(webglContext.RENDERER) as string,
      version: webglContext.getParameter(webglContext.VERSION) as string,
      shadingLanguageVersion: webglContext.getParameter(webglContext.SHADING_LANGUAGE_VERSION) as string,
      unmaskedVendor: debugInfo ? webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string : undefined,
      unmaskedRenderer: debugInfo ? webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string : undefined
    }
  } catch (e) {
    return { error: 'webgl_error' }
  }
}

/**
 * 获取已安装的字体列表
 * @returns {string[]} 字体列表
 */
function getFontList(): string[] {
  const testFonts: string[] = [
    'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia', 'Helvetica',
    'Impact', 'Lucida Console', 'Lucida Sans Unicode', 'Palatino Linotype',
    'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Times',
    'Monaco', 'Menlo', 'Consolas', 'Inconsolata', 'Source Code Pro',
    'Microsoft YaHei', 'SimSun', 'SimHei', 'KaiTi', 'FangSong'
  ]
  
  const detectedFonts: string[] = []
  const testString = 'mmmmmmmmmmlli'
  const testSize = '72px'
  
  // 创建测试元素
  const testElement = document.createElement('span')
  testElement.style.fontSize = testSize
  testElement.style.position = 'absolute'
  testElement.style.left = '-9999px'
  testElement.style.top = '-9999px'
  testElement.style.visibility = 'hidden'
  testElement.innerHTML = testString
  document.body.appendChild(testElement)
  
  // 获取默认字体的尺寸
  testElement.style.fontFamily = 'monospace'
  const defaultWidth = testElement.offsetWidth
  const defaultHeight = testElement.offsetHeight
  
  // 测试每个字体
  testFonts.forEach(font => {
    testElement.style.fontFamily = `${font}, monospace`
    if (testElement.offsetWidth !== defaultWidth || testElement.offsetHeight !== defaultHeight) {
      detectedFonts.push(font)
    }
  })
  
  document.body.removeChild(testElement)
  return detectedFonts
}

/**
 * 获取浏览器插件信息
 * @returns {PluginInfo[]} 插件信息列表
 */
function getPluginList(): PluginInfo[] {
  if (!navigator.plugins) {
    return []
  }
  
  const plugins: PluginInfo[] = []
  for (let i = 0; i < navigator.plugins.length; i++) {
    const plugin = navigator.plugins[i]
    plugins.push({
      name: plugin.name,
      description: plugin.description,
      filename: plugin.filename,
      version: (plugin as any).version || undefined // 某些浏览器可能不支持version属性
    })
  }
  
  return plugins.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * 获取浏览器指纹信息
 * @returns {BrowserFingerprint} 浏览器指纹信息对象
 */
function getBrowserFingerprint(): BrowserFingerprint {
  const fingerprint: BrowserFingerprint = {
    // 基本信息
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages || [],
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: navigator.deviceMemory || 0,
    
    // 屏幕信息
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth
    },
    
    // 时区信息
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    
    // 窗口信息
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight
    },
    
    // 特性检测
    features: {
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      onLine: navigator.onLine,
      javaEnabled: typeof (navigator as any).javaEnabled === 'function' ? (navigator as any).javaEnabled() : false,
      webdriver: (navigator as any).webdriver || false,
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof Storage !== 'undefined',
      indexedDB: typeof indexedDB !== 'undefined',
      webGL: typeof WebGLRenderingContext !== 'undefined',
      canvas: typeof CanvasRenderingContext2D !== 'undefined'
    },
    
    // Canvas 指纹
    canvasFingerprint: getCanvasFingerprint(),
    
    // WebGL 指纹
    webglFingerprint: getWebGLFingerprint(),
    
    // 字体列表
    fonts: getFontList(),
    
    // 插件列表
    plugins: getPluginList()
  }
  
  return fingerprint
}

/**
 * 使用 SHA-256 算法生成哈希值
 * @param {string} message 要哈希的消息
 * @returns {string} 哈希值
 */
function sha256(message: string): string {
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex)
}

/**
 * 获取用户唯一标识符
 * @returns {string} 用户ID
 */
export function getUserId(): string {
  try {
    // 获取浏览器指纹
    const fingerprint = getBrowserFingerprint()
    
    // 转换为 JSON 字符串
    const fingerprintJson = JSON.stringify(fingerprint, null, 2)
    
    // 生成 SHA-256 哈希
    const userId = sha256(fingerprintJson)
    
    return userId
  } catch (error) {
    console.error('获取用户ID失败:', error)
    // 如果获取失败，返回一个基于当前时间的临时ID
    const fallbackId = sha256(`fallback_${Date.now()}_${Math.random()}`)
    return fallbackId
  }
}

export default {
  getUserId,
  getBrowserFingerprint,
  sha256
} 