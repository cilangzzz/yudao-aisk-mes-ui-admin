import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MesBomApi {
  /** BOM记录信息 */
  export interface Bom {
    id?: number;
    productId: number;
    productCode: string;
    materialCode: string;
    materialName: string;
    qty: number;
    unit?: string;
    keyPart?: number;
    createTime?: Date;
  }
}

/** 查询BOM分页 */
export function getBomPage(params: PageParam) {
  return requestClient.get<PageResult<MesBomApi.Bom>>('/mes/product-bom/page', {
    params,
  });
}

/** 查询BOM列表 */
export function getBomList(params?: any) {
  return requestClient.get<MesBomApi.Bom[]>('/mes/product-bom/list', {
    params,
  });
}

/** 按产品查询BOM列表 */
export function getBomListByProduct(productId: number) {
  return requestClient.get<MesBomApi.Bom[]>(
    `/mes/product-bom/list-by-product?productId=${productId}`,
  );
}

/** 查询BOM详情 */
export function getBom(id: number) {
  return requestClient.get<MesBomApi.Bom>(`/mes/product-bom/get?id=${id}`);
}

/** 新增BOM */
export function createBom(data: MesBomApi.Bom) {
  return requestClient.post('/mes/product-bom/create', data);
}

/** 修改BOM */
export function updateBom(data: MesBomApi.Bom) {
  return requestClient.put('/mes/product-bom/update', data);
}

/** 删除BOM */
export function deleteBom(id: number) {
  return requestClient.delete(`/mes/product-bom/delete?id=${id}`);
}