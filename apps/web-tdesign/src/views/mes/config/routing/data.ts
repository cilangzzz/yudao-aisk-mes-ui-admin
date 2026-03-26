import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getProductSimpleList } from '#/api/mes/basic/product';

/** 工艺路线状态选项 */
export const ROUTING_STATUS_OPTIONS = [
  { label: '草稿', value: 0 },
  { label: '生效', value: 1 },
  { label: '失效', value: 2 },
];

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'routingCode',
      label: '工艺路线编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工艺路线编码',
      },
      rules: 'required',
    },
    {
      fieldName: 'routingName',
      label: '工艺路线名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工艺路线名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'productId',
      label: '产品',
      component: 'ApiSelect',
      componentProps: {
        api: getProductSimpleList,
        labelField: 'productName',
        valueField: 'id',
        placeholder: '请选择产品',
        showSearch: true,
        filterOption: (input: string, option: any) =>
          option.label?.toLowerCase().includes(input.toLowerCase()),
      },
      rules: 'required',
    },
    {
      fieldName: 'version',
      label: '版本号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入版本号',
      },
      rules: 'required',
    },
    {
      fieldName: 'description',
      label: '描述',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入描述',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'routingCode',
      label: '工艺路线编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工艺路线编码',
        allowClear: true,
      },
    },
    {
      fieldName: 'routingName',
      label: '工艺路线名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工艺路线名称',
        allowClear: true,
      },
    },
    {
      fieldName: 'productId',
      label: '产品',
      component: 'ApiSelect',
      componentProps: {
        api: getProductSimpleList,
        labelField: 'productName',
        valueField: 'id',
        placeholder: '请选择产品',
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: ROUTING_STATUS_OPTIONS,
        placeholder: '请选择状态',
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '编号',
      minWidth: 80,
    },
    {
      field: 'routingCode',
      title: '工艺路线编码',
      minWidth: 120,
    },
    {
      field: 'routingName',
      title: '工艺路线名称',
      minWidth: 150,
    },
    {
      field: 'productCode',
      title: '产品编码',
      minWidth: 120,
    },
    {
      field: 'productName',
      title: '产品名称',
      minWidth: 150,
    },
    {
      field: 'version',
      title: '版本号',
      minWidth: 80,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 80,
      formatter: ({ cellValue }) => {
        const item = ROUTING_STATUS_OPTIONS.find((o) => o.value === cellValue);
        return item?.label ?? '';
      },
    },
    {
      field: 'description',
      title: '描述',
      minWidth: 200,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 280,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 工序可编辑表格列配置 */
export function useOperationGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'sequence',
      title: '顺序',
      minWidth: 60,
      slots: { default: 'sequence' },
    },
    {
      field: 'operationCode',
      title: '工序编码',
      minWidth: 120,
      slots: { default: 'operationCode' },
    },
    {
      field: 'operationName',
      title: '工序名称',
      minWidth: 120,
      slots: { default: 'operationName' },
    },
    {
      field: 'workstationId',
      title: '工作站',
      minWidth: 150,
      slots: { default: 'workstationId' },
    },
    {
      field: 'standardTime',
      title: '标准工时(分)',
      minWidth: 100,
      slots: { default: 'standardTime' },
    },
    {
      field: 'description',
      title: '描述',
      minWidth: 150,
      slots: { default: 'description' },
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}