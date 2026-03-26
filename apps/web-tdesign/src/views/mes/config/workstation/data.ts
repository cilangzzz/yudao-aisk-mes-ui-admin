import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MesWorkstationApi } from '#/api/mes/config/workstation';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { getSimpleProductionLineList } from '#/api/mes/basic/prdline';

/** 工作站类型选项 */
export const WORKSTATION_TYPE_OPTIONS = [
  { label: '生产工位', value: 0 },
  { label: '检测工位', value: 1 },
  { label: '仓储工位', value: 2 },
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
      fieldName: 'workstationCode',
      label: '工作站编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工作站编码',
      },
      rules: 'required',
    },
    {
      fieldName: 'workstationName',
      label: '工作站名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工作站名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'workstationType',
      label: '工作站类型',
      component: 'RadioGroup',
      componentProps: {
        options: WORKSTATION_TYPE_OPTIONS,
        buttonStyle: 'solid',
        optionType: 'button',
      },
      defaultValue: 0,
      rules: 'required',
    },
    {
      fieldName: 'lineId',
      label: '所属产线',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleProductionLineList,
        labelField: 'lineName',
        valueField: 'id',
        placeholder: '请选择所属产线',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      defaultValue: 0,
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
      fieldName: 'workstationCode',
      label: '工作站编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工作站编码',
        allowClear: true,
      },
    },
    {
      fieldName: 'workstationName',
      label: '工作站名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工作站名称',
        allowClear: true,
      },
    },
    {
      fieldName: 'workstationType',
      label: '工作站类型',
      component: 'Select',
      componentProps: {
        options: WORKSTATION_TYPE_OPTIONS,
        placeholder: '请选择工作站类型',
        allowClear: true,
      },
    },
    {
      fieldName: 'lineId',
      label: '所属产线',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleProductionLineList,
        labelField: 'lineName',
        valueField: 'id',
        placeholder: '请选择所属产线',
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: '请选择状态',
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(
  onStatusChange?: (
    newStatus: number,
    row: MesWorkstationApi.Workstation,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '编号',
      minWidth: 80,
    },
    {
      field: 'workstationCode',
      title: '工作站编码',
      minWidth: 120,
    },
    {
      field: 'workstationName',
      title: '工作站名称',
      minWidth: 150,
    },
    {
      field: 'workstationType',
      title: '工作站类型',
      minWidth: 100,
      formatter: ({ cellValue }) => {
        const item = WORKSTATION_TYPE_OPTIONS.find(
          (o) => o.value === cellValue,
        );
        return item?.label ?? '';
      },
    },
    {
      field: 'lineName',
      title: '所属产线',
      minWidth: 120,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      cellRender: {
        name: 'CellSwitch',
        attrs: { beforeChange: onStatusChange },
        props: { checkedValue: 0, unCheckedValue: 1 },
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
      width: 160,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}