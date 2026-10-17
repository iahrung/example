<template>
  <component :is="tag" v-html="safeHtml"></component>
</template>

<script setup lang="ts">
/**
 * SafeHtml 组件
 *
 * 安全渲染 HTML 内容，自动过滤 XSS 攻击
 *
 * @example
 * <SafeHtml :html="userContent" />
 * <SafeHtml :html="articleContent" tag="article" />
 */
import { computed } from 'vue'
import { sanitizeHtml } from '@/utils/security/xss'

interface Props {
  /** 要渲染的 HTML 内容 */
  html: string
  /** 包裹元素的标签名 */
  tag?: string
}

const props = withDefaults(defineProps<Props>(), {
  html: '',
  tag: 'div'
})

// 过滤后的安全 HTML
const safeHtml = computed(() => sanitizeHtml(props.html))
</script>
