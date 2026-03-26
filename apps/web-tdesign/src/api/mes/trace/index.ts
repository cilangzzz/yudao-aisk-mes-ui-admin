import type { PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MesTraceApi {
  /** 车辆信息 */
  export interface VehicleInfo {
    productCode: string;
    productName: string;
    color: string;
    config: string;
    produceDate: string;
  }

  /** 工单信息 */
  export interface WorkOrderInfo {
    orderNo: string;
    planQty: number;
    actualQty: number;
    lineName: string;
    status: number;
    statusName: string;
  }

  /** 工序作业记录 */
  export interface OperationRecord {
    id: number;
    operationCode: string;
    operationName: string;
    workstationName: string;
    operatorName: string;
    startTime: string;
    endTime: string;
    duration: number;
    status: number;
    statusName: string;
    result: string;
  }

  /** 关键件绑定信息 */
  export interface KeyPartInfo {
    partCode: string;
    partName: string;
    partSn: string;
    supplierName: string;
    bindTime: string;
    workstationName: string;
    operatorName: string;
  }

  /** 质量检验记录 */
  export interface QualityRecord {
    checkType: string;
    checkItemName: string;
    result: string;
    inspectorName: string;
    checkTime: string;
  }

  /** 设备采集数据 */
  export interface DeviceData {
    deviceCode: string;
    deviceName: string;
    dataType: string;
    dataValue: number;
    dataUnit: string;
    result: string;
    collectTime: string;
  }

  /** VIN正向追溯响应 */
  export interface VinTraceResult {
    vin: string;
    vehicleInfo: VehicleInfo;
    workOrderInfo: WorkOrderInfo;
    operationRecords: OperationRecord[];
    keyParts: KeyPartInfo[];
    qualityRecords: QualityRecord[];
    deviceData: DeviceData[];
  }

  /** 关键件反向追溯响应 */
  export interface PartTraceResult {
    partCode: string;
    partName: string;
    partSn: string;
    supplierCode: string;
    supplierName: string;
    bindVin: string;
    bindTime: string;
    workstationId: number;
    workstationName: string;
    operatorId: number;
    operatorName: string;
    workOrderNo: string;
  }

  /** 工序作业详情 */
  export interface OperationDetail {
    id: number;
    vin: string;
    workOrderNo: string;
    operationId: number;
    operationCode: string;
    operationName: string;
    workstationId: number;
    workstationCode: string;
    workstationName: string;
    operatorId: number;
    operatorName: string;
    startTime: string;
    endTime: string;
    duration: number;
    status: number;
    statusName: string;
    result: number;
    resultName: string;
    torqueValue: number;
    torqueResult: number;
    remark: string;
  }

  /** 操作员作业记录查询参数 */
  export interface OperatorRecordParams {
    pageNo?: number;
    pageSize?: number;
    operatorId?: number;
    vin?: string;
    workOrderNo?: string;
    operationName?: string;
    status?: number;
    startTimeBegin?: string;
    startTimeEnd?: string;
  }

  /** 操作员作业记录 */
  export interface OperatorRecord {
    id: number;
    vin: string;
    workOrderNo: string;
    operationId: number;
    operationCode: string;
    operationName: string;
    workstationId: number;
    workstationCode: string;
    workstationName: string;
    operatorId: number;
    operatorName: string;
    startTime: string;
    endTime: string;
    duration: number;
    status: number;
    statusName: string;
    result: number;
    resultName: string;
    torqueValue: number;
    torqueResult: number;
    remark: string;
  }
}

/** VIN正向追溯查询 */
export function getVinTrace(vin: string) {
  return requestClient.get<MesTraceApi.VinTraceResult>(
    `/mes/trace/vin?vin=${encodeURIComponent(vin)}`,
  );
}

/** 关键件反向追溯查询 */
export function getPartTrace(partSn: string) {
  return requestClient.get<MesTraceApi.PartTraceResult>(
    `/mes/trace/part?partSn=${encodeURIComponent(partSn)}`,
  );
}

/** 工序作业详情查询 */
export function getOperationDetail(recordId: number) {
  return requestClient.get<MesTraceApi.OperationDetail>(
    `/mes/trace/operation?recordId=${recordId}`,
  );
}

/** 操作员作业记录查询 */
export function getOperatorRecords(params: MesTraceApi.OperatorRecordParams) {
  return requestClient.get<PageResult<MesTraceApi.OperatorRecord>>(
    '/mes/trace/operator',
    { params },
  );
}