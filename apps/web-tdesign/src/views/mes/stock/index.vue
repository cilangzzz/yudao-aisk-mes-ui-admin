<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MesStockApi } from '#/api/mes/stock';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Tag } from 'tdesign-vue-next';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getStockPage } from '#/api/mes/stock';

import { useGridColumns, useGridFormSchema } from './data';
import StockIn from './modules/stock-in.vue';
import Consume from './modules/consume.vue';
import WarningList from './modules/warning-list.vue';

const [StockInModal, stockInModalApi] = useVbenModal({
  connectedComponent: StockIn,
  destroyOnClose: true,
});

const [ConsumeModal, consumeModalApi] = useVbenModal({
  connectedComponent: Consume,
  destroyOnClose: true,
});

const warningListRef = ref<InstanceType<typeof WarningList>>();

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 入库 */
function handleStockIn() {
  stockInModalApi.open();
}

/** 消耗 */
function handleConsume() {
  consumeModalApi.open();
}

/** 查看缺料预警 */
function handleShowWarning() {
  warningListRef.value?.open();
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getStockPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<MesStockApi.Stock>,
});
</script>

<template>
  <Page auto-content-height>
    <StockInModal @success="handleRefresh" />
    <ConsumeModal @success="handleRefresh" />
    <Grid table-title="线边库存列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '入库',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['mes:stock:update'],
              onClick: handleStockIn,
            },
            {
              label: '消耗',
              icon: ACTION_ICON.EDIT,
              auth: ['mes:stock:update'],
              onClick: handleConsume,
            },
            {
              label: '缺料预警',
              type: 'warning',
              auth: ['mes:stock:query'],
              onClick: handleShowWarning,
            },
          ]"
        />
      </template>
      <template #warning="{ row }">
        <Tag :theme="row.warning ? 'danger' : 'success'" variant="light">
          {{ row.warning ? '缺料' : '正常' }}
        </Tag>
      </template>
    </Grid>
    <WarningList ref="warningListRef" />
  </Page>
</template>