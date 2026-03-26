# 生产工单管理模块 API 接口文档

## 模块概述

生产工单管理模块是 MES 系统的核心模块之一，用于管理生产制造过程中的工单全生命周期。该模块支持工单的创建、修改、删除、查询等基础操作，以及工单的下发、开始生产、完成、关闭等业务操作，实现了从计划到生产完成的全流程管理。

### 主要功能

- 工单基础管理：创建、修改、删除、查询工单
- 工单状态流转：下发、开始生产、完成、关闭
- 工单分页查询与列表查询
- 工单数据导出（Excel）

---

## 接口列表

| 序号 | 接口名称 | HTTP方法 | 路径 | 权限标识 |
|------|----------|----------|------|----------|
| 1 | 创建生产工单 | POST | /mes/work-order/create | mes:work-order:create |
| 2 | 更新生产工单 | PUT | /mes/work-order/update | mes:work-order:update |
| 3 | 删除生产工单 | DELETE | /mes/work-order/delete | mes:work-order:delete |
| 4 | 获得生产工单 | GET | /mes/work-order/get | mes:work-order:query |
| 5 | 获得生产工单分页 | GET | /mes/work-order/page | mes:work-order:query |
| 6 | 获得生产工单列表 | GET | /mes/work-order/list | mes:work-order:query |
| 7 | 导出生产工单 Excel | GET | /mes/work-order/export-excel | mes:work-order:export |
| 8 | 下发工单 | PUT | /mes/work-order/release | mes:work-order:operate |
| 9 | 开始生产 | PUT | /mes/work-order/start | mes:work-order:operate |
| 10 | 完成工单 | PUT | /mes/work-order/complete | mes:work-order:operate |
| 11 | 关闭工单 | PUT | /mes/work-order/close | mes:work-order:operate |

---

## 接口详细说明

### 1. 创建生产工单

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/work-order/create |
| 方法 | POST |
| 描述 | 创建新的生产工单 |
| 权限 | mes:work-order:create |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| orderNo | String | 否 | 工单编号，不填则系统自动生成 | WO202603250001 |
| erpOrderNo | String | 否 | ERP订单编号 | ERP001 |
| productId | Long | 是 | 产品ID | 1 |
| productCode | String | 是 | 产品编码 | P001 |
| productName | String | 是 | 产品名称 | 汽车A |
| planQty | Integer | 是 | 计划数量 | 100 |
| routingId | Long | 是 | 工艺路线ID | 1 |
| routingName | String | 否 | 工艺路线名称 | 总装线A |
| priority | Integer | 否 | 优先级(1-10) | 5 |
| planStartTime | LocalDateTime | 是 | 计划开始时间 | 2026-03-25 08:00:00 |
| planEndTime | LocalDateTime | 是 | 计划结束时间 | 2026-03-25 17:00:00 |
| workshopId | Long | 否 | 车间ID | 1 |
| workshopName | String | 否 | 车间名称 | 总装车间 |
| lineId | Long | 是 | 产线ID | 1 |
| lineName | String | 否 | 产线名称 | 产线A |
| remark | String | 否 | 备注 | 备注信息 |

#### 请求示例

```json
{
  "orderNo": "WO202603250001",
  "erpOrderNo": "ERP001",
  "productId": 1,
  "productCode": "P001",
  "productName": "汽车A",
  "planQty": 100,
  "routingId": 1,
  "routingName": "总装线A",
  "priority": 5,
  "planStartTime": "2026-03-25 08:00:00",
  "planEndTime": "2026-03-25 17:00:00",
  "workshopId": 1,
  "workshopName": "总装车间",
  "lineId": 1,
  "lineName": "产线A",
  "remark": "紧急生产订单"
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Long | 创建成功的工单ID |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": 1,
  "msg": "操作成功"
}
```

---

