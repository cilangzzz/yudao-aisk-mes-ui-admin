# 车间管理模块 API 接口文档

## 1. 模块概述

车间管理模块用于管理企业的生产车间信息，支持树形结构的车间层级管理。车间是生产制造的基本组织单元，下设产线、工位等生产资源。该模块与产线管理、班组管理紧密关联，是生产计划排程和资源分配的基础。

**主要功能**：
- 车间信息的创建、更新、删除和查询
- 支持树形结构的车间层级管理
- 车间列表查询
- 车间精简信息列表（用于前端下拉选项）

**业务场景**：
- 定义企业车间组织结构
- 支持多级车间管理（如工厂-车间-工段）
- 为产线分配所属车间
- 为生产订单分配生产车间

---

## 2. 接口列表

| 序号 | 接口名称 | HTTP方法 | 路径 | 权限标识 |
|------|----------|----------|------|----------|
| 1 | 创建车间 | POST | /mes/workshop/create | mes:workshop:create |
| 2 | 更新车间 | PUT | /mes/workshop/update | mes:workshop:update |
| 3 | 删除车间 | DELETE | /mes/workshop/delete | mes:workshop:delete |
| 4 | 获得车间信息 | GET | /mes/workshop/get | mes:workshop:query |
| 5 | 获取车间列表 | GET | /mes/workshop/list | mes:workshop:query |
| 6 | 获取车间精简信息列表 | GET | /mes/workshop/simple-list | 无需权限 |

---

## 3. 接口详细说明

### 3.1 创建车间

#### 基本信息
- **路径**: `/mes/workshop/create`
- **方法**: POST
- **描述**: 创建新的车间信息
- **权限**: `mes:workshop:create`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| workshopCode | String | 是 | 车间编码 | WS001 |
| workshopName | String | 是 | 车间名称 | 总装车间 |
| parentId | Long | 否 | 父级ID，顶级车间传0或不传 | 0 |
| sort | Integer | 否 | 显示顺序 | 1 |
| leaderUserId | Long | 否 | 负责人用户ID | 1 |
| status | Integer | 否 | 状态（0=启用，1=禁用） | 0 |
| description | String | 否 | 描述 | 这是总装车间 |

#### 请求示例

