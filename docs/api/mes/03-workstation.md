# 工作站管理模块 API 接口文档

## 模块概述

工作站管理模块是 MES 系统中管理生产现场作业单元的核心模块。工作站是生产线上的基本作业单元，代表一个具体的生产作业位置，可以绑定相应的生产设备。该模块支持工作站的创建、修改、删除、查询等基础操作，以及启用/停用、设备绑定等业务操作，为生产排程和工序执行提供基础数据支撑。

### 主要功能

- 工作站基础管理：创建、修改、删除、查询工作站
- 工作站状态控制：启用、停用
- 设备绑定：将生产设备绑定到工作站
- 工作站分页查询与列表查询
- 按产线查询工作站
- 工作站数据导出（Excel）

---

## 接口列表

| 序号 | 接口名称 | HTTP方法 | 路径 | 权限标识 |
|------|----------|----------|------|----------|
| 1 | 创建工作站 | POST | /mes/workstation/create | mes:workstation:create |
| 2 | 更新工作站 | PUT | /mes/workstation/update | mes:workstation:update |
| 3 | 删除工作站 | DELETE | /mes/workstation/delete | mes:workstation:delete |
| 4 | 获得工作站 | GET | /mes/workstation/get | mes:workstation:query |
| 5 | 获得工作站分页 | GET | /mes/workstation/page | mes:workstation:query |
| 6 | 获得工作站列表 | GET | /mes/workstation/list | mes:workstation:query |
| 7 | 获得工作站精简信息列表 | GET | /mes/workstation/list-all-simple | 无 |
| 8 | 获得产线下的工作站列表 | GET | /mes/workstation/list-by-line | mes:workstation:query |
| 9 | 启用工作站 | PUT | /mes/workstation/enable | mes:workstation:enable |
| 10 | 停用工作站 | PUT | /mes/workstation/disable | mes:workstation:disable |
| 11 | 绑定设备 | PUT | /mes/workstation/bind-equipment | mes:workstation:bind-equipment |
| 12 | 导出工作站 Excel | GET | /mes/workstation/export-excel | mes:workstation:export |

---

## 接口详细说明

### 1. 创建工作站

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/workstation/create |
| 方法 | POST |
| 描述 | 创建新的工作站 |
| 权限 | mes:workstation:create |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| workstationCode | String | 是 | 工作站编码 | WS001 |
| workstationName | String | 是 | 工作站名称 | 工位A01 |
| workshopId | Long | 否 | 车间ID | 1 |
| lineId | Long | 是 | 产线ID | 1 |
| workstationType | Integer | 是 | 工作站类型 | 0 |
| status | Integer | 否 | 状态，默认为0（启用） | 0 |
| equipmentIds | Array[Long] | 否 | 关联设备ID列表 | [1, 2, 3] |
| description | String | 否 | 描述 | 这是工位A01 |

#### 请求示例

