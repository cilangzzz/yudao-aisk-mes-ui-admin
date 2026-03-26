import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MesProductApi {
  /** 产品信息 */
  export interface Product {
    id?: number;
    productCode: string;
    productName: string;
    productType?: string;
    specification?: string;
    model?: string;
    unit?: string;
    status?: number;
    description?: string;
    createTime?: Date;
  }
}

/** 查询产品分页 */
export function getProductPage(params: PageParam) {
  return requestClient.get<PageResult<MesProductApi.Product>>(
    '/mes/product/page',
    {
      params,
    },
  );
}

/** 查询产品列表 */
export function getProductList(params?: any) {
  return requestClient.get<MesProductApi.Product[]>('/mes/product/list', {
    params,
  });
}

/** 查询产品精简列表 */
export function getProductSimpleList() {
  return requestClient.get<MesProductApi.Product[]>('/mes/product/simple-list');
}

/** 查询产品详情 */
export function getProduct(id: number) {
  return requestClient.get<MesProductApi.Product>(`/mes/product/get?id=${id}`);
}

/** 新增产品 */
export function createProduct(data: MesProductApi.Product) {
  return requestClient.post('/mes/product/create', data);
}

/** 修改产品 */
export function updateProduct(data: MesProductApi.Product) {
  return requestClient.put('/mes/product/update', data);
}

/** 删除产品 */
export function deleteProduct(id: number) {
  return requestClient.delete(`/mes/product/delete?id=${id}`);
}

/** 批量删除产品 */
export function deleteProductList(ids: number[]) {
  return requestClient.delete(`/mes/product/delete-list?ids=${ids.join(',')}`);
}

/** 导出产品 */
export function exportProduct(params: any) {
  return requestClient.download('/mes/product/export-excel', {
    params,
  });
}