import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getProductSimpleList } from '#/api/mes/basic/product';

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
      fieldName: 'productCode',
      label: '产品编码',
      component: 'Input',
      dependencies: {
        triggerFields: ['productId'],
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
      fieldName: 'qty',
      label: '用量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入用量',
        min: 0,
        precision: 4,
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
      fieldName: 'keyPart',
      label: '是否关键件',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
        buttonStyle: 'solid',
        optionType: 'button',
      },
      defaultValue: 0,
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
      fieldName: 'productId',
      label: '产品',
      component: 'ApiSelect',
      componentProps: {
        api: getProductSimpleList,
        labelField: 'productName',
        valueField: 'id',
        placeholder: '请选择产品',
        allowClear: true,
        showSearch: true,
        filterOption: (input: string, option: any) =>
          option.label?.toLowerCase().includes(input.toLowerCase()),
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
      title: 'BOM编号',
      minWidth: 100,
    },
    {
      field: 'productCode',
      title: '产品编码',
      minWidth: 120,
    },
    {
      field: 'materialCode',
      title: '物料编码',
      minWidth: 120,
    },
    {
      field: 'materialName',
      title: '物料名称',
      minWidth: 150,
    },
    {
      field: 'qty',
      title: '用量',
      minWidth: 100,
    },
    {
      field: 'unit',
      title: '单位',
      minWidth: 80,
    },
    {
      field: 'keyPart',
      title: '是否关键件',
      minWidth: 100,
      formatter: ({ cellValue }) => (cellValue === 1 ? '是' : '否'),
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