```json
{
  "workstationCode": "WS001",
  "workstationName": "工位A01",
  "workshopId": 1,
  "lineId": 1,
  "workstationType": 0,
  "status": 0,
  "equipmentIds": [1, 2, 3],
  "description": "总装线第一工位"
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Long | 创建成功的工作站ID |
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

### 2. 更新工作站

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/workstation/update |
| 方法 | PUT |
| 描述 | 更新已有的工作站信息 |
| 权限 | mes:workstation:update |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工作站编号 | 1 |
| workstationCode | String | 是 | 工作站编码 | WS001 |
| workstationName | String | 是 | 工作站名称 | 工位A01 |
| workshopId | Long | 否 | 车间ID | 1 |
| lineId | Long | 是 | 产线ID | 1 |
| workstationType | Integer | 是 | 工作站类型 | 0 |
| status | Integer | 否 | 状态 | 0 |
| equipmentIds | Array[Long] | 否 | 关联设备ID列表 | [1, 2, 3] |
| description | String | 否 | 描述 | 这是工位A01 |

#### 请求示例

```json
{
  "id": 1,
  "workstationCode": "WS001",
  "workstationName": "工位A01（修订）",
  "workshopId": 1,
  "lineId": 1,
  "workstationType": 0,
  "status": 0,
  "equipmentIds": [1, 2, 3, 4],
  "description": "总装线第一工位 - 已更新"
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

### 3. 删除工作站

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/workstation/delete |
| 方法 | DELETE |
| 描述 | 删除指定的工作站 |
| 权限 | mes:workstation:delete |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工作站编号 | 1 |

#### 请求示例

```
DELETE /mes/workstation/delete?id=1
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

### 4. 获得工作站

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/workstation/get |
| 方法 | GET |
| 描述 | 根据ID获取工作站详情 |
| 权限 | mes:workstation:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工作站编号 | 1 |

#### 请求示例

```
GET /mes/workstation/get?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Object | 工作站详情对象 |
| msg | String | 提示信息 |

**data 对象结构：**

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| id | Long | 编号 | 1 |
| workstationCode | String | 工作站编码 | WS001 |
| workstationName | String | 工作站名称 | 工位A01 |
| workshopId | Long | 车间ID | 1 |
| workshopName | String | 车间名称 | 总装车间 |
| lineId | Long | 产线ID | 1 |
| lineName | String | 产线名称 | 主线A |
| workstationType | Integer | 工作站类型 | 0 |
| status | Integer | 状态 | 0 |
| equipmentIds | Array[Long] | 关联设备ID列表 | [1, 2, 3] |
| description | String | 描述 | 这是工位A01 |
| createTime | LocalDateTime | 创建时间 | 2026-03-25 08:00:00 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "workstationCode": "WS001",
    "workstationName": "工位A01",
    "workshopId": 1,
    "workshopName": "总装车间",
    "lineId": 1,
    "lineName": "主线A",
    "workstationType": 0,
    "status": 0,
    "equipmentIds": [1, 2, 3],
    "description": "总装线第一工位",
    "createTime": "2026-03-25 08:00:00"
  },
  "msg": "操作成功"
}
```

---

### 5. 获得工作站分页

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/workstation/page |
| 方法 | GET |
| 描述 | 分页查询工作站列表 |
| 权限 | mes:workstation:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| pageNo | Integer | 否 | 页码，默认1 | 1 |
| pageSize | Integer | 否 | 每页条数，默认10 | 10 |
| workstationCode | String | 否 | 工作站编码 | WS001 |
| workstationName | String | 否 | 工作站名称（支持模糊查询） | 工位 |
| workshopId | Long | 否 | 车间ID | 1 |
| lineId | Long | 否 | 产线ID | 1 |
| workstationType | Integer | 否 | 工作站类型 | 0 |
| status | Integer | 否 | 状态 | 0 |

#### 请求示例

```
GET /mes/workstation/page?pageNo=1&pageSize=10&status=0&lineId=1
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
| list | Array | 工作站列表 |
| total | Long | 总记录数 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "workstationCode": "WS001",
        "workstationName": "工位A01",
        "workshopId": 1,
        "workshopName": "总装车间",
        "lineId": 1,
        "lineName": "主线A",
        "workstationType": 0,
        "status": 0,
        "equipmentIds": [1, 2, 3],
        "description": "总装线第一工位",
        "createTime": "2026-03-25 08:00:00"
      }
    ],
    "total": 1
  },
  "msg": "操作成功"
}
```

---

### 6. 获得工作站列表

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/workstation/list |
| 方法 | GET |
| 描述 | 获取工作站列表（不分页） |
| 权限 | mes:workstation:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| workstationCode | String | 否 | 工作站编码 | WS001 |
| workstationName | String | 否 | 工作站名称（支持模糊查询） | 工位 |
| workshopId | Long | 否 | 车间ID | 1 |
| lineId | Long | 否 | 产线ID | 1 |
| workstationType | Integer | 否 | 工作站类型 | 0 |
| status | Integer | 否 | 状态 | 0 |

#### 请求示例

```
GET /mes/workstation/list?status=0&lineId=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | 工作站列表 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "workstationCode": "WS001",
      "workstationName": "工位A01",
      "workshopId": 1,
      "workshopName": "总装车间",
      "lineId": 1,
      "lineName": "主线A",
      "workstationType": 0,
      "status": 0,
      "equipmentIds": [1, 2, 3],
      "description": "总装线第一工位",
      "createTime": "2026-03-25 08:00:00"
    }
  ],
  "msg": "操作成功"
}
```

---

### 7. 获得工作站精简信息列表

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/workstation/list-all-simple |
| 方法 | GET |
| 描述 | 获取启用状态的工作站精简信息列表，主要用于前端下拉选项 |
| 权限 | 无（公开接口） |

#### 请求参数

无

#### 请求示例

```
GET /mes/workstation/list-all-simple
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | 工作站精简信息列表 |
| msg | String | 提示信息 |

