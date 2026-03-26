<script lang="ts" setup>
import type { MesOperationApi } from '#/api/mes/operation';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/tdesign';
import { bindKeyPart } from '#/api/mes/operation';

import { useKeyPartFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<{ vin: string; workOrderId: number }>();

const getTitle = computed(() => '绑定关键件');

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useKeyPartFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const data = (await formApi.getValues()) as MesOperationApi.BindPartRequest;
    // 设置VIN和工单ID
    if (formData.value) {
      data.vin = formData.value.vin;
      data.workOrderId = formData.value.workOrderId;
    }
    try {
      await bindKeyPart(data);
      await modalApi.close();
      emit('success');
      message.success('关键件绑定成功');
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
    const data = modalApi.getData<{ vin: string; workOrderId: number }>();
    if (data) {
      formData.value = data;
      await formApi.setValues({
        vin: data.vin,
        workOrderId: data.workOrderId,
      });
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-1/2">
    <Form class="mx-4" />
  </Modal>
</template>