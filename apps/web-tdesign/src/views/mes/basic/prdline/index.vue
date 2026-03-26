<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MesPrdlineApi } from '#/api/mes/basic/prdline';

import { ref } from 'vue';

import { confirm, Page, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { message } from '#/adapter/tdesign';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteProductionLine,
  exportProductionLine,
  getProductionLinePage,
} from '#/api/mes/basic/prdline';
import { $t } from '#/locales';

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

/** 导出表格 */
async function handleExport() {
  const data = await exportProductionLine(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '产线管理.xls', source: data });
}

/** 创建产线 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑产线 */
function handleEdit(row: MesPrdlineApi.ProductionLine) {
  formModalApi.setData(row).open();
}

/** 删除产线 */
async function handleDelete(row: MesPrdlineApi.ProductionLine) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.lineName]),
    duration: 0,
  });
  try {
    await deleteProductionLine(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.lineName]));
    handleRefresh();
  } finally {
    message.close(hideLoading);
  }
}

/** 批量删除产线 */
async function handleDeleteBatch() {
  await confirm($t('ui.actionMessage.deleteBatchConfirm'));
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deletingBatch'),
    duration: 0,
  });
  try {
    for (const id of checkedIds.value) {
      await deleteProductionLine(id);
    }
    checkedIds.value = [];
    message.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } finally {
    message.close(hideLoading);
  }
}

const checkedIds = ref<number[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: MesPrdlineApi.ProductionLine[];
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
          return await getProductionLinePage({
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
  } as VxeTableGridOptions<MesPrdlineApi.ProductionLine>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleRefresh" />
    <Grid table-title="产线列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['产线']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['mes:production-line:create'],
              onClick: handleCreate,
            },
            {
              label: $t('ui.actionTitle.export'),
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              auth: ['mes:production-line:export'],
              onClick: handleExport,
            },
            {
              label: $t('ui.actionTitle.deleteBatch'),
              type: 'danger',
              icon: ACTION_ICON.DELETE,
              disabled: isEmpty(checkedIds),
              auth: ['mes:production-line:delete'],
              onClick: handleDeleteBatch,
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
              auth: ['mes:production-line:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              variant: 'text',
              type: 'danger',
              icon: ACTION_ICON.DELETE,
              auth: ['mes:production-line:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.lineName]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>