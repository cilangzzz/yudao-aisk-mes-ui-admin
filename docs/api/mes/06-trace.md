# 生产追溯模块 API 接口文档

## 1. 模块概述

生产追溯模块是 MES 系统中实现产品质量追溯的关键模块，支持正向追溯（从 VIN 到零部件）和反向追溯（从零部件到 VIN）两种追溯方式。该模块能够完整记录车辆生产过程中的工序作业、关键件绑定、质量检验和设备采集数据，为质量分析和问题定位提供数据支持。

### 主要功能

- **VIN 正向追溯**：通过 VIN 码查询车辆的完整生产履历
- **关键件反向追溯**：通过零部件序列号查询其绑定的车辆信息
- **工序作业详情**：查询具体作业记录的详细信息
- **操作员作业记录**：查询指定操作员的历史作业记录

---

## 2. 接口列表

| 序号 | 接口名称 | HTTP 方法 | 路径 | 权限标识 |
|------|----------|-----------|------|----------|
| 1 | VIN 正向追溯查询 | GET | /mes/trace/vin | mes:trace:query |
| 2 | 关键件反向追溯 | GET | /mes/trace/part | mes:trace:query |
| 3 | 工序作业详情查询 | GET | /mes/trace/operation | mes:trace:query |
| 4 | 操作员作业记录查询 | GET | /mes/trace/operator | mes:trace:query |

---

## 3. 接口详细说明

### 3.1 VIN 正向追溯查询

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/trace/vin |
| 方法 | GET |
| 描述 | 通过 VIN 码查询车辆的完整生产履历，包括车辆信息、工单信息、工序作业记录、关键件绑定、质量检验记录和设备采集数据 |
| 权限 | mes:trace:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| vin | String | 是 | VIN码 | LSVAU2180N2183721 |

#### 请求示例

