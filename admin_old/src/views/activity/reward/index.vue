<template>
  <div class="p-4">
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <el-tabs v-model="activeTab" type="border-card">
        
        <!-- Tab 1: Recharge -->
        <el-tab-pane label="充值活动" name="recharge">
          <el-form label-width="120px" class="max-w-3xl mt-4">
            <div v-for="(item, index) in form.recharge" :key="index" class="flex items-center gap-4 mb-4">
              <div class="font-medium text-gray-600 w-24">第 {{ index + 1 }} 档：</div>
              <el-form-item label="单次充值满" class="mb-0">
                <el-input v-model="item.money" style="width: 120px">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="赠送" class="mb-0 !ml-[-80px]">
                <el-input v-model="item.percent" style="width: 120px">
                  <template #append>%</template>
                </el-input>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>

        <!-- Tab 2: Consumption -->
        <el-tab-pane label="消费活动" name="consumption">
          <el-form label-width="100px" class="max-w-4xl mt-4">
            <div class="mb-8">
              <h3 class="text-lg font-medium mb-4 border-l-4 border-primary pl-3">日消费</h3>
              <div v-for="(item, index) in form.daily_consume" :key="'day_'+index" class="flex items-center gap-4 mb-4">
                <div class="font-medium text-gray-600 w-24">第 {{ index + 1 }} 档：</div>
                <el-form-item label="消费满" class="mb-0">
                  <el-input v-model="item.money" style="width: 120px">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="本人赠送" class="mb-0 !ml-[-20px]">
                  <el-input v-model="item.self_percent" style="width: 100px">
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="上家赠送" class="mb-0 !ml-[-20px]">
                  <el-input v-model="item.parent_percent" style="width: 100px">
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-4 border-l-4 border-primary pl-3">月消费</h3>
              <div v-for="(item, index) in form.monthly_consume" :key="'month_'+index" class="flex items-center gap-4 mb-4">
                <div class="font-medium text-gray-600 w-24">第 {{ index + 1 }} 档：</div>
                <el-form-item label="消费满" class="mb-0">
                  <el-input v-model="item.money" style="width: 120px">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="本人赠送" class="mb-0 !ml-[-20px]">
                  <el-input v-model="item.self_percent" style="width: 100px">
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="上家赠送" class="mb-0 !ml-[-20px]">
                  <el-input v-model="item.parent_percent" style="width: 100px">
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </el-tab-pane>

        <!-- Tab 3: Loss -->
        <el-tab-pane label="亏损活动" name="loss">
          <el-form label-width="100px" class="max-w-4xl mt-4">
            <div class="mb-8">
              <h3 class="text-lg font-medium mb-4 border-l-4 border-primary pl-3">日亏损</h3>
              <div v-for="(item, index) in form.daily_loss" :key="'loss_day_'+index" class="flex items-center gap-4 mb-4">
                <div class="font-medium text-gray-600 w-24">第 {{ index + 1 }} 档：</div>
                <el-form-item label="亏损满" class="mb-0">
                  <el-input v-model="item.money" style="width: 120px">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="本人赠送" class="mb-0 !ml-[-20px]">
                  <el-input v-model="item.self_percent" style="width: 100px">
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="上家赠送" class="mb-0 !ml-[-20px]">
                  <el-input v-model="item.parent_percent" style="width: 100px">
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-4 border-l-4 border-primary pl-3">月亏损</h3>
              <div v-for="(item, index) in form.monthly_loss" :key="'loss_month_'+index" class="flex items-center gap-4 mb-4">
                <div class="font-medium text-gray-600 w-24">第 {{ index + 1 }} 档：</div>
                <el-form-item label="亏损满" class="mb-0">
                  <el-input v-model="item.money" style="width: 120px">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="本人赠送" class="mb-0 !ml-[-20px]">
                  <el-input v-model="item.self_percent" style="width: 100px">
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="上家赠送" class="mb-0 !ml-[-20px]">
                  <el-input v-model="item.parent_percent" style="width: 100px">
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </el-tab-pane>

        <!-- Tab 4: Agent -->
        <el-tab-pane label="代理分红" name="agent">
          <el-form label-width="120px" class="max-w-3xl mt-4">
            <div v-for="(item, index) in form.agent_bonus" :key="index" class="flex items-center gap-4 mb-4">
              <div class="font-medium text-gray-600 w-24">第 {{ index + 1 }} 档：</div>
              <el-form-item label="月下线亏损满" class="mb-0">
                <el-input v-model="item.money" style="width: 120px">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="赠送" class="mb-0 !ml-[-60px]">
                <el-input v-model="item.percent" style="width: 120px">
                  <template #append>%</template>
                </el-input>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>

        <!-- Tab 5: Other -->
        <el-tab-pane label="其他" name="other">
          <el-form label-width="150px" class="max-w-2xl mt-8">
            <el-form-item label="绑定银行账户赠送">
              <el-input v-model="form.other.bindcard_amount" placeholder="请输入金额">
                <template #append>元</template>
              </el-input>
              <div class="text-gray-400 text-xs mt-1">设置为 0 表示关闭此活动</div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

      </el-tabs>

      <div class="mt-6 flex justify-center gap-4">
        <el-button type="primary" @click="handleSubmit" :loading="submitting" size="large" style="width: 120px">保存设置</el-button>
        <el-button @click="loadData" size="large" style="width: 120px">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  fetchActivityRewardSettings, 
  saveActivityRewardSettings,
  type ActivityRewardConfig,
  type RewardTier
} from '@/api/activity-reward'

const activeTab = ref('recharge')
const loading = ref(false)
const submitting = ref(false)

const form = reactive<ActivityRewardConfig>({
  recharge: [],
  daily_consume: [],
  monthly_consume: [],
  daily_loss: [],
  monthly_loss: [],
  agent_bonus: [],
  other: { bindcard_amount: '' }
})

// Ensure array length for display
const ensureLength = (arr: RewardTier[], len: number, hasParent = false) => {
  while (arr.length < len) {
    const item: any = { level: arr.length, money: '', percent: '' }
    if (hasParent) {
      item.self_percent = ''
      item.parent_percent = ''
      delete item.percent
    }
    arr.push(item)
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchActivityRewardSettings()
    // Assign response to form
    if (res.recharge) form.recharge = res.recharge
    if (res.daily_consume) form.daily_consume = res.daily_consume
    if (res.monthly_consume) form.monthly_consume = res.monthly_consume
    if (res.daily_loss) form.daily_loss = res.daily_loss
    if (res.monthly_loss) form.monthly_loss = res.monthly_loss
    if (res.agent_bonus) form.agent_bonus = res.agent_bonus
    if (res.other) form.other = res.other

    // Ensure lengths for UI
    ensureLength(form.recharge, 5)
    ensureLength(form.daily_consume, 3, true)
    ensureLength(form.monthly_consume, 3, true)
    ensureLength(form.daily_loss, 3, true)
    ensureLength(form.monthly_loss, 3, true)
    ensureLength(form.agent_bonus, 4)
    
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    await saveActivityRewardSettings(form)
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
/* Custom styles if needed */
</style>
