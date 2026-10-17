<template>
  <div class="p-4 min-h-[calc(100vh-100px)] relative pb-20">
    <!-- Top Navigation -->
    <div class="bg-white rounded-lg shadow-sm p-2 mb-4 sticky top-0 z-10 mx-[-16px] px-6 border-b border-gray-100 sm:mx-0 sm:px-2">
      <el-tabs v-model="activeTab" class="custom-tabs">
        <el-tab-pane v-for="tab in tabs" :key="tab.name" :name="tab.name">
          <template #label>
            <div class="flex items-center gap-2 px-2 py-1">
              <i :class="tab.icon" class="text-lg"></i>
              <span class="font-medium">{{ tab.label }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Content Area -->
    <div class="space-y-4">
      <el-form 
        ref="formRef"
        :model="form" 
        label-position="top"
        class="w-full"
      >
        <!-- Basic Settings -->
        <div v-show="activeTab === 'basic'" class="animate-fade-in space-y-4">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-base font-bold text-gray-800 mb-6 border-l-4 border-primary pl-3">基础信息</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <el-form-item label="网站名称">
                <el-input v-model="form.webtitle" placeholder="请输入网站名称" />
              </el-form-item>
              <el-form-item label="关键词">
                <el-input v-model="form.keywords" placeholder="SEO关键词，用逗号分隔" />
              </el-form-item>
              <el-form-item label="网站描述" class="md:col-span-2">
                <el-input v-model="form.description" type="textarea" :rows="3" placeholder="网站描述信息" />
              </el-form-item>
              <el-form-item label="默认推荐码">
                <el-input v-model="form.defaulttjcode">
                  <template #prefix><i class="ri-share-forward-line"></i></template>
                </el-input>
                <div class="text-xs text-gray-400 mt-1">仅针对散户注册显示</div>
              </el-form-item>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-base font-bold text-gray-800 mb-6 border-l-4 border-primary pl-3">访问控制</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <el-form-item label="前台登录保护">
                <div class="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-100 w-full">
                  <span>连续错误</span>
                  <el-input-number v-model="form.loginerrornum_q" :min="0" controls-position="right" class="!w-20" />
                  <span>次，锁定</span>
                  <el-input-number v-model="form.loginerrorclosetime_q" :min="0" controls-position="right" class="!w-20" />
                  <span>小时</span>
                </div>
              </el-form-item>
              
              <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="border border-gray-100 rounded-lg p-4">
                  <div class="flex justify-between items-center mb-3">
                    <span class="font-medium text-gray-700">IP 黑名单</span>
                    <el-switch v-model="form.ipblackisopen" :active-value="1" :inactive-value="0" />
                  </div>
                  <el-input v-model="form.ipblacklist" type="textarea" :rows="4" placeholder="一行一个IP地址" :disabled="!form.ipblackisopen" />
                </div>
                <div class="border border-gray-100 rounded-lg p-4">
                  <div class="flex justify-between items-center mb-3">
                    <span class="font-medium text-gray-700">IP 白名单</span>
                    <el-switch v-model="form.ipwhiteisopen" :active-value="1" :inactive-value="0" />
                  </div>
                  <el-input v-model="form.ipwhitelist" type="textarea" :rows="4" placeholder="一行一个IP地址" :disabled="!form.ipwhiteisopen" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Operation Settings -->
        <div v-show="activeTab === 'operation'" class="animate-fade-in space-y-4">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <h3 class="text-base font-bold text-gray-800 mb-6 border-l-4 border-primary pl-3">财务规则</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <el-form-item label="提款开放时间">
                  <div class="flex items-center gap-2 w-full">
                    <el-time-picker v-model="form.tikuanstart" value-format="HH:mm" format="HH:mm" class="!flex-1" placeholder="开始" />
                    <span class="text-gray-400">-</span>
                    <el-time-picker v-model="form.tikuanend" value-format="HH:mm" format="HH:mm" class="!flex-1" placeholder="结束" />
                  </div>
                </el-form-item>
                <el-form-item label="提款打码量 (%)">
                  <el-input-number v-model="form.damaliang" :min="0" :max="100" controls-position="right" class="w-full" />
                </el-form-item>
                
                <div class="md:col-span-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div class="text-sm font-bold text-blue-800 mb-3">提款限额 (元)</div>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <el-form-item label="单笔最低" class="mb-0">
                      <el-input-number v-model="form.tikuanMin" :min="0" :controls="false" class="w-full" />
                    </el-form-item>
                    <el-form-item label="单笔最高" class="mb-0">
                      <el-input-number v-model="form.tikuanMax" :min="0" :controls="false" class="w-full" />
                    </el-form-item>
                    <el-form-item label="日累计限额" class="mb-0">
                      <el-input-number v-model="form.ritikuanxiane" :min="0" :controls="false" class="w-full" />
                    </el-form-item>
                    <el-form-item label="日提款次数" class="mb-0">
                      <el-input-number v-model="form.tikuannum" :min="0" :controls="false" class="w-full" />
                    </el-form-item>
                  </div>
                </div>

                <div class="md:col-span-2 p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div class="text-sm font-bold text-orange-800 mb-3">超额提款费用</div>
                  <div class="flex flex-wrap items-end gap-4">
                    <el-form-item label="费率 (%)" class="mb-0 flex-1 min-w-[120px]">
                      <el-input-number v-model="form.tikuannumoverbilv" :min="0" :max="100" controls-position="right" class="w-full" />
                    </el-form-item>
                    <el-form-item label="最低费用" class="mb-0 flex-1 min-w-[120px]">
                      <el-input-number v-model="form.tikuannumovermin" :min="0" controls-position="right" class="w-full" />
                    </el-form-item>
                    <el-form-item label="最高费用" class="mb-0 flex-1 min-w-[120px]">
                      <el-input-number v-model="form.tikuannumovermax" :min="0" controls-position="right" class="w-full" />
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="bg-white p-6 rounded-lg shadow-sm h-fit">
                <h3 class="text-base font-bold text-gray-800 mb-6 border-l-4 border-primary pl-3">接口配置</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>NG接口</span>
                    <el-switch v-model="form.switch_ng" :active-value="1" :inactive-value="0" />
                  </div>
                  <el-form-item label="API Account" class="mb-0">
                    <el-input v-model="form.api_account" />
                  </el-form-item>
                  <el-form-item label="Sign Key" class="mb-0">
                    <el-input v-model="form.sign_key" show-password />
                  </el-form-item>
                </div>
              </div>

              <div class="bg-white p-6 rounded-lg shadow-sm h-fit">
                <h3 class="text-base font-bold text-gray-800 mb-6 border-l-4 border-primary pl-3">其他规则</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>允许撤单</span>
                    <el-switch v-model="form.iskillorder" :active-value="1" :inactive-value="0" />
                  </div>
                  <el-form-item label="最大绑卡数" class="mb-0">
                    <el-input-number v-model="form.sysBankMaxNum" :min="1" controls-position="right" class="w-full" />
                  </el-form-item>
                  <el-form-item label="排队人数基数" class="mb-0">
                    <el-input-number v-model="form.paiduinum" :min="0" controls-position="right" class="w-full" />
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-base font-bold text-gray-800 mb-6 border-l-4 border-primary pl-3">返点与客服</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <el-form-item label="返点范围 (%)">
                <div class="flex items-center gap-2">
                  <el-input-number v-model="form.fanDianMin" :min="0" :max="100" :precision="1" :controls="false" class="!w-20" />
                  <span>-</span>
                  <el-input-number v-model="form.fanDianMax" :min="0" :max="100" :precision="1" :controls="false" class="!w-20" />
                </div>
              </el-form-item>
              <el-form-item label="充值积分 (元/分)">
                <div class="flex items-center gap-2">
                  <el-input-number v-model="form.pointchongzhi" :min="1" :controls="false" class="!w-20" />
                  <span>:</span>
                  <el-input-number v-model="form.pointchongzhiadd" :min="0" :controls="false" class="!w-20" />
                </div>
              </el-form-item>
              <div class="md:col-span-1 space-y-4">
                <el-input v-model="form.kefuqq" placeholder="客服QQ">
                  <template #prefix><i class="ri-qq-line"></i></template>
                </el-input>
                <el-input v-model="form.kefuthree" placeholder="客服链接">
                  <template #prefix><i class="ri-link"></i></template>
                </el-input>
              </div>
            </div>
          </div>
        </div>

        <!-- Backend Settings -->
        <div v-show="activeTab === 'backend'" class="animate-fade-in space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <h3 class="text-base font-bold text-gray-800 mb-6 border-l-4 border-primary pl-3">后台登录安全</h3>
              <el-form-item label="登录失败限制">
                <div class="flex items-center gap-2 w-full bg-red-50 p-3 rounded border border-red-100">
                  <span class="text-gray-600">错误</span>
                  <el-input-number v-model="form.loginerrornum" :min="0" controls-position="right" class="!w-20" />
                  <span class="text-gray-600">次，锁定</span>
                  <el-input-number v-model="form.loginerrorclosetime" :min="0" controls-position="right" class="!w-20" />
                  <span class="text-gray-600">小时</span>
                </div>
              </el-form-item>
              <div class="flex items-center justify-between p-4 mt-4 bg-gray-50 rounded-lg">
                <div class="font-medium">图像验证码</div>
                <el-switch v-model="form.islogincode" :active-value="1" :inactive-value="0" />
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm">
              <h3 class="text-base font-bold text-gray-800 mb-6 border-l-4 border-primary pl-3">邮箱验证登录</h3>
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                <div class="font-medium">启用状态</div>
                <el-switch v-model="form.isemailcode" :active-value="1" :inactive-value="0" />
              </div>
              <div class="space-y-4">
                <el-form-item label="验证码有效期 (秒)">
                  <el-input-number v-model="form.adminemailcodetime" :min="0" controls-position="right" class="w-full" />
                </el-form-item>
                <el-form-item label="接收验证码邮箱">
                  <el-input v-model="form.getemailcode" placeholder="用于接收验证码" />
                </el-form-item>
              </div>
              <div class="mt-4 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                <i class="ri-alert-line align-bottom mr-1"></i>
                请确保邮件服务器配置正确，否则无法收到验证码。
              </div>
            </div>
          </div>
        </div>

        <!-- Mail Settings -->
        <div v-show="activeTab === 'mail'" class="animate-fade-in">
          <div class="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
            <h3 class="text-base font-bold text-gray-800 mb-6 border-l-4 border-primary pl-3">SMTP 服务器配置</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <el-form-item label="服务器地址" class="md:col-span-2">
                <el-input v-model="form.SMTP_HOST" placeholder="例如: smtp.exmail.qq.com">
                  <template #prefix><i class="ri-server-line"></i></template>
                </el-input>
              </el-form-item>
              <el-form-item label="端口">
                <el-input v-model="form.SMTP_PORT" placeholder="465 / 587" />
              </el-form-item>
              <el-form-item label="加密协议">
                <el-radio-group v-model="form.SMTP_SSL" class="w-full">
                  <el-radio-button :label="1">SSL / TLS</el-radio-button>
                  <el-radio-button :label="0">None</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="账号">
                <el-input v-model="form.SMTP_USER" placeholder="邮箱账号" />
              </el-form-item>
              <el-form-item label="密码 / 授权码">
                <el-input v-model="form.SMTP_PASS" type="password" show-password placeholder="密码" />
              </el-form-item>
              
              <div class="md:col-span-2 border-t border-gray-100 my-2 pt-4">
                <h4 class="text-sm font-bold text-gray-700 mb-4">发件人信息</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <el-form-item label="发件人名称">
                    <el-input v-model="form.FROM_NAME" />
                  </el-form-item>
                  <el-form-item label="发件人邮箱">
                    <el-input v-model="form.FROM_EMAIL" />
                  </el-form-item>
                  <el-form-item label="回复名称">
                    <el-input v-model="form.REPLY_NAME" />
                  </el-form-item>
                  <el-form-item label="回复邮箱">
                    <el-input v-model="form.REPLY_EMAIL" />
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Settings -->
        <div v-show="activeTab === 'other'" class="animate-fade-in space-y-4">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-base font-bold text-gray-800 mb-6 border-l-4 border-primary pl-3">接口与访问</h3>
            <div class="grid grid-cols-1 gap-6">
              <el-form-item label="采集接口 URL">
                <el-input v-model="form.caijieapiurl" placeholder="http://..." />
              </el-form-item>
              <el-form-item label="允许前台访问 IP">
                <el-input v-model="form.weballowips" type="textarea" :rows="3" placeholder="限制前台只能由特定IP访问，留空则不限制" />
              </el-form-item>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-base font-bold text-gray-800 mb-6 border-l-4 border-primary pl-3">声音提示配置</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- 充值音 -->
              <div class="border border-gray-100 rounded-lg p-4 transition-shadow hover:shadow-md" :class="{'bg-gray-50': !form.czaudioplay}">
                <div class="flex justify-between items-center mb-4">
                  <span class="font-bold text-gray-700 flex items-center gap-2">
                    <i class="ri-money-dollar-circle-line text-xl text-green-500"></i> 充值提示
                  </span>
                  <el-switch v-model="form.czaudioplay" :active-value="1" :inactive-value="0" />
                </div>
                <div v-if="form.czaudioplay" class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">有效时间</span>
                    <div class="flex items-center gap-1">
                      <el-input-number v-model="form.czaudioplaytime" :min="1" :controls="false" size="small" class="!w-12" />
                      <span>分</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">自动关闭</span>
                    <div class="flex items-center gap-1">
                      <el-input-number v-model="form.czaudioqxtime" :min="1" :controls="false" size="small" class="!w-12" />
                      <span>分</span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-gray-400 text-sm py-4">已关闭</div>
              </div>

              <!-- 提款音 -->
              <div class="border border-gray-100 rounded-lg p-4 transition-shadow hover:shadow-md" :class="{'bg-gray-50': !form.tkaudioplay}">
                <div class="flex justify-between items-center mb-4">
                  <span class="font-bold text-gray-700 flex items-center gap-2">
                    <i class="ri-bank-card-line text-xl text-orange-500"></i> 提款提示
                  </span>
                  <el-switch v-model="form.tkaudioplay" :active-value="1" :inactive-value="0" />
                </div>
                <div v-if="form.tkaudioplay" class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">有效时间</span>
                    <div class="flex items-center gap-1">
                      <el-input-number v-model="form.tkaudioplaytime" :min="1" :controls="false" size="small" class="!w-12" />
                      <span>分</span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-gray-400 text-sm py-4">已关闭</div>
              </div>

              <!-- 绑卡音 -->
              <div class="border border-gray-100 rounded-lg p-4 transition-shadow hover:shadow-md" :class="{'bg-gray-50': !form.cardaudioplay}">
                <div class="flex justify-between items-center mb-4">
                  <span class="font-bold text-gray-700 flex items-center gap-2">
                    <i class="ri-id-card-line text-xl text-blue-500"></i> 绑卡提示
                  </span>
                  <el-switch v-model="form.cardaudioplay" :active-value="1" :inactive-value="0" />
                </div>
                <div class="text-xs text-gray-500 leading-relaxed">
                  开启后，当用户绑定新的银行卡时，后台将播放提示音。
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>

    <!-- Fixed Bottom Action Bar -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-center gap-4 z-20 sm:absolute sm:left-0 sm:right-0 sm:bottom-0 sm:rounded-b-lg">
      <el-button @click="loadData" size="large" class="w-32">重置</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting" size="large" class="w-32">保存设置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  fetchSystemSettings, 
  saveSystemSettings, 
  type SystemSettings 
} from '@/api/system-settings'