```
GET /mes/trace/vin?vin=LSVAU2180N2183721
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| vin | String | VIN码 |
| vehicleInfo | Object | 车辆信息 |
| workOrderInfo | Object | 工单信息 |
| operationRecords | Array | 工序作业记录列表 |
| keyParts | Array | 关键件绑定列表 |
| qualityRecords | Array | 质量检验记录列表 |
| deviceData | Array | 设备采集数据列表 |

**vehicleInfo 对象结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| productCode | String | 产品编码 |
| productName | String | 产品名称 |
| color | String | 颜色 |
| config | String | 配置版本 |
| produceDate | LocalDate | 生产日期 |

**workOrderInfo 对象结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| orderNo | String | 工单编号 |
| planQty | Integer | 计划数量 |
| actualQty | Integer | 实际数量 |
| lineName | String | 产线名称 |
| status | Integer | 工单状态 |
| statusName | String | 状态名称 |

**operationRecords 数组元素结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | Long | 记录ID |
| operationCode | String | 工序编码 |
| operationName | String | 工序名称 |
| workstationName | String | 工位名称 |
| operatorName | String | 操作员姓名 |
| startTime | LocalDateTime | 开始时间 |
| endTime | LocalDateTime | 结束时间 |
| duration | Integer | 作业时长(秒) |
| status | Integer | 作业状态 |
| statusName | String | 状态名称 |
| result | String | 作业结果 |

**keyParts 数组元素结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| partCode | String | 零部件编码 |
| partName | String | 零部件名称 |
| partSn | String | 零部件序列号 |
| supplierName | String | 供应商名称 |
| bindTime | LocalDateTime | 绑定时间 |
| workstationName | String | 绑定工位 |
| operatorName | String | 绑定操作员 |

**qualityRecords 数组元素结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| checkType | String | 检验类型 |
| checkItemName | String | 检验项名称 |
| result | String | 检验结果 |
| inspectorName | String | 检验员姓名 |
| checkTime | LocalDateTime | 检验时间 |

**deviceData 数组元素结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| deviceCode | String | 设备编码 |
| deviceName | String | 设备名称 |
| dataType | String | 数据类型 |
| dataValue | BigDecimal | 数据值 |
| dataUnit | String | 数据单位 |
| result | String | 判定结果 |
| collectTime | LocalDateTime | 采集时间 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "vin": "LSVAU2180N2183721",
    "vehicleInfo": {
      "productCode": "P001",
      "productName": "汽车A",
      "color": "珍珠白",
      "config": "豪华版",
      "produceDate": "2026-03-25"
    },
    "workOrderInfo": {
      "orderNo": "WO202603250001",
      "planQty": 100,
      "actualQty": 85,
      "lineName": "总装线A",
      "status": 2,
      "statusName": "生产中"
    },
    "operationRecords": [
      {
        "id": 1001,
        "operationCode": "OP001",
        "operationName": "前桥装配",
        "workstationName": "工位1",
        "operatorName": "张三",
        "startTime": "2026-03-25 08:30:00",
        "endTime": "2026-03-25 08:45:00",
        "duration": 900,
        "status": 1,
        "statusName": "已完成",
        "result": "合格"
      },
      {
        "id": 1002,
        "operationCode": "OP002",
        "operationName": "发动机装配",
        "workstationName": "工位2",
        "operatorName": "李四",
        "startTime": "2026-03-25 09:00:00",
        "endTime": "2026-03-25 09:30:00",
        "duration": 1800,
        "status": 1,
        "statusName": "已完成",
        "result": "合格"
      }
    ],
    "keyParts": [
      {
        "partCode": "P001",
        "partName": "发动机",
        "partSn": "ENG202603250001",
        "supplierName": "发动机制造商A",
        "bindTime": "2026-03-25 09:15:00",
        "workstationName": "工位2",
        "operatorName": "李四"
      },
      {
        "partCode": "P002",
        "partName": "变速箱",
        "partSn": "TSM202603250001",
        "supplierName": "变速箱制造商B",
        "bindTime": "2026-03-25 09:45:00",
        "workstationName": "工位3",
        "operatorName": "王五"
      }
    ],
    "qualityRecords": [
      {
        "checkType": "过程检验",
        "checkItemName": "扭矩检测",
        "result": "合格",
        "inspectorName": "质检员A",
        "checkTime": "2026-03-25 09:35:00"
      }
    ],
    "deviceData": [
      {
        "deviceCode": "DEV001",
        "deviceName": "扭矩枪1",
        "dataType": "扭矩",
        "dataValue": 120.50,
        "dataUnit": "N·m",
        "result": "合格",
        "collectTime": "2026-03-25 09:20:00"
      }
    ]
  },
  "msg": "操作成功"
}
```

---

### 3.2 关键件反向追溯

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/trace/part |
| 方法 | GET |
| 描述 | 通过关键件序列号查询该零部件绑定的车辆信息，用于质量问题定位和召回分析 |
| 权限 | mes:trace:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| partSn | String | 是 | 关键件序列号 | ENG202603250001 |

#### 请求示例

```
GET /mes/trace/part?partSn=ENG202603250001
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| partCode | String | 零部件编码 |
| partName | String | 零部件名称 |
| partSn | String | 零部件序列号 |
| supplierCode | String | 供应商编码 |
| supplierName | String | 供应商名称 |
| bindVin | String | 绑定车辆VIN |
| bindTime | LocalDateTime | 绑定时间 |
| workstationId | Long | 绑定工位ID |
| workstationName | String | 绑定工位名称 |
| operatorId | Long | 绑定操作员ID |
| operatorName | String | 绑定操作员姓名 |
| workOrderNo | String | 工单编号 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "partCode": "P001",
    "partName": "发动机",
    "partSn": "ENG202603250001",
    "supplierCode": "S001",
    "supplierName": "发动机制造商A",
    "bindVin": "LSVAU2180N2183721",
    "bindTime": "2026-03-25 09:15:00",
    "workstationId": 2,
    "workstationName": "工位2",
    "operatorId": 2,
    "operatorName": "李四",
    "workOrderNo": "WO202603250001"
  },
  "msg": "操作成功"
}
```