### 2. 更新生产工单

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/work-order/update |
| 方法 | PUT |
| 描述 | 更新已有的生产工单信息 |
| 权限 | mes:work-order:update |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工单编号 | 1 |
| orderNo | String | 否 | 工单编号 | WO202603250001 |
| erpOrderNo | String | 否 | ERP订单编号 | ERP001 |
| productId | Long | 是 | 产品ID | 1 |
| productCode | String | 是 | 产品编码 | P001 |
| productName | String | 是 | 产品名称 | 汽车A |
| planQty | Integer | 是 | 计划数量 | 100 |
| routingId | Long | 是 | 工艺路线ID | 1 |
| routingName | String | 否 | 工艺路线名称 | 总装线A |
| priority | Integer | 否 | 优先级(1-10) | 5 |
| planStartTime | LocalDateTime | 是 | 计划开始时间 | 2026-03-25 08:00:00 |
| planEndTime | LocalDateTime | 是 | 计划结束时间 | 2026-03-25 17:00:00 |
| workshopId | Long | 否 | 车间ID | 1 |
| workshopName | String | 否 | 车间名称 | 总装车间 |
| lineId | Long | 是 | 产线ID | 1 |
| lineName | String | 否 | 产线名称 | 产线A |
| remark | String | 否 | 备注 | 备注信息 |

#### 请求示例

```json
{
  "id": 1,
  "orderNo": "WO202603250001",
  "erpOrderNo": "ERP001",
  "productId": 1,
  "productCode": "P001",
  "productName": "汽车A",
  "planQty": 150,
  "routingId": 1,
  "routingName": "总装线A",
  "priority": 8,
  "planStartTime": "2026-03-25 08:00:00",
  "planEndTime": "2026-03-25 18:00:00",
  "workshopId": 1,
  "workshopName": "总装车间",
  "lineId": 1,
  "lineName": "产线A",
  "remark": "数量调整至150"
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Boolean | 是否成功 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": true,
  "msg": "操作成功"
}
```

---

### 3. 删除生产工单

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/work-order/delete |
| 方法 | DELETE |
| 描述 | 删除指定的生产工单 |
| 权限 | mes:work-order:delete |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工单编号 | 1 |

#### 请求示例

```
DELETE /mes/work-order/delete?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Boolean | 是否成功 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": true,
  "msg": "操作成功"
}
```

---

### 4. 获得生产工单

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/work-order/get |
| 方法 | GET |
| 描述 | 根据ID获取生产工单详情 |
| 权限 | mes:work-order:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工单编号 | 1 |

#### 请求示例

```
GET /mes/work-order/get?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Object | 工单详情对象 |
| msg | String | 提示信息 |

**data 对象结构：**

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| id | Long | 编号 | 1 |
| orderNo | String | 工单编号 | WO202603250001 |
| erpOrderNo | String | ERP订单编号 | ERP001 |
| productId | Long | 产品ID | 1 |
| productCode | String | 产品编码 | P001 |
| productName | String | 产品名称 | 汽车A |
| planQty | Integer | 计划数量 | 100 |
| actualQty | Integer | 实际数量 | 50 |
| routingId | Long | 工艺路线ID | 1 |
| routingName | String | 工艺路线名称 | 总装线A |
| status | Integer | 状态 | 0 |
| priority | Integer | 优先级 | 5 |
| planStartTime | LocalDateTime | 计划开始时间 | 2026-03-25 08:00:00 |
| planEndTime | LocalDateTime | 计划结束时间 | 2026-03-25 17:00:00 |
| actualStartTime | LocalDateTime | 实际开始时间 | 2026-03-25 08:30:00 |
| actualEndTime | LocalDateTime | 实际结束时间 | 2026-03-25 16:30:00 |
| workshopId | Long | 车间ID | 1 |
| workshopName | String | 车间名称 | 总装车间 |
| lineId | Long | 产线ID | 1 |
| lineName | String | 产线名称 | 产线A |
| remark | String | 备注 | 备注信息 |
| createTime | LocalDateTime | 创建时间 | 2026-03-25 07:00:00 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "orderNo": "WO202603250001",
    "erpOrderNo": "ERP001",
    "productId": 1,
    "productCode": "P001",
    "productName": "汽车A",
    "planQty": 100,
    "actualQty": 50,
    "routingId": 1,
    "routingName": "总装线A",
    "status": 1,
    "priority": 5,
    "planStartTime": "2026-03-25 08:00:00",
    "planEndTime": "2026-03-25 17:00:00",
    "actualStartTime": "2026-03-25 08:30:00",
    "actualEndTime": null,
    "workshopId": 1,
    "workshopName": "总装车间",
    "lineId": 1,
    "lineName": "产线A",
    "remark": "紧急生产订单",
    "createTime": "2026-03-25 07:00:00"
  },
  "msg": "操作成功"
}
```

