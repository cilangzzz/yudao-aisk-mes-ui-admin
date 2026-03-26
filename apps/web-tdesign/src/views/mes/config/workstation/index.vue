<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MesWorkstationApi } from '#/api/mes/config/workstation';

import { ref } from 'vue';

import { confirm, Page, useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictLabel } from '@vben/hooks';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { message } from '#/adapter/tdesign';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteWorkstation,
  disableWorkstation,
  enableWorkstation,
  exportWorkstation,
  getWorkstationPage,
} from '#/api/mes/config/workstation';
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
  const data = await exportWorkstation(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '工作站管理.xls', source: data });
}

/** 创建工作站 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑工作站 */
function handleEdit(row: MesWorkstationApi.Workstation) {
  formModalApi.setData(row).open();
}

/** 删除工作站 */
async function handleDelete(row: MesWorkstationApi.Workstation) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.workstationName]),
    duration: 0,
  });
  try {
    await deleteWorkstation(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.workstationName]));
    handleRefresh();
  } finally {
    message.close(hideLoading);
  }
}

/** 批量删除工作站 */
async function handleDeleteBatch() {
  await confirm($t('ui.actionMessage.deleteBatchConfirm'));
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deletingBatch'),
    duration: 0,
  });
  try {
    for (const id of checkedIds.value) {
      await deleteWorkstation(id);
    }
    checkedIds.value = [];
    message.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } finally {
    message.close(hideLoading);
  }
}

/** 启停状态切换 */
async function handleStatusChange(
  newStatus: number,
  row: MesWorkstationApi.Workstation,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    confirm({
      content: `确定要将【${row.workstationName}】的状态切换为【${getDictLabel(DICT_TYPE.COMMON_STATUS, newStatus)}】吗？`,
    })
      .then(async () => {
        await (newStatus === 0
          ? enableWorkstation(row.id!)
          : disableWorkstation(row.id!));
        message.success($t('ui.actionMessage.operationSuccess'));
        resolve(true);
      })
      .catch(() => {
        reject(new Error('取消操作'));
      });
  });
}

const checkedIds = ref<number[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: MesWorkstationApi.Workstation[];
}) {
  checkedIds.value = records.map((item) => item.id!);
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(handleStatusChange),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getWorkstationPage({
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
  } as VxeTableGridOptions<MesWorkstationApi.Workstation>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleRefresh" />
    <Grid table-title="工作站列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['工作站']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['mes:workstation:create'],
              onClick: handleCreate,
            },
            {
              label: $t('ui.actionTitle.export'),
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              auth: ['mes:workstation:export'],
              onClick: handleExport,
            },
            {
              label: $t('ui.actionTitle.deleteBatch'),
              type: 'danger',
              icon: ACTION_ICON.DELETE,
              disabled: isEmpty(checkedIds),
              auth: ['mes:workstation:delete'],
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
              auth: ['mes:workstation:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              variant: 'text',
              type: 'danger',
              icon: ACTION_ICON.DELETE,
              auth: ['mes:workstation:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.workstationName]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>