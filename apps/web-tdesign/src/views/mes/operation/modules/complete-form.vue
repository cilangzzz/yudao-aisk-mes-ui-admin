<script lang="ts" setup>
import type { MesOperationApi } from '#/api/mes/operation';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/tdesign';
import { completeOperation } from '#/api/mes/operation';

import { useCompleteFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<{ recordId: number; vin?: string; workOrderId?: number }>();

const getTitle = computed(() => '完成作业');

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useCompleteFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const data = (await formApi.getValues()) as MesOperationApi.CompleteRequest;
    try {
      await completeOperation(data);
      await modalApi.close();
      emit('success');
      message.success('作业已完成');
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    // 加载数据
    const data = modalApi.getData<{ recordId: number; vin?: string; workOrderId?: number }>();
    if (data) {
      formData.value = data;
      await formApi.setValues({ recordId: data.recordId });
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-1/2">
    <Form class="mx-4" />
  </Modal>
</template>