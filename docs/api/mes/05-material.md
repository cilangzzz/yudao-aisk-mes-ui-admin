# 物料管理模块 API 接口文档

## 1. 模块概述

物料管理模块是 MES 系统中负责车间现场物料管理的核心模块，主要实现线边库存的管理和物料消耗记录功能。该模块支持按工位查询库存、缺料预警、物料入库和物料消耗等操作，为车间生产提供物料保障。

### 主要功能

- **库存查询**：支持线边库存的分页查询和按工位查询
- **缺料预警**：当库存数量低于安全库存时自动预警
- **物料入库**：支持线边物料的入库操作
- **物料消耗**：记录生产过程中的物料消耗情况

---

## 2. 接口列表

| 序号 | 接口名称 | HTTP 方法 | 路径 | 权限标识 |
|------|----------|-----------|------|----------|
| 1 | 获得线边库存分页 | GET | /mes/stock/page | mes:stock:query |
| 2 | 按工位查询库存 | GET | /mes/stock/list-by-workstation | mes:stock:query |
| 3 | 获得缺料预警列表 | GET | /mes/stock/warning-list | mes:stock:query |
| 4 | 物料消耗 | POST | /mes/stock/consume | mes:stock:update |
| 5 | 线边物料入库 | POST | /mes/stock/in | mes:stock:update |
| 6 | 获得线边库存 | GET | /mes/stock/get | mes:stock:query |

---

## 3. 接口详细说明

### 3.1 获得线边库存分页

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/stock/page |
| 方法 | GET |
| 描述 | 分页查询线边库存列表 |
| 权限 | mes:stock:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| pageNo | Integer | 否 | 页码（默认1） | 1 |
| pageSize | Integer | 否 | 每页数量（默认10） | 10 |
| materialCode | String | 否 | 物料编码 | MAT001 |
| materialName | String | 否 | 物料名称 | 焊丝 |
| workstationId | Long | 否 | 工位ID | 1 |

#### 请求示例

```
GET /mes/stock/page?pageNo=1&pageSize=10&materialName=焊丝
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| list | Array | 库存记录列表 |
| total | Long | 总记录数 |

**list 数组元素结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | Long | 编号 |
| materialCode | String | 物料编码 |
| materialName | String | 物料名称 |
| workstationId | Long | 工位ID |
| workstationName | String | 工位名称 |
| qty | BigDecimal | 库存数量 |
| safetyQty | BigDecimal | 安全库存 |
| unit | String | 单位 |
| lastUpdateTime | LocalDateTime | 最后更新时间 |
| createTime | LocalDateTime | 创建时间 |
| warning | Boolean | 是否缺料预警 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "materialCode": "MAT001",
        "materialName": "焊丝",
        "workstationId": 1,
        "workstationName": "焊接工位1",
        "qty": 100.5,
        "safetyQty": 20.0,
        "unit": "kg",
        "lastUpdateTime": "2026-03-25 10:30:00",
        "createTime": "2026-03-01 08:00:00",
        "warning": false
      },
      {
        "id": 2,
        "materialCode": "MAT002",
        "materialName": "螺栓",
        "workstationId": 1,
        "workstationName": "焊接工位1",
        "qty": 15.0,
        "safetyQty": 50.0,
        "unit": "个",
        "lastUpdateTime": "2026-03-25 09:15:00",
        "createTime": "2026-03-01 08:00:00",
        "warning": true
      }
    ],
    "total": 2
  },
  "msg": "操作成功"
}
```

---

### 3.2 按工位查询库存

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/stock/list-by-workstation |
| 方法 | GET |
| 描述 | 根据工位ID查询该工位下的所有物料库存 |
| 权限 | mes:stock:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| workstationId | Long | 是 | 工位ID | 1 |

#### 请求示例

```
GET /mes/stock/list-by-workstation?workstationId=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| - | Array | 库存记录列表 |

**数组元素结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | Long | 编号 |
| materialCode | String | 物料编码 |
| materialName | String | 物料名称 |
| workstationId | Long | 工位ID |
| workstationName | String | 工位名称 |
| qty | BigDecimal | 库存数量 |
| safetyQty | BigDecimal | 安全库存 |
| unit | String | 单位 |
| lastUpdateTime | LocalDateTime | 最后更新时间 |
| createTime | LocalDateTime | 创建时间 |
| warning | Boolean | 是否缺料预警 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "materialCode": "MAT001",
      "materialName": "焊丝",
      "workstationId": 1,
      "workstationName": "焊接工位1",
      "qty": 100.5,
      "safetyQty": 20.0,
      "unit": "kg",
      "lastUpdateTime": "2026-03-25 10:30:00",
      "createTime": "2026-03-01 08:00:00",
      "warning": false
    },
    {
      "id": 2,
      "materialCode": "MAT002",
      "materialName": "螺栓",
      "workstationId": 1,
      "workstationName": "焊接工位1",
      "qty": 15.0,
      "safetyQty": 50.0,
      "unit": "个",
      "lastUpdateTime": "2026-03-25 09:15:00",
      "createTime": "2026-03-01 08:00:00",
      "warning": true
    }
  ],
  "msg": "操作成功"
}
```

---

### 3.3 获得缺料预警列表

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/stock/warning-list |
| 方法 | GET |
| 描述 | 获取库存数量低于安全库存的物料列表（缺料预警） |
| 权限 | mes:stock:query |

#### 请求参数

无

#### 请求示例

