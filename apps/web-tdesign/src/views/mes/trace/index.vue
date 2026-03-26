<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Tabs, TabPanel } from 'tdesign-vue-next';

import VinTrace from './modules/vin-trace.vue';
import PartTrace from './modules/part-trace.vue';

const activeTab = ref('vin');
const vinTraceRef = ref<InstanceType<typeof VinTrace>>();
const partTraceRef = ref<InstanceType<typeof PartTrace>>();

/** 处理从关键件追溯跳转到VIN追溯 */
function handleVinTrace(vin: string) {
  // 切换到VIN追溯Tab
  activeTab.value = 'vin';
  // 这里可以触发vin-trace组件的查询
  // 由于vin-trace组件内部表单，需要在组件内提供设置VIN的方法
}
</script>

<template>
  <Page auto-content-height>
    <div class="trace-page h-full">
      <Tabs v-model="activeTab" class="h-full">
        <TabPanel value="vin" label="VIN正向追溯" class="h-full">
          <VinTrace ref="vinTraceRef" />
        </TabPanel>
        <TabPanel value="part" label="关键件反向追溯" class="h-full">
          <PartTrace ref="partTraceRef" @vin-trace="handleVinTrace" />
        </TabPanel>
      </Tabs>
    </div>
  </Page>
</template>

<style scoped>
.trace-page {
  padding: 16px;
  background: var(--td-bg-color-container);
  border-radius: var(--td-radius-default);
}

.trace-page :deep(.t-tabs) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.trace-page :deep(.t-tabs__content) {
  flex: 1;
  overflow: auto;
}

.trace-page :deep(.t-tab-panel) {
  height: 100%;
}
</style>