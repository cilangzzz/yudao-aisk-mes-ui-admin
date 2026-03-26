<script lang="ts" setup>
import type { MesStockApi } from '#/api/mes/stock';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/tdesign';
import { consumeStock } from '#/api/mes/stock';

import { useConsumeFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<MesStockApi.ConsumeRequest>();

const getTitle = computed(() => '物料消耗');

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useConsumeFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const data = (await formApi.getValues()) as MesStockApi.ConsumeRequest;
    try {
      await consumeStock(data);
      await modalApi.close();
      emit('success');
      message.success('消耗记录成功');
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    // 重置表单
    await formApi.resetForm();
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-1/2">
    <Form class="mx-4" />
  </Modal>
</template>