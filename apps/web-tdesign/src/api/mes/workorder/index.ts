import type { PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MesWorkOrderApi {
  /** 生产工单信息 */
  export interface WorkOrder {
    id?: number;
    orderNo?: string;
    erpOrderNo?: string;
    productId: number;
    productCode: string;
    productName: string;
    planQty: number;
    actualQty?: number;
    routingId: number;
    routingName?: string;
    status: number; // 0-草稿/计划, 1-已下发, 2-生产中, 3-已完成, 4-已关闭
    priority?: number;
    planStartTime: string;
    planEndTime: string;
    actualStartTime?: string;
    actualEndTime?: string;
    workshopId?: number;
    workshopName?: string;
    lineId: number;
    lineName?: string;
    remark?: string;
    createTime?: string;
  }

  /** 工单分页查询参数 */
  export interface PageParams {
    pageNo?: number;
    pageSize?: number;
    orderNo?: string;
    erpOrderNo?: string;
    productCode?: string;
    productName?: string;
    status?: number;
    lineId?: number;
    workshopId?: number;
    planStartTime?: string[];
    createTime?: string[];
  }
}

/** 创建生产工单 */
export function createWorkOrder(data: MesWorkOrderApi.WorkOrder) {
  return requestClient.post('/mes/work-order/create', data);
}

/** 更新生产工单 */
export function updateWorkOrder(data: MesWorkOrderApi.WorkOrder) {
  return requestClient.put('/mes/work-order/update', data);
}

/** 删除生产工单 */
export function deleteWorkOrder(id: number) {
  return requestClient.delete(`/mes/work-order/delete?id=${id}`);
}

/** 获得生产工单详情 */
export function getWorkOrder(id: number) {
  return requestClient.get<MesWorkOrderApi.WorkOrder>(
    `/mes/work-order/get?id=${id}`,
  );
}

/** 获得生产工单分页 */
export function getWorkOrderPage(params: MesWorkOrderApi.PageParams) {
  return requestClient.get<PageResult<MesWorkOrderApi.WorkOrder>>(
    '/mes/work-order/page',
    { params },
  );
}

/** 获得生产工单列表 */
export function getWorkOrderList(params?: MesWorkOrderApi.PageParams) {
  return requestClient.get<MesWorkOrderApi.WorkOrder[]>('/mes/work-order/list', {
    params,
  });
}

/** 导出生产工单 Excel */
export function exportWorkOrder(params?: MesWorkOrderApi.PageParams) {
  return requestClient.get('/mes/work-order/export-excel', {
    params,
    responseType: 'blob',
  });
}

/** 下发工单 */
export function releaseWorkOrder(id: number) {
  return requestClient.put(`/mes/work-order/release?id=${id}`);
}

/** 开始生产 */
export function startWorkOrder(id: number) {
  return requestClient.put(`/mes/work-order/start?id=${id}`);
}

/** 完成工单 */
export function completeWorkOrder(id: number) {
  return requestClient.put(`/mes/work-order/complete?id=${id}`);
}

/** 关闭工单 */
export function closeWorkOrder(id: number) {
  return requestClient.put(`/mes/work-order/close?id=${id}`);
}