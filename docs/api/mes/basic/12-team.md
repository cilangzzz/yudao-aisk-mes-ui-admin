# 班组管理模块 API 接口文档

## 1. 模块概述

班组管理模块用于管理企业的生产班组信息，班组是产线下的基本作业单元，由班组长和一组操作人员组成。班组与班次配合使用，实现生产人员的排班管理。该模块是生产排程、人员考勤、绩效考核的基础数据支撑。

**主要功能**：
- 班组信息的创建、更新、删除和查询
- 班组分页列表和全量列表查询
- 根据产线ID查询班组列表
- 班组精简信息列表（用于前端下拉选项）

**业务场景**：
- 定义产线班组组织结构
- 为班组分配班组长
- 支持生产排程的人员分配
- 支持人员考勤和绩效统计

---

## 2. 接口列表

| 序号 | 接口名称 | HTTP方法 | 路径 | 权限标识 |
|------|----------|----------|------|----------|
| 1 | 创建班组 | POST | /mes/team/create | mes:team:create |
| 2 | 更新班组 | PUT | /mes/team/update | mes:team:update |
| 3 | 删除班组 | DELETE | /mes/team/delete | mes:team:delete |
| 4 | 获得班组 | GET | /mes/team/get | mes:team:query |
| 5 | 获得班组分页 | GET | /mes/team/page | mes:team:query |
| 6 | 获得班组列表 | GET | /mes/team/list | mes:team:query |
| 7 | 获得产线下的班组列表 | GET | /mes/team/list-by-line | mes:team:query |
| 8 | 获得班组精简信息列表 | GET | /mes/team/simple-list | 无需权限 |

---

## 3. 接口详细说明

### 3.1 创建班组

#### 基本信息
- **路径**: `/mes/team/create`
- **方法**: POST
- **描述**: 创建新的班组信息
- **权限**: `mes:team:create`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| teamCode | String | 是 | 班组编码 | TEAM001 |
| teamName | String | 是 | 班组名称 | 甲班 |
| lineId | Long | 是 | 所属产线ID | 1 |
| leaderId | Long | 否 | 班组长用户ID | 1 |
| leaderName | String | 否 | 班组长姓名 | 张三 |
| status | Integer | 否 | 状态（0=启用，1=禁用） | 0 |

#### 请求示例

