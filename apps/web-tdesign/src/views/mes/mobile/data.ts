import type { VbenFormSchema } from '#/adapter/form';

import { getSimpleWorkstationList } from '#/api/mes/config/workstation';

/** 作业结果选项 */
export const OPERATION_RESULT_OPTIONS = [
  { label: '合格', value: 0 },
  { label: '不合格', value: 1 },
];

/** 扫码表单 */
export function useScanFormSchema(): VbenFormSchema[] {
  return [
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
      fieldName: 'scanCode',
      label: '扫码',
      component: 'Input',
      componentProps: {
        placeholder: '请扫描或输入VIN/工单号/物料码',
        allowClear: true,
        autofocus: true,
      },
      rules: 'required',
    },
  ];
}

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
        autosize: { minRows: 2, maxRows: 4 },
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
      component: 'Input',
      fieldName: 'operationRecordId',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'partSn',
      label: '零件序列号',
      component: 'Input',
      componentProps: {
        placeholder: '请扫描或输入零件序列号',
        autofocus: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'partCode',
      label: '零件编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入零件编码',
      },
    },
    {
      fieldName: 'partName',
      label: '零件名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入零件名称',
      },
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
        autosize: { minRows: 2, maxRows: 4 },
      },
    },
  ];
}

/** 异常上报表单 */
export function useExceptionFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'vin',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
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
      fieldName: 'operationId',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      component: 'Input',
      fieldName: 'workstationId',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'exceptionReason',
      label: '异常原因',
      component: 'Select',
      componentProps: {
        options: [
          { label: '设备故障', value: '设备故障' },
          { label: '物料异常', value: '物料异常' },
          { label: '质量问题', value: '质量问题' },
          { label: '工艺异常', value: '工艺异常' },
          { label: '其他', value: '其他' },
        ],
        placeholder: '请选择异常原因',
      },
      rules: 'required',
    },
    {
      fieldName: 'exceptionDesc',
      label: '异常描述',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入异常详细描述',
        autosize: { minRows: 3, maxRows: 6 },
      },
    },
    {
      fieldName: 'imageUrls',
      label: '现场照片',
      component: 'Input',
      componentProps: {
        placeholder: '请上传现场照片',
      },
    },
  ];
}