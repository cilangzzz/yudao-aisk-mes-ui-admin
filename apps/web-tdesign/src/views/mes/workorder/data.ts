import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getProductSimpleList } from '#/api/mes/basic/product';
import { getSimpleProductionLineList } from '#/api/mes/basic/prdline';
import { getRoutingSimpleList } from '#/api/mes/config/routing';

/** 工单状态选项 */
export const WORK_ORDER_STATUS_OPTIONS = [
  { label: '草稿', value: 0 },
  { label: '已下发', value: 1 },
  { label: '生产中', value: 2 },
  { label: '已完成', value: 3 },
  { label: '已关闭', value: 4 },
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
      fieldName: 'orderNo',
      label: '工单编号',
      component: 'Input',
      componentProps: {
        placeholder: '留空自动生成',
        disabled: true,
      },
    },
    {
      fieldName: 'erpOrderNo',
      label: 'ERP订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入ERP订单编号',
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
        showSearch: true,
        filterOption: (input: string, option: any) =>
          option.label?.toLowerCase().includes(input.toLowerCase()),
      },
      rules: 'required',
    },
    {
      fieldName: 'routingId',
      label: '工艺路线',
      component: 'ApiSelect',
      componentProps: {
        api: getRoutingSimpleList,
        labelField: 'routingName',
        valueField: 'id',
        placeholder: '请选择工艺路线',
        showSearch: true,
        filterOption: (input: string, option: any) =>
          option.label?.toLowerCase().includes(input.toLowerCase()),
      },
      rules: 'required',
    },
    {
      fieldName: 'lineId',
      label: '产线',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleProductionLineList,
        labelField: 'lineName',
        valueField: 'id',
        placeholder: '请选择产线',
        showSearch: true,
        filterOption: (input: string, option: any) =>
          option.label?.toLowerCase().includes(input.toLowerCase()),
      },
      rules: 'required',
    },
    {
      fieldName: 'planQty',
      label: '计划数量',
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: '请输入计划数量',
        class: 'w-full',
      },
      rules: 'required',
    },
    {
      fieldName: 'priority',
      label: '优先级',
      component: 'InputNumber',
      componentProps: {
        min: 1,
        max: 10,
        placeholder: '1-10，默认5',
        class: 'w-full',
      },
    },
    {
      fieldName: 'planStartTime',
      label: '计划开始时间',
      component: 'DatePicker',
      componentProps: {
        enableTimePicker: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueType: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '请选择计划开始时间',
        class: 'w-full',
      },
      rules: 'required',
    },
    {
      fieldName: 'planEndTime',
      label: '计划结束时间',
      component: 'DatePicker',
      componentProps: {
        enableTimePicker: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueType: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '请选择计划结束时间',
        class: 'w-full',
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'orderNo',
      label: '工单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工单编号',
        allowClear: true,
      },
    },
    {
      fieldName: 'productName',
      label: '产品名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入产品名称',
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: WORK_ORDER_STATUS_OPTIONS,
        placeholder: '请选择状态',
        allowClear: true,
      },
    },
    {
      fieldName: 'lineId',
      label: '产线',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleProductionLineList,
        labelField: 'lineName',
        valueField: 'id',
        placeholder: '请选择产线',
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
      field: 'orderNo',
      title: '工单编号',
      minWidth: 140,
    },
    {
      field: 'erpOrderNo',
      title: 'ERP订单编号',
      minWidth: 120,
    },
    {
      field: 'productCode',
      title: '产品编码',
      minWidth: 100,
    },
    {
      field: 'productName',
      title: '产品名称',
      minWidth: 120,
    },
    {
      field: 'planQty',
      title: '计划数量',
      minWidth: 80,
    },
    {
      field: 'actualQty',
      title: '实际数量',
      minWidth: 80,
    },
    {
      field: 'routingName',
      title: '工艺路线',
      minWidth: 120,
    },
    {
      field: 'lineName',
      title: '产线',
      minWidth: 100,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 80,
      formatter: ({ cellValue }) => {
        const item = WORK_ORDER_STATUS_OPTIONS.find((o) => o.value === cellValue);
        return item?.label ?? '';
      },
    },
    {
      field: 'priority',
      title: '优先级',
      minWidth: 60,
    },
    {
      field: 'planStartTime',
      title: '计划开始时间',
      minWidth: 160,
      formatter: 'formatDateTime',
    },
    {
      field: 'planEndTime',
      title: '计划结束时间',
      minWidth: 160,
      formatter: 'formatDateTime',
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 160,
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