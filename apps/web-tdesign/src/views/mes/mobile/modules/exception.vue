<script lang="ts" setup>
import type { MesMobileApi } from '#/api/mes/mobile';

import { ref } from 'vue';

import { Card, Button, Loading } from 'tdesign-vue-next';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { message } from '#/adapter/tdesign';
import { reportException } from '#/api/mes/mobile';

import { useExceptionFormSchema } from '../data';

const props = defineProps<{
  scanData: {
    vin?: string;
    workOrderId?: number;
    operationId?: number;
    workstationId?: number;
    recordId?: number;
  };
}>();

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

const loading = ref(false);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 100,
  },
  layout: 'vertical',
  schema: useExceptionFormSchema(),
  showDefaultActions: false,
});

/** 初始化表单数据 */
function initForm() {
  formApi.setValues({
    vin: props.scanData.vin,
    workOrderId: props.scanData.workOrderId,
    operationId: props.scanData.operationId,
    workstationId: props.scanData.workstationId,
  });
}

/** 提交异常上报 */
async function handleSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) return;

  const values = await formApi.getValues();
  loading.value = true;

  try {
    await reportException({
      vin: values.vin,
      workOrderId: values.workOrderId,
      operationId: values.operationId,
      workstationId: values.workstationId,
      exceptionReason: values.exceptionReason,
      exceptionDesc: values.exceptionDesc,
      imageUrls: values.imageUrls ? values.imageUrls.split(',').map((s: string) => s.trim()) : [],
    });

    message.success('异常上报成功');
    emit('success');
  } catch (error) {
    message.error('上报失败');
  } finally {
    loading.value = false;
  }
}

/** 取消 */
function handleCancel() {
  emit('cancel');
}

// 初始化
initForm();
</script>

<template>
  <Loading :loading="loading">
    <Card title="异常上报" class="mb-4">
      <div class="mb-4 p-3 bg-yellow-50 rounded text-yellow-700 text-sm">
        <div class="font-medium mb-1">异常信息</div>
        <div>VIN: {{ scanData.vin }}</div>
        <div>工单ID: {{ scanData.workOrderId }}</div>
      </div>

      <Form>
        <template #default>
          <div class="flex gap-2 mt-4">
            <Button block theme="danger" @click="handleSubmit">
              提交上报
            </Button>
            <Button block theme="default" variant="outline" @click="handleCancel">
              取消
            </Button>
          </div>
        </template>
      </Form>
    </Card>

    <!-- 提示信息 -->
    <Card>
      <div class="text-gray-500 text-sm">
        <div class="font-medium mb-2">上报说明</div>
        <ul class="list-disc list-inside space-y-1">
          <li>请详细描述异常情况</li>
          <li>如有现场照片请一并上传</li>
          <li>上报后将通知相关人员进行处理</li>
        </ul>
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

:deep(.t-textarea__inner) {
  font-size: 16px;
}
</style>