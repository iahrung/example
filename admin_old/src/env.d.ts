/// <reference types="vite/client" />

declare module 'nprogress'

declare module 'crypto-js'

declare module 'vue-img-cutter'

declare module 'file-saver'

declare module 'qrcode.vue' {
  export type Level = 'L' | 'M' | 'Q' | 'H'
  export type RenderAs = 'canvas' | 'svg'
  export type GradientType = 'linear' | 'radial'
  export interface ImageSettings {
    src: string
    height: number
    width: number
    excavate: boolean
  }
  export interface QRCodeProps {
    value: string
    size?: number
    level?: Level
    background?: string
    foreground?: string
    renderAs?: RenderAs
  }
  const QrcodeVue: any
  export default QrcodeVue
}

// 全局变量声明
declare const __APP_VERSION__: string // 版本号

// 环境变量类型声明
interface ImportMetaEnv {
  /** 应用部署基础路径 */
  readonly VITE_BASE_URL: string
  /** API 请求基础路径 */
  readonly VITE_API_URL: string
  /** 代理目标地址 */
  readonly VITE_API_PROXY_URL?: string
  /** 是否删除 console */
  readonly VITE_DROP_CONSOLE: string
  /** 加密密钥 */
  readonly VITE_CRYPTO_KEY?: string
  /** 是否启用凭据 */
  readonly VITE_WITH_CREDENTIALS?: string
  /** 应用版本号 */
  readonly VITE_VERSION?: string
  /** 端口号 */
  readonly VITE_PORT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