---

### 5. 获得生产工单分页

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/work-order/page |
| 方法 | GET |
| 描述 | 分页查询生产工单列表 |
| 权限 | mes:work-order:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| pageNo | Integer | 否 | 页码，默认1 | 1 |
| pageSize | Integer | 否 | 每页条数，默认10 | 10 |
| orderNo | String | 否 | 工单编号 | WO202603250001 |
| erpOrderNo | String | 否 | ERP订单编号 | ERP001 |
| productCode | String | 否 | 产品编码 | P001 |
| productName | String | 否 | 产品名称（支持模糊查询） | 汽车 |
| status | Integer | 否 | 状态 | 0 |
| lineId | Long | 否 | 产线ID | 1 |
| workshopId | Long | 否 | 车间ID | 1 |
| planStartTime | LocalDateTime[] | 否 | 计划开始时间范围 | ["2026-03-01 00:00:00", "2026-03-31 23:59:59"] |
| createTime | LocalDateTime[] | 否 | 创建时间范围 | ["2026-03-01 00:00:00", "2026-03-31 23:59:59"] |

#### 请求示例

```
GET /mes/work-order/page?pageNo=1&pageSize=10&status=1&workshopId=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Object | 分页结果对象 |
| msg | String | 提示信息 |

**data 对象结构：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| list | Array | 工单列表 |
| total | Long | 总记录数 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "orderNo": "WO202603250001",
        "erpOrderNo": "ERP001",
        "productId": 1,
        "productCode": "P001",
        "productName": "汽车A",
        "planQty": 100,
        "actualQty": 50,
        "routingId": 1,
        "routingName": "总装线A",
        "status": 1,
        "priority": 5,
        "planStartTime": "2026-03-25 08:00:00",
        "planEndTime": "2026-03-25 17:00:00",
        "actualStartTime": "2026-03-25 08:30:00",
        "actualEndTime": null,
        "workshopId": 1,
        "workshopName": "总装车间",
        "lineId": 1,
        "lineName": "产线A",
        "remark": "紧急生产订单",
        "createTime": "2026-03-25 07:00:00"
      }
    ],
    "total": 1
  },
  "msg": "操作成功"
}
```

---

### 6. 获得生产工单列表

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/work-order/list |
| 方法 | GET |
| 描述 | 获取生产工单列表（不分页） |
| 权限 | mes:work-order:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| orderNo | String | 否 | 工单编号 | WO202603250001 |
| erpOrderNo | String | 否 | ERP订单编号 | ERP001 |
| productCode | String | 否 | 产品编码 | P001 |
| productName | String | 否 | 产品名称（支持模糊查询） | 汽车 |
| status | Integer | 否 | 状态 | 0 |
| lineId | Long | 否 | 产线ID | 1 |
| workshopId | Long | 否 | 车间ID | 1 |
| planStartTime | LocalDateTime[] | 否 | 计划开始时间范围 | ["2026-03-01 00:00:00", "2026-03-31 23:59:59"] |
| createTime | LocalDateTime[] | 否 | 创建时间范围 | ["2026-03-01 00:00:00", "2026-03-31 23:59:59"] |

#### 请求示例

