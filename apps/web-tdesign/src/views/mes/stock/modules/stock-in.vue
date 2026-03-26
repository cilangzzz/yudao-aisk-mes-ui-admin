<script lang="ts" setup>
import type { MesStockApi } from '#/api/mes/stock';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/tdesign';
import { stockIn } from '#/api/mes/stock';
import { getSimpleWorkstationList } from '#/api/mes/config/workstation';

import { useStockInFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<MesStockApi.StockInRequest>();

const getTitle = computed(() => '物料入库');

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useStockInFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const data = (await formApi.getValues()) as MesStockApi.StockInRequest;
    // 处理工位名称
    if (data.workstationId) {
      const workstationList = await getSimpleWorkstationList();
      const workstation = workstationList.find(
        (item) => item.id === data.workstationId,
      );
      if (workstation) {
        // 不需要额外处理，后端会自动填充
      }
    }
    try {
      await stockIn(data);
      await modalApi.close();
      emit('success');
      message.success('入库成功');
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