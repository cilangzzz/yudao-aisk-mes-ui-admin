<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Steps, StepItem, Button } from 'tdesign-vue-next';

import ScanModule from './modules/scan.vue';
import KeyPartModule from './modules/key-part.vue';
import ExceptionModule from './modules/exception.vue';

/** 当前步骤 */
const currentStep = ref(0);

/** 扫码结果 */
const scanData = ref<{
  vin?: string;
  workOrderId?: number;
  operationId?: number;
  workstationId?: number;
  recordId?: number;
  operationName?: string;
}>({});

/** 扫码成功回调 */
function handleScanSuccess(data: {
  vin: string;
  workOrderId: number;
  operationId: number;
  workstationId: number;
  operationName: string;
}) {
  scanData.value = { ...data };
  currentStep.value = 1;
}

/** 开始作业成功回调 */
function handleStartSuccess(recordId: number) {
  scanData.value.recordId = recordId;
  currentStep.value = 2;
}

/** 完成作业回调 */
function handleComplete() {
  // 重置状态
  currentStep.value = 0;
  scanData.value = {};
}

/** 跳转到异常上报 */
function handleReportException() {
  currentStep.value = 3;
}

/** 返回扫码 */
function handleBackToScan() {
  currentStep.value = 0;
}
</script>

<template>
  <Page auto-content-height>
    <div class="mobile-container">
      <!-- 步骤指示器 -->
      <Card class="mb-4">
        <Steps :current="currentStep" layout="vertical" theme="dot">
          <StepItem title="扫码识别" content="扫描VIN码或工单号" />
          <StepItem title="绑定关键件" content="扫描绑定关键零部件" />
          <StepItem title="完成作业" content="确认作业结果" />
        </Steps>
      </Card>

      <!-- 扫码模块 -->
      <ScanModule
        v-if="currentStep === 0"
        @scan-success="handleScanSuccess"
      />

      <!-- 关键件绑定模块 -->
      <KeyPartModule
        v-else-if="currentStep === 1 || currentStep === 2"
        :scan-data="scanData"
        @bind-success="handleStartSuccess"
        @complete="handleComplete"
        @report-exception="handleReportException"
      />

      <!-- 异常上报模块 -->
      <ExceptionModule
        v-else-if="currentStep === 3"
        :scan-data="scanData"
        @success="handleBackToScan"
        @cancel="handleBackToScan"
      />

      <!-- 底部操作栏 -->
      <Card v-if="currentStep > 0" class="mt-4">
        <div class="flex gap-2">
          <Button
            block
            theme="default"
            variant="outline"
            @click="handleBackToScan"
          >
            返回扫码
          </Button>
          <Button
            v-if="currentStep === 1 || currentStep === 2"
            block
            theme="danger"
            variant="outline"
            @click="handleReportException"
          >
            异常上报
          </Button>
        </div>
      </Card>
    </div>
  </Page>
</template>

<style scoped>
.mobile-container {
  width: 100%;
  max-width: 414px;
  margin: 0 auto;
  padding: 16px;
  min-height: 100%;
}

.mobile-container :deep(.t-button) {
  min-height: 48px;
  font-size: 16px;
}

.mobile-container :deep(.t-input__inner) {
  font-size: 16px;
}

.mobile-container :deep(.t-card) {
  margin-bottom: 16px;
}
</style>