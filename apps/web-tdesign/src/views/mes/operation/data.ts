import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getSimpleWorkstationList } from '#/api/mes/config/workstation';

/** 作业状态选项 */
export const OPERATION_STATUS_OPTIONS = [
  { label: '进行中', value: 0 },
  { label: '已完成', value: 1 },
  { label: '异常', value: 2 },
];

/** 作业结果选项 */
export const OPERATION_RESULT_OPTIONS = [
  { label: '合格', value: 0 },
  { label: '不合格', value: 1 },
];

/** 完成作业表单 */
export function useCompleteFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'recordId',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'result',
      label: '作业结果',
      component: 'RadioGroup',
      componentProps: {
        options: OPERATION_RESULT_OPTIONS,
      },
      rules: 'required',
    },
    {
      fieldName: 'torqueValue',
      label: '扭矩值(N·m)',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: '请输入扭矩值',
        class: 'w-full',
      },
    },
    {
      fieldName: 'torqueResult',
      label: '扭矩判定',
      component: 'RadioGroup',
      componentProps: {
        options: OPERATION_RESULT_OPTIONS,
      },
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

/** 关键件绑定表单 */
export function useKeyPartFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'workOrderId',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      component: 'Input',
      fieldName: 'vin',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'partCode',
      label: '零部件编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入零部件编码',
      },
      rules: 'required',
    },
    {
      fieldName: 'partName',
      label: '零部件名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入零部件名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'partSn',
      label: '序列号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入序列号',
      },
      rules: 'required',
    },
    {
      fieldName: 'supplierCode',
      label: '供应商编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入供应商编码',
      },
    },
    {
      fieldName: 'supplierName',
      label: '供应商名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入供应商名称',
      },
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
      fieldName: 'vin',
      label: 'VIN码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入VIN码',
        allowClear: true,
      },
    },
    {
      fieldName: 'workOrderNo',
      label: '工单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工单编号',
        allowClear: true,
      },
    },
    {
      fieldName: 'operationName',
      label: '工序名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工序名称',
        allowClear: true,
      },
    },
    {
      fieldName: 'workstationId',
      label: '工位',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleWorkstationList,
        labelField: 'workstationName',
        valueField: 'id',
        placeholder: '请选择工位',
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: OPERATION_STATUS_OPTIONS,
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
      field: 'workOrderNo',
      title: '工单编号',
      minWidth: 140,
    },
    {
      field: 'vin',
      title: 'VIN码',
      minWidth: 180,
    },
    {
      field: 'operationName',
      title: '工序名称',
      minWidth: 100,
    },
    {
      field: 'workstationName',
      title: '工位',
      minWidth: 100,
    },
    {
      field: 'operatorName',
      title: '操作员',
      minWidth: 80,
    },
    {
      field: 'startTime',
      title: '开始时间',
      minWidth: 160,
      formatter: 'formatDateTime',
    },
    {
      field: 'endTime',
      title: '结束时间',
      minWidth: 160,
      formatter: 'formatDateTime',
    },
    {
      field: 'duration',
      title: '时长(秒)',
      minWidth: 80,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 80,
      formatter: ({ cellValue }) => {
        const item = OPERATION_STATUS_OPTIONS.find((o) => o.value === cellValue);
        return item?.label ?? '';
      },
    },
    {
      field: 'resultName',
      title: '结果',
      minWidth: 60,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 160,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 关键件列表字段 */
export function useKeyPartGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'partCode',
      title: '零部件编码',
      minWidth: 120,
    },
    {
      field: 'partName',
      title: '零部件名称',
      minWidth: 120,
    },
    {
      field: 'partSn',
      title: '序列号',
      minWidth: 120,
    },
    {
      field: 'supplierName',
      title: '供应商',
      minWidth: 100,
    },
    {
      field: 'bindTime',
      title: '绑定时间',
      minWidth: 160,
      formatter: 'formatDateTime',
    },
    {
      field: 'operatorName',
      title: '操作员',
      minWidth: 80,
    },
  ];
}