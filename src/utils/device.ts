/*
  Device.ts: A powerful script that detects user browser type.
  Not only based on UserAgent

  by EterIll | eterill.xyz
*/

import { ref } from 'vue';

// 定义设备信息类型
interface WebGLInfo {
  vendor: string;
  renderer: string;
}

interface NFCCapabilities {
  hasAPI: boolean;
  apiType: string;
  canScan: boolean;
  error: string | null;
}

interface DeviceSignals {
  touchPoints: number;
  pointerCoarse: boolean;
  pointerFine: boolean;
  hover: boolean;
  webkitTouchCallout: boolean;
  webkitOverflowScrolling: boolean;
  applePay: boolean;
  safariPush: boolean;
  iOSPermissionShape: boolean;
  pwaStandalone: boolean | null;
  webNFC: boolean;
  nfcDetails: string;
  relatedApps: boolean;
  webSerial: boolean;
  webHID: boolean;
  webUSB: boolean;
}

interface DetectionResult {
  scores: Record<string, number>;
  top: string;
  confidence: number;
}

// 定义全局类型扩展
declare global {
  interface Window {
    detectedOSType: string;
    safari?: {
      pushNotification?: any;
    };
    NDEFReader?: any;
    NFC?: any;
  }
  
  interface Navigator {
    nfc?: any;
    serial?: any;
    hid?: any;
    usb?: any;
    standalone?: boolean;
    getInstalledRelatedApps?: () => Promise<string[]>;
  }
  
  interface DeviceMotionEvent {
    requestPermission?: () => Promise<'granted' | 'denied' | 'prompt'>;
  }
}

// 设备信息检测服务
class DeviceInfoService {
  private webGLInfo = ref<WebGLInfo | null>(null);
  private nfcCapabilities = ref<NFCCapabilities>({
    hasAPI: false,
    apiType: '',
    canScan: false,
    error: null
  });
  private deviceSignals = ref<DeviceSignals | null>(null);
  private detectionResult = ref<DetectionResult | null>(null);

