# 工艺路线管理模块 API 接口文档

## 模块概述

工艺路线管理模块是 MES 系统中定义产品生产流程的核心模块。工艺路线描述了产品从原材料到成品的完整生产过程，包含多个工序的顺序安排、每个工序的作业指导、所需物料等信息。该模块支持工艺路线的创建、修改、查询、生效/失效控制以及复制等功能，为生产工单提供标准化的作业流程定义。

### 主要功能

- 工艺路线基础管理：创建、修改、删除、查询工艺路线
- 工艺路线状态控制：生效、失效
- 工艺路线复制：快速创建相似工艺路线
- 工序与物料管理：支持嵌套的工序和物料数据结构

---

## 接口列表

| 序号 | 接口名称 | HTTP方法 | 路径 | 权限标识 |
|------|----------|----------|------|----------|
| 1 | 创建工艺路线 | POST | /mes/routing/create | mes:routing:create |
| 2 | 更新工艺路线 | PUT | /mes/routing/update | mes:routing:update |
| 3 | 删除工艺路线 | DELETE | /mes/routing/delete | mes:routing:delete |
| 4 | 获得工艺路线 | GET | /mes/routing/get | mes:routing:query |
| 5 | 获得工艺路线分页 | GET | /mes/routing/page | mes:routing:query |
| 6 | 生效工艺路线 | PUT | /mes/routing/activate | mes:routing:update |
| 7 | 失效工艺路线 | PUT | /mes/routing/deactivate | mes:routing:update |
| 8 | 复制工艺路线 | POST | /mes/routing/copy | mes:routing:create |

---

## 接口详细说明

### 1. 创建工艺路线

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/routing/create |
| 方法 | POST |
| 描述 | 创建新的工艺路线，可同时创建关联的工序和物料信息 |
| 权限 | mes:routing:create |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| routingCode | String | 是 | 工艺路线编码 | RT001 |
| routingName | String | 是 | 工艺路线名称 | 车身焊接工艺 |
| productId | Long | 否 | 关联产品ID | 1 |
| productCode | String | 否 | 产品编码 | PROD001 |
| productName | String | 否 | 产品名称 | 汽车车身 |
| version | String | 是 | 版本号 | V1.0 |
| description | String | 否 | 描述 | 车身焊接工艺路线 |
| operations | Array | 否 | 工序列表 | 见工序列表结构 |

**工序列表（operations）结构：**

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 否 | 工序编号（更新时必填） | 1 |
| operationCode | String | 是 | 工序编码 | OP001 |
| operationName | String | 是 | 工序名称 | 点焊 |
| sequence | Integer | 是 | 工序顺序 | 1 |
| workstationId | Long | 否 | 默认工作站ID | 1 |
| workstationName | String | 否 | 工作站名称 | 焊接工位1 |
| standardTime | BigDecimal | 否 | 标准工时(分钟) | 30.5 |
| description | String | 否 | 工序描述 | 车身点焊工序 |
| keyOperation | Integer | 否 | 是否关键工序:0-否,1-是 | 0 |
| qualityCheck | Integer | 否 | 是否需要质检:0-否,1-是 | 0 |
| instruction | String | 否 | 作业指导内容 | 按照标准操作流程进行焊接 |
| instructionFile | String | 否 | 作业指导文件URL | http://xxx/file.pdf |
| materials | Array | 否 | 物料列表 | 见物料列表结构 |

**物料列表（materials）结构：**

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 否 | 物料编号（更新时必填） | 1 |
| materialCode | String | 是 | 物料编码 | MAT001 |
| materialName | String | 是 | 物料名称 | 焊丝 |
| qty | BigDecimal | 是 | 用量 | 10.5 |
| unit | String | 否 | 单位 | kg |
| keyPart | Integer | 否 | 是否关键件:0-否,1-是 | 0 |

#### 请求示例

