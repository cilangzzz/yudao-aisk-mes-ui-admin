# MES 移动终端 API 接口文档

## 模块概述

移动终端模块提供 MES 系统在移动设备上的核心作业功能，主要包括扫码解析、作业执行、关键件绑定和异常上报等功能。该模块支持生产线工人在工位终端上通过扫描条码快速获取作业信息、执行生产作业并记录关键数据。

### 功能特性

- **扫码解析**: 支持扫描 VIN 码、工单码、物料码、关键件码等多种条码类型，自动识别并返回对应信息
- **作业执行**: 提供开始作业和完成作业的完整流程支持，支持扭矩值记录和质量判定
- **关键件绑定**: 实现关键零部件与车辆的绑定追溯，支持供应商信息和序列号管理
- **异常上报**: 支持生产过程中异常情况的上报，可附带图片和详细描述

### 接口前缀

移动端接口统一使用 `/app-api` 前缀，无需权限校验。

---

## 接口列表

| 序号 | 接口名称 | HTTP方法 | 路径 | 权限标识 |
|------|----------|----------|------|----------|
| 1 | 扫码解析 | POST | /app-api/mes/operation/scan | 无 |
| 2 | 开始作业 | POST | /app-api/mes/operation/start | 无 |
| 3 | 完成作业 | PUT | /app-api/mes/operation/complete | 无 |
| 4 | 绑定关键件 | POST | /app-api/mes/operation/bind-part | 无 |
| 5 | 异常上报 | POST | /app-api/mes/exception/report | 无 |

---

## 接口详细说明

### 1. 扫码解析

#### 基本信息

| 项目 | 说明 |
|------|------|
| 接口路径 | `/app-api/mes/operation/scan` |
| 请求方法 | POST |
| 接口描述 | 扫描条码并解析内容，自动识别条码类型（VIN/工单/物料/关键件），返回对应的业务信息 |
| 权限标识 | 无 |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| scanCode | String | 是 | 扫码内容，支持 VIN 码、工单编号、物料编码、关键件编码等 | `LSVNV2182E2100001` |
| workstationId | Long | 是 | 当前工位 ID | `1` |

#### 请求示例

```json
{
  "scanCode": "LSVNV2182E2100001",
  "workstationId": 1
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| scanType | String | 扫码类型: VIN/WORK_ORDER/MATERIAL/KEY_PART |
| vin | String | VIN 码 |
| workOrderNo | String | 工单编号 |
| workOrderId | Long | 工单 ID |
| productName | String | 产品名称 |
| currentOperation | Object | 当前工序信息 |
| boundParts | Array | 已绑定关键件列表 |
| success | Boolean | 扫码结果: true-成功, false-失败 |
| failReason | String | 失败原因（扫码失败时返回） |

**currentOperation 对象结构:**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| operationId | Long | 工序 ID |
| operationCode | String | 工序编码 |
| operationName | String | 工序名称 |
| sequence | Integer | 工序顺序 |
| keyOperation | Boolean | 是否关键工序 |
| instruction | String | 作业指导 |
| torqueRequirement | String | 扭矩要求 |
| keyParts | Array | 所需关键件列表 |

**keyParts 数组元素结构:**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| partCode | String | 零部件编码 |
| partName | String | 零部件名称 |
| required | Boolean | 是否必须 |

**boundParts 数组元素结构:**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| partCode | String | 零部件编码 |
| partName | String | 零部件名称 |
| partSn | String | 零部件序列号 |
| bound | Boolean | 绑定状态 |

#### 响应示例

**成功响应（VIN 码扫描）:**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "scanType": "VIN",
    "vin": "LSVNV2182E2100001",
    "workOrderNo": "WO202403250001",
    "workOrderId": 1001,
    "productName": "Model Y 后驱版",
    "currentOperation": {
      "operationId": 201,
      "operationCode": "OP010",
      "operationName": "前悬架装配",
      "sequence": 10,
      "keyOperation": true,
      "instruction": "请按照作业指导书 SOP-OP010 进行操作",
      "torqueRequirement": "120±5 N·m",
      "keyParts": [
        {
          "partCode": "P001",
          "partName": "前减震器总成",
          "required": true
        },
        {
          "partCode": "P002",
          "partName": "下摆臂",
          "required": true
        }
      ]
    },
    "boundParts": [
      {
        "partCode": "P001",
        "partName": "前减震器总成",
        "partSn": "SN20240325001",
        "bound": true
      }
    ],
    "success": true,
    "failReason": null
  }
}
```