**data 数组元素结构：**

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| id | Long | 编号 | 1 |
| workstationCode | String | 工作站编码 | WS001 |
| workstationName | String | 工作站名称 | 工位A01 |
| lineId | Long | 产线ID | 1 |
| workstationType | Integer | 工作站类型 | 0 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "workstationCode": "WS001",
      "workstationName": "工位A01",
      "lineId": 1,
      "workstationType": 0
    },
    {
      "id": 2,
      "workstationCode": "WS002",
      "workstationName": "工位A02",
      "lineId": 1,
      "workstationType": 0
    }
  ],
  "msg": "操作成功"
}
```

---

### 8. 获得产线下的工作站列表

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/workstation/list-by-line |
| 方法 | GET |
| 描述 | 根据产线ID获取该产线下所有工作站的精简信息 |
| 权限 | mes:workstation:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| lineId | Long | 是 | 产线编号 | 1 |

#### 请求示例

```
GET /mes/workstation/list-by-line?lineId=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | 工作站精简信息列表 |
| msg | String | 提示信息 |

**data 数组元素结构：**

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| id | Long | 编号 | 1 |
| workstationCode | String | 工作站编码 | WS001 |
| workstationName | String | 工作站名称 | 工位A01 |
| lineId | Long | 产线ID | 1 |
| workstationType | Integer | 工作站类型 | 0 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "workstationCode": "WS001",
      "workstationName": "工位A01",
      "lineId": 1,
      "workstationType": 0
    },
    {
      "id": 2,
      "workstationCode": "WS002",
      "workstationName": "工位A02",
      "lineId": 1,
      "workstationType": 0
    }
  ],
  "msg": "操作成功"
}
```

---

### 9. 启用工作站

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/workstation/enable |
| 方法 | PUT |
| 描述 | 将工作站状态变更为启用状态，启用后的工作站可参与生产排程 |
| 权限 | mes:workstation:enable |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工作站编号 | 1 |

#### 请求示例

```
PUT /mes/workstation/enable?id=1
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

### 10. 停用工作站

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/workstation/disable |
| 方法 | PUT |
| 描述 | 将工作站状态变更为停用状态，停用后的工作站不参与生产排程 |
| 权限 | mes:workstation:disable |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工作站编号 | 1 |

#### 请求示例

```
PUT /mes/workstation/disable?id=1
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

### 11. 绑定设备

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/workstation/bind-equipment |
| 方法 | PUT |
| 描述 | 将设备绑定到工作站，会覆盖原有的设备绑定关系 |
| 权限 | mes:workstation:bind-equipment |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工作站编号 | 1 |
| equipmentIds | Array[Long] | 是 | 设备ID列表 | 1,2,3 |

#### 请求示例

```
PUT /mes/workstation/bind-equipment?id=1&equipmentIds=1,2,3
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

### 12. 导出工作站 Excel

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/workstation/export-excel |
| 方法 | GET |
| 描述 | 导出工作站数据为Excel文件 |
| 权限 | mes:workstation:export |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| workstationCode | String | 否 | 工作站编码 | WS001 |
| workstationName | String | 否 | 工作站名称（支持模糊查询） | 工位 |
| workshopId | Long | 否 | 车间ID | 1 |
| lineId | Long | 否 | 产线ID | 1 |
| workstationType | Integer | 否 | 工作站类型 | 0 |
| status | Integer | 否 | 状态 | 0 |

#### 请求示例

```
GET /mes/workstation/export-excel?status=0&lineId=1
```

#### 响应

返回 Excel 文件流，文件名为"工作站.xls"

---

## 附录

### 工作站状态说明

| 状态值 | 状态名称 | 说明 |
|--------|----------|------|
| 0 | 启用 | 工作站正常可用，可参与生产排程 |
| 1 | 停用 | 工作站已停用，不参与生产排程 |

### 工作站类型说明

| 类型值 | 类型名称 | 说明 |
|--------|----------|------|
| 0 | 生产工位 | 用于生产作业的工作站 |
| 1 | 检测工位 | 用于质量检测的工作站 |
| 2 | 仓储工位 | 用于物料存储的工作站 |

> 注：具体类型值根据业务配置可能有所不同

### 设备绑定说明

- 一个工作站可以绑定多个设备
- 设备绑定会覆盖原有绑定关系，如需追加设备需传入完整的设备ID列表
- 设备绑定后，在工序执行时可关联到具体设备进行数据采集

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