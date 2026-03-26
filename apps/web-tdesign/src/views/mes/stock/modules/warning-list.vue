<script lang="ts" setup>
import { ref } from 'vue';

import { Button, Card } from 'tdesign-vue-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getWarningList } from '#/api/mes/stock';

import { useWarningGridColumns } from '../data';

const visible = ref(false);
const loading = ref(false);

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useWarningGridColumns(),
    height: 300,
    data: [],
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
  },
});

async function loadData() {
  loading.value = true;
  try {
    const data = await getWarningList();
    gridApi.grid?.loadData(data);
  } finally {
    loading.value = false;
  }
}

function open() {
  visible.value = true;
  loadData();
}

function close() {
  visible.value = false;
}

defineExpose({ open, close });
</script>

<template>
  <Card
    v-if="visible"
    title="缺料预警"
    class="mb-4"
    :bordered="true"
  >
    <template #actions>
      <Button variant="text" size="small" @click="close">关闭</Button>
    </template>
    <Grid :loading="loading" />
  </Card>
</template>