**失败响应:**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "scanType": null,
    "vin": null,
    "workOrderNo": null,
    "workOrderId": null,
    "productName": null,
    "currentOperation": null,
    "boundParts": null,
    "success": false,
    "failReason": "未识别的条码格式，请确认条码内容是否正确"
  }
}
```

---

### 2. 开始作业

#### 基本信息

| 项目 | 说明 |
|------|------|
| 接口路径 | `/app-api/mes/operation/start` |
| 请求方法 | POST |
| 接口描述 | 开始执行指定工单的工序作业，创建作业记录并返回记录 ID |
| 权限标识 | 无 |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| workOrderId | Long | 是 | 工单 ID | `1001` |
| vin | String | 是 | VIN 码 | `LSVNV2182E2100001` |
| operationId | Long | 是 | 工序 ID | `201` |
| workstationId | Long | 是 | 工作站 ID | `1` |
| remark | String | 否 | 备注 | `开始前悬架装配` |

#### 请求示例

```json
{
  "workOrderId": 1001,
  "vin": "LSVNV2182E2100001",
  "operationId": 201,
  "workstationId": 1,
  "remark": "开始前悬架装配"
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data | Long | 作业记录 ID |

#### 响应示例

```json
{
  "code": 0,
  "msg": "success",
  "data": 5001
}
```

---

### 3. 完成作业

#### 基本信息

| 项目 | 说明 |
|------|------|
| 接口路径 | `/app-api/mes/operation/complete` |
| 请求方法 | PUT |
| 接口描述 | 完成指定的作业记录，记录作业结果、扭矩值等质量数据 |
| 权限标识 | 无 |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| recordId | Long | 是 | 作业记录 ID（开始作业时返回的 ID） | `5001` |
| result | Integer | 否 | 作业结果: 0-合格, 1-不合格 | `0` |
| torqueValue | BigDecimal | 否 | 扭矩值（单位: N·m） | `120.50` |
| torqueResult | Integer | 否 | 扭矩判定: 0-合格, 1-不合格 | `0` |
| remark | String | 否 | 备注 | `作业完成，扭矩合格` |

#### 请求示例

```json
{
  "recordId": 5001,
  "result": 0,
  "torqueValue": 120.50,
  "torqueResult": 0,
  "remark": "作业完成，扭矩合格"
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data | Boolean | 操作结果: true-成功 |

#### 响应示例

```json
{
  "code": 0,
  "msg": "success",
  "data": true
}
```

---

### 4. 绑定关键件

#### 基本信息

| 项目 | 说明 |
|------|------|
| 接口路径 | `/app-api/mes/operation/bind-part` |
| 请求方法 | POST |
| 接口描述 | 将关键零部件与车辆进行绑定，实现零部件追溯管理 |
| 权限标识 | 无 |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| workOrderId | Long | 是 | 工单 ID | `1001` |
| operationRecordId | Long | 否 | 作业记录 ID | `5001` |
| vin | String | 是 | VIN 码 | `LSVNV2182E2100001` |
| partCode | String | 是 | 零部件编码 | `P001` |
| partName | String | 是 | 零部件名称 | `前减震器总成` |
| partSn | String | 是 | 零部件序列号 | `SN20240325001` |
| supplierCode | String | 否 | 供应商编码 | `S001` |
| supplierName | String | 否 | 供应商名称 | `采埃孚` |
| workstationId | Long | 否 | 绑定工位 ID | `1` |
| remark | String | 否 | 备注 | `关键件绑定` |

#### 请求示例

```json
{
  "workOrderId": 1001,
  "operationRecordId": 5001,
  "vin": "LSVNV2182E2100001",
  "partCode": "P001",
  "partName": "前减震器总成",
  "partSn": "SN20240325001",
  "supplierCode": "S001",
  "supplierName": "采埃孚",
  "workstationId": 1,
  "remark": "关键件绑定"
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data | Long | 绑定记录 ID |

#### 响应示例

```json
{
  "code": 0,
  "msg": "success",
  "data": 3001
}
```

---

### 5. 异常上报

#### 基本信息

| 项目 | 说明 |
|------|------|
| 接口路径 | `/app-api/mes/exception/report` |
| 请求方法 | POST |
| 接口描述 | 上报生产过程中的异常情况，支持上传图片和详细描述 |
| 权限标识 | 无 |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| vin | String | 是 | VIN 码 | `LSVNV2182E2100001` |
| workOrderId | Long | 是 | 工单 ID | `1001` |
| operationId | Long | 是 | 工序 ID | `201` |
| workstationId | Long | 是 | 工位 ID | `1` |
| exceptionReason | String | 是 | 异常原因 | `零部件缺失` |
| exceptionDesc | String | 否 | 异常详细描述 | `前减震器总成库存不足，需要补货` |
| imageUrls | List\<String\> | 否 | 异常图片 URL 列表 | `["https://example.com/img1.jpg"]` |

#### 请求示例

```json
{
  "vin": "LSVNV2182E2100001",
  "workOrderId": 1001,
  "operationId": 201,
  "workstationId": 1,
  "exceptionReason": "零部件缺失",
  "exceptionDesc": "前减震器总成库存不足，需要补货",
  "imageUrls": [
    "https://mes.example.com/images/exception/20240325_001.jpg",
    "https://mes.example.com/images/exception/20240325_002.jpg"
  ]
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data | Boolean | 操作结果: true-成功 |

#### 响应示例

```json
{
  "code": 0,
  "msg": "success",
  "data": true
}
```

---

## 统一响应格式

所有接口均使用 `CommonResult` 统一响应格式:

```json
{
  "code": 0,
  "msg": "success",
  "data": { ... }
}
```

### 响应码说明

| 响应码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 无权限 |
| 500 | 服务器内部错误 |

---

## 典型业务流程

### 作业执行流程

```
1. 工人扫描 VIN 码 -> 调用扫码解析接口
2. 获取当前工序信息和已绑定关键件列表
3. 点击"开始作业" -> 调用开始作业接口，获取作业记录 ID
4. 扫描关键件条码 -> 调用绑定关键件接口（如需要）
5. 执行作业操作（如扭矩拧紧）
6. 点击"完成作业" -> 调用完成作业接口，记录结果
7. 如遇异常 -> 调用异常上报接口
```

### 关键件绑定流程

```
1. 扫描关键件条码 -> 调用扫码解析接口，scanType=KEY_PART
2. 确认零部件信息
3. 调用绑定关键件接口，将零部件与车辆 VIN 绑定
4. 系统记录追溯数据
```

---

## 错误处理

### 业务错误示例

**工单不存在:**

```json
{
  "code": 500,
  "msg": "工单不存在",
  "data": null
}
```

**VIN 码格式错误:**

```json
{
  "code": 400,
  "msg": "VIN码格式不正确",
  "data": null
}
```

**作业记录不存在:**

```json
{
  "code": 500,
  "msg": "作业记录不存在",
  "data": null
}
```

**关键件已绑定:**

```json
{
  "code": 500,
  "msg": "该关键件已被其他车辆绑定",
  "data": null
}
```

---

## 附录

### 扫码类型枚举

| 枚举值 | 说明 |
|--------|------|
| VIN | 车辆识别码 |
| WORK_ORDER | 工单编号 |
| MATERIAL | 物料编码 |
| KEY_PART | 关键件编码 |

### 作业结果枚举

| 枚举值 | 说明 |
|--------|------|
| 0 | 合格 |
| 1 | 不合格 |

### 扭矩判定枚举

| 枚举值 | 说明 |
|--------|------|
| 0 | 合格 |
| 1 | 不合格 |