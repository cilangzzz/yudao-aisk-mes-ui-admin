<script lang="ts" setup>
import type { MesWorkOrderApi } from '#/api/mes/workorder';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/tdesign';
import {
  createWorkOrder,
  getWorkOrder,
  updateWorkOrder,
} from '#/api/mes/workorder';
import { getProductSimpleList } from '#/api/mes/basic/product';
import { getRoutingSimpleList } from '#/api/mes/config/routing';
import { getSimpleProductionLineList } from '#/api/mes/basic/prdline';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<MesWorkOrderApi.WorkOrder>();

const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['生产工单'])
    : $t('ui.actionTitle.create', ['生产工单']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    // 提交表单
    const data = (await formApi.getValues()) as MesWorkOrderApi.WorkOrder;
    // 处理产品信息
    if (data.productId) {
      const productList = await getProductSimpleList();
      const product = productList.find((item) => item.id === data.productId);
      if (product) {
        data.productCode = product.productCode!;
        data.productName = product.productName!;
      }
    }
    // 处理工艺路线名称
    if (data.routingId) {
      const routingList = await getRoutingSimpleList();
      const routing = routingList.find((item) => item.id === data.routingId);
      if (routing) {
        data.routingName = routing.routingName;
      }
    }
    // 处理产线名称
    if (data.lineId) {
      const lineList = await getSimpleProductionLineList();
      const line = lineList.find((item) => item.id === data.lineId);
      if (line) {
        data.lineName = line.lineName;
      }
    }
    try {
      await (formData.value?.id
        ? updateWorkOrder(data)
        : createWorkOrder(data));
      // 关闭并提示
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
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
    const data = modalApi.getData<MesWorkOrderApi.WorkOrder>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getWorkOrder(data.id);
      // 设置到 values
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-1/2">
    <Form class="mx-4" />
  </Modal>
</template>