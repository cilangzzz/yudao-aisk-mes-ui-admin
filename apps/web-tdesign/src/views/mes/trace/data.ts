import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

/** 作业状态选项 */
export const OPERATION_STATUS_OPTIONS = [
  { label: '进行中', value: 0 },
  { label: '已完成', value: 1 },
  { label: '异常', value: 2 },
];

/** VIN追溯搜索表单 */
export function useVinTraceFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'vin',
      label: 'VIN码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入VIN码',
        allowClear: true,
      },
      rules: 'required',
    },
  ];
}

/** 关键件追溯搜索表单 */
export function usePartTraceFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'partSn',
      label: '零件序列号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入零件序列号',
        allowClear: true,
      },
      rules: 'required',
    },
  ];
}

/** 操作员作业记录搜索表单 */
export function useOperatorRecordFormSchema(): VbenFormSchema[] {
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
      fieldName: 'status',
      label: '作业状态',
      component: 'Select',
      componentProps: {
        options: OPERATION_STATUS_OPTIONS,
        placeholder: '请选择状态',
        allowClear: true,
      },
    },
    {
      fieldName: 'startTime',
      label: '开始时间',
      component: 'RangePicker',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        allowClear: true,
      },
    },
  ];
}

/** 工序作业记录表格列 */
export function useOperationRecordColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'operationCode',
      title: '工序编码',
      minWidth: 100,
    },
    {
      field: 'operationName',
      title: '工序名称',
      minWidth: 100,
    },
    {
      field: 'workstationName',
      title: '工位',
      minWidth: 80,
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
      field: 'statusName',
      title: '状态',
      minWidth: 80,
    },
    {
      field: 'result',
      title: '结果',
      minWidth: 60,
    },
  ];
}

/** 关键件绑定表格列 */
export function useKeyPartColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'partCode',
      title: '零部件编码',
      minWidth: 100,
    },
    {
      field: 'partName',
      title: '零部件名称',
      minWidth: 100,
    },
    {
      field: 'partSn',
      title: '序列号',
      minWidth: 140,
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
      field: 'workstationName',
      title: '绑定工位',
      minWidth: 80,
    },
    {
      field: 'operatorName',
      title: '操作员',
      minWidth: 80,
    },
  ];
}

/** 质量检验记录表格列 */
export function useQualityRecordColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'checkType',
      title: '检验类型',
      minWidth: 100,
    },
    {
      field: 'checkItemName',
      title: '检验项',
      minWidth: 120,
    },
    {
      field: 'result',
      title: '检验结果',
      minWidth: 80,
    },
    {
      field: 'inspectorName',
      title: '检验员',
      minWidth: 80,
    },
    {
      field: 'checkTime',
      title: '检验时间',
      minWidth: 160,
      formatter: 'formatDateTime',
    },
  ];
}

/** 设备采集数据表格列 */
export function useDeviceDataColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'deviceCode',
      title: '设备编码',
      minWidth: 100,
    },
    {
      field: 'deviceName',
      title: '设备名称',
      minWidth: 100,
    },
    {
      field: 'dataType',
      title: '数据类型',
      minWidth: 80,
    },
    {
      field: 'dataValue',
      title: '数据值',
      minWidth: 80,
    },
    {
      field: 'dataUnit',
      title: '单位',
      minWidth: 60,
    },
    {
      field: 'result',
      title: '判定结果',
      minWidth: 80,
    },
    {
      field: 'collectTime',
      title: '采集时间',
      minWidth: 160,
      formatter: 'formatDateTime',
    },
  ];
}

/** 操作员作业记录表格列 */
export function useOperatorRecordColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'vin',
      title: 'VIN码',
      minWidth: 180,
    },
    {
      field: 'workOrderNo',
      title: '工单编号',
      minWidth: 140,
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
      field: 'statusName',
      title: '状态',
      minWidth: 80,
    },
    {
      field: 'resultName',
      title: '结果',
      minWidth: 60,
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}