  // 获取WebGL信息
  private getWebGLInfo(): WebGLInfo | null {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return null;
      
      // 类型断言为WebGLRenderingContext
      const gli = gl as WebGLRenderingContext;
      const dbg = gli.getExtension('WEBGL_debug_renderer_info');
      const vendor = dbg ? gli.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gli.getParameter(gli.VENDOR);
      const renderer = dbg ? gli.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gli.getParameter(gli.RENDERER);
      
      return { 
        vendor: String(vendor || ''), 
        renderer: String(renderer || '') 
      };
    } catch (e) {
      return null;
    }
  }

  // 检查NFC能力
  private async checkNFCCapabilities(): Promise<NFCCapabilities> {
    const result: NFCCapabilities = {
      hasAPI: false,
      apiType: '',
      canScan: false,
      error: null
    };

    try {
      // 检查标准Web NFC API
      if ('NDEFReader' in window) {
        result.hasAPI = true;
        result.apiType = 'NDEFReader';

        try {
          new (window as any).NDEFReader();
          result.canScan = true;
        } catch (e: any) {
          result.error = e.message;
        }
      }
      // 检查其他NFC API
      else if (navigator.nfc || 'nfc' in navigator) {
        result.hasAPI = true;
        result.apiType = 'navigator.nfc';
      }
      else if ('NFC' in window) {
        result.hasAPI = true;
        result.apiType = 'window.NFC';
      }
    } catch (e: any) {
      result.error = e.message;
    }

    return result;
  }

  // 判断是否为苹果平台
  private isApplePlatform(): boolean {
    try {
      const ua = navigator.userAgent || '';
      const platform = navigator.platform || '';
      const applePay = 'ApplePaySession' in window;
      const safariPush = !!(window.safari && window.safari.pushNotification);
      const iOSPermissionShape = typeof DeviceMotionEvent !== 'undefined' && 
        typeof (DeviceMotionEvent as any).requestPermission === 'function';
      const isIphoneOrIpadUA = /iPhone|iPad|iPod/i.test(ua);
      const isMac = /Mac/.test(platform) || /Mac OS X/.test(ua);
      const isIPadOS13Plus = platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1;
      const webkitTouch = (CSS.supports?.('-webkit-touch-callout', 'none') || 
        CSS.supports?.('-webkit-overflow-scrolling', 'touch')) || false;
      
      return !!(applePay || safariPush || iOSPermissionShape || isIphoneOrIpadUA || 
        isIPadOS13Plus || (isMac && webkitTouch));
    } catch {
      return false;
    }
  }

  // 主要检测方法
  public async detect(): Promise<DetectionResult> {
    // 重置状态
    this.webGLInfo.value = this.getWebGLInfo();
    this.nfcCapabilities.value = await this.checkNFCCapabilities();

    const scores = { android: 0, ios: 0, ipados: 0, macos: 0, windows: 0, linux: 0 };
    //const pretty = { android: 'Android', ios: 'iOS', ipados: 'iPadOS', macos: 'macOS', windows: 'Windows', linux: 'Linux' };
    const signals: any = {};

    // 基础输入设备与显示
    signals.touchPoints = navigator.maxTouchPoints || 0;
    signals.pointerCoarse = matchMedia('(pointer:coarse)').matches;
    signals.pointerFine = matchMedia('(pointer:fine)').matches;
    signals.hover = matchMedia('(hover:hover)').matches;

    const hasRealTouch = signals.touchPoints > 0 && 'ontouchstart' in window;
    const isPrimaryTouch = signals.pointerCoarse && !signals.hover;
    const isTouchy = hasRealTouch || isPrimaryTouch;

    if (isTouchy) {
      scores.android += 2;
      scores.ios += 2;
      scores.ipados += 2;
    } else {
      scores.macos += 2;
      scores.windows += 2;
      scores.linux += 2;
    }

    // Apple 相关强信号
    signals.webkitTouchCallout = CSS.supports?.('-webkit-touch-callout', 'none') || false;
    signals.webkitOverflowScrolling = CSS.supports?.('-webkit-overflow-scrolling', 'touch') || false;
    if (signals.webkitTouchCallout || signals.webkitOverflowScrolling) {
      scores.ios += 5;
      scores.ipados += 5;
    }

    signals.applePay = 'ApplePaySession' in window;
    if (signals.applePay) {
      scores.ios += 4;
      scores.ipados += 4;
      scores.macos += 4;
    }

    signals.safariPush = !!(window.safari && window.safari.pushNotification);
    if (signals.safariPush) {
      scores.macos += 4;
    }

    signals.iOSPermissionShape = typeof DeviceMotionEvent !== 'undefined' && 
      typeof (DeviceMotionEvent as any).requestPermission === 'function';
    if (signals.iOSPermissionShape) {
      scores.ios += 6;
      scores.ipados += 6;
    }

    signals.pwaStandalone = 'standalone' in navigator ? navigator.standalone : null;
    if (signals.pwaStandalone !== null) {
      scores.ios += 2;
      scores.ipados += 2;
    }

    // Android 相关信号
    const nfcCaps = this.nfcCapabilities.value;
    signals.webNFC = nfcCaps.hasAPI;
    signals.nfcDetails = nfcCaps.apiType;

    if (signals.webNFC) {
      scores.android += 4;
    }

    signals.relatedApps = 'getInstalledRelatedApps' in navigator;
    if (signals.relatedApps) {
      scores.android += 3;
    }

    // 桌面侧能力（Chromium 系）
    signals.webSerial = 'serial' in navigator;
    signals.webHID = 'hid' in navigator;
    signals.webUSB = 'usb' in navigator;

    if (signals.webSerial) {
      scores.windows += 4;
      scores.macos += 4;
      scores.linux += 4;
    }
    if (signals.webHID) {
      scores.windows += 2;
      scores.macos += 2;
      scores.linux += 2;
    }
    if (signals.webUSB) {
      scores.windows += 1;
      scores.macos += 1;
      scores.linux += 1;
    }

    // Apple 移动尺寸分流
    const shortSideCSS = Math.min(screen.width, screen.height) / (devicePixelRatio || 1);
    if ((signals.webkitTouchCallout || signals.webkitOverflowScrolling || signals.iOSPermissionShape) && isTouchy) {
      if (shortSideCSS >= 600) {
        scores.ipados += 5;
      } else {
        scores.ios += 5;
      }
    }

    // 图形栈（强信号；隐私模式下禁用）
    const glInfo = this.webGLInfo.value;
    if (glInfo) {
      const v = (glInfo.vendor || '').toLowerCase();
      const r = (glInfo.renderer || '').toLowerCase();
      
      // Apple
      if (v.includes('apple') || r.includes('apple')) {
        scores.macos += 6;
        scores.ios += 6;
        scores.ipados += 6;
      }
      // Windows（Direct3D / D3D）
      if (r.includes('direct3d') || r.includes('d3d')) {
        scores.windows += 6;
      }
      // Linux（Mesa/X.Org/llvmpipe）
      if (v.includes('mesa') || r.includes('mesa') || r.includes('x.org') || r.includes('llvmpipe')) {
        scores.linux += 5;
      }
      // Linux 显示栈（X11/Wayland）
      if (v.includes('x11') || r.includes('x11') || v.includes('wayland') || r.includes('wayland')) {
        scores.linux += 4;
      }
      // 移动 GPU 词（弱：辅助区分移动）
      if (r.includes('adreno') || r.includes('mali') || r.includes('Maleoon') || r.includes('powervr')) {
        if (isTouchy) {
          scores.android += 4;
        }
      }
      // Chrome on macOS 常见：ANGLE (Metal)
      if (r.includes('angle') && r.includes('metal')) {
        scores.macos += 4;
      }
    }

    // 置信度计算
    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = entries[0];
    const second = entries[1];
    const topName = top[0];
    const topScore = top[1];
    const secondScore = second[1];
    const gap = topScore - secondScore;

    // 当多个系统分数并列最高时，使用 UA 进行二次判定
    const topCandidates = entries.filter(([_, v]) => v === topScore).map(([k]) => k);

    const breakTieWithUA = (candidates: string[]): { hit: string | null, reason: string } => {
      try {
        const uaRaw = navigator.userAgent || '';
        const ua = uaRaw.toLowerCase();
        const platform = (navigator.platform || '').toLowerCase();
        
        const pick = (name: string) => candidates.includes(name) ? name : null;
        
        // Android
        if (/android/.test(ua)) {
          const hit = pick('android') || pick('harmonyos');
          if (hit) return { hit, reason: 'UA含 android' };
        }
        // iPhone/iPod 明确 iOS
        if (/iphone|ipod/.test(ua)) {
          const hit = pick('ios') || pick('ipados');
          if (hit) return { hit, reason: 'UA含 iPhone/iPod' };
        }
        // iPad 优先归入 iPadOS
        if (/ipad/.test(ua)) {
          const hit = pick('ipados') || pick('ios');
          if (hit) return { hit, reason: 'UA含 iPad' };
        }
        // macOS / iPadOS 的桌面化 UA
        if (/mac os x|macintosh/.test(ua) || /mac/.test(platform)) {
          if (/mobile/.test(ua)) {
            const hit = pick('ipados') || pick('ios');
            if (hit) return { hit, reason: 'UA含 Macintosh 且含 Mobile → iPadOS 倾向' };
          }
          const hit = pick('macos') || pick('ipados');
          if (hit) return { hit, reason: 'UA含 Mac OS X/Macintosh' };
        }
        // Windows
        if (/windows nt/.test(ua)) {
          const hit = pick('windows');
          if (hit) return { hit, reason: 'UA含 Windows NT' };
        }
        // Linux/Unix 类（含 CrOS/X11）
        if (/cros|x11|linux/.test(ua)) {
          const hit = pick('linux');
          if (hit) return { hit, reason: 'UA含 CrOS/X11/Linux' };
        }
        return { hit: null, reason: '未命中明确规则' };
      } catch (e) {
        return { hit: null, reason: 'UA 解析异常: ' + String(e) };
      }
    };

    let finalTopName = topName;
    if (topCandidates.length > 1) {
      const { hit } = breakTieWithUA(topCandidates);
      if (hit) {
        finalTopName = hit;
      }
    }

    // 改进的置信度映射
    let confidence = 0;
    if (topScore <= 0) {
      confidence = 0;
    } else if (topScore >= 15 && gap >= 8) {
      confidence = 98;
    } else if (topScore >= 12 && gap >= 6) {
      confidence = 95;
    } else if (topScore >= 10 && gap >= 5) {
      confidence = 92;
    } else if (topScore >= 8 && gap >= 4) {
      confidence = 88;
    } else if (topScore >= 6 && gap >= 3) {
      confidence = 82;
    } else if (topScore >= 5 && gap >= 2) {
      confidence = 75;
    } else if (gap >= 2) {
      confidence = 68;
    } else if (gap >= 1) {
      confidence = 58;
    } else {
      confidence = 45;
    }

    // 保存检测结果
    this.detectionResult.value = { scores, top: finalTopName, confidence };
    
    // 暴露到全局
    window.detectedOSType = finalTopName;
    
    return { scores, top: finalTopName, confidence };
  }

  // 获取当前检测结果
  public getDetectionResult(): DetectionResult | null {
    return this.detectionResult.value;
  }

  // 获取WebGL信息
  public getWebGL(): WebGLInfo | null {
    return this.webGLInfo.value;
  }

  // 获取NFC能力
  public getNFCCapabilities(): NFCCapabilities {
    return this.nfcCapabilities.value;
  }

  // 获取设备信号
  public getDeviceSignals(): DeviceSignals | null {
    return this.deviceSignals.value;
  }

  // 获取设备类型字符串
  public getDeviceType(): string {
    const result = this.detectionResult.value;
    if (result) {
      const pretty = { android: 'Android', ios: 'iOS', ipados: 'iPadOS', macos: 'macOS', windows: 'Windows', linux: 'Linux' };
      return (pretty as any)[result.top] || result.top;
    }
    return 'Unknown';
  }

  // 获取完整设备信息
  public getDeviceInfo() {
    return {
      webGLInfo: this.getWebGLInfo(),
      nfcCapabilities: this.getNFCCapabilities(),
      detectionResult: this.getDetectionResult(),
      deviceType: this.getDeviceType(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth
      },
      window: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      devicePixelRatio: window.devicePixelRatio,
      isSecureContext: window.isSecureContext,
      isApplePlatform: this.isApplePlatform()
    };
  }
}


export async function deviceInfo() {
    const disvc = new DeviceInfoService;
    return disvc.detect();
}