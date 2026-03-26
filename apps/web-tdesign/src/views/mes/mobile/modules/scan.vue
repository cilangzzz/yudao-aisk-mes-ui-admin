<script lang="ts" setup>
import type { MesMobileApi } from '#/api/mes/mobile';

import { ref } from 'vue';

import { Card, Button, Tag, Descriptions, DescriptionsItem, Loading, Message } from 'tdesign-vue-next';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/tdesign';
import { scanCode, startOperation } from '#/api/mes/mobile';

import { useScanFormSchema } from '../data';

const emit = defineEmits<{
  'scan-success': [data: {
    vin: string;
    workOrderId: number;
    operationId: number;
    workstationId: number;
    operationName: string;
  }];
}>();

const loading = ref(false);
const scanResult = ref<MesMobileApi.ScanResult | null>(null);
const recordId = ref<number>(0);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 80,
  },
  layout: 'vertical',
  schema: useScanFormSchema(),
  showDefaultActions: false,
});

/** 扫码查询 */
async function handleScan() {
  const { valid } = await formApi.validate();
  if (!valid) return;

  const values = await formApi.getValues();
  loading.value = true;
  scanResult.value = null;

  try {
    const result = await scanCode({
      scanCode: values.scanCode,
      workstationId: values.workstationId,
    });
    scanResult.value = result;

    if (result.success) {
      message.success('扫码成功');
    } else {
      message.warning(result.failReason || '扫码失败');
    }
  } catch (error) {
    message.error('扫码请求失败');
  } finally {
    loading.value = false;
  }
}

/** 开始作业 */
async function handleStart() {
  if (!scanResult.value?.canStart) {
    message.warning('当前状态不允许开始作业');
    return;
  }

  const values = await formApi.getValues();
  loading.value = true;

  try {
    const id = await startOperation({
      workOrderId: scanResult.value.workOrderId!,
      vin: scanResult.value.vin!,
      operationId: scanResult.value.currentOperation?.operationId!,
      workstationId: values.workstationId,
    });
    recordId.value = id;
    message.success('作业已开始');

    // 触发成功事件
    emit('scan-success', {
      vin: scanResult.value.vin!,
      workOrderId: scanResult.value.workOrderId!,
      operationId: scanResult.value.currentOperation?.operationId!,
      workstationId: values.workstationId,
      operationName: scanResult.value.currentOperation?.operationName || '',
    });
  } catch (error) {
    message.error('开始作业失败');
  } finally {
    loading.value = false;
  }
}

/** 重置 */
function handleReset() {
  formApi.resetForm();
  scanResult.value = null;
  recordId.value = 0;
}
</script>

<template>
  <Loading :loading="loading">
    <!-- 扫码输入 -->
    <Card title="扫码作业" class="mb-4">
      <Form>
        <template #default>
          <div class="flex gap-2 mt-4">
            <Button block theme="primary" @click="handleScan">
              扫码识别
            </Button>
            <Button block theme="default" variant="outline" @click="handleReset">
              重置
            </Button>
          </div>
        </template>
      </Form>
    </Card>

    <!-- 扫码结果 -->
    <template v-if="scanResult">
      <!-- 基本信息卡片 -->
      <Card title="扫码结果" class="mb-4">
        <div class="mb-4">
          <Tag :theme="scanResult.success ? 'success' : 'danger'" size="large">
            {{ scanResult.scanTypeName }}
          </Tag>
          <span class="ml-2 text-gray-500">{{ scanResult.message }}</span>
        </div>

        <Descriptions :column="2" border size="small">
          <DescriptionsItem label="VIN码">{{ scanResult.vin || '-' }}</DescriptionsItem>
          <DescriptionsItem label="工单号">{{ scanResult.workOrderNo || '-' }}</DescriptionsItem>
          <DescriptionsItem label="产品名称" :span="2">{{ scanResult.productName || '-' }}</DescriptionsItem>
        </Descriptions>
      </Card>

      <!-- 当前工序信息 -->
      <Card v-if="scanResult.currentOperation" title="当前工序" class="mb-4">
        <Descriptions :column="1" border size="small">
          <DescriptionsItem label="工序名称">
            {{ scanResult.currentOperation.operationName }}
          </DescriptionsItem>
          <DescriptionsItem label="工序编码">
            {{ scanResult.currentOperation.operationCode }}
          </DescriptionsItem>
          <DescriptionsItem v-if="scanResult.currentOperation.operationGuide" label="作业指导">
            {{ scanResult.currentOperation.operationGuide }}
          </DescriptionsItem>
          <DescriptionsItem v-if="scanResult.currentOperation.torqueRequire" label="扭矩要求">
            {{ scanResult.currentOperation.torqueRequire }} N·m
          </DescriptionsItem>
        </Descriptions>

        <!-- 所需关键件 -->
        <div v-if="scanResult.currentOperation.requiredKeyParts?.length" class="mt-4">
          <div class="text-gray-600 font-medium mb-2">所需关键件</div>
          <div class="flex flex-wrap gap-2">
            <Tag
              v-for="part in scanResult.currentOperation.requiredKeyParts"
              :key="part.partCode"
              :theme="part.bound ? 'success' : 'default'"
              variant="light"
            >
              {{ part.partName }}
              <span v-if="part.required" class="text-red-500">*</span>
              <span v-if="part.bound" class="ml-1">(已绑定)</span>
            </Tag>
          </div>
        </div>
      </Card>

      <!-- 已绑定关键件 -->
      <Card v-if="scanResult.boundParts?.length" title="已绑定关键件" class="mb-4">
        <div class="space-y-2">
          <div
            v-for="part in scanResult.boundParts"
            :key="part.partSn"
            class="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <div>
              <div class="font-medium">{{ part.partName }}</div>
              <div class="text-sm text-gray-500">{{ part.partSn }}</div>
            </div>
            <Tag theme="success" variant="light" size="small">已绑定</Tag>
          </div>
        </div>
      </Card>

      <!-- 操作按钮 -->
      <Card>
        <Button
          block
          theme="primary"
          size="large"
          :disabled="!scanResult.canStart"
          @click="handleStart"
        >
          {{ scanResult.canStart ? '开始作业' : '当前不可开始' }}
        </Button>
      </Card>
    </template>

    <!-- 空状态 -->
    <Card v-else>
      <div class="text-center text-gray-400 py-8">
        请扫描VIN码或工单号开始作业
      </div>
    </Card>
  </Loading>
</template>

<style scoped>
:deep(.t-button) {
  min-height: 48px;
  font-size: 16px;
}

:deep(.t-input__inner) {
  font-size: 16px;
}
</style>