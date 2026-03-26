<script lang="ts" setup>
import type { MesRoutingApi } from '#/api/mes/config/routing';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/tdesign';
import {
  createRouting,
  getRouting,
  updateRouting,
} from '#/api/mes/config/routing';
import { getProductSimpleList } from '#/api/mes/basic/product';
import { $t } from '#/locales';

import { useFormSchema } from '../data';
import OperationList from './operation-list.vue';

const emit = defineEmits(['success']);
const formData = ref<MesRoutingApi.Routing>();
const operationListRef = ref<InstanceType<typeof OperationList>>();

const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['工艺路线'])
    : $t('ui.actionTitle.create', ['工艺路线']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
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
    const data = (await formApi.getValues()) as MesRoutingApi.Routing;
    // 处理产品名称
    if (data.productId) {
      const productList = await getProductSimpleList();
      const product = productList.find((item) => item.id === data.productId);
      if (product) {
        data.productCode = product.productCode;
        data.productName = product.productName;
      }
    }
    // 获取工序列表数据
    data.operations = operationListRef.value?.getData();
    try {
      await (formData.value?.id ? updateRouting(data) : createRouting(data));
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
    const data = modalApi.getData<MesRoutingApi.Routing>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getRouting(data.id);
      // 设置到 values
      await formApi.setValues(formData.value);
      // 加载工序列表
      if (formData.value.operations) {
        await operationListRef.value?.loadData(formData.value.operations);
      }
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-2/3">
    <Form class="mx-4" />
    <div class="mx-4 mt-4">
      <div class="mb-2 text-base font-medium">工序列表</div>
      <OperationList ref="operationListRef" />
    </div>
  </Modal>
</template>