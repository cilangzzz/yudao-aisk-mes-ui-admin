<script lang="ts" setup>
import type { MesPrdlineApi } from '#/api/mes/basic/prdline';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/tdesign';
import {
  createProductionLine,
  getProductionLine,
  updateProductionLine,
} from '#/api/mes/basic/prdline';
import { getSimpleWorkshopList } from '#/api/mes/basic/workshop';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<MesPrdlineApi.ProductionLine>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['产线'])
    : $t('ui.actionTitle.create', ['产线']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
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
    const data = (await formApi.getValues()) as MesPrdlineApi.ProductionLine;
    // 处理车间名称
    if (data.workshopId) {
      const workshopList = await getSimpleWorkshopList();
      const workshop = workshopList.find((item) => item.id === data.workshopId);
      if (workshop) {
        data.workshopName = workshop.workshopName;
      }
    }
    try {
      await (formData.value?.id ? updateProductionLine(data) : createProductionLine(data));
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
    const data = modalApi.getData<MesPrdlineApi.ProductionLine>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getProductionLine(data.id);
      // 设置到 values
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>