```json
{
  "workshopCode": "WS001",
  "workshopName": "总装车间",
  "parentId": 0,
  "sort": 1,
  "leaderUserId": 1,
  "status": 0,
  "description": "这是总装车间，负责整车装配"
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Long | 车间ID |
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

### 3.2 更新车间

#### 基本信息
- **路径**: `/mes/workshop/update`
- **方法**: PUT
- **描述**: 更新已有车间信息
- **权限**: `mes:workshop:update`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 车间编号 | 1 |
| workshopCode | String | 是 | 车间编码 | WS001 |
| workshopName | String | 是 | 车间名称 | 总装车间 |
| parentId | Long | 否 | 父级ID | 0 |
| sort | Integer | 否 | 显示顺序 | 1 |
| leaderUserId | Long | 否 | 负责人用户ID | 2 |
| status | Integer | 否 | 状态（0=启用，1=禁用） | 0 |
| description | String | 否 | 描述 | 这是总装车间 |

#### 请求示例

```json
{
  "id": 1,
  "workshopCode": "WS001",
  "workshopName": "总装车间",
  "parentId": 0,
  "sort": 1,
  "leaderUserId": 2,
  "status": 0,
  "description": "更新后的总装车间描述"
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

### 3.3 删除车间

#### 基本信息
- **路径**: `/mes/workshop/delete`
- **方法**: DELETE
- **描述**: 根据ID删除车间
- **权限**: `mes:workshop:delete`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 车间编号 | 1 |

#### 请求示例

```
DELETE /mes/workshop/delete?id=1
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

### 3.4 获得车间信息

#### 基本信息
- **路径**: `/mes/workshop/get`
- **方法**: GET
- **描述**: 根据ID获取车间详情
- **权限**: `mes:workshop:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 车间编号 | 1 |

#### 请求示例

```
GET /mes/workshop/get?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Object | 车间信息 |
| data.id | Long | 车间编号 |
| data.workshopCode | String | 车间编码 |
| data.workshopName | String | 车间名称 |
| data.parentId | Long | 父级ID |
| data.sort | Integer | 显示顺序 |
| data.leaderUserId | Long | 负责人用户ID |
| data.status | Integer | 状态 |
| data.description | String | 描述 |
| data.createTime | DateTime | 创建时间 |
| data.children | Array | 子车间列表 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "workshopCode": "WS001",
    "workshopName": "总装车间",
    "parentId": 0,
    "sort": 1,
    "leaderUserId": 1,
    "status": 0,
    "description": "这是总装车间",
    "createTime": "2024-01-15 10:30:00",
    "children": [
      {
        "id": 2,
        "workshopCode": "WS001-01",
        "workshopName": "内饰工段",
        "parentId": 1,
        "sort": 1,
        "status": 0,
        "createTime": "2024-01-15 10:35:00"
      }
    ]
  },
  "msg": "操作成功"
}
```

---

### 3.5 获取车间列表

#### 基本信息
- **路径**: `/mes/workshop/list`
- **方法**: GET
- **描述**: 查询车间列表
- **权限**: `mes:workshop:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| workshopCode | String | 否 | 车间编码（模糊查询） | WS |
| workshopName | String | 否 | 车间名称（模糊查询） | 总装 |
| status | Integer | 否 | 状态 | 0 |

#### 请求示例

```
GET /mes/workshop/list?status=0
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | 车间列表 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "workshopCode": "WS001",
      "workshopName": "总装车间",
      "parentId": 0,
      "sort": 1,
      "leaderUserId": 1,
      "status": 0,
      "description": "这是总装车间",
      "createTime": "2024-01-15 10:30:00",
      "children": [
        {
          "id": 2,
          "workshopCode": "WS001-01",
          "workshopName": "内饰工段",
          "parentId": 1,
          "sort": 1,
          "status": 0,
          "createTime": "2024-01-15 10:35:00",
          "children": []
        }
      ]
    },
    {
      "id": 3,
      "workshopCode": "WS002",
      "workshopName": "涂装车间",
      "parentId": 0,
      "sort": 2,
      "leaderUserId": 2,
      "status": 0,
      "description": "这是涂装车间",
      "createTime": "2024-01-15 11:00:00",
      "children": []
    }
  ],
  "msg": "操作成功"
}
```

---

### 3.6 获取车间精简信息列表

#### 基本信息
- **路径**: `/mes/workshop/simple-list`
- **方法**: GET
- **描述**: 获取启用状态的车间精简信息列表，主要用于前端下拉选项
- **权限**: 无需权限

#### 请求参数

无

#### 请求示例

```
GET /mes/workshop/simple-list
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | 车间精简列表 |
| data.id | Long | 车间编号 |
| data.workshopCode | String | 车间编码 |
| data.workshopName | String | 车间名称 |
| data.parentId | Long | 父级ID |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "workshopCode": "WS001",
      "workshopName": "总装车间",
      "parentId": 0
    },
    {
      "id": 2,
      "workshopCode": "WS001-01",
      "workshopName": "内饰工段",
      "parentId": 1
    },
    {
      "id": 3,
      "workshopCode": "WS002",
      "workshopName": "涂装车间",
      "parentId": 0
    }
  ],
  "msg": "操作成功"
}
```

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

## 6. 数据结构说明

### 车间树形结构

车间支持多级树形结构，典型层级如下：

```
工厂
├── 总装车间
│   ├── 内饰工段
│   ├── 底盘工段
│   └── 最终装配工段
├── 涂装车间
│   ├── 前处理工段
│   ├── 电泳工段
│   └── 面漆工段
├── 焊装车间
│   ├── 白车身焊接工段
│   └── 调整工段
└── 冲压车间
    ├── 落料工段
    └── 成形工段
```

### 父级ID说明

| parentId值 | 说明 |
|------------|------|
| 0 或 null | 顶级车间 |
| 大于0 | 指定父车间ID |

---

## 7. 业务规则

### 删除规则
- 存在子车间时，不允许删除父车间
- 存在关联产线时，不允许删除车间

### 编码规则
- 车间编码唯一，不可重复
- 建议采用层级编码，如：WS001、WS001-01、WS001-01-01

### 状态变更
- 车间禁用后，该车间下的产线也将不可用
- 启用车间时，需确保父级车间已启用

---

## 8. 使用示例

### 创建多级车间示例

1. 创建顶级车间（总装车间）：

```json
{
  "workshopCode": "WS001",
  "workshopName": "总装车间",
  "parentId": 0,
  "sort": 1,
  "status": 0
}
```

2. 创建二级车间（内饰工段）：

```json
{
  "workshopCode": "WS001-01",
  "workshopName": "内饰工段",
  "parentId": 1,
  "sort": 1,
  "status": 0
}
```

3. 创建二级车间（底盘工段）：

```json
{
  "workshopCode": "WS001-02",
  "workshopName": "底盘工段",
  "parentId": 1,
  "sort": 2,
  "status": 0
}
```