```json
{
  "teamCode": "TEAM001",
  "teamName": "甲班",
  "lineId": 1,
  "leaderId": 1,
  "leaderName": "张三",
  "status": 0
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Long | 班组ID |
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

### 3.2 更新班组

#### 基本信息
- **路径**: `/mes/team/update`
- **方法**: PUT
- **描述**: 更新已有班组信息
- **权限**: `mes:team:update`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 班组编号 | 1 |
| teamCode | String | 是 | 班组编码 | TEAM001 |
| teamName | String | 是 | 班组名称 | 甲班 |
| lineId | Long | 是 | 所属产线ID | 1 |
| leaderId | Long | 否 | 班组长用户ID | 1 |
| leaderName | String | 否 | 班组长姓名 | 李四 |
| status | Integer | 否 | 状态（0=启用，1=禁用） | 0 |

#### 请求示例

```json
{
  "id": 1,
  "teamCode": "TEAM001",
  "teamName": "甲班",
  "lineId": 1,
  "leaderId": 1,
  "leaderName": "李四",
  "status": 0
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

### 3.3 删除班组

#### 基本信息
- **路径**: `/mes/team/delete`
- **方法**: DELETE
- **描述**: 根据ID删除班组
- **权限**: `mes:team:delete`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 班组编号 | 1 |

#### 请求示例

```
DELETE /mes/team/delete?id=1
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

### 3.4 获得班组

#### 基本信息
- **路径**: `/mes/team/get`
- **方法**: GET
- **描述**: 根据ID获取班组详情
- **权限**: `mes:team:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 班组编号 | 1 |

#### 请求示例

```
GET /mes/team/get?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Object | 班组信息 |
| data.id | Long | 班组编号 |
| data.teamCode | String | 班组编码 |
| data.teamName | String | 班组名称 |
| data.lineId | Long | 所属产线ID |
| data.lineName | String | 所属产线名称 |
| data.leaderId | Long | 班组长用户ID |
| data.leaderName | String | 班组长姓名 |
| data.status | Integer | 状态 |
| data.createTime | DateTime | 创建时间 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "teamCode": "TEAM001",
    "teamName": "甲班",
    "lineId": 1,
    "lineName": "主线A",
    "leaderId": 1,
    "leaderName": "张三",
    "status": 0,
    "createTime": "2024-01-15 10:30:00"
  },
  "msg": "操作成功"
}
```

---

### 3.5 获得班组分页

#### 基本信息
- **路径**: `/mes/team/page`
- **方法**: GET
- **描述**: 分页查询班组列表
- **权限**: `mes:team:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| pageNo | Integer | 否 | 页码，默认1 | 1 |
| pageSize | Integer | 否 | 每页条数，默认10 | 10 |
| teamCode | String | 否 | 班组编码（模糊查询） | TEAM |
| teamName | String | 否 | 班组名称（模糊查询） | 甲 |
| lineId | Long | 否 | 所属产线ID | 1 |
| status | Integer | 否 | 状态 | 0 |

#### 请求示例

```
GET /mes/team/page?pageNo=1&pageSize=10&lineId=1&status=0
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Object | 分页数据 |
| data.list | Array | 班组列表 |
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
        "teamCode": "TEAM001",
        "teamName": "甲班",
        "lineId": 1,
        "lineName": "主线A",
        "leaderId": 1,
        "leaderName": "张三",
        "status": 0,
        "createTime": "2024-01-15 10:30:00"
      },
      {
        "id": 2,
        "teamCode": "TEAM002",
        "teamName": "乙班",
        "lineId": 1,
        "lineName": "主线A",
        "leaderId": 2,
        "leaderName": "李四",
        "status": 0,
        "createTime": "2024-01-15 10:35:00"
      }
    ],
    "total": 2
  },
  "msg": "操作成功"
}
```

---

### 3.6 获得班组列表

#### 基本信息
- **路径**: `/mes/team/list`
- **方法**: GET
- **描述**: 查询班组全量列表（不分页）
- **权限**: `mes:team:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| teamCode | String | 否 | 班组编码（模糊查询） | TEAM |
| teamName | String | 否 | 班组名称（模糊查询） | 甲 |
| lineId | Long | 否 | 所属产线ID | 1 |
| status | Integer | 否 | 状态 | 0 |

#### 请求示例

```
GET /mes/team/list?status=0
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | 班组列表 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "teamCode": "TEAM001",
      "teamName": "甲班",
      "lineId": 1,
      "lineName": "主线A",
      "leaderId": 1,
      "leaderName": "张三",
      "status": 0,
      "createTime": "2024-01-15 10:30:00"
    }
  ],
  "msg": "操作成功"
}
```

---

### 3.7 获得产线下的班组列表

