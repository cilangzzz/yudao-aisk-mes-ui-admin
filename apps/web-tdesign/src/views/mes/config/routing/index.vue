<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MesRoutingApi } from '#/api/mes/config/routing';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from '#/adapter/tdesign';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  activateRouting,
  copyRouting,
  deactivateRouting,
  deleteRouting,
  getRoutingPage,
} from '#/api/mes/config/routing';
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

/** 创建工艺路线 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑工艺路线 */
function handleEdit(row: MesRoutingApi.Routing) {
  formModalApi.setData(row).open();
}

/** 删除工艺路线 */
async function handleDelete(row: MesRoutingApi.Routing) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.routingName]),
    duration: 0,
  });
  try {
    await deleteRouting(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.routingName]));
    handleRefresh();
  } finally {
    message.close(hideLoading);
  }
}

/** 生效工艺路线 */
async function handleActivate(row: MesRoutingApi.Routing) {
  const hideLoading = message.loading({
    content: '正在生效...',
    duration: 0,
  });
  try {
    await activateRouting(row.id!);
    message.success('生效成功');
    handleRefresh();
  } finally {
    message.close(hideLoading);
  }
}

/** 失效工艺路线 */
async function handleDeactivate(row: MesRoutingApi.Routing) {
  const hideLoading = message.loading({
    content: '正在失效...',
    duration: 0,
  });
  try {
    await deactivateRouting(row.id!);
    message.success('失效成功');
    handleRefresh();
  } finally {
    message.close(hideLoading);
  }
}

/** 复制工艺路线 */
async function handleCopy(row: MesRoutingApi.Routing) {
  const hideLoading = message.loading({
    content: '正在复制...',
    duration: 0,
  });
  try {
    await copyRouting(row.id!);
    message.success('复制成功');
    handleRefresh();
  } finally {
    message.close(hideLoading);
  }
}

const checkedIds = ref<number[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: MesRoutingApi.Routing[];
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
          return await getRoutingPage({
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
  } as VxeTableGridOptions<MesRoutingApi.Routing>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleRefresh" />
    <Grid table-title="工艺路线列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['工艺路线']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['mes:routing:create'],
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
              auth: ['mes:routing:update'],
              ifShow: () => row.status === 0,
              onClick: handleEdit.bind(null, row),
            },
            {
              label: '生效',
              variant: 'text',
              type: 'success',
              icon: ACTION_ICON.EDIT,
              auth: ['mes:routing:update'],
              ifShow: () => row.status === 0,
              popConfirm: {
                title: '确定生效该工艺路线吗？',
                confirm: handleActivate.bind(null, row),
              },
            },
            {
              label: '失效',
              variant: 'text',
              type: 'warning',
              icon: ACTION_ICON.EDIT,
              auth: ['mes:routing:update'],
              ifShow: () => row.status === 1,
              popConfirm: {
                title: '确定失效该工艺路线吗？',
                confirm: handleDeactivate.bind(null, row),
              },
            },
            {
              label: '复制',
              variant: 'text',
              icon: ACTION_ICON.COPY,
              auth: ['mes:routing:create'],
              ifShow: () => row.status === 1,
              popConfirm: {
                title: '确定复制该工艺路线吗？',
                confirm: handleCopy.bind(null, row),
              },
            },
            {
              label: $t('common.delete'),
              variant: 'text',
              type: 'danger',
              icon: ACTION_ICON.DELETE,
              auth: ['mes:routing:delete'],
              ifShow: () => row.status === 0,
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.routingName]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>