const activeTab = ref('basic')
const loading = ref(false)
const submitting = ref(false)

const tabs = [
  { name: 'basic', label: '基本设置', icon: 'ri-settings-4-line' },
  { name: 'operation', label: '运维设置', icon: 'ri-tools-line' },
  { name: 'backend', label: '后台设置', icon: 'ri-shield-user-line' },
  { name: 'mail', label: '邮件设置', icon: 'ri-mail-settings-line' },
  { name: 'other', label: '其他设置', icon: 'ri-more-fill' }
]

const form = reactive<SystemSettings>({
  // Basic
  webtitle: '',
  keywords: '',
  description: '',
  defaulttjcode: '',
  loginerrornum_q: 6,
  loginerrorclosetime_q: 24,
  ipblackisopen: 0,
  ipblacklist: '',
  ipwhiteisopen: 0,
  ipwhitelist: '',
  
  // Operation
  switch_ng: 1,
  api_account: '',
  sign_key: '',
  iskillorder: 1,
  sysBankMaxNum: 4,
  damaliang: 50,
  paiduinum: 33,
  tikuanstart: '00:10',
  tikuanend: '23:55',
  tikuannumoverbilv: 10,
  tikuannumovermin: 100,
  tikuannumovermax: 9999999,
  tikuanMin: 100,
  tikuanMax: 500000,
  ritikuanxiane: 1000000,
  tikuannum: 10,
  fanDianMax: 9.8,
  fanDianMin: 0.0,
  pointchongzhi: 1,
  pointchongzhiadd: 2,
  kefuqq: '',
  kefuthree: '',

  // Backend
  loginerrornum: 3,
  loginerrorclosetime: 1,
  islogincode: 0,
  isemailcode: 0,
  adminemailcodetime: 180,
  getemailcode: '',

  // Mail
  SMTP_HOST: '',
  SMTP_SSL: 0,
  SMTP_PORT: '',
  FROM_EMAIL: '',
  SMTP_USER: '',
  FROM_NAME: '',
  REPLY_EMAIL: '',
  REPLY_NAME: '',
  SMTP_PASS: '',

  // Other
  caijieapiurl: '',
  weballowips: '',
  czaudioplay: 1,
  czaudioplaytime: 5,
  czaudioqxtime: 8,
  tkaudioplay: 1,
  tkaudioplaytime: 5,
  cardaudioplay: 1
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchSystemSettings()
    console.log('System Settings API Response:', res)
    
    // Handle if response is nested under 'info' or similar key
    // Based on 1.md, the form fields were name="info[key]".
    // If backend returns { code: 1, data: { ...settings } }, our fetchSystemSettings already returns res.data.
    // But if the data itself has keys like "webtitle", "keywords", etc. directly, Object.assign should work.
    // However, if backend returns numeric strings for numbers, we might need conversion.
    
    // Let's try to map fields manually if needed or handle type differences.
    // For now, let's assume the keys match but might be strings instead of numbers.
    
    // Helper to safe parse number
    const toNumber = (val: any) => {
      const n = Number(val)
      return isNaN(n) ? 0 : n
    }

    // Merge safely
    const settings = (res as any).settings || res // Handle nested settings object
    if (settings) {
      form.webtitle = settings.webtitle || ''
      form.keywords = settings.keywords || ''
      form.description = settings.description || ''
      form.defaulttjcode = settings.defaulttjcode || ''
      form.loginerrornum_q = toNumber(settings.loginerrornum_q)
      form.loginerrorclosetime_q = toNumber(settings.loginerrorclosetime_q)
      form.ipblackisopen = toNumber(settings.ipblackisopen)
      form.ipblacklist = settings.ipblacklist || ''
      form.ipwhiteisopen = toNumber(settings.ipwhiteisopen)
      form.ipwhitelist = settings.ipwhitelist || ''
      
      form.switch_ng = toNumber(settings.switch_ng)
      form.api_account = settings.api_account || ''
      form.sign_key = settings.sign_key || ''
      form.iskillorder = toNumber(settings.iskillorder)
      form.sysBankMaxNum = toNumber(settings.sysBankMaxNum)
      form.damaliang = toNumber(settings.damaliang)
      form.paiduinum = toNumber(settings.paiduinum)
      form.tikuanstart = settings.tikuanstart || '00:00'
      form.tikuanend = settings.tikuanend || '23:59'
      form.tikuannumoverbilv = toNumber(settings.tikuannumoverbilv)
      form.tikuannumovermin = toNumber(settings.tikuannumovermin)
      form.tikuannumovermax = toNumber(settings.tikuannumovermax)
      form.tikuanMin = toNumber(settings.tikuanMin)
      form.tikuanMax = toNumber(settings.tikuanMax)
      form.ritikuanxiane = toNumber(settings.ritikuanxiane)
      form.tikuannum = toNumber(settings.tikuannum)
      form.fanDianMax = toNumber(settings.fanDianMax)
      form.fanDianMin = toNumber(settings.fanDianMin)
      form.pointchongzhi = toNumber(settings.pointchongzhi)
      form.pointchongzhiadd = toNumber(settings.pointchongzhiadd)
      form.kefuqq = settings.kefuqq || ''
      form.kefuthree = settings.kefuthree || ''
      
      form.loginerrornum = toNumber(settings.loginerrornum)
      form.loginerrorclosetime = toNumber(settings.loginerrorclosetime)
      form.islogincode = toNumber(settings.islogincode)
      form.isemailcode = toNumber(settings.isemailcode)
      form.adminemailcodetime = toNumber(settings.adminemailcodetime)
      form.getemailcode = settings.getemailcode || ''
      
      form.SMTP_HOST = settings.SMTP_HOST || ''
      form.SMTP_SSL = toNumber(settings.SMTP_SSL)
      form.SMTP_PORT = settings.SMTP_PORT || ''
      form.FROM_EMAIL = settings.FROM_EMAIL || ''
      form.SMTP_USER = settings.SMTP_USER || ''
      form.FROM_NAME = settings.FROM_NAME || ''
      form.REPLY_EMAIL = settings.REPLY_EMAIL || ''
      form.REPLY_NAME = settings.REPLY_NAME || ''
      form.SMTP_PASS = settings.SMTP_PASS || ''
      
      form.caijieapiurl = settings.caijieapiurl || ''
      form.weballowips = settings.weballowips || ''
      form.czaudioplay = toNumber(settings.czaudioplay)
      form.czaudioplaytime = toNumber(settings.czaudioplaytime)
      form.czaudioqxtime = toNumber(settings.czaudioqxtime)
      form.tkaudioplay = toNumber(settings.tkaudioplay)
      form.tkaudioplaytime = toNumber(settings.tkaudioplaytime)
      form.cardaudioplay = toNumber(settings.cardaudioplay)
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    await saveSystemSettings(form)
    ElMessage.success('保存成功')
    loadData()
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.custom-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}
.custom-tabs :deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 3px;
}
.custom-tabs :deep(.el-tabs__item) {
  font-size: 15px;
  padding: 0 20px;
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>