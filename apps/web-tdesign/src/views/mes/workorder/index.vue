<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MesWorkOrderApi } from '#/api/mes/workorder';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from '#/adapter/tdesign';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  closeWorkOrder,
  completeWorkOrder,
  deleteWorkOrder,
  exportWorkOrder,
  getWorkOrderPage,
  releaseWorkOrder,
  startWorkOrder,
} from '#/api/mes/workorder';
import { $t } from '#/locales';
import { downloadFileFromBlobPart } from '@vben/utils';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建工单 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑工单 */
function handleEdit(row: MesWorkOrderApi.WorkOrder) {
  formModalApi.setData(row).open();
}

/** 删除工单 */
async function handleDelete(row: MesWorkOrderApi.WorkOrder) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.orderNo]),
    duration: 0,
  });
  try {
    await deleteWorkOrder(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.orderNo]));
    handleRefresh();
  } finally {
    message.close(hideLoading);
  }
}

/** 下发工单 */
async function handleRelease(row: MesWorkOrderApi.WorkOrder) {
  const hideLoading = message.loading({
    content: '正在下发...',
    duration: 0,
  });
  try {
    await releaseWorkOrder(row.id!);
    message.success('下发成功');
    handleRefresh();
  } finally {
    message.close(hideLoading);
  }
}

/** 开始生产 */
async function handleStart(row: MesWorkOrderApi.WorkOrder) {
  const hideLoading = message.loading({
    content: '正在开始生产...',
    duration: 0,
  });
  try {
    await startWorkOrder(row.id!);
    message.success('开始生产成功');
    handleRefresh();
  } finally {
    message.close(hideLoading);
  }
}

/** 完成工单 */
async function handleComplete(row: MesWorkOrderApi.WorkOrder) {
  const hideLoading = message.loading({
    content: '正在完成工单...',
    duration: 0,
  });
  try {
    await completeWorkOrder(row.id!);
    message.success('工单已完成');
    handleRefresh();
  } finally {
    message.close(hideLoading);
  }
}

/** 关闭工单 */
async function handleClose(row: MesWorkOrderApi.WorkOrder) {
  const hideLoading = message.loading({
    content: '正在关闭工单...',
    duration: 0,
  });
  try {
    await closeWorkOrder(row.id!);
    message.success('工单已关闭');
    handleRefresh();
  } finally {
    message.close(hideLoading);
  }
}

/** 导出工单 */
async function handleExport() {
  const hideLoading = message.loading({
    content: '正在导出...',
    duration: 0,
  });
  try {
    const formValues = await gridApi.formApi?.getValues?.();
    const data = await exportWorkOrder(formValues);
    downloadFileFromBlobPart({ fileName: '生产工单.xls', source: data });
  } finally {
    message.close(hideLoading);
  }
}

const checkedIds = ref<number[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: MesWorkOrderApi.WorkOrder[];
}) {
  checkedIds.value = records.map((item) => item.id!);
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
          return await getWorkOrderPage({
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
  } as VxeTableGridOptions<MesWorkOrderApi.WorkOrder>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleRefresh" />
    <Grid table-title="生产工单列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['工单']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['mes:work-order:create'],
              onClick: handleCreate,
            },
            {
              label: $t('ui.actionTitle.export'),
              icon: ACTION_ICON.DOWNLOAD,
              auth: ['mes:work-order:export'],
              onClick: handleExport,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              variant: 'text',
              icon: ACTION_ICON.EDIT,
              auth: ['mes:work-order:update'],
              ifShow: () => row.status === 0,
              onClick: handleEdit.bind(null, row),
            },
            {
              label: '下发',
              variant: 'text',
              type: 'success',
              auth: ['mes:work-order:operate'],
              ifShow: () => row.status === 0,
              popConfirm: {
                title: '确定下发该工单吗？',
                confirm: handleRelease.bind(null, row),
              },
            },
            {
              label: '开始',
              variant: 'text',
              type: 'success',
              auth: ['mes:work-order:operate'],
              ifShow: () => row.status === 1,
              popConfirm: {
                title: '确定开始生产吗？',
                confirm: handleStart.bind(null, row),
              },
            },
            {
              label: '完成',
              variant: 'text',
              type: 'success',
              auth: ['mes:work-order:operate'],
              ifShow: () => row.status === 2,
              popConfirm: {
                title: '确定完成该工单吗？',
                confirm: handleComplete.bind(null, row),
              },
            },
            {
              label: '关闭',
              variant: 'text',
              type: 'warning',
              auth: ['mes:work-order:operate'],
              ifShow: () => row.status === 0 || row.status === 1 || row.status === 2,
              popConfirm: {
                title: '确定关闭该工单吗？',
                confirm: handleClose.bind(null, row),
              },
            },
            {
              label: $t('common.delete'),
              variant: 'text',
              type: 'danger',
              icon: ACTION_ICON.DELETE,
              auth: ['mes:work-order:delete'],
              ifShow: () => row.status === 0,
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.orderNo]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
