/**
 * XSS 防护工具模块
 *
 * 提供 HTML 内容过滤和 XSS 攻击防护
 *
 * ## 主要功能
 *
 * - HTML 标签过滤
 * - 危险属性移除
 * - 安全的 HTML 渲染
 *
 * @module utils/security/xss
 * @author Art Design Pro Team
 */

// 允许的 HTML 标签白名单
const ALLOWED_TAGS = [
  'a', 'abbr', 'address', 'article', 'aside', 'b', 'bdi', 'bdo', 'blockquote',
  'br', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'dd', 'del',
  'details', 'dfn', 'div', 'dl', 'dt', 'em', 'figcaption', 'figure', 'footer',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'i', 'img', 'ins',
  'kbd', 'li', 'main', 'mark', 'nav', 'ol', 'p', 'pre', 'q', 'rp', 'rt',
  'ruby', 's', 'samp', 'section', 'small', 'span', 'strong', 'sub', 'summary',
  'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'time', 'tr', 'u',
  'ul', 'var', 'wbr'
]

// 允许的属性白名单
const ALLOWED_ATTRS = [
  'href', 'src', 'alt', 'title', 'class', 'id', 'style', 'target', 'rel',
  'width', 'height', 'colspan', 'rowspan', 'datetime', 'cite'
]

// 危险的属性模式
const DANGEROUS_ATTR_PATTERNS = [
  /^on\w+/i,           // 事件处理器 (onclick, onerror, etc.)
  /^javascript:/i,     // javascript: 协议
  /^data:/i,           // data: 协议 (除了图片)
  /^vbscript:/i        // vbscript: 协议
]

// 危险的 CSS 属性
const DANGEROUS_CSS_PATTERNS = [
  /expression\s*\(/i,
  /javascript\s*:/i,
  /behavior\s*:/i,
  /-moz-binding/i
]

/**
 * 检查属性值是否安全
 * @param attrName 属性名
 * @param attrValue 属性值
 * @returns 是否安全
 */
function isAttrValueSafe(attrName: string, attrValue: string): boolean {
  const lowerValue = attrValue.toLowerCase().trim()
  
  // 检查 href 和 src 属性
  if (attrName === 'href' || attrName === 'src') {
    if (lowerValue.startsWith('javascript:') || lowerValue.startsWith('vbscript:')) {
      return false
    }
    // 允许 data: 协议的图片
    if (lowerValue.startsWith('data:') && attrName === 'src') {
      return lowerValue.startsWith('data:image/')
    }
  }
  
  // 检查 style 属性
  if (attrName === 'style') {
    return !DANGEROUS_CSS_PATTERNS.some(pattern => pattern.test(attrValue))
  }
  
  return true
}

/**
 * 转义 HTML 特殊字符
 * @param str 要转义的字符串
 * @returns 转义后的字符串
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return ''
  
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }
  
  return str.replace(/[&<>"'/]/g, char => escapeMap[char])
}

/**
 * 过滤 HTML 内容，移除危险标签和属性
 * @param html 原始 HTML 字符串
 * @returns 过滤后的安全 HTML
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return ''
  
  // 创建临时 DOM 元素
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  
  // 递归处理所有节点
  sanitizeNode(tempDiv)
  
  return tempDiv.innerHTML
}

/**
 * 递归清理 DOM 节点
 * @param node 要清理的节点
 */
function sanitizeNode(node: Element): void {
  const childNodes = Array.from(node.childNodes)
  
  for (const child of childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child as Element
      const tagName = element.tagName.toLowerCase()
      
      // 检查标签是否在白名单中
      if (!ALLOWED_TAGS.includes(tagName)) {
        // 移除危险标签，但保留其文本内容
        if (['script', 'style', 'iframe', 'object', 'embed', 'form'].includes(tagName)) {
          element.remove()
        } else {
          // 用文本内容替换
          const textContent = element.textContent || ''
          const textNode = document.createTextNode(textContent)
          element.replaceWith(textNode)
        }
        continue
      }
      
      // 清理属性
      const attrs = Array.from(element.attributes)
      for (const attr of attrs) {
        const attrName = attr.name.toLowerCase()
        
        // 检查是否是危险属性
        const isDangerous = DANGEROUS_ATTR_PATTERNS.some(pattern => pattern.test(attrName))
        
        // 检查是否在白名单中且值安全
        if (isDangerous || !ALLOWED_ATTRS.includes(attrName) || !isAttrValueSafe(attrName, attr.value)) {
          element.removeAttribute(attr.name)
        }
      }
      
      // 递归处理子节点
      sanitizeNode(element)
    }
  }
}

/**
 * 创建安全的 HTML 内容（用于 v-html）
 * @param html 原始 HTML
 * @returns 安全的 HTML
 */
export function createSafeHtml(html: string): string {
  return sanitizeHtml(html)
}
