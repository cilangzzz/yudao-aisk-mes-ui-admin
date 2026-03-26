import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MesShiftApi {
  /** 班次信息 */
  export interface Shift {
    id?: number;
    shiftCode: string;
    shiftName: string;
    startTime: string;
    endTime: string;
    status?: number;
    createTime?: Date;
  }
}

/** 查询班次分页 */
export function getShiftPage(params: PageParam) {
  return requestClient.get<PageResult<MesShiftApi.Shift>>('/mes/shift/page', {
    params,
  });
}

/** 查询班次列表 */
export function getShiftList(params?: any) {
  return requestClient.get<MesShiftApi.Shift[]>('/mes/shift/list', {
    params,
  });
}

/** 查询班次详情 */
export function getShift(id: number) {
  return requestClient.get<MesShiftApi.Shift>(`/mes/shift/get?id=${id}`);
}

/** 新增班次 */
export function createShift(data: MesShiftApi.Shift) {
  return requestClient.post('/mes/shift/create', data);
}

/** 修改班次 */
export function updateShift(data: MesShiftApi.Shift) {
  return requestClient.put('/mes/shift/update', data);
}

/** 删除班次 */
export function deleteShift(id: number) {
  return requestClient.delete(`/mes/shift/delete?id=${id}`);
}

/** 批量删除班次 */
export function deleteShiftList(ids: number[]) {
  return requestClient.delete(`/mes/shift/delete-list?ids=${ids.join(',')}`);
}

/** 导出班次 */
export function exportShift(params: any) {
  return requestClient.download('/mes/shift/export-excel', {
    params,
  });
}