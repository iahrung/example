/**
 * 加密工具模块
 *
 * 提供数据加密和解密功能，用于敏感数据的安全存储
 *
 * ## 主要功能
 *
 * - AES 加密/解密
 * - 敏感数据安全存储
 * - 自动检测已加密数据
 *
 * @module utils/crypto
 * @author Art Design Pro Team
 */

import CryptoJS from 'crypto-js'

// 加密密钥（生产环境应从环境变量获取）
const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY || 'art-design-pro-secret-key-2024'
const ENCRYPTED_PREFIX = 'ENC:'

/**
 * AES 加密
 * @param data 要加密的数据
 * @returns 加密后的字符串
 */
export function encrypt(data: string): string {
  if (!data) return ''
  try {
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString()
    return ENCRYPTED_PREFIX + encrypted
  } catch (error) {
    console.error('[Crypto] 加密失败:', error)
    return data
  }
}

/**
 * AES 解密
 * @param encryptedData 加密的数据
 * @returns 解密后的字符串
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return ''
  try {
    // 检查是否有加密前缀
    const data = encryptedData.startsWith(ENCRYPTED_PREFIX)
      ? encryptedData.slice(ENCRYPTED_PREFIX.length)
      : encryptedData
    
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('[Crypto] 解密失败:', error)
    return encryptedData
  }
}

/**
 * 检查数据是否已加密
 * @param data 要检查的数据
 * @returns 是否已加密
 */
export function isEncrypted(data: string): boolean {
  return data?.startsWith(ENCRYPTED_PREFIX) ?? false
}

/**
 * 安全存储数据到 localStorage
 * @param key 存储键
 * @param value 要存储的值
 */
export function secureSetItem(key: string, value: string): void {
  try {
    const encrypted = encrypt(value)
    localStorage.setItem(key, encrypted)
  } catch (error) {
    console.error('[Crypto] 安全存储失败:', error)
  }
}

/**
 * 从 localStorage 安全读取数据
 * @param key 存储键
 * @returns 解密后的值
 */
export function secureGetItem(key: string): string | null {
  try {
    const value = localStorage.getItem(key)
    if (!value) return null
    
    // 兼容旧数据：如果未加密，直接返回
    if (!isEncrypted(value)) {
      return value
    }
    
    return decrypt(value)
  } catch (error) {
    console.error('[Crypto] 安全读取失败:', error)
    return null
  }
}
