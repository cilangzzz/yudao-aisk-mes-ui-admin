# 产线管理模块 API 接口文档

## 1. 模块概述

产线管理模块用于管理企业的生产流水线信息，产线是车间下的生产单元，承载具体的生产作业活动。每条产线归属于一个车间，并可关联多个班组。该模块是生产计划排程、产能计算、人员排班的基础数据支撑。

**主要功能**：
- 产线信息的创建、更新、删除和查询
- 产线分页列表和全量列表查询
- 根据车间ID查询产线列表
- 产线精简信息列表（用于前端下拉选项）
- 产线数据 Excel 导出

**业务场景**：
- 定义企业生产线资源配置
- 为生产订单分配生产产线
- 为班组分配所属产线
- 计算产线产能和生产效率

---

## 2. 接口列表

| 序号 | 接口名称 | HTTP方法 | 路径 | 权限标识 |
|------|----------|----------|------|----------|
| 1 | 创建产线 | POST | /mes/production-line/create | mes:production-line:create |
| 2 | 更新产线 | PUT | /mes/production-line/update | mes:production-line:update |
| 3 | 删除产线 | DELETE | /mes/production-line/delete | mes:production-line:delete |
| 4 | 获得产线 | GET | /mes/production-line/get | mes:production-line:query |
| 5 | 获得产线分页 | GET | /mes/production-line/page | mes:production-line:query |
| 6 | 获得产线列表 | GET | /mes/production-line/list | mes:production-line:query |
| 7 | 获得产线精简信息列表 | GET | /mes/production-line/simple-list | 无需权限 |
| 8 | 获得车间下的产线列表 | GET | /mes/production-line/list-by-workshop | mes:production-line:query |
| 9 | 导出产线 Excel | GET | /mes/production-line/export-excel | mes:production-line:export |

---

## 3. 接口详细说明

### 3.1 创建产线

#### 基本信息
- **路径**: `/mes/production-line/create`
- **方法**: POST
- **描述**: 创建新的产线信息
- **权限**: `mes:production-line:create`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| lineCode | String | 是 | 产线编码 | LINE001 |
| lineName | String | 是 | 产线名称 | 主线A |
| workshopId | Long | 否 | 所属车间ID | 1 |
| status | Integer | 否 | 状态（0=启用，1=禁用） | 0 |
| description | String | 否 | 描述 | 这是主线A |

#### 请求示例

```json
{
  "lineCode": "LINE001",
  "lineName": "主线A",
  "workshopId": 1,
  "status": 0,
  "description": "总装车间主线A，负责整车装配"
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Long | 产线ID |
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

### 3.2 更新产线

#### 基本信息
- **路径**: `/mes/production-line/update`
- **方法**: PUT
- **描述**: 更新已有产线信息
- **权限**: `mes:production-line:update`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 产线编号 | 1 |
| lineCode | String | 是 | 产线编码 | LINE001 |
| lineName | String | 是 | 产线名称 | 主线A |
| workshopId | Long | 否 | 所属车间ID | 1 |
| status | Integer | 否 | 状态（0=启用，1=禁用） | 0 |
| description | String | 否 | 描述 | 这是主线A |

#### 请求示例

```json
{
  "id": 1,
  "lineCode": "LINE001",
  "lineName": "主线A",
  "workshopId": 1,
  "status": 0,
  "description": "更新后的主线A描述"
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

### 3.3 删除产线

#### 基本信息
- **路径**: `/mes/production-line/delete`
- **方法**: DELETE
- **描述**: 根据ID删除产线
- **权限**: `mes:production-line:delete`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 产线编号 | 1 |

#### 请求示例

```
DELETE /mes/production-line/delete?id=1
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

### 3.4 获得产线

#### 基本信息
- **路径**: `/mes/production-line/get`
- **方法**: GET
- **描述**: 根据ID获取产线详情
- **权限**: `mes:production-line:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 产线编号 | 1 |

#### 请求示例

```
GET /mes/production-line/get?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Object | 产线信息 |
| data.id | Long | 产线编号 |
| data.lineCode | String | 产线编码 |
| data.lineName | String | 产线名称 |
| data.workshopId | Long | 所属车间ID |
| data.workshopName | String | 所属车间名称 |
| data.status | Integer | 状态 |
| data.description | String | 描述 |
| data.createTime | DateTime | 创建时间 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "lineCode": "LINE001",
    "lineName": "主线A",
    "workshopId": 1,
    "workshopName": "总装车间",
    "status": 0,
    "description": "总装车间主线A，负责整车装配",
    "createTime": "2024-01-15 10:30:00"
  },
  "msg": "操作成功"
}
```

---

### 3.5 获得产线分页

#### 基本信息
- **路径**: `/mes/production-line/page`
- **方法**: GET
- **描述**: 分页查询产线列表
- **权限**: `mes:production-line:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| pageNo | Integer | 否 | 页码，默认1 | 1 |
| pageSize | Integer | 否 | 每页条数，默认10 | 10 |
| lineCode | String | 否 | 产线编码（模糊查询） | LINE |
| lineName | String | 否 | 产线名称（模糊查询） | 主线 |
| workshopId | Long | 否 | 所属车间ID | 1 |
| status | Integer | 否 | 状态 | 0 |

#### 请求示例

```
GET /mes/production-line/page?pageNo=1&pageSize=10&workshopId=1&status=0
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Object | 分页数据 |
| data.list | Array | 产线列表 |
| data.total | Long | 总记录数 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "lineCode": "LINE001",
        "lineName": "主线A",
        "workshopId": 1,
        "workshopName": "总装车间",
        "status": 0,
        "description": "总装车间主线A",
        "createTime": "2024-01-15 10:30:00"
      },
      {
        "id": 2,
        "lineCode": "LINE002",
        "lineName": "主线B",
        "workshopId": 1,
        "workshopName": "总装车间",
        "status": 0,
        "description": "总装车间主线B",
        "createTime": "2024-01-15 10:35:00"
      }
    ],
    "total": 2
  },
  "msg": "操作成功"
}
```

---

### 3.6 获得产线列表

#### 基本信息
- **路径**: `/mes/production-line/list`
- **方法**: GET
- **描述**: 查询产线全量列表（不分页）
- **权限**: `mes:production-line:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| lineCode | String | 否 | 产线编码（模糊查询） | LINE |
| lineName | String | 否 | 产线名称（模糊查询） | 主线 |
| workshopId | Long | 否 | 所属车间ID | 1 |
| status | Integer | 否 | 状态 | 0 |