---

### 3.3 工序作业详情查询

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/trace/operation |
| 方法 | GET |
| 描述 | 根据作业记录ID查询工序作业的详细信息，包括作业时间、操作员、设备数据等 |
| 权限 | mes:trace:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| recordId | Long | 是 | 作业记录ID | 1001 |

#### 请求示例

```
GET /mes/trace/operation?recordId=1001
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | Long | 记录ID |
| vin | String | VIN码 |
| workOrderNo | String | 工单编号 |
| operationId | Long | 工序ID |
| operationCode | String | 工序编码 |
| operationName | String | 工序名称 |
| workstationId | Long | 工位ID |
| workstationCode | String | 工位编码 |
| workstationName | String | 工位名称 |
| operatorId | Long | 操作员ID |
| operatorName | String | 操作员姓名 |
| startTime | LocalDateTime | 开始时间 |
| endTime | LocalDateTime | 结束时间 |
| duration | Integer | 作业时长(秒) |
| status | Integer | 作业状态:0-进行中,1-已完成,2-异常 |
| statusName | String | 状态名称 |
| result | Integer | 作业结果:0-合格,1-不合格 |
| resultName | String | 结果名称 |
| torqueValue | BigDecimal | 扭矩值(N·m) |
| torqueResult | Integer | 扭矩判定:0-合格,1-不合格 |
| remark | String | 备注 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": 1001,
    "vin": "LSVAU2180N2183721",
    "workOrderNo": "WO202603250001",
    "operationId": 1,
    "operationCode": "OP001",
    "operationName": "前桥装配",
    "workstationId": 1,
    "workstationCode": "WS001",
    "workstationName": "工位1",
    "operatorId": 1,
    "operatorName": "张三",
    "startTime": "2026-03-25 08:30:00",
    "endTime": "2026-03-25 08:45:00",
    "duration": 900,
    "status": 1,
    "statusName": "已完成",
    "result": 0,
    "resultName": "合格",
    "torqueValue": 120.50,
    "torqueResult": 0,
    "remark": "作业正常完成"
  },
  "msg": "操作成功"
}
```

---

### 3.4 操作员作业记录查询

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/trace/operator |
| 方法 | GET |
| 描述 | 分页查询指定操作员的历史作业记录，用于工作量统计和绩效分析 |
| 权限 | mes:trace:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| pageNo | Integer | 否 | 页码（默认1） | 1 |
| pageSize | Integer | 否 | 每页数量（默认10） | 10 |
| operatorId | Long | 否 | 操作员ID | 1 |
| vin | String | 否 | VIN码 | LSVAU2180N2183721 |
| workOrderNo | String | 否 | 工单编号 | WO202603250001 |
| operationName | String | 否 | 工序名称 | 前桥装配 |
| status | Integer | 否 | 作业状态 | 1 |
| startTimeBegin | String | 否 | 开始时间-起 | 2026-03-01 00:00:00 |
| startTimeEnd | String | 否 | 开始时间-止 | 2026-03-31 23:59:59 |

#### 请求示例