```json
{
  "routingCode": "RT001",
  "routingName": "车身焊接工艺",
  "productId": 1,
  "productCode": "PROD001",
  "productName": "汽车车身",
  "version": "V1.0",
  "description": "车身焊接工艺路线",
  "operations": [
    {
      "operationCode": "OP001",
      "operationName": "点焊",
      "sequence": 1,
      "workstationId": 1,
      "workstationName": "焊接工位1",
      "standardTime": 30.5,
      "description": "车身点焊工序",
      "keyOperation": 1,
      "qualityCheck": 1,
      "instruction": "按照标准操作流程进行焊接",
      "instructionFile": "http://example.com/files/welding.pdf",
      "materials": [
        {
          "materialCode": "MAT001",
          "materialName": "焊丝",
          "qty": 10.5,
          "unit": "kg",
          "keyPart": 0
        }
      ]
    },
    {
      "operationCode": "OP002",
      "operationName": "质检",
      "sequence": 2,
      "workstationId": 2,
      "workstationName": "质检工位1",
      "standardTime": 15.0,
      "description": "焊接质量检测",
      "keyOperation": 1,
      "qualityCheck": 0
    }
  ]
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Long | 创建成功的工艺路线ID |
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

### 2. 更新工艺路线

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/routing/update |
| 方法 | PUT |
| 描述 | 更新已有的工艺路线信息，包括工序和物料 |
| 权限 | mes:routing:update |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工艺路线编号 | 1 |
| routingCode | String | 是 | 工艺路线编码 | RT001 |
| routingName | String | 是 | 工艺路线名称 | 车身焊接工艺 |
| productId | Long | 否 | 关联产品ID | 1 |
| productCode | String | 否 | 产品编码 | PROD001 |
| productName | String | 否 | 产品名称 | 汽车车身 |
| version | String | 是 | 版本号 | V1.0 |
| description | String | 否 | 描述 | 车身焊接工艺路线 |
| operations | Array | 否 | 工序列表 | 见工序列表结构 |

#### 请求示例

```json
{
  "id": 1,
  "routingCode": "RT001",
  "routingName": "车身焊接工艺（修订版）",
  "productId": 1,
  "productCode": "PROD001",
  "productName": "汽车车身",
  "version": "V1.1",
  "description": "车身焊接工艺路线 - 修订版",
  "operations": [
    {
      "id": 1,
      "operationCode": "OP001",
      "operationName": "点焊",
      "sequence": 1,
      "workstationId": 1,
      "workstationName": "焊接工位1",
      "standardTime": 35.0,
      "description": "车身点焊工序",
      "keyOperation": 1,
      "qualityCheck": 1
    }
  ]
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

### 3. 删除工艺路线

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/routing/delete |
| 方法 | DELETE |
| 描述 | 删除指定的工艺路线及其关联的工序和物料 |
| 权限 | mes:routing:delete |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工艺路线编号 | 1 |

#### 请求示例

```
DELETE /mes/routing/delete?id=1
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

### 4. 获得工艺路线

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/routing/get |
| 方法 | GET |
| 描述 | 根据ID获取工艺路线详情，包含完整的工序和物料信息 |
| 权限 | mes:routing:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工艺路线编号 | 1 |

#### 请求示例

```
GET /mes/routing/get?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Object | 工艺路线详情对象 |
| msg | String | 提示信息 |

**data 对象结构：**

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| id | Long | 编号 | 1 |
| routingCode | String | 工艺路线编码 | RT001 |
| routingName | String | 工艺路线名称 | 车身焊接工艺 |
| productId | Long | 关联产品ID | 1 |
| productCode | String | 产品编码 | PROD001 |
| productName | String | 产品名称 | 汽车车身 |
| version | String | 版本号 | V1.0 |
| status | Integer | 状态:0-草稿,1-生效,2-失效 | 1 |
| description | String | 描述 | 车身焊接工艺路线 |
| createTime | LocalDateTime | 创建时间 | 2026-03-25 08:00:00 |
| operations | Array | 工序列表 | 见工序响应结构 |

**工序响应结构（operations）：**

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| id | Long | 工序编号 | 1 |
| operationCode | String | 工序编码 | OP001 |
| operationName | String | 工序名称 | 点焊 |
| sequence | Integer | 工序顺序 | 1 |
| workstationId | Long | 默认工作站ID | 1 |
| workstationName | String | 工作站名称 | 焊接工位1 |
| standardTime | BigDecimal | 标准工时(分钟) | 30.5 |
| description | String | 工序描述 | 车身点焊工序 |
| keyOperation | Integer | 是否关键工序:0-否,1-是 | 0 |
| qualityCheck | Integer | 是否需要质检:0-否,1-是 | 0 |
| instruction | String | 作业指导内容 | 按照标准操作流程进行焊接 |
| instructionFile | String | 作业指导文件URL | http://xxx/file.pdf |
| createTime | LocalDateTime | 创建时间 | 2026-03-25 08:00:00 |
| materials | Array | 物料列表 | 见物料响应结构 |

**物料响应结构（materials）：**

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| id | Long | 物料编号 | 1 |
| materialCode | String | 物料编码 | MAT001 |
| materialName | String | 物料名称 | 焊丝 |
| qty | BigDecimal | 用量 | 10.5 |
| unit | String | 单位 | kg |
| keyPart | Integer | 是否关键件:0-否,1-是 | 0 |
| createTime | LocalDateTime | 创建时间 | 2026-03-25 08:00:00 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "routingCode": "RT001",
    "routingName": "车身焊接工艺",
    "productId": 1,
    "productCode": "PROD001",
    "productName": "汽车车身",
    "version": "V1.0",
    "status": 1,
    "description": "车身焊接工艺路线",
    "createTime": "2026-03-25 08:00:00",
    "operations": [
      {
        "id": 1,
        "operationCode": "OP001",
        "operationName": "点焊",
        "sequence": 1,
        "workstationId": 1,
        "workstationName": "焊接工位1",
        "standardTime": 30.5,
        "description": "车身点焊工序",
        "keyOperation": 1,
        "qualityCheck": 1,
        "instruction": "按照标准操作流程进行焊接",
        "instructionFile": "http://example.com/files/welding.pdf",
        "createTime": "2026-03-25 08:00:00",
        "materials": [
          {
            "id": 1,
            "materialCode": "MAT001",
            "materialName": "焊丝",
            "qty": 10.5,
            "unit": "kg",
            "keyPart": 0,
            "createTime": "2026-03-25 08:00:00"
          }
        ]
      }
    ]
  },
  "msg": "操作成功"
}
```

---

### 5. 获得工艺路线分页

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/routing/page |
| 方法 | GET |
| 描述 | 分页查询工艺路线列表 |
| 权限 | mes:routing:query |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| pageNo | Integer | 否 | 页码，默认1 | 1 |
| pageSize | Integer | 否 | 每页条数，默认10 | 10 |
| routingCode | String | 否 | 工艺路线编码 | RT001 |
| routingName | String | 否 | 工艺路线名称（支持模糊查询） | 焊接 |
| productCode | String | 否 | 产品编码 | PROD001 |
| status | Integer | 否 | 状态:0-草稿,1-生效,2-失效 | 1 |
| createTime | LocalDateTime[] | 否 | 创建时间范围 | ["2026-03-01 00:00:00", "2026-03-31 23:59:59"] |

#### 请求示例

```
GET /mes/routing/page?pageNo=1&pageSize=10&status=1
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
| list | Array | 工艺路线列表 |
| total | Long | 总记录数 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "routingCode": "RT001",
        "routingName": "车身焊接工艺",
        "productId": 1,
        "productCode": "PROD001",
        "productName": "汽车车身",
        "version": "V1.0",
        "status": 1,
        "description": "车身焊接工艺路线",
        "createTime": "2026-03-25 08:00:00"
      }
    ],
    "total": 1
  },
  "msg": "操作成功"
}
```

---

### 6. 生效工艺路线

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/routing/activate |
| 方法 | PUT |
| 描述 | 将工艺路线状态变更为生效状态，生效后的工艺路线可用于生产工单 |
| 权限 | mes:routing:update |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工艺路线编号 | 1 |

#### 请求示例

```
PUT /mes/routing/activate?id=1
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

