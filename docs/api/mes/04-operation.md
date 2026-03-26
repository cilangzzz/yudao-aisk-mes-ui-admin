# 装配作业执行模块 API 接口文档

## 1. 模块概述

装配作业执行模块是 MES 系统的核心功能模块，主要用于管理车间现场的生产作业执行过程。该模块提供了从扫码识别、开始作业、完成作业到关键件绑定的完整作业流程支持，同时提供作业记录查询和车辆生产进度跟踪功能。

### 主要功能

- **扫码识别**：支持 VIN 码、工单、物料等多种条码类型的识别和解析
- **作业执行**：支持开始作业、完成作业的完整作业流程
- **关键件绑定**：支持关键零部件与车辆的绑定记录
- **作业记录**：提供作业记录的分页查询和详情查看
- **进度跟踪**：支持车辆生产进度的实时查询

---

## 2. 接口列表

| 序号 | 接口名称 | HTTP 方法 | 路径 | 权限标识 |
|------|----------|-----------|------|----------|
| 1 | 扫码识别 | POST | /mes/operation/scan | mes:operation:scan |
| 2 | 开始作业 | POST | /mes/operation/start | mes:operation:scan |
| 3 | 完成作业 | PUT | /mes/operation/complete | mes:operation:complete |
| 4 | 绑定关键件 | POST | /mes/operation/bind-part | mes:operation:bind-part |
| 5 | 获得作业记录分页 | GET | /mes/operation/record/page | mes:operation:query |
| 6 | 获得作业记录 | GET | /mes/operation/record/get | mes:operation:query |
| 7 | 获得车辆进度 | GET | /mes/operation/progress | mes:operation:query |
| 8 | 获得关键件绑定列表 | GET | /mes/operation/key-part/list | mes:operation:query |

---

## 3. 接口详细说明

### 3.1 扫码识别

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/operation/scan |
| 方法 | POST |
| 描述 | 扫描条码进行识别，支持 VIN 码、工单、物料等多种类型 |
| 权限 | mes:operation:scan |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| code | String | 是 | 扫码内容 | LSVNV2182E2100001 |
| workstationId | Long | 否 | 工作站ID | 1 |
| workOrderId | Long | 否 | 工单ID（用于切换当前工单） | 1 |
| operationId | Long | 否 | 操作ID（用于切换当前操作） | 1 |

#### 请求示例

```json
{
  "code": "LSVNV2182E2100001",
  "workstationId": 1,
  "workOrderId": 1,
  "operationId": 1
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| scanType | String | 扫码类型 |
| scanTypeName | String | 扫码类型名称 |
| canStart | Boolean | 是否可以开始作业 |
| vin | String | VIN码（扫码结果） |
| workOrderId | Long | 工单ID |
| workOrderNo | String | 工单编号 |
| productCode | String | 产品编码 |
| productName | String | 产品名称 |
| materialCode | String | 物料编码 |
| vinInfo | Object | VIN码信息 |
| workOrderInfo | Object | 工单信息 |
| materialInfo | Object | 物料信息 |
| message | String | 提示消息 |

**vinInfo 对象结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| vin | String | VIN码 |
| workOrderId | Long | 工单ID |
| workOrderNo | String | 工单编号 |
| productName | String | 产品名称 |
| operations | Array | 当前工序信息列表 |

**operations 数组元素结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| operationId | Long | 工序ID |
| operationCode | String | 工序编码 |
| operationName | String | 工序名称 |
| operationSeq | Integer | 工序顺序 |
| completed | Boolean | 是否已完成 |
| recordId | Long | 作业记录ID（如果存在） |
| status | Integer | 作业状态 |

**workOrderInfo 对象结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | Long | 工单ID |
| orderNo | String | 工单编号 |
| productName | String | 产品名称 |
| status | Integer | 状态 |
| statusName | String | 状态名称 |

**materialInfo 对象结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| partCode | String | 物料编码 |
| partName | String | 物料名称 |
| partSn | String | 序列号 |
| binded | Boolean | 是否已绑定 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "scanType": "vin",
    "scanTypeName": "VIN码",
    "canStart": true,
    "vin": "LSVNV2182E2100001",
    "workOrderId": 1,
    "workOrderNo": "WO202603250001",
    "productCode": "P001",
    "productName": "汽车A",
    "materialCode": "M001",
    "vinInfo": {
      "vin": "LSVNV2182E2100001",
      "workOrderId": 1,
      "workOrderNo": "WO202603250001",
      "productName": "汽车A",
      "operations": [
        {
          "operationId": 1,
          "operationCode": "OP001",
          "operationName": "总装",
          "operationSeq": 1,
          "completed": false,
          "recordId": null,
          "status": null
        }
      ]
    },
    "workOrderInfo": {
      "id": 1,
      "orderNo": "WO202603250001",
      "productName": "汽车A",
      "status": 2,
      "statusName": "生产中"
    },
    "materialInfo": null,
    "message": "请选择工序开始作业"
  },
  "msg": "操作成功"
}
```

