import type { PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MesOperationApi {
  /** 扫码请求 */
  export interface ScanRequest {
    code: string;
    workstationId?: number;
    workOrderId?: number;
    operationId?: number;
  }

  /** 扫码结果 */
  export interface ScanResult {
    scanType: string;
    scanTypeName: string;
    canStart: boolean;
    vin?: string;
    workOrderId?: number;
    workOrderNo?: string;
    productCode?: string;
    productName?: string;
    materialCode?: string;
    vinInfo?: VinInfo;
    workOrderInfo?: WorkOrderInfo;
    materialInfo?: MaterialInfo;
    message?: string;
  }

  /** VIN信息 */
  export interface VinInfo {
    vin: string;
    workOrderId: number;
    workOrderNo: string;
    productName: string;
    operations: OperationProgress[];
  }

  /** 工单信息 */
  export interface WorkOrderInfo {
    id: number;
    orderNo: string;
    productName: string;
    status: number;
    statusName: string;
    operations?: OperationProgress[];
  }

  /** 物料信息 */
  export interface MaterialInfo {
    partCode: string;
    partName: string;
    partSn: string;
    binded: boolean;
  }

  /** 开始作业请求 */
  export interface StartRequest {
    workOrderId: number;
    vin: string;
    operationId: number;
    workstationId: number;
    remark?: string;
  }

  /** 完成作业请求 */
  export interface CompleteRequest {
    recordId: number;
    result?: number;
    torqueValue?: number;
    torqueResult?: number;
    remark?: string;
  }

  /** 关键件绑定请求 */
  export interface BindPartRequest {
    workOrderId: number;
    operationRecordId?: number;
    vin: string;
    partCode: string;
    partName: string;
    partSn: string;
    supplierCode?: string;
    supplierName?: string;
    workstationId?: number;
    remark?: string;
  }

  /** 作业记录 */
  export interface OperationRecord {
    id?: number;
    workOrderId?: number;
    workOrderNo?: string;
    vin?: string;
    operationId?: number;
    operationCode?: string;
    operationName?: string;
    operationSeq?: number;
    workstationId?: number;
    workstationCode?: string;
    workstationName?: string;
    operatorId?: number;
    operatorName?: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
    status: number;
    result?: number;
    torqueValue?: number;
    torqueResult?: number;
    remark?: string;
    createTime?: string;
    statusName?: string;
    resultName?: string;
    torqueResultName?: string;
    keyParts?: KeyPart[];
  }

  /** 作业记录分页查询参数 */
  export interface RecordPageParams {
    pageNo?: number;
    pageSize?: number;
    workOrderId?: number;
    workOrderNo?: string;
    vin?: string;
    operationCode?: string;
    operationName?: string;
    workstationId?: number;
    operatorId?: number;
    status?: number;
    createTime?: string[];
  }

  /** 关键件 */
  export interface KeyPart {
    id?: number;
    workOrderId?: number;
    vin?: string;
    partCode: string;
    partName: string;
    partSn: string;
    supplierCode?: string;
    supplierName?: string;
    bindTime?: string;
    workstationId?: number;
    operatorName?: string;
  }

  /** 车辆进度 */
  export interface VehicleProgress {
    vin: string;
    workOrderId: number;
    workOrderNo: string;
    productCode: string;
    productName: string;
    operations: OperationProgress[];
    completedCount: number;
    totalCount: number;
    progressPercent: number;
  }

  /** 工序进度 */
  export interface OperationProgress {
    operationId: number;
    operationCode: string;
    operationName: string;
    operationSeq: number;
    completed: boolean;
    recordId?: number;
    status?: number;
    statusName?: string;
    startTime?: string;
    endTime?: string;
    keyPartCount?: number;
    operatorName?: string;
  }
}

/** 扫码识别 */
export function scanCode(data: MesOperationApi.ScanRequest) {
  return requestClient.post<MesOperationApi.ScanResult>(
    '/mes/operation/scan',
    data,
  );
}

/** 开始作业 */
export function startOperation(data: MesOperationApi.StartRequest) {
  return requestClient.post<number>('/mes/operation/start', data);
}

/** 完成作业 */
export function completeOperation(data: MesOperationApi.CompleteRequest) {
  return requestClient.put('/mes/operation/complete', data);
}

/** 绑定关键件 */
export function bindKeyPart(data: MesOperationApi.BindPartRequest) {
  return requestClient.post<number>('/mes/operation/bind-part', data);
}

/** 获得作业记录分页 */
export function getOperationRecordPage(
  params: MesOperationApi.RecordPageParams,
) {
  return requestClient.get<PageResult<MesOperationApi.OperationRecord>>(
    '/mes/operation/record/page',
    { params },
  );
}

/** 获得作业记录详情 */
export function getOperationRecord(id: number) {
  return requestClient.get<MesOperationApi.OperationRecord>(
    `/mes/operation/record/get?id=${id}`,
  );
}

/** 获得车辆进度 */
export function getVehicleProgress(vin: string) {
  return requestClient.get<MesOperationApi.VehicleProgress>(
    `/mes/operation/progress?vin=${vin}`,
  );
}

/** 获得关键件绑定列表 */
export function getKeyPartList(vin: string) {
  return requestClient.get<MesOperationApi.KeyPart[]>(
    `/mes/operation/key-part/list?vin=${vin}`,
  );
}