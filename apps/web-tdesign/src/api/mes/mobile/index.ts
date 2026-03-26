import { requestClient } from '#/api/request';

export namespace MesMobileApi {
  /** 扫码解析请求 */
  export interface ScanRequest {
    scanCode: string;
    workstationId?: number;
  }

  /** 扫码类型 */
  export type ScanType = 'VIN' | 'WORK_ORDER' | 'MATERIAL' | 'KEY_PART';

  /** 当前工序信息 */
  export interface CurrentOperation {
    operationId: number;
    operationCode: string;
    operationName: string;
    operationGuide?: string;
    torqueRequire?: number;
    requiredKeyParts?: RequiredKeyPart[];
  }

  /** 所需关键件 */
  export interface RequiredKeyPart {
    partCode: string;
    partName: string;
    required: boolean;
    bound?: boolean;
  }

  /** 已绑定关键件 */
  export interface BoundPart {
    partCode: string;
    partName: string;
    partSn: string;
    bindTime: string;
  }

  /** 扫码解析结果 */
  export interface ScanResult {
    scanType: ScanType;
    scanTypeName: string;
    success: boolean;
    failReason?: string;
    vin?: string;
    workOrderId?: number;
    workOrderNo?: string;
    productName?: string;
    currentOperation?: CurrentOperation;
    boundParts?: BoundPart[];
    canStart?: boolean;
    message?: string;
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

  /** 绑定关键件请求 */
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

  /** 异常上报请求 */
  export interface ExceptionReportRequest {
    vin: string;
    workOrderId: number;
    operationId: number;
    workstationId: number;
    exceptionReason: string;
    exceptionDesc?: string;
    imageUrls?: string[];
  }

  /** 任务信息 */
  export interface TaskInfo {
    id: number;
    taskType: string;
    taskTypeName: string;
    vin: string;
    workOrderNo: string;
    productName: string;
    operationName: string;
    workstationName: string;
    status: number;
    statusName: string;
    priority: number;
    createTime: string;
  }
}

/** 扫码解析 */
export function scanCode(data: MesMobileApi.ScanRequest) {
  return requestClient.post<MesMobileApi.ScanResult>(
    '/app-api/mes/operation/scan',
    data,
  );
}

/** 开始作业 */
export function startOperation(data: MesMobileApi.StartRequest) {
  return requestClient.post<number>('/app-api/mes/operation/start', data);
}

/** 完成作业 */
export function completeOperation(data: MesMobileApi.CompleteRequest) {
  return requestClient.put('/app-api/mes/operation/complete', data);
}

/** 绑定关键件 */
export function bindKeyPart(data: MesMobileApi.BindPartRequest) {
  return requestClient.post<number>('/app-api/mes/operation/bind-part', data);
}

/** 异常上报 */
export function reportException(data: MesMobileApi.ExceptionReportRequest) {
  return requestClient.post('/app-api/mes/exception/report', data);
}

/** 获取任务列表 */
export function getTaskList(workstationId: number) {
  return requestClient.get<MesMobileApi.TaskInfo[]>(
    `/app-api/mes/task/list?workstationId=${workstationId}`,
  );
}