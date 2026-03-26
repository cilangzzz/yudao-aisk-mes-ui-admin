import type { PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MesStockApi {
  /** 线边库存信息 */
  export interface Stock {
    id?: number;
    materialCode: string;
    materialName: string;
    workstationId: number;
    workstationName?: string;
    qty: number;
    safetyQty: number;
    unit?: string;
    lastUpdateTime?: string;
    createTime?: string;
    warning: boolean;
  }

  /** 库存分页查询参数 */
  export interface PageParams {
    pageNo?: number;
    pageSize?: number;
    materialCode?: string;
    materialName?: string;
    workstationId?: number;
  }

  /** 物料消耗请求 */
  export interface ConsumeRequest {
    vin?: string;
    workOrderId?: number;
    materialCode: string;
    materialName: string;
    qty: number;
    unit?: string;
    workstationId: number;
    operatorId?: number;
    operatorName?: string;
    remark?: string;
  }

  /** 线边入库请求 */
  export interface StockInRequest {
    materialCode: string;
    materialName: string;
    workstationId: number;
    qty: number;
    safetyQty?: number;
    unit?: string;
  }
}

/** 获得线边库存分页 */
export function getStockPage(params: MesStockApi.PageParams) {
  return requestClient.get<PageResult<MesStockApi.Stock>>('/mes/stock/page', {
    params,
  });
}

/** 按工位查询库存 */
export function getStockByWorkstation(workstationId: number) {
  return requestClient.get<MesStockApi.Stock[]>(
    `/mes/stock/list-by-workstation?workstationId=${workstationId}`,
  );
}

/** 获得缺料预警列表 */
export function getWarningList() {
  return requestClient.get<MesStockApi.Stock[]>('/mes/stock/warning-list');
}

/** 获得线边库存详情 */
export function getStock(id: number) {
  return requestClient.get<MesStockApi.Stock>(`/mes/stock/get?id=${id}`);
}

/** 物料消耗 */
export function consumeStock(data: MesStockApi.ConsumeRequest) {
  return requestClient.post('/mes/stock/consume', data);
}

/** 线边物料入库 */
export function stockIn(data: MesStockApi.StockInRequest) {
  return requestClient.post('/mes/stock/in', data);
}