---

### 3.2 开始作业

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/operation/start |
| 方法 | POST |
| 描述 | 开始一项装配作业，返回作业记录ID |
| 权限 | mes:operation:scan |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| workOrderId | Long | 是 | 工单ID | 1 |
| vin | String | 是 | VIN码 | LSVNV2182E2100001 |
| operationId | Long | 是 | 工序ID | 1 |
| workstationId | Long | 是 | 工作站ID | 1 |
| remark | String | 否 | 备注 | 开始装配 |

#### 请求示例

```json
{
  "workOrderId": 1,
  "vin": "LSVNV2182E2100001",
  "operationId": 1,
  "workstationId": 1,
  "remark": "开始装配"
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| - | Long | 作业记录ID |

#### 响应示例

```json
{
  "code": 0,
  "data": 1001,
  "msg": "操作成功"
}
```

---

### 3.3 完成作业

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/operation/complete |
| 方法 | PUT |
| 描述 | 完成一项装配作业，记录作业结果和扭矩数据 |
| 权限 | mes:operation:complete |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| recordId | Long | 是 | 作业记录ID | 1 |
| result | Integer | 否 | 结果:0-合格,1-不合格 | 0 |
| torqueValue | BigDecimal | 否 | 扭矩值(N·m) | 100.00 |
| torqueResult | Integer | 否 | 扭矩判定:0-合格,1-不合格 | 0 |
| remark | String | 否 | 备注 | 作业完成 |

#### 请求示例

```json
{
  "recordId": 1001,
  "result": 0,
  "torqueValue": 100.00,
  "torqueResult": 0,
  "remark": "作业完成"
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| - | Boolean | 操作结果 |

#### 响应示例

```json
{
  "code": 0,
  "data": true,
  "msg": "操作成功"
}
```

---

### 3.4 绑定关键件

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/operation/bind-part |
| 方法 | POST |
| 描述 | 将关键零部件绑定到指定车辆，用于质量追溯 |
| 权限 | mes:operation:bind-part |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| workOrderId | Long | 是 | 工单ID | 1 |
| operationRecordId | Long | 否 | 作业记录ID | 1 |
| vin | String | 是 | VIN码 | LSVNV2182E2100001 |
| partCode | String | 是 | 零部件编码 | P001 |
| partName | String | 是 | 零部件名称 | 发动机 |
| partSn | String | 是 | 零部件序列号 | SN001 |
| supplierCode | String | 否 | 供应商编码 | S001 |
| supplierName | String | 否 | 供应商名称 | 供应商A |
| workstationId | Long | 否 | 绑定工位ID | 1 |
| remark | String | 否 | 备注 | 备注信息 |

#### 请求示例

```json
{
  "workOrderId": 1,
  "operationRecordId": 1001,
  "vin": "LSVNV2182E2100001",
  "partCode": "P001",
  "partName": "发动机",
  "partSn": "SN001",
  "supplierCode": "S001",
  "supplierName": "供应商A",
  "workstationId": 1,
  "remark": "关键件绑定"
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| - | Long | 绑定记录ID |

#### 响应示例

```json
{
  "code": 0,
  "data": 2001,
  "msg": "操作成功"
}
```

---

### 3.5 获得作业记录分页

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/operation/record/page |
| 方法 | GET |
| 描述 | 分页查询作业记录列表 |
| 权限 | mes:operation:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| pageNo | Integer | 否 | 页码（默认1） | 1 |
| pageSize | Integer | 否 | 每页数量（默认10） | 10 |
| workOrderId | Long | 否 | 工单ID | 1 |
| workOrderNo | String | 否 | 工单编号 | WO202603250001 |
| vin | String | 否 | VIN码 | LSVNV2182E2100001 |
| operationCode | String | 否 | 工序编码 | OP001 |
| operationName | String | 否 | 工序名称 | 总装 |
| workstationId | Long | 否 | 工作站ID | 1 |
| operatorId | Long | 否 | 操作员ID | 1 |
| status | Integer | 否 | 状态 | 0 |
| createTime | String | 否 | 创建时间范围 | ["2026-03-01 00:00:00", "2026-03-31 23:59:59"] |

#### 请求示例

```
GET /mes/operation/record/page?pageNo=1&pageSize=10&vin=LSVNV2182E2100001
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| list | Array | 作业记录列表 |
| total | Long | 总记录数 |

**list 数组元素结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | Long | 编号 |
| workOrderId | Long | 工单ID |
| workOrderNo | String | 工单编号 |
| vin | String | VIN码 |
| operationId | Long | 工序ID |
| operationCode | String | 工序编码 |
| operationName | String | 工序名称 |
| operationSeq | Integer | 工序顺序 |
| workstationId | Long | 工作站ID |
| workstationCode | String | 工作站编码 |
| workstationName | String | 工作站名称 |
| operatorId | Long | 操作员ID |
| operatorName | String | 操作员姓名 |
| startTime | LocalDateTime | 开始时间 |
| endTime | LocalDateTime | 结束时间 |
| duration | Integer | 作业时长(秒) |
| status | Integer | 状态 |
| result | Integer | 结果 |
| torqueValue | BigDecimal | 扭矩值(N·m) |
| torqueResult | Integer | 扭矩判定 |
| remark | String | 备注 |
| createTime | LocalDateTime | 创建时间 |
| statusName | String | 状态名称 |
| resultName | String | 结果名称 |
| torqueResultName | String | 扭矩判定名称 |
| keyParts | Array | 关键件绑定列表 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1001,
        "workOrderId": 1,
        "workOrderNo": "WO202603250001",
        "vin": "LSVNV2182E2100001",
        "operationId": 1,
        "operationCode": "OP001",
        "operationName": "总装",
        "operationSeq": 1,
        "workstationId": 1,
        "workstationCode": "WS001",
        "workstationName": "工位1",
        "operatorId": 1,
        "operatorName": "张三",
        "startTime": "2026-03-25 08:30:00",
        "endTime": "2026-03-25 08:32:00",
        "duration": 120,
        "status": 1,
        "result": 0,
        "torqueValue": 100.00,
        "torqueResult": 0,
        "remark": "作业完成",
        "createTime": "2026-03-25 08:30:00",
        "statusName": "已完成",
        "resultName": "合格",
        "torqueResultName": "合格",
        "keyParts": [
          {
            "id": 2001,
            "workOrderId": 1,
            "vin": "LSVNV2182E2100001",
            "partCode": "P001",
            "partName": "发动机",
            "partSn": "SN001",
            "supplierCode": "S001",
            "supplierName": "供应商A",
            "bindTime": "2026-03-25 08:31:00",
            "workstationId": 1,
            "operatorName": "张三"
          }
        ]
      }
    ],
    "total": 1
  },
  "msg": "操作成功"
}
```

---

### 3.6 获得作业记录

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/operation/record/get |
| 方法 | GET |
| 描述 | 根据ID获取单条作业记录详情 |
| 权限 | mes:operation:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 编号 | 1024 |

#### 请求示例

```
GET /mes/operation/record/get?id=1001
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | Long | 编号 |
| workOrderId | Long | 工单ID |
| workOrderNo | String | 工单编号 |
| vin | String | VIN码 |
| operationId | Long | 工序ID |
| operationCode | String | 工序编码 |
| operationName | String | 工序名称 |
| operationSeq | Integer | 工序顺序 |
| workstationId | Long | 工作站ID |
| workstationCode | String | 工作站编码 |
| workstationName | String | 工作站名称 |
| operatorId | Long | 操作员ID |
| operatorName | String | 操作员姓名 |
| startTime | LocalDateTime | 开始时间 |
| endTime | LocalDateTime | 结束时间 |
| duration | Integer | 作业时长(秒) |
| status | Integer | 状态 |
| result | Integer | 结果 |
| torqueValue | BigDecimal | 扭矩值(N·m) |
| torqueResult | Integer | 扭矩判定 |
| remark | String | 备注 |
| createTime | LocalDateTime | 创建时间 |
| statusName | String | 状态名称 |
| resultName | String | 结果名称 |
| torqueResultName | String | 扭矩判定名称 |
| keyParts | Array | 关键件绑定列表 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": 1001,
    "workOrderId": 1,
    "workOrderNo": "WO202603250001",
    "vin": "LSVNV2182E2100001",
    "operationId": 1,
    "operationCode": "OP001",
    "operationName": "总装",
    "operationSeq": 1,
    "workstationId": 1,
    "workstationCode": "WS001",
    "workstationName": "工位1",
    "operatorId": 1,
    "operatorName": "张三",
    "startTime": "2026-03-25 08:30:00",
    "endTime": "2026-03-25 08:32:00",
    "duration": 120,
    "status": 1,
    "result": 0,
    "torqueValue": 100.00,
    "torqueResult": 0,
    "remark": "作业完成",
    "createTime": "2026-03-25 08:30:00",
    "statusName": "已完成",
    "resultName": "合格",
    "torqueResultName": "合格",
    "keyParts": []
  },
  "msg": "操作成功"
}
```

---

### 3.7 获得车辆进度

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/operation/progress |
| 方法 | GET |
| 描述 | 获取指定 VIN 码车辆的生产进度信息 |
| 权限 | mes:operation:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| vin | String | 是 | VIN码 | LSVNV2182E2100001 |

#### 请求示例

```
GET /mes/operation/progress?vin=LSVNV2182E2100001
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| vin | String | VIN码 |
| workOrderId | Long | 工单ID |
| workOrderNo | String | 工单编号 |
| productCode | String | 产品编码 |
| productName | String | 产品名称 |
| operations | Array | 总工序列表 |
| completedCount | Integer | 已完成工序数 |
| totalCount | Integer | 总工序数 |
| progressPercent | Double | 完成进度(%) |

