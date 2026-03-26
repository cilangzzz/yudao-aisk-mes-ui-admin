import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MesWorkstationApi {
  /** 工作站信息 */
  export interface Workstation {
    id?: number;
    workstationCode: string;
    workstationName: string;
    workshopId?: number;
    workshopName?: string;
    lineId: number;
    lineName?: string;
    workstationType: number; // 0-生产工位, 1-检测工位, 2-仓储工位
    status: number; // 0-启用, 1-停用
    equipmentIds?: number[];
    description?: string;
    createTime?: Date;
  }

  /** 工作站精简信息 */
  export interface SimpleWorkstation {
    id: number;
    workstationCode: string;
    workstationName: string;
    lineId: number;
    workstationType: number;
  }
}

/** 创建工作站 */
export function createWorkstation(
  data: MesWorkstationApi.Workstation,
) {
  return requestClient.post('/mes/workstation/create', data);
}

/** 更新工作站 */
export function updateWorkstation(
  data: MesWorkstationApi.Workstation,
) {
  return requestClient.put('/mes/workstation/update', data);
}

/** 删除工作站 */
export function deleteWorkstation(id: number) {
  return requestClient.delete(`/mes/workstation/delete?id=${id}`);
}

/** 获得工作站详情 */
export function getWorkstation(id: number) {
  return requestClient.get<MesWorkstationApi.Workstation>(
    `/mes/workstation/get?id=${id}`,
  );
}

/** 获得工作站分页 */
export function getWorkstationPage(params: PageParam) {
  return requestClient.get<PageResult<MesWorkstationApi.Workstation>>(
    '/mes/workstation/page',
    { params },
  );
}

/** 获得工作站列表 */
export function getWorkstationList(params?: any) {
  return requestClient.get<MesWorkstationApi.Workstation[]>(
    '/mes/workstation/list',
    { params },
  );
}

/** 获得工作站精简列表 */
export function getSimpleWorkstationList() {
  return requestClient.get<MesWorkstationApi.SimpleWorkstation[]>(
    '/mes/workstation/list-all-simple',
  );
}

/** 按产线查询工作站 */
export function getWorkstationListByLine(lineId: number) {
  return requestClient.get<MesWorkstationApi.SimpleWorkstation[]>(
    `/mes/workstation/list-by-line?lineId=${lineId}`,
  );
}

/** 启用工作站 */
export function enableWorkstation(id: number) {
  return requestClient.put(`/mes/workstation/enable?id=${id}`);
}

/** 停用工作站 */
export function disableWorkstation(id: number) {
  return requestClient.put(`/mes/workstation/disable?id=${id}`);
}

/** 绑定设备 */
export function bindWorkstationEquipment(
  id: number,
  equipmentIds: number[],
) {
  return requestClient.put(
    `/mes/workstation/bind-equipment?id=${id}&equipmentIds=${equipmentIds.join(',')}`,
  );
}

/** 导出工作站 */
export function exportWorkstation(params: any) {
  return requestClient.download('/mes/workstation/export-excel', { params });
}