#### 请求示例

```
GET /mes/production-line/list?status=0
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | 产线列表 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "lineCode": "LINE001",
      "lineName": "主线A",
      "workshopId": 1,
      "workshopName": "总装车间",
      "status": 0,
      "description": "总装车间主线A",
      "createTime": "2024-01-15 10:30:00"
    }
  ],
  "msg": "操作成功"
}
```

---

### 3.7 获得产线精简信息列表

#### 基本信息
- **路径**: `/mes/production-line/simple-list`
- **方法**: GET
- **描述**: 获取启用状态的产线精简信息列表，主要用于前端下拉选项
- **权限**: 无需权限

#### 请求参数

无

#### 请求示例

```
GET /mes/production-line/simple-list
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | 产线精简列表 |
| data.id | Long | 产线编号 |
| data.lineCode | String | 产线编码 |
| data.lineName | String | 产线名称 |
| data.workshopId | Long | 所属车间ID |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "lineCode": "LINE001",
      "lineName": "主线A",
      "workshopId": 1
    },
    {
      "id": 2,
      "lineCode": "LINE002",
      "lineName": "主线B",
      "workshopId": 1
    },
    {
      "id": 3,
      "lineCode": "LINE003",
      "lineName": "涂装线A",
      "workshopId": 2
    }
  ],
  "msg": "操作成功"
}
```

---

### 3.8 获得车间下的产线列表

#### 基本信息
- **路径**: `/mes/production-line/list-by-workshop`
- **方法**: GET
- **描述**: 根据车间ID获取该车间下的所有产线，用于车间产线联动选择
- **权限**: `mes:production-line:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| workshopId | Long | 是 | 车间编号 | 1 |

#### 请求示例

```
GET /mes/production-line/list-by-workshop?workshopId=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | 产线精简列表 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "lineCode": "LINE001",
      "lineName": "主线A",
      "workshopId": 1
    },
    {
      "id": 2,
      "lineCode": "LINE002",
      "lineName": "主线B",
      "workshopId": 1
    }
  ],
  "msg": "操作成功"
}
```

---

### 3.9 导出产线 Excel

#### 基本信息
- **路径**: `/mes/production-line/export-excel`
- **方法**: GET
- **描述**: 导出产线数据为 Excel 文件
- **权限**: `mes:production-line:export`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| lineCode | String | 否 | 产线编码（模糊查询） | LINE |
| lineName | String | 否 | 产线名称（模糊查询） | 主线 |
| workshopId | Long | 否 | 所属车间ID | 1 |
| status | Integer | 否 | 状态 | 0 |

#### 请求示例

```
GET /mes/production-line/export-excel?status=0
```

#### 响应参数

返回 Excel 文件流，文件名为 `产线.xls`

---

## 4. 状态码说明

| 状态值 | 说明 |
|--------|------|
| 0 | 启用 |
| 1 | 禁用 |

---

## 5. 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 无权限访问 |
| 500 | 服务器内部错误 |

---

## 6. 数据关联关系

### 组织层级关系

```
工厂
├── 车间（Workshop）
│   ├── 产线（ProductionLine）
│   │   ├── 班组（Team）
│   │   │   └── 班次（Shift）
│   │   └── 工位（WorkStation）
│   └── 设备（Equipment）
└── 仓库（Warehouse）
```

### 产线与其他模块的关系

| 关联模块 | 关联字段 | 说明 |
|----------|----------|------|
| 车间 | workshopId | 产线所属车间 |
| 班组 | lineId | 班组所属产线 |
| 工位 | lineId | 工位所属产线 |
| 设备 | lineId | 设备所属产线 |
| 工单 | lineId | 工单分配产线 |

---

## 7. 业务规则

### 删除规则
- 存在关联班组时，不允许删除产线
- 存在进行中的生产订单时，不允许删除产线

### 编码规则
- 产线编码唯一，不可重复
- 建议编码格式：LINE + 序号，如 LINE001、LINE002

### 状态变更
- 产线禁用后，该产线下的班组也将不可用
- 产线禁用后，不能在此产线上创建新的生产订单

---

## 8. 使用示例

### 典型产线配置示例

| 产线编码 | 产线名称 | 所属车间 | 状态 |
|----------|----------|----------|------|
| LINE001 | 主线A | 总装车间 | 启用 |
| LINE002 | 主线B | 总装车间 | 启用 |
| LINE003 | 涂装线A | 涂装车间 | 启用 |
| LINE004 | 焊装线A | 焊装车间 | 启用 |
| LINE005 | 冲压线A | 冲压车间 | 启用 |