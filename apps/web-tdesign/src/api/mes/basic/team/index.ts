import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MesTeamApi {
  /** 班组信息 */
  export interface Team {
    id?: number;
    teamCode: string;
    teamName: string;
    lineId: number;
    lineName?: string;
    leaderId?: number;
    leaderName?: string;
    status?: number;
    createTime?: Date;
  }
}

/** 查询班组分页 */
export function getTeamPage(params: PageParam) {
  return requestClient.get<PageResult<MesTeamApi.Team>>('/mes/team/page', {
    params,
  });
}

/** 查询班组详情 */
export function getTeam(id: number) {
  return requestClient.get<MesTeamApi.Team>(`/mes/team/get?id=${id}`);
}

/** 查询班组列表 */
export function getTeamList() {
  return requestClient.get<MesTeamApi.Team[]>('/mes/team/list');
}

/** 查询产线下班组 */
export function getTeamListByLine(lineId: number) {
  return requestClient.get<MesTeamApi.Team[]>(
    `/mes/team/list-by-line?lineId=${lineId}`,
  );
}

/** 查询班组精简列表 */
export function getTeamSimpleList() {
  return requestClient.get<MesTeamApi.Team[]>('/mes/team/simple-list');
}

/** 新增班组 */
export function createTeam(data: MesTeamApi.Team) {
  return requestClient.post('/mes/team/create', data);
}

/** 修改班组 */
export function updateTeam(data: MesTeamApi.Team) {
  return requestClient.put('/mes/team/update', data);
}

/** 删除班组 */
export function deleteTeam(id: number) {
  return requestClient.delete(`/mes/team/delete?id=${id}`);
}