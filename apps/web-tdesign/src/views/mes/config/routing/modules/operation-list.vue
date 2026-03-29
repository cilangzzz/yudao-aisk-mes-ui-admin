<script lang="ts" setup>
import type { MesRoutingApi } from '#/api/mes/config/routing';

import { onMounted, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { Button, Input, InputNumber, Select } from 'tdesign-vue-next';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSimpleWorkstationList } from '#/api/mes/config/workstation';
import { $t } from '#/locales';

import { useOperationGridColumns } from '../data';

const workstationOptions = ref<{ id: number; workstationName: string }[]>([]);

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useOperationGridColumns(),
    border: true,
    showOverflow: true,
    autoResize: true,
    keepSource: true,
    rowConfig: { keyField: 'id' },
    pagerConfig: { enabled: false },
    toolbarConfig: { enabled: false },
  },
});

/** 添加工序 */
async function handleAdd() {
  const data = gridApi.grid.getData() as MesRoutingApi.Operation[];
  const newSequence =
    data.length > 0
      ? Math.max(...data.map((d) => d.sequence || 0)) + 1
      : 1;
  await gridApi.grid.insertAt(
    {
      sequence: newSequence,
      operationCode: '',
      operationName: '',
    } as MesRoutingApi.Operation,
    -1,
  );
}

/** 删除工序 */
async function handleDelete(row: MesRoutingApi.Operation) {
  await gridApi.grid.remove(row);
}

/** 获取表格数据 */
function getData(): MesRoutingApi.Operation[] {
  // 使用 getTableData().fullData 获取所有数据（包括新增未提交的记录）
  const tableData = gridApi.grid.getTableData();
  const data = tableData.fullData as MesRoutingApi.Operation[];
  const removeRecords = gridApi.grid.getRemoveRecords() as MesRoutingApi.Operation[];
  return data
    .filter((row) => !removeRecords.some((removed) => removed.id === row.id))
    .map((row) => {
      // 过滤掉临时 id（新增记录的临时 id 是字符串，如 "row_xxx"）
      const id = typeof row.id === 'number' ? row.id : undefined;
      return { ...row, id };
    });
}

/** 加载表格数据 */
async function loadData(data: MesRoutingApi.Operation[]) {
  await gridApi.grid.loadData(data);
}

/** 加载工作站选项 */
async function loadWorkstationOptions() {
  workstationOptions.value = await getSimpleWorkstationList();
}

/** 暴露方法给父组件 */
defineExpose({
  getData,
  loadData,
});

onMounted(() => {
  loadWorkstationOptions();
});
</script>

<template>
  <div>
    <Grid class="mx-4">
      <template #sequence="{ row }">
        <InputNumber
          v-model="row.sequence"
          :min="1"
          theme="normal"
          style="width: 60px"
        />
      </template>
      <template #operationCode="{ row }">
        <Input v-model="row.operationCode" placeholder="请输入工序编码" />
      </template>
      <template #operationName="{ row }">
        <Input v-model="row.operationName" placeholder="请输入工序名称" />
      </template>
      <template #workstationId="{ row }">
        <Select
          v-model="row.workstationId"
          :options="
            workstationOptions.map((w) => ({
              label: w.workstationName,
              value: w.id,
            }))
          "
          placeholder="请选择工作站"
          clearable
        />
      </template>
      <template #standardTime="{ row }">
        <InputNumber
          v-model="row.standardTime"
          :min="0"
          theme="normal"
          style="width: 80px"
        />
      </template>
      <template #description="{ row }">
        <Input v-model="row.description" placeholder="请输入描述" />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.delete'),
              type: 'danger',
              variant: 'text',
              icon: ACTION_ICON.DELETE,
              popConfirm: {
                title: '确定删除该工序吗？',
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
    <div class="-mt-4 flex justify-center">
      <Button theme="primary" ghost @click="handleAdd">
        <template #icon>
          <IconifyIcon icon="lucide:plus" />
        </template>
        添加工序
      </Button>
    </div>
  </div>
</template>