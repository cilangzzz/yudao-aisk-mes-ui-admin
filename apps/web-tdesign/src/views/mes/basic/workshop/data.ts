import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MesWorkshopApi } from '#/api/mes/basic/workshop';
import type { SystemUserApi } from '#/api/system/user';

import { CommonStatusEnum, DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { handleTree } from '@vben/utils';

import { z } from '#/adapter/form';
import { getWorkshopList } from '#/api/mes/basic/workshop';
import { getSimpleUserList } from '#/api/system/user';

/** 关联数据 */
let userList: SystemUserApi.User[] = [];
getSimpleUserList().then((data) => (userList = data));

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'workshopCode',
      label: '车间编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车间编码',
      },
      rules: 'required',
    },
    {
      fieldName: 'workshopName',
      label: '车间名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车间名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'parentId',
      label: '上级车间',
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: async () => {
          const data = await getWorkshopList();
          data.unshift({
            id: 0,
            workshopCode: '',
            workshopName: '顶级车间',
          });
          return handleTree(data);
        },
        labelField: 'workshopName',
        valueField: 'id',
        childrenField: 'children',
        placeholder: '请选择上级车间',
        treeDefaultExpandAll: true,
      },
    },
    {
      fieldName: 'sort',
      label: '显示顺序',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: '请输入显示顺序',
      },
    },
    {
      fieldName: 'leaderUserId',
      label: '负责人',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleUserList,
        labelField: 'nickname',
        valueField: 'id',
        placeholder: '请选择负责人',
        allowClear: true,
      },
      rules: z.number().optional(),
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
      rules: z.number().default(CommonStatusEnum.ENABLE),
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
      fieldName: 'workshopCode',
      label: '车间编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车间编码',
        allowClear: true,
      },
    },
    {
      fieldName: 'workshopName',
      label: '车间名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车间名称',
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
export function useGridColumns(): VxeTableGridOptions<MesWorkshopApi.Workshop>['columns'] {
  return [
    {
      field: 'workshopCode',
      title: '车间编码',
      minWidth: 120,
      align: 'left',
      fixed: 'left',
      treeNode: true,
    },
    {
      field: 'workshopName',
      title: '车间名称',
      minWidth: 150,
    },
    {
      field: 'leaderUserId',
      title: '负责人',
      minWidth: 120,
      formatter: ({ cellValue }) =>
        userList.find((user) => user.id === cellValue)?.nickname || '-',
    },
    {
      field: 'sort',
      title: '显示顺序',
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
      width: 220,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}