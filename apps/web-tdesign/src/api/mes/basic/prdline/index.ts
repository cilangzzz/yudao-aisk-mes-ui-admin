import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MesPrdlineApi {
  /** 产线信息 */
  export interface ProductionLine {
    id?: number;
    lineCode: string;
    lineName: string;
    workshopId?: number;
    workshopName?: string;
    status?: number;
    description?: string;
    createTime?: Date;
  }
}

/** 查询产线分页 */
export function getProductionLinePage(params: PageParam) {
  return requestClient.get<PageResult<MesPrdlineApi.ProductionLine>>(
    '/mes/production-line/page',
    {
      params,
    },
  );
}

/** 查询产线详情 */
export function getProductionLine(id: number) {
  return requestClient.get<MesPrdlineApi.ProductionLine>(
    `/mes/production-line/get?id=${id}`,
  );
}

/** 查询产线列表 */
export function getProductionLineList() {
  return requestClient.get<MesPrdlineApi.ProductionLine[]>(
    '/mes/production-line/list',
  );
}

/** 查询产线精简列表 */
export function getSimpleProductionLineList() {
  return requestClient.get<MesPrdlineApi.ProductionLine[]>(
    '/mes/production-line/simple-list',
  );
}

/** 按车间查询产线 */
export function getProductionLineListByWorkshop(workshopId: number) {
  return requestClient.get<MesPrdlineApi.ProductionLine[]>(
    `/mes/production-line/list-by-workshop?workshopId=${workshopId}`,
  );
}

/** 新增产线 */
export function createProductionLine(data: MesPrdlineApi.ProductionLine) {
  return requestClient.post('/mes/production-line/create', data);
}

/** 修改产线 */
export function updateProductionLine(data: MesPrdlineApi.ProductionLine) {
  return requestClient.put('/mes/production-line/update', data);
}

/** 删除产线 */
export function deleteProductionLine(id: number) {
  return requestClient.delete(`/mes/production-line/delete?id=${id}`);
}

/** 导出产线 */
export function exportProductionLine(params: any) {
  return requestClient.download('/mes/production-line/export-excel', {
    params,
  });
}