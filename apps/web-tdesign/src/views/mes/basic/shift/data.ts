import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

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
      fieldName: 'shiftCode',
      label: '班次编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入班次编码',
      },
      rules: 'required',
    },
    {
      fieldName: 'shiftName',
      label: '班次名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入班次名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'startTime',
      label: '开始时间',
      component: 'TimePicker',
      componentProps: {
        placeholder: '请选择开始时间',
        format: 'HH:mm',
        enableTimePicker: true,
        allowInput: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'endTime',
      label: '结束时间',
      component: 'TimePicker',
      componentProps: {
        placeholder: '请选择结束时间',
        format: 'HH:mm',
        enableTimePicker: true,
        allowInput: true,
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
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'shiftCode',
      label: '班次编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入班次编码',
        allowClear: true,
      },
    },
    {
      fieldName: 'shiftName',
      label: '班次名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入班次名称',
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
      title: '班次编号',
      minWidth: 100,
    },
    {
      field: 'shiftCode',
      title: '班次编码',
      minWidth: 120,
    },
    {
      field: 'shiftName',
      title: '班次名称',
      minWidth: 120,
    },
    {
      field: 'startTime',
      title: '开始时间',
      minWidth: 100,
    },
    {
      field: 'endTime',
      title: '结束时间',
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