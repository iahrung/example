/**
 * 生产环境安全的日志工具
 * 
 * 在开发环境输出日志，生产环境自动禁用
 * 防止敏感信息泄露到生产环境控制台
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerConfig {
  /** 是否启用日志 */
  enabled: boolean
  /** 最低日志级别 */
  minLevel: LogLevel
  /** 是否显示时间戳 */
  showTimestamp: boolean
  /** 日志前缀 */
  prefix: string
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

// 默认配置：生产环境只输出错误，开发环境输出所有
const defaultConfig: LoggerConfig = {
  enabled: import.meta.env.DEV,
  minLevel: import.meta.env.DEV ? 'debug' : 'error',
  showTimestamp: true,
  prefix: '[App]'
}

class Logger {
  private config: LoggerConfig

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel]
  }

  private formatMessage(level: LogLevel, message: string): string {
    const parts: string[] = []
    
    if (this.config.showTimestamp) {
      parts.push(`[${new Date().toISOString()}]`)
    }
    
    parts.push(this.config.prefix)
    parts.push(`[${level.toUpperCase()}]`)
    parts.push(message)
    
    return parts.join(' ')
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), ...args)
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args)
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args)
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), ...args)
    }
  }

  /**
   * 创建带有自定义前缀的子日志器
   */
  createChild(prefix: string): Logger {
    return new Logger({
      ...this.config,
      prefix: `${this.config.prefix}${prefix}`
    })
  }
}

// 导出默认日志实例
export const logger = new Logger()

// 导出类以便创建自定义实例
export { Logger }
export type { LoggerConfig, LogLevel }
