<script lang="ts" setup>
import { ref, watch } from 'vue';

import { Button, Card } from 'tdesign-vue-next';

import { useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getKeyPartList } from '#/api/mes/operation';

import { useKeyPartGridColumns } from '../data';
import KeyPartForm from './key-part-form.vue';

const props = defineProps<{
  vin: string;
  workOrderId: number;
}>();

const emit = defineEmits(['refresh']);

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: KeyPartForm,
  destroyOnClose: true,
});

const loading = ref(false);

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useKeyPartGridColumns(),
    height: 200,
    data: [],
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
  },
});

async function loadData() {
  if (!props.vin) return;
  loading.value = true;
  try {
    const data = await getKeyPartList(props.vin);
    gridApi.grid?.loadData(data);
  } finally {
    loading.value = false;
  }
}

// 监听VIN变化
watch(
  () => props.vin,
  () => {
    loadData();
  },
  { immediate: true },
);

// 绑定关键件
function handleBind() {
  formModalApi.setData({
    vin: props.vin,
    workOrderId: props.workOrderId,
  }).open();
}

function handleSuccess() {
  loadData();
  emit('refresh');
}
</script>

<template>
  <Card title="关键件绑定" class="mb-4">
    <template #actions>
      <Button size="small" theme="primary" @click="handleBind">
        绑定关键件
      </Button>
    </template>
    <Grid :loading="loading" />
    <FormModal @success="handleSuccess" />
  </Card>
</template>