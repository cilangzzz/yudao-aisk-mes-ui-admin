import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { getSimpleProductionLineList } from '#/api/mes/basic/prdline';

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
      fieldName: 'teamCode',
      label: '班组编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入班组编码',
      },
      rules: 'required',
    },
    {
      fieldName: 'teamName',
      label: '班组名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入班组名称',
      },
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
      fieldName: 'leaderId',
      label: '班组长ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入班组长用户ID',
        allowClear: true,
      },
    },
    {
      fieldName: 'leaderName',
      label: '班组长姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入班组长姓名',
        allowClear: true,
      },
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
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'teamCode',
      label: '班组编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入班组编码',
        allowClear: true,
      },
    },
    {
      fieldName: 'teamName',
      label: '班组名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入班组名称',
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
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '班组编号',
      minWidth: 100,
    },
    {
      field: 'teamCode',
      title: '班组编码',
      minWidth: 120,
    },
    {
      field: 'teamName',
      title: '班组名称',
      minWidth: 120,
    },
    {
      field: 'lineName',
      title: '所属产线',
      minWidth: 120,
    },
    {
      field: 'leaderName',
      title: '班组长',
      minWidth: 100,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
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