```
GET /mes/trace/operator?pageNo=1&pageSize=10&operatorId=1&startTimeBegin=2026-03-01 00:00:00&startTimeEnd=2026-03-31 23:59:59
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| list | Array | 作业记录列表 |
| total | Long | 总记录数 |

**list 数组元素结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | Long | 记录ID |
| vin | String | VIN码 |
| workOrderNo | String | 工单编号 |
| operationId | Long | 工序ID |
| operationCode | String | 工序编码 |
| operationName | String | 工序名称 |
| workstationId | Long | 工位ID |
| workstationCode | String | 工位编码 |
| workstationName | String | 工位名称 |
| operatorId | Long | 操作员ID |
| operatorName | String | 操作员姓名 |
| startTime | LocalDateTime | 开始时间 |
| endTime | LocalDateTime | 结束时间 |
| duration | Integer | 作业时长(秒) |
| status | Integer | 作业状态:0-进行中,1-已完成,2-异常 |
| statusName | String | 状态名称 |
| result | Integer | 作业结果:0-合格,1-不合格 |
| resultName | String | 结果名称 |
| torqueValue | BigDecimal | 扭矩值(N·m) |
| torqueResult | Integer | 扭矩判定:0-合格,1-不合格 |
| remark | String | 备注 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1001,
        "vin": "LSVAU2180N2183721",
        "workOrderNo": "WO202603250001",
        "operationId": 1,
        "operationCode": "OP001",
        "operationName": "前桥装配",
        "workstationId": 1,
        "workstationCode": "WS001",
        "workstationName": "工位1",
        "operatorId": 1,
        "operatorName": "张三",
        "startTime": "2026-03-25 08:30:00",
        "endTime": "2026-03-25 08:45:00",
        "duration": 900,
        "status": 1,
        "statusName": "已完成",
        "result": 0,
        "resultName": "合格",
        "torqueValue": 120.50,
        "torqueResult": 0,
        "remark": "作业正常完成"
      },
      {
        "id": 1005,
        "vin": "LSVAU2180N2183722",
        "workOrderNo": "WO202603250001",
        "operationId": 1,
        "operationCode": "OP001",
        "operationName": "前桥装配",
        "workstationId": 1,
        "workstationCode": "WS001",
        "workstationName": "工位1",
        "operatorId": 1,
        "operatorName": "张三",
        "startTime": "2026-03-25 09:00:00",
        "endTime": "2026-03-25 09:12:00",
        "duration": 720,
        "status": 1,
        "statusName": "已完成",
        "result": 0,
        "resultName": "合格",
        "torqueValue": 118.30,
        "torqueResult": 0,
        "remark": null
      }
    ],
    "total": 2
  },
  "msg": "操作成功"
}
```

---

## 4. 追溯场景说明

### 正向追溯场景

当需要查询某辆车使用了哪些零部件、经历了哪些工序、由谁操作、设备数据如何时，使用 VIN 正向追溯功能。典型应用场景：

1. **质量调查**：当收到车辆质量投诉时，追溯该车的生产履历
2. **售后支持**：为售后服务提供详细的装配信息
3. **合规审计**：满足汽车行业质量追溯的法规要求

### 反向追溯场景

当某批次零部件出现质量问题需要召回相关车辆时，使用关键件反向追溯功能。典型应用场景：

1. **召回分析**：确定问题零部件装配到了哪些车辆
2. **供应商管理**：追溯零部件的来源供应商
3. **风险评估**：评估质量问题的影响范围

---

## 5. 状态码说明

### 作业状态 (status)

| 值 | 说明 |
|----|------|
| 0 | 进行中 |
| 1 | 已完成 |
| 2 | 异常 |

### 作业结果 (result)

| 值 | 说明 |
|----|------|
| 0 | 合格 |
| 1 | 不合格 |

### 扭矩判定 (torqueResult)

| 值 | 说明 |
|----|------|
| 0 | 合格 |
| 1 | 不合格 |

---

## 6. 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 操作成功 |
| 3001 | VIN码不存在 |
| 3002 | 关键件序列号不存在 |
| 3003 | 作业记录不存在 |
| 3004 | 操作员不存在 |
| 3005 | 追溯数据为空 |

---

## 7. 注意事项

1. 所有接口均需要登录认证，并在请求头中携带 Token
2. 权限标识需要在用户角色中配置才能访问对应接口
3. VIN 码格式需符合车辆识别代码标准（17位字符）
4. 追溯数据包含敏感生产信息，请注意数据安全
5. 大量数据查询建议使用分页接口，避免一次查询过多数据
6. 时间范围查询建议限制在合理范围内（如一个月）以提高查询效率