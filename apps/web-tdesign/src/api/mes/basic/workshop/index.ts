import { requestClient } from '#/api/request';

export namespace MesWorkshopApi {
  /** 车间信息 */
  export interface Workshop {
    id?: number;
    workshopCode: string;
    workshopName: string;
    parentId?: number;
    sort?: number;
    leaderUserId?: number;
    status?: number;
    description?: string;
    createTime?: Date;
    children?: Workshop[];
  }
}

/** 查询车间列表 */
export async function getWorkshopList() {
  return requestClient.get<MesWorkshopApi.Workshop[]>('/mes/workshop/list');
}

/** 查询车间（精简)列表 */
export async function getSimpleWorkshopList() {
  return requestClient.get<MesWorkshopApi.Workshop[]>('/mes/workshop/simple-list');
}

/** 查询车间详情 */
export async function getWorkshop(id: number) {
  return requestClient.get<MesWorkshopApi.Workshop>(
    `/mes/workshop/get?id=${id}`,
  );
}

/** 新增车间 */
export async function createWorkshop(data: MesWorkshopApi.Workshop) {
  return requestClient.post('/mes/workshop/create', data);
}

/** 修改车间 */
export async function updateWorkshop(data: MesWorkshopApi.Workshop) {
  return requestClient.put('/mes/workshop/update', data);
}

/** 删除车间 */
export async function deleteWorkshop(id: number) {
  return requestClient.delete(`/mes/workshop/delete?id=${id}`);
}