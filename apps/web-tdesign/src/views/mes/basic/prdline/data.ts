import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { getSimpleWorkshopList } from '#/api/mes/basic/workshop';

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
      fieldName: 'lineCode',
      label: '产线编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入产线编码',
      },
      rules: 'required',
    },
    {
      fieldName: 'lineName',
      label: '产线名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入产线名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'workshopId',
      label: '所属车间',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleWorkshopList,
        labelField: 'workshopName',
        valueField: 'id',
        placeholder: '请选择所属车间',
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
      fieldName: 'lineCode',
      label: '产线编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入产线编码',
        allowClear: true,
      },
    },
    {
      fieldName: 'lineName',
      label: '产线名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入产线名称',
        allowClear: true,
      },
    },
    {
      fieldName: 'workshopId',
      label: '所属车间',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleWorkshopList,
        labelField: 'workshopName',
        valueField: 'id',
        placeholder: '请选择所属车间',
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
      title: '产线编号',
      minWidth: 100,
    },
    {
      field: 'lineCode',
      title: '产线编码',
      minWidth: 120,
    },
    {
      field: 'lineName',
      title: '产线名称',
      minWidth: 150,
    },
    {
      field: 'workshopName',
      title: '所属车间',
      minWidth: 150,
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