```
GET /mes/stock/warning-list
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| - | Array | 缺料预警物料列表 |

**数组元素结构**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | Long | 编号 |
| materialCode | String | 物料编码 |
| materialName | String | 物料名称 |
| workstationId | Long | 工位ID |
| workstationName | String | 工位名称 |
| qty | BigDecimal | 库存数量 |
| safetyQty | BigDecimal | 安全库存 |
| unit | String | 单位 |
| lastUpdateTime | LocalDateTime | 最后更新时间 |
| createTime | LocalDateTime | 创建时间 |
| warning | Boolean | 是否缺料预警（始终为true） |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 2,
      "materialCode": "MAT002",
      "materialName": "螺栓",
      "workstationId": 1,
      "workstationName": "焊接工位1",
      "qty": 15.0,
      "safetyQty": 50.0,
      "unit": "个",
      "lastUpdateTime": "2026-03-25 09:15:00",
      "createTime": "2026-03-01 08:00:00",
      "warning": true
    },
    {
      "id": 5,
      "materialCode": "MAT005",
      "materialName": "密封胶",
      "workstationId": 2,
      "workstationName": "装配工位1",
      "qty": 2.5,
      "safetyQty": 10.0,
      "unit": "支",
      "lastUpdateTime": "2026-03-25 11:00:00",
      "createTime": "2026-03-01 08:00:00",
      "warning": true
    }
  ],
  "msg": "操作成功"
}
```

---

### 3.4 物料消耗

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/stock/consume |
| 方法 | POST |
| 描述 | 记录物料消耗并扣减线边库存 |
| 权限 | mes:stock:update |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| vin | String | 否 | 车辆VIN | LSVAU2180N2181234 |
| workOrderId | Long | 否 | 工单ID | 1 |
| materialCode | String | 是 | 物料编码 | MAT001 |
| materialName | String | 是 | 物料名称 | 焊丝 |
| qty | BigDecimal | 是 | 消耗数量 | 5.5 |
| unit | String | 否 | 单位 | kg |
| workstationId | Long | 是 | 消耗工位ID | 1 |
| operatorId | Long | 否 | 操作员ID | 1 |
| operatorName | String | 否 | 操作员姓名 | 张三 |
| remark | String | 否 | 备注 | 正常消耗 |

#### 请求示例

```json
{
  "vin": "LSVAU2180N2181234",
  "workOrderId": 1,
  "materialCode": "MAT001",
  "materialName": "焊丝",
  "qty": 5.5,
  "unit": "kg",
  "workstationId": 1,
  "operatorId": 1,
  "operatorName": "张三",
  "remark": "正常消耗"
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

### 3.5 线边物料入库

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/stock/in |
| 方法 | POST |
| 描述 | 线边物料入库，增加库存数量 |
| 权限 | mes:stock:update |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| materialCode | String | 是 | 物料编码 | MAT001 |
| materialName | String | 是 | 物料名称 | 焊丝 |
| workstationId | Long | 是 | 工位ID | 1 |
| qty | BigDecimal | 是 | 入库数量 | 100.5 |
| safetyQty | BigDecimal | 否 | 安全库存 | 20.0 |
| unit | String | 否 | 单位 | kg |

#### 请求示例

```json
{
  "materialCode": "MAT001",
  "materialName": "焊丝",
  "workstationId": 1,
  "qty": 100.5,
  "safetyQty": 20.0,
  "unit": "kg"
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

### 3.6 获得线边库存

#### 基本信息

| 项目 | 说明 |
|------|------|
| 路径 | /mes/stock/get |
| 方法 | GET |
| 描述 | 根据ID获取单条库存记录详情 |
| 权限 | mes:stock:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 编号 | 1024 |

#### 请求示例

```
GET /mes/stock/get?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | Long | 编号 |
| materialCode | String | 物料编码 |
| materialName | String | 物料名称 |
| workstationId | Long | 工位ID |
| workstationName | String | 工位名称 |
| qty | BigDecimal | 库存数量 |
| safetyQty | BigDecimal | 安全库存 |
| unit | String | 单位 |
| lastUpdateTime | LocalDateTime | 最后更新时间 |
| createTime | LocalDateTime | 创建时间 |
| warning | Boolean | 是否缺料预警 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "materialCode": "MAT001",
    "materialName": "焊丝",
    "workstationId": 1,
    "workstationName": "焊接工位1",
    "qty": 100.5,
    "safetyQty": 20.0,
    "unit": "kg",
    "lastUpdateTime": "2026-03-25 10:30:00",
    "createTime": "2026-03-01 08:00:00",
    "warning": false
  },
  "msg": "操作成功"
}
```

---

## 4. 业务规则说明

### 缺料预警规则

当库存数量 (qty) 小于安全库存 (safetyQty) 时，系统会自动标记为缺料预警状态（warning = true）。缺料预警列表接口仅返回满足此条件的记录。

### 库存计算规则

- **入库操作**：新增库存或累加到已有库存记录
- **消耗操作**：从库存中扣减指定数量，同时生成消耗记录
- **库存不足**：当消耗数量大于当前库存时，接口将返回错误

### 工位库存隔离

同一物料在不同工位下分别维护独立的库存记录，互不影响。

---

## 5. 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 操作成功 |
| 2001 | 参数校验失败 |
| 2002 | 物料编码不能为空 |
| 2003 | 物料名称不能为空 |
| 2004 | 消耗数量不能为空 |
| 2005 | 消耗工位不能为空 |
| 2006 | 库存不足 |
| 2007 | 库存记录不存在 |
| 2008 | 工位不存在 |

---

## 6. 注意事项

1. 所有接口均需要登录认证，并在请求头中携带 Token
2. 权限标识需要在用户角色中配置才能访问对应接口
3. 库存数量使用 BigDecimal 类型，保留两位小数
4. 入库时如果工位+物料组合已存在，则累加库存数量
5. 消耗操作会同时记录消耗明细和更新库存
6. 建议定期查看缺料预警列表，及时补充物料