**operations 数组元素结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| operationId | Long | 工序ID |
| operationCode | String | 工序编码 |
| operatorName | String | 操作员名称 |
| operationName | String | 工序名称 |
| operationSeq | Integer | 工序顺序 |
| completed | Boolean | 是否已完成 |
| recordId | Long | 作业记录ID |
| status | Integer | 作业状态 |
| statusName | String | 状态名称 |
| startTime | String | 开始时间 |
| endTime | String | 结束时间 |
| keyPartCount | Integer | 关键件绑定数量 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "vin": "LSVNV2182E2100001",
    "workOrderId": 1,
    "workOrderNo": "WO202603250001",
    "productCode": "P202603250001",
    "productName": "汽车A",
    "operations": [
      {
        "operationId": 1,
        "operationCode": "OP001",
        "operatorName": "张三",
        "operationName": "总装",
        "operationSeq": 1,
        "completed": true,
        "recordId": 1001,
        "status": 1,
        "statusName": "已完成",
        "startTime": "2026-03-25 08:30:00",
        "endTime": "2026-03-25 08:32:00",
        "keyPartCount": 2
      },
      {
        "operationId": 2,
        "operationCode": "OP002",
        "operatorName": null,
        "operationName": "检测",
        "operationSeq": 2,
        "completed": false,
        "recordId": null,
        "status": null,
        "statusName": null,
        "startTime": null,
        "endTime": null,
        "keyPartCount": 0
      }
    ],
    "completedCount": 1,
    "totalCount": 2,
    "progressPercent": 50.00
  },
  "msg": "操作成功"
}
```

---

### 3.8 获得关键件绑定列表

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/operation/key-part/list |
| 方法 | GET |
| 描述 | 根据 VIN 码获取关键件绑定记录列表 |
| 权限 | mes:operation:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| vin | String | 是 | VIN码 | LSVNV2182E2100001 |

#### 请求示例

```
GET /mes/operation/key-part/list?vin=LSVNV2182E2100001
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | Long | 编号 |
| workOrderId | Long | 工单ID |
| vin | String | VIN码 |
| partCode | String | 零部件编码 |
| partName | String | 零部件名称 |
| partSn | String | 零部件序列号 |
| supplierCode | String | 供应商编码 |
| supplierName | String | 供应商名称 |
| bindTime | LocalDateTime | 绑定时间 |
| workstationId | Long | 绑定工位ID |
| operatorName | String | 操作员姓名 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 2001,
      "workOrderId": 1,
      "vin": "LSVNV2182E2100001",
      "partCode": "P001",
      "partName": "发动机",
      "partSn": "SN001",
      "supplierCode": "S001",
      "supplierName": "供应商A",
      "bindTime": "2026-03-25 08:31:00",
      "workstationId": 1,
      "operatorName": "张三"
    },
    {
      "id": 2002,
      "workOrderId": 1,
      "vin": "LSVNV2182E2100001",
      "partCode": "P002",
      "partName": "变速箱",
      "partSn": "SN002",
      "supplierCode": "S002",
      "supplierName": "供应商B",
      "bindTime": "2026-03-25 08:35:00",
      "workstationId": 1,
      "operatorName": "张三"
    }
  ],
  "msg": "操作成功"
}
```

---

## 4. 状态码说明

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

## 5. 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 操作成功 |
| 1001 | 参数校验失败 |
| 1002 | 工单不存在 |
| 1003 | 工序不存在 |
| 1004 | VIN码不存在 |
| 1005 | 作业记录不存在 |
| 1006 | 作业已完成，无法重复操作 |
| 1007 | 关键件已被绑定 |

---

## 6. 注意事项

1. 所有接口均需要登录认证，并在请求头中携带 Token
2. 权限标识需要在用户角色中配置才能访问对应接口
3. VIN 码格式需符合车辆识别代码标准（17位字符）
4. 扭矩值单位为 N·m，需保留两位小数
5. 作业时长由系统自动计算，单位为秒