### 7. 失效工艺路线

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/routing/deactivate |
| 方法 | PUT |
| 描述 | 将工艺路线状态变更为失效状态，失效后的工艺路线不能用于新创建的生产工单 |
| 权限 | mes:routing:update |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 工艺路线编号 | 1 |

#### 请求示例

```
PUT /mes/routing/deactivate?id=1
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

### 8. 复制工艺路线

#### 基本信息

| 属性 | 值 |
|------|-----|
| 路径 | /mes/routing/copy |
| 方法 | POST |
| 描述 | 复制指定的工艺路线，生成一个新的工艺路线副本，包含所有工序和物料信息 |
| 权限 | mes:routing:create |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 源工艺路线编号 | 1 |

#### 请求示例

```
POST /mes/routing/copy?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Long | 新创建的工艺路线ID |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": 2,
  "msg": "操作成功"
}
```

---

## 附录

### 工艺路线状态说明

| 状态值 | 状态名称 | 说明 |
|--------|----------|------|
| 0 | 草稿 | 工艺路线创建后的初始状态，可编辑 |
| 1 | 生效 | 工艺路线已生效，可用于生产工单 |
| 2 | 失效 | 工艺路线已失效，不能用于新工单 |

### 工序属性说明

| 属性 | 说明 |
|------|------|
| keyOperation | 关键工序标记，用于标识生产过程中的重要质量控制点 |
| qualityCheck | 质检标记，标识该工序完成后是否需要进行质量检验 |
| standardTime | 标准工时，用于计算生产计划时间和产能评估 |

### 物料属性说明

| 属性 | 说明 |
|------|------|
| keyPart | 关键件标记，用于追溯管理和质量控制 |
| qty | 单件产品该物料的消耗量 |

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