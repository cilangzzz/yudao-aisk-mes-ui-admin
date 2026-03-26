<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MesTeamApi } from '#/api/mes/basic/team';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from '#/adapter/tdesign';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteTeam, getTeamPage } from '#/api/mes/basic/team';
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

/** 创建班组 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑班组 */
function handleEdit(row: MesTeamApi.Team) {
  formModalApi.setData(row).open();
}

/** 删除班组 */
async function handleDelete(row: MesTeamApi.Team) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.teamName]),
    duration: 0,
  });
  try {
    await deleteTeam(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.teamName]));
    handleRefresh();
  } finally {
    message.close(hideLoading);
  }
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
          return await getTeamPage({
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
  } as VxeTableGridOptions<MesTeamApi.Team>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleRefresh" />
    <Grid table-title="班组列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['班组']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['mes:team:create'],
              onClick: handleCreate,
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
              auth: ['mes:team:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              variant: 'text',
              type: 'danger',
              icon: ACTION_ICON.DELETE,
              auth: ['mes:team:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.teamName]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>