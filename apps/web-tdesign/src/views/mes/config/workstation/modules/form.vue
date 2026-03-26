<script lang="ts" setup>
import type { MesWorkstationApi } from '#/api/mes/config/workstation';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/tdesign';
import {
  createWorkstation,
  getWorkstation,
  updateWorkstation,
} from '#/api/mes/config/workstation';
import { getSimpleProductionLineList } from '#/api/mes/basic/prdline';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<MesWorkstationApi.Workstation>();

const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['工作站'])
    : $t('ui.actionTitle.create', ['工作站']);
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
    const data = (await formApi.getValues()) as MesWorkstationApi.Workstation;
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
        ? updateWorkstation(data)
        : createWorkstation(data));
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
    const data = modalApi.getData<MesWorkstationApi.Workstation>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getWorkstation(data.id);
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