```
GET /mes/work-order/list?status=1&workshopId=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | 工单列表 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "orderNo": "WO202603250001",
      "erpOrderNo": "ERP001",
      "productId": 1,
      "productCode": "P001",
      "productName": "汽车A",
      "planQty": 100,
      "actualQty": 50,
      "routingId": 1,
      "routingName": "总装线A",
      "status": 1,
      "priority": 5,
      "planStartTime": "2026-03-25 08:00:00",
      "planEndTime": "2026-03-25 17:00:00",
      "actualStartTime": "2026-03-25 08:30:00",
      "actualEndTime": null,
      "workshopId": 1,
      "workshopName": "总装车间",
      "lineId": 1,
      "lineName": "产线A",
      "remark": "紧急生产订单",
      "createTime": "2026-03-25 07:00:00"
    }
  ],
  "msg": "操作成功"
}
```

---

### 7. 导出生产工单 Excel

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/work-order/export-excel |
| 方法 | GET |
| 描述 | 导出生产工单数据为Excel文件 |
| 权限 | mes:work-order:export |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| orderNo | String | 否 | 工单编号 | WO202603250001 |
| erpOrderNo | String | 否 | ERP订单编号 | ERP001 |
| productCode | String | 否 | 产品编码 | P001 |
| productName | String | 否 | 产品名称（支持模糊查询） | 汽车 |
| status | Integer | 否 | 状态 | 0 |
| lineId | Long | 否 | 产线ID | 1 |
| workshopId | Long | 否 | 车间ID | 1 |
| planStartTime | LocalDateTime[] | 否 | 计划开始时间范围 | ["2026-03-01 00:00:00", "2026-03-31 23:59:59"] |
| createTime | LocalDateTime[] | 否 | 创建时间范围 | ["2026-03-01 00:00:00", "2026-03-31 23:59:59"] |

#### 请求示例

```
GET /mes/work-order/export-excel?status=1&workshopId=1
```

#### 响应

返回 Excel 文件流，文件名为"生产工单.xls"

---

### 8. 下发工单

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/work-order/release |
| 方法 | PUT |
| 描述 | 将工单状态从草稿/计划状态变更为已下发状态 |
| 权限 | mes:work-order:operate |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工单编号 | 1 |

#### 请求示例

```
PUT /mes/work-order/release?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Boolean | 是否成功 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": true,
  "msg": "操作成功"
}
```

---

### 9. 开始生产

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/work-order/start |
| 方法 | PUT |
| 描述 | 将工单状态变更为生产中，并记录实际开始时间 |
| 权限 | mes:work-order:operate |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工单编号 | 1 |

#### 请求示例

```
PUT /mes/work-order/start?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Boolean | 是否成功 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": true,
  "msg": "操作成功"
}
```

---

### 10. 完成工单

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/work-order/complete |
| 方法 | PUT |
| 描述 | 将工单状态变更为已完成，并记录实际结束时间 |
| 权限 | mes:work-order:operate |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工单编号 | 1 |

#### 请求示例

```
PUT /mes/work-order/complete?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Boolean | 是否成功 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": true,
  "msg": "操作成功"
}
```

---

### 11. 关闭工单

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/work-order/close |
| 方法 | PUT |
| 描述 | 将工单状态变更为已关闭，工单不再允许任何操作 |
| 权限 | mes:work-order:operate |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工单编号 | 1 |

#### 请求示例

```
PUT /mes/work-order/close?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Boolean | 是否成功 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": true,
  "msg": "操作成功"
}
```

---

## 附录

### 工单状态说明

| 状态值 | 状态名称 | 说明 |
|--------|----------|------|
| 0 | 草稿/计划 | 工单创建后的初始状态 |
| 1 | 已下发 | 工单已下发到生产线 |
| 2 | 生产中 | 工单正在生产 |
| 3 | 已完成 | 工单生产完成 |
| 4 | 已关闭 | 工单已关闭 |

### 统一响应格式

所有接口均使用 CommonResult 统一响应格式：

```json
{
  "code": 0,        // 状态码，0表示成功，非0表示失败
  "data": {},       // 返回数据
  "msg": "操作成功"  // 提示信息
}
```

### 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 无权限 |
| 500 | 服务器内部错误 |