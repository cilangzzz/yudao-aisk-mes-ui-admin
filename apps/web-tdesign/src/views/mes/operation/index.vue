<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MesOperationApi } from '#/api/mes/operation';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Tag } from 'tdesign-vue-next';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getOperationRecordPage, getVehicleProgress } from '#/api/mes/operation';

import { useGridColumns, useGridFormSchema } from './data';
import ScanPanel from './modules/scan-panel.vue';
import OperationPanel from './modules/operation-panel.vue';
import KeyPartList from './modules/key-part-list.vue';

const scanResult = ref<MesOperationApi.ScanResult | null>(null);
const currentVin = ref<string>('');
const currentWorkOrderId = ref<number>(0);

/** 处理扫码结果 */
function handleScanned(result: MesOperationApi.ScanResult) {
  scanResult.value = result;
  if (result.vin) {
    currentVin.value = result.vin;
    currentWorkOrderId.value = result.workOrderId || 0;
  }
}

/** 刷新数据 */
async function handleRefresh() {
  if (currentVin.value) {
    const progress = await getVehicleProgress(currentVin.value);
    // 更新扫描结果中的工序信息
    if (scanResult.value && scanResult.value.vinInfo) {
      scanResult.value.vinInfo.operations = progress.operations;
    }
  }
  gridApi.query();
}

/** 作业完成回调 */
function handleOperationComplete() {
  handleRefresh();
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
          return await getOperationRecordPage({
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
  } as VxeTableGridOptions<MesOperationApi.OperationRecord>,
});
</script>

<template>
  <Page auto-content-height>
    <div class="flex gap-4">
      <!-- 左侧：扫码和作业操作区 -->
      <div class="w-1/3 flex-shrink-0">
        <ScanPanel ref="scanPanelRef" @scanned="handleScanned" />
        <OperationPanel
          :scan-result="scanResult"
          @refresh="handleRefresh"
          @operation-complete="handleOperationComplete"
        />
        <KeyPartList
          v-if="currentVin"
          :vin="currentVin"
          :work-order-id="currentWorkOrderId"
          @refresh="handleRefresh"
        />
      </div>

      <!-- 右侧：作业记录列表 -->
      <div class="flex-1 min-w-0">
        <Grid table-title="作业记录">
          <template #status="{ row }">
            <Tag
              :theme="row.status === 1 ? 'success' : row.status === 2 ? 'danger' : 'warning'"
              variant="light"
            >
              {{ row.statusName }}
            </Tag>
          </template>
        </Grid>
      </div>
    </div>
  </Page>
</template>