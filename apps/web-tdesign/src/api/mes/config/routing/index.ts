import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MesRoutingApi {
  /** 工艺路线信息 */
  export interface Routing {
    id?: number;
    routingCode: string;
    routingName: string;
    productId?: number;
    productCode?: string;
    productName?: string;
    version: string;
    status: number; // 0-草稿, 1-生效, 2-失效
    description?: string;
    operations?: Operation[];
    createTime?: Date;
  }

  /** 工序信息 */
  export interface Operation {
    id?: number;
    routingId?: number;
    operationCode: string;
    operationName: string;
    sequence: number;
    workstationId?: number;
    workstationName?: string;
    standardTime?: number;
    description?: string;
    keyOperation?: number; // 是否关键工序: 0-否, 1-是
    qualityCheck?: number; // 是否需要质检: 0-否, 1-是
    instruction?: string;
    instructionFile?: string;
    materials?: Material[];
    createTime?: Date;
  }

  /** 工序物料信息 */
  export interface Material {
    id?: number;
    operationId?: number;
    materialCode: string;
    materialName: string;
    qty: number;
    unit?: string;
    keyPart?: number; // 是否关键件: 0-否, 1-是
    createTime?: Date;
  }
}

/** 创建工艺路线 */
export function createRouting(data: MesRoutingApi.Routing) {
  return requestClient.post('/mes/routing/create', data);
}

/** 更新工艺路线 */
export function updateRouting(data: MesRoutingApi.Routing) {
  return requestClient.put('/mes/routing/update', data);
}

/** 删除工艺路线 */
export function deleteRouting(id: number) {
  return requestClient.delete(`/mes/routing/delete?id=${id}`);
}

/** 获得工艺路线详情 */
export function getRouting(id: number) {
  return requestClient.get<MesRoutingApi.Routing>(
    `/mes/routing/get?id=${id}`,
  );
}

/** 获得工艺路线分页 */
export function getRoutingPage(params: PageParam) {
  return requestClient.get<PageResult<MesRoutingApi.Routing>>(
    '/mes/routing/page',
    { params },
  );
}

/** 生效工艺路线 */
export function activateRouting(id: number) {
  return requestClient.put(`/mes/routing/activate?id=${id}`);
}

/** 失效工艺路线 */
export function deactivateRouting(id: number) {
  return requestClient.put(`/mes/routing/deactivate?id=${id}`);
}

/** 复制工艺路线 */
export function copyRouting(id: number) {
  return requestClient.post(`/mes/routing/copy?id=${id}`);
}