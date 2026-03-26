<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MesWorkshopApi } from '#/api/mes/basic/workshop';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from '#/adapter/tdesign';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteWorkshop, getWorkshopList } from '#/api/mes/basic/workshop';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 切换树形展开/收缩状态 */
const isExpanded = ref(true);
function handleExpand() {
  isExpanded.value = !isExpanded.value;
  gridApi.grid.setAllTreeExpand(isExpanded.value);
}

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建车间 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 添加下级车间 */
function handleAppend(row: MesWorkshopApi.Workshop) {
  formModalApi.setData({ parentId: row.id }).open();
}

/** 编辑车间 */
function handleEdit(row: MesWorkshopApi.Workshop) {
  formModalApi.setData(row).open();
}

/** 删除车间 */
async function handleDelete(row: MesWorkshopApi.Workshop) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.workshopName]),
    duration: 0,
  });
  try {
    await deleteWorkshop(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.workshopName]));
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
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async (_, formValues) => {
          let data = await getWorkshopList();
          // 前端过滤搜索条件
          if (formValues) {
            if (formValues.workshopCode) {
              data = data.filter((item) =>
                item.workshopCode.includes(formValues.workshopCode),
              );
            }
            if (formValues.workshopName) {
              data = data.filter((item) =>
                item.workshopName.includes(formValues.workshopName),
              );
            }
            if (formValues.status !== undefined && formValues.status !== null) {
              data = data.filter((item) => item.status === formValues.status);
            }
          }
          return data;
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
    treeConfig: {
      parentField: 'parentId',
      rowField: 'id',
      transform: true,
      expandAll: true,
      reserve: true,
    },
  } as VxeTableGridOptions<MesWorkshopApi.Workshop>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleRefresh" />
    <Grid table-title="车间列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['车间']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['mes:workshop:create'],
              onClick: handleCreate,
            },
            {
              label: isExpanded ? '收缩' : '展开',
              type: 'primary',
              onClick: handleExpand,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '新增下级',
              type: 'primary',
              variant: 'text',
              icon: ACTION_ICON.ADD,
              auth: ['mes:workshop:create'],
              onClick: handleAppend.bind(null, row),
            },
            {
              label: $t('common.edit'),
              type: 'primary',
              variant: 'text',
              icon: ACTION_ICON.EDIT,
              auth: ['mes:workshop:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'danger',
              variant: 'text',
              icon: ACTION_ICON.DELETE,
              auth: ['mes:workshop:delete'],
              disabled: row.children && row.children.length > 0,
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.workshopName]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>