#### 基本信息
- **路径**: `/mes/team/list-by-line`
- **方法**: GET
- **描述**: 根据产线ID获取该产线下的所有班组，用于产线班组联动选择
- **权限**: `mes:team:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| lineId | Long | 是 | 产线编号 | 1 |

#### 请求示例

```
GET /mes/team/list-by-line?lineId=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | 班组列表 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "teamCode": "TEAM001",
      "teamName": "甲班",
      "lineId": 1,
      "lineName": "主线A",
      "leaderId": 1,
      "leaderName": "张三",
      "status": 0,
      "createTime": "2024-01-15 10:30:00"
    },
    {
      "id": 2,
      "teamCode": "TEAM002",
      "teamName": "乙班",
      "lineId": 1,
      "lineName": "主线A",
      "leaderId": 2,
      "leaderName": "李四",
      "status": 0,
      "createTime": "2024-01-15 10:35:00"
    },
    {
      "id": 3,
      "teamCode": "TEAM003",
      "teamName": "丙班",
      "lineId": 1,
      "lineName": "主线A",
      "leaderId": 3,
      "leaderName": "王五",
      "status": 0,
      "createTime": "2024-01-15 10:40:00"
    }
  ],
  "msg": "操作成功"
}
```

---

### 3.8 获得班组精简信息列表

#### 基本信息
- **路径**: `/mes/team/simple-list`
- **方法**: GET
- **描述**: 获取启用状态的班组精简信息列表，主要用于前端下拉选项
- **权限**: 无需权限

#### 请求参数

无

#### 请求示例

```
GET /mes/team/simple-list
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | 班组列表 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "teamCode": "TEAM001",
      "teamName": "甲班",
      "lineId": 1,
      "lineName": "主线A",
      "leaderId": 1,
      "leaderName": "张三",
      "status": 0,
      "createTime": "2024-01-15 10:30:00"
    },
    {
      "id": 2,
      "teamCode": "TEAM002",
      "teamName": "乙班",
      "lineId": 1,
      "lineName": "主线A",
      "leaderId": 2,
      "leaderName": "李四",
      "status": 0,
      "createTime": "2024-01-15 10:35:00"
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

## 6. 数据关联关系

### 班组组织结构

```
车间（Workshop）
└── 产线（ProductionLine）
    └── 班组（Team）
        ├── 班组长
        └── 班组成员
```

### 班组与其他模块的关系

| 关联模块 | 关联字段 | 说明 |
|----------|----------|------|
| 产线 | lineId | 班组所属产线 |
| 用户 | leaderId | 班组长用户ID |
| 班次 | - | 班组与班次配合实现排班 |
| 工单 | teamId | 工单分配班组 |

---

## 7. 业务规则

### 删除规则
- 存在关联的生产订单时，不允许删除班组
- 班组存在成员时，建议先转移成员后再删除

### 编码规则
- 班组编码唯一，不可重复
- 建议编码格式：TEAM + 序号，如 TEAM001、TEAM002

### 班组命名规则
企业常见的班组命名方式：

| 命名方式 | 示例 | 说明 |
|----------|------|------|
| 天干命名 | 甲班、乙班、丙班 | 传统命名方式 |
| 数字命名 | 1班、2班、3班 | 简单直观 |
| 时间命名 | 白班、中班、夜班 | 按班次时间 |
| 组合命名 | 白班甲组、夜班乙组 | 时间+编号 |

### 状态变更
- 班组禁用后，该班组不能分配到新的生产订单
- 班组禁用不影响历史数据的查询

---

## 8. 使用示例

### 典型班组配置示例

假设产线"主线A"采用三班制（甲、乙、丙三班轮换）：

| 班组编码 | 班组名称 | 所属产线 | 班组长 | 状态 |
|----------|----------|----------|--------|------|
| TEAM001 | 甲班 | 主线A | 张三 | 启用 |
| TEAM002 | 乙班 | 主线A | 李四 | 启用 |
| TEAM003 | 丙班 | 主线A | 王五 | 启用 |

### 班组与班次配合示例

班组与班次配合实现人员排班：

| 班组 | 班次 | 工作时间 | 工作周期 |
|------|------|----------|----------|
| 甲班 | 白班 | 08:00-16:00 | 第1周 |
| 甲班 | 中班 | 16:00-00:00 | 第2周 |
| 甲班 | 夜班 | 00:00-08:00 | 第3周 |

---

## 9. 常见问题

### Q: 班组和班次有什么区别？

**班组**：是人员的组织单元，由班组长和一组操作人员组成，是相对固定的组织结构。

**班次**：是时间段的概念，定义了一天中的工作时段（如白班、夜班）。

班组与班次配合使用，实现人员排班管理。例如："甲班"的员工今天上"白班"。

### Q: 一条产线需要设置几个班组？

根据企业实际情况设置，常见配置：

| 班制 | 班组数量 | 说明 |
|------|----------|------|
| 单班制 | 1个班组 | 仅白天生产 |
| 两班制 | 2个班组 | 白班+夜班轮换 |
| 三班制 | 3个班组 | 24小时连续生产 |
| 四班三倒 | 4个班组 | 3个班组生产，1个班组休息 |