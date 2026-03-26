<script lang="ts" setup>
import type { MesMobileApi } from '#/api/mes/mobile';

import { ref, computed } from 'vue';

import { Card, Button, Tag, List, ListItem, Dialog, Loading } from 'tdesign-vue-next';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { message } from '#/adapter/tdesign';
import { bindKeyPart, completeOperation } from '#/api/mes/mobile';

import { useKeyPartFormSchema, useCompleteFormSchema, OPERATION_RESULT_OPTIONS } from '../data';

const props = defineProps<{
  scanData: {
    vin?: string;
    workOrderId?: number;
    operationId?: number;
    workstationId?: number;
    recordId?: number;
    operationName?: string;
  };
}>();

const emit = defineEmits<{
  'bind-success': [recordId: number];
  'complete': [];
  'report-exception': [];
}>();

const loading = ref(false);
const boundParts = ref<MesMobileApi.BoundPart[]>([]);

/** 完成作业弹窗 */
const [CompleteModal, completeModalApi] = useVbenModal({
  connectedComponent: CompleteForm,
  destroyOnClose: true,
});

/** 绑定关键件表单 */
const [KeyPartForm, keyPartFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 100,
  },
  layout: 'vertical',
  schema: useKeyPartFormSchema(),
  showDefaultActions: false,
});

/** 完成作业表单 */
const [CompleteForm, completeFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 100,
  },
  layout: 'vertical',
  schema: useCompleteFormSchema(),
  showDefaultActions: false,
});

/** 扫描关键件 */
async function handleScanPart() {
  const { valid } = await keyPartFormApi.validate();
  if (!valid) return;

  const values = await keyPartFormApi.getValues();
  loading.value = true;

  try {
    await bindKeyPart({
      workOrderId: props.scanData.workOrderId!,
      vin: props.scanData.vin!,
      operationRecordId: props.scanData.recordId,
      partSn: values.partSn,
      partCode: values.partCode || '',
      partName: values.partName || '',
    });

    message.success('关键件绑定成功');

    // 添加到已绑定列表
    boundParts.value.push({
      partCode: values.partCode || '',
      partName: values.partName || '',
      partSn: values.partSn,
      bindTime: new Date().toISOString(),
    });

    // 清空表单
    keyPartFormApi.resetForm();
  } catch (error) {
    message.error('绑定失败');
  } finally {
    loading.value = false;
  }
}

/** 打开完成作业弹窗 */
function openCompleteModal() {
  completeFormApi.resetForm();
  completeFormApi.setValues({
    recordId: props.scanData.recordId,
    result: 0,
  });
  completeModalApi.open();
}

/** 提交完成作业 */
async function handleComplete() {
  const { valid } = await completeFormApi.validate();
  if (!valid) return;

  const values = await completeFormApi.getValues();
  loading.value = true;

  try {
    await completeOperation({
      recordId: values.recordId,
      result: values.result,
      torqueValue: values.torqueValue,
      torqueResult: values.torqueResult,
      remark: values.remark,
    });

    message.success('作业完成');
    completeModalApi.close();
    emit('complete');
  } catch (error) {
    message.error('完成作业失败');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Loading :loading="loading">
    <!-- 作业信息 -->
    <Card class="mb-4">
      <div class="flex justify-between items-center">
        <div>
          <div class="text-gray-500 text-sm">当前工序</div>
          <div class="font-medium text-lg">{{ scanData.operationName }}</div>
        </div>
        <Tag v-if="scanData.recordId" theme="success" variant="light">
          作业中
        </Tag>
      </div>
      <div class="mt-2 text-gray-500 text-sm">
        VIN: {{ scanData.vin }}
      </div>
    </Card>

    <!-- 关键件绑定 -->
    <Card title="关键件绑定" class="mb-4">
      <KeyPartForm>
        <template #default>
          <Button block theme="primary" class="mt-4" @click="handleScanPart">
            扫描绑定
          </Button>
        </template>
      </KeyPartForm>
    </Card>

    <!-- 已绑定列表 -->
    <Card v-if="boundParts.length > 0" title="已绑定关键件" class="mb-4">
      <List :split="true">
        <ListItem v-for="part in boundParts" :key="part.partSn">
          <div class="flex justify-between items-center w-full">
            <div>
              <div class="font-medium">{{ part.partName }}</div>
              <div class="text-sm text-gray-500">{{ part.partSn }}</div>
            </div>
            <Tag theme="success" variant="light" size="small">已绑定</Tag>
          </div>
        </ListItem>
      </List>
    </Card>

    <!-- 完成作业 -->
    <Card>
      <Button block theme="success" size="large" @click="openCompleteModal">
        完成作业
      </Button>
    </Card>

    <!-- 完成作业弹窗 -->
    <CompleteModal title="完成作业" @confirm="handleComplete">
      <CompleteForm class="p-4" />
    </CompleteModal>
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