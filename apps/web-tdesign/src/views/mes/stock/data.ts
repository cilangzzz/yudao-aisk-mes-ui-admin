import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getSimpleWorkstationList } from '#/api/mes/config/workstation';

/** 入库表单 */
export function useStockInFormSchema(): VbenFormSchema[] {
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
      fieldName: 'materialCode',
      label: '物料编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入物料编码',
      },
      rules: 'required',
    },
    {
      fieldName: 'materialName',
      label: '物料名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入物料名称',
      },
      rules: 'required',
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
        showSearch: true,
        filterOption: (input: string, option: any) =>
          option.label?.toLowerCase().includes(input.toLowerCase()),
      },
      rules: 'required',
    },
    {
      fieldName: 'qty',
      label: '入库数量',
      component: 'InputNumber',
      componentProps: {
        min: 0.01,
        placeholder: '请输入入库数量',
        class: 'w-full',
      },
      rules: 'required',
    },
    {
      fieldName: 'safetyQty',
      label: '安全库存',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: '请输入安全库存',
        class: 'w-full',
      },
    },
    {
      fieldName: 'unit',
      label: '单位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入单位',
      },
    },
  ];
}

/** 消耗表单 */
export function useConsumeFormSchema(): VbenFormSchema[] {
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
      fieldName: 'vin',
      label: '车辆VIN',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车辆VIN',
      },
    },
    {
      fieldName: 'workOrderId',
      label: '工单ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入工单ID',
        class: 'w-full',
      },
    },
    {
      fieldName: 'materialCode',
      label: '物料编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入物料编码',
      },
      rules: 'required',
    },
    {
      fieldName: 'materialName',
      label: '物料名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入物料名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'workstationId',
      label: '消耗工位',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleWorkstationList,
        labelField: 'workstationName',
        valueField: 'id',
        placeholder: '请选择工位',
        showSearch: true,
        filterOption: (input: string, option: any) =>
          option.label?.toLowerCase().includes(input.toLowerCase()),
      },
      rules: 'required',
    },
    {
      fieldName: 'qty',
      label: '消耗数量',
      component: 'InputNumber',
      componentProps: {
        min: 0.01,
        placeholder: '请输入消耗数量',
        class: 'w-full',
      },
      rules: 'required',
    },
    {
      fieldName: 'unit',
      label: '单位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入单位',
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
      fieldName: 'materialCode',
      label: '物料编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入物料编码',
        allowClear: true,
      },
    },
    {
      fieldName: 'materialName',
      label: '物料名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入物料名称',
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
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'materialCode',
      title: '物料编码',
      minWidth: 120,
    },
    {
      field: 'materialName',
      title: '物料名称',
      minWidth: 120,
    },
    {
      field: 'workstationName',
      title: '工位',
      minWidth: 120,
    },
    {
      field: 'qty',
      title: '库存数量',
      minWidth: 100,
    },
    {
      field: 'safetyQty',
      title: '安全库存',
      minWidth: 100,
    },
    {
      field: 'unit',
      title: '单位',
      minWidth: 60,
    },
    {
      field: 'warning',
      title: '状态',
      minWidth: 80,
      slots: { default: 'warning' },
    },
    {
      field: 'lastUpdateTime',
      title: '最后更新时间',
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
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 缺料预警列表字段 */
export function useWarningGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'materialCode',
      title: '物料编码',
      minWidth: 120,
    },
    {
      field: 'materialName',
      title: '物料名称',
      minWidth: 120,
    },
    {
      field: 'workstationName',
      title: '工位',
      minWidth: 120,
    },
    {
      field: 'qty',
      title: '当前库存',
      minWidth: 100,
      slots: { default: 'qty' },
    },
    {
      field: 'safetyQty',
      title: '安全库存',
      minWidth: 100,
    },
    {
      field: 'unit',
      title: '单位',
      minWidth: 60,
    },
    {
      field: 'lastUpdateTime',
      title: '最后更新时间',
      minWidth: 160,
      formatter: 'formatDateTime',
    },
  ];
}