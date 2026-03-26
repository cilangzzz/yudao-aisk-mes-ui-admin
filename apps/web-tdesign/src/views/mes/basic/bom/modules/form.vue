<script lang="ts" setup>
import type { MesBomApi } from '#/api/mes/basic/bom';
import type { MesProductApi } from '#/api/mes/basic/product';

import { computed, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/tdesign';
import { createBom, getBom, updateBom } from '#/api/mes/basic/bom';
import { getProductSimpleList } from '#/api/mes/basic/product';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<MesBomApi.Bom>();
const productOptions = ref<MesProductApi.Product[]>([]);

const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['BOM'])
    : $t('ui.actionTitle.create', ['BOM']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

// 监听产品选择变化，自动填充产品编码
watch(
  () => formApi.form?.values?.productId,
  async (newProductId) => {
    if (newProductId && productOptions.value.length > 0) {
      const selectedProduct = productOptions.value.find(
        (p) => p.id === newProductId,
      );
      if (selectedProduct) {
        await formApi.setValues({
          productCode: selectedProduct.productCode,
        });
      }
    }
  },
);

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    // 提交表单
    const data = (await formApi.getValues()) as MesBomApi.Bom;
    try {
      await (formData.value?.id ? updateBom(data) : createBom(data));
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
    // 加载产品列表
    try {
      productOptions.value = await getProductSimpleList();
    } catch (e) {
      console.error('加载产品列表失败', e);
    }
    // 加载数据
    const data = modalApi.getData<MesBomApi.Bom>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getBom(data.id);
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