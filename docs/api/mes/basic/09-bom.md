# 产品BOM管理模块 API 接口文档

## 1. 模块概述

产品BOM（Bill of Materials，物料清单）管理模块用于管理产品的物料组成结构，定义生产一个产品所需的各种物料及其用量。该模块是生产计划、物料需求计划（MRP）、成本核算等业务的基础数据支撑。

**主要功能**：
- 产品BOM信息的创建、更新、删除和查询
- 产品BOM分页列表和全量列表查询
- 根据产品ID查询其BOM列表

**业务场景**：
- 定义产品的物料组成结构
- 计算产品生产所需物料数量
- 支持物料需求计划计算
- 支持产品成本核算

---

## 2. 接口列表

| 序号 | 接口名称 | HTTP方法 | 路径 | 权限标识 |
|------|----------|----------|------|----------|
| 1 | 创建产品BOM | POST | /mes/product-bom/create | mes:product-bom:create |
| 2 | 更新产品BOM | PUT | /mes/product-bom/update | mes:product-bom:update |
| 3 | 删除产品BOM | DELETE | /mes/product-bom/delete | mes:product-bom:delete |
| 4 | 获得产品BOM | GET | /mes/product-bom/get | mes:product-bom:query |
| 5 | 获得产品BOM分页 | GET | /mes/product-bom/page | mes:product-bom:query |
| 6 | 获得产品BOM列表 | GET | /mes/product-bom/list | mes:product-bom:query |
| 7 | 获得产品下的BOM列表 | GET | /mes/product-bom/list-by-product | mes:product-bom:query |

---

## 3. 接口详细说明

### 3.1 创建产品BOM

#### 基本信息
- **路径**: `/mes/product-bom/create`
- **方法**: POST
- **描述**: 创建新的产品BOM记录
- **权限**: `mes:product-bom:create`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| productId | Long | 是 | 产品ID | 1 |
| productCode | String | 是 | 产品编码 | PROD001 |
| materialCode | String | 是 | 物料编码 | MAT001 |
| materialName | String | 是 | 物料名称 | 发动机 |
| qty | BigDecimal | 是 | 用量 | 1 |
| unit | String | 否 | 单位 | 台 |
| keyPart | Integer | 否 | 是否关键件（0=否，1=是） | 1 |

#### 请求示例

```json
{
  "productId": 1,
  "productCode": "PROD001",
  "materialCode": "MAT001",
  "materialName": "发动机",
  "qty": 1,
  "unit": "台",
  "keyPart": 1
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Long | BOM记录ID |
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

### 3.2 更新产品BOM

#### 基本信息
- **路径**: `/mes/product-bom/update`
- **方法**: PUT
- **描述**: 更新已有产品BOM记录
- **权限**: `mes:product-bom:update`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | BOM记录编号 | 1 |
| productId | Long | 是 | 产品ID | 1 |
| productCode | String | 是 | 产品编码 | PROD001 |
| materialCode | String | 是 | 物料编码 | MAT001 |
| materialName | String | 是 | 物料名称 | 发动机 |
| qty | BigDecimal | 是 | 用量 | 2 |
| unit | String | 否 | 单位 | 台 |
| keyPart | Integer | 否 | 是否关键件（0=否，1=是） | 1 |

#### 请求示例

```json
{
  "id": 1,
  "productId": 1,
  "productCode": "PROD001",
  "materialCode": "MAT001",
  "materialName": "发动机",
  "qty": 2,
  "unit": "台",
  "keyPart": 1
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

### 3.3 删除产品BOM

#### 基本信息
- **路径**: `/mes/product-bom/delete`
- **方法**: DELETE
- **描述**: 根据ID删除产品BOM记录
- **权限**: `mes:product-bom:delete`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | BOM记录编号 | 1 |

#### 请求示例

```
DELETE /mes/product-bom/delete?id=1
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

### 3.4 获得产品BOM

#### 基本信息
- **路径**: `/mes/product-bom/get`
- **方法**: GET
- **描述**: 根据ID获取产品BOM详情
- **权限**: `mes:product-bom:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | BOM记录编号 | 1 |

#### 请求示例

```
GET /mes/product-bom/get?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Object | BOM信息 |
| data.id | Long | BOM记录编号 |
| data.productId | Long | 产品ID |
| data.productCode | String | 产品编码 |
| data.materialCode | String | 物料编码 |
| data.materialName | String | 物料名称 |
| data.qty | BigDecimal | 用量 |
| data.unit | String | 单位 |
| data.keyPart | Integer | 是否关键件 |
| data.createTime | DateTime | 创建时间 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "productId": 1,
    "productCode": "PROD001",
    "materialCode": "MAT001",
    "materialName": "发动机",
    "qty": 1,
    "unit": "台",
    "keyPart": 1,
    "createTime": "2024-01-15 10:30:00"
  },
  "msg": "操作成功"
}
```

---

### 3.5 获得产品BOM分页

#### 基本信息
- **路径**: `/mes/product-bom/page`
- **方法**: GET
- **描述**: 分页查询产品BOM列表
- **权限**: `mes:product-bom:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| pageNo | Integer | 否 | 页码，默认1 | 1 |
| pageSize | Integer | 否 | 每页条数，默认10 | 10 |
| productId | Long | 否 | 产品ID | 1 |
| materialCode | String | 否 | 物料编码（模糊查询） | MAT |
| materialName | String | 否 | 物料名称（模糊查询） | 发动机 |

#### 请求示例

```
GET /mes/product-bom/page?pageNo=1&pageSize=10&productId=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Object | 分页数据 |
| data.list | Array | BOM列表 |
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
        "productId": 1,
        "productCode": "PROD001",
        "materialCode": "MAT001",
        "materialName": "发动机",
        "qty": 1,
        "unit": "台",
        "keyPart": 1,
        "createTime": "2024-01-15 10:30:00"
      },
      {
        "id": 2,
        "productId": 1,
        "productCode": "PROD001",
        "materialCode": "MAT002",
        "materialName": "变速箱",
        "qty": 1,
        "unit": "台",
        "keyPart": 1,
        "createTime": "2024-01-15 10:35:00"
      }
    ],
    "total": 2
  },
  "msg": "操作成功"
}
```

---

### 3.6 获得产品BOM列表

#### 基本信息
- **路径**: `/mes/product-bom/list`
- **方法**: GET
- **描述**: 查询产品BOM全量列表（不分页）
- **权限**: `mes:product-bom:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| productId | Long | 否 | 产品ID | 1 |
| materialCode | String | 否 | 物料编码（模糊查询） | MAT |
| materialName | String | 否 | 物料名称（模糊查询） | 发动机 |

#### 请求示例

```
GET /mes/product-bom/list?productId=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | BOM列表 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "productId": 1,
      "productCode": "PROD001",
      "materialCode": "MAT001",
      "materialName": "发动机",
      "qty": 1,
      "unit": "台",
      "keyPart": 1,
      "createTime": "2024-01-15 10:30:00"
    }
  ],
  "msg": "操作成功"
}
```

---

### 3.7 获得产品下的BOM列表

#### 基本信息
- **路径**: `/mes/product-bom/list-by-product`
- **方法**: GET
- **描述**: 根据产品ID获取该产品的所有BOM记录，用于查看产品物料组成
- **权限**: `mes:product-bom:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| productId | Long | 是 | 产品编号 | 1 |

#### 请求示例

```
GET /mes/product-bom/list-by-product?productId=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | BOM列表 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "productId": 1,
      "productCode": "PROD001",
      "materialCode": "MAT001",
      "materialName": "发动机",
      "qty": 1,
      "unit": "台",
      "keyPart": 1,
      "createTime": "2024-01-15 10:30:00"
    },
    {
      "id": 2,
      "productId": 1,
      "productCode": "PROD001",
      "materialCode": "MAT002",
      "materialName": "变速箱",
      "qty": 1,
      "unit": "台",
      "keyPart": 1,
      "createTime": "2024-01-15 10:35:00"
    },
    {
      "id": 3,
      "productId": 1,
      "productCode": "PROD001",
      "materialCode": "MAT003",
      "materialName": "轮胎",
      "qty": 4,
      "unit": "个",
      "keyPart": 0,
      "createTime": "2024-01-15 10:40:00"
    }
  ],
  "msg": "操作成功"
}
```

---

## 4. 状态码说明

### 是否关键件（keyPart）

| 状态值 | 说明 |
|--------|------|
| 0 | 非关键件 |
| 1 | 关键件 |

**关键件说明**：关键件是指对产品质量、安全、性能有重大影响的零部件，在生产过程中需要进行重点管控和追溯。

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

## 6. 业务规则

### BOM用量计算
- 生产订单数量 × BOM用量 = 所需物料数量
- 例如：生产10辆SUV整车，需要 10 × 1 = 10台发动机，10 × 4 = 40个轮胎

### BOM层级关系
- 本系统目前支持单层BOM
- 如需多层BOM，可通过物料与产品的关联实现

### 数据校验规则
- 同一产品下，物料编码不能重复
- 用量必须大于0
- 关键件需要设置追溯标识

---

## 7. 使用示例

### 完整产品BOM示例

假设产品"SUV整车"（PROD001）的BOM结构如下：

| 物料编码 | 物料名称 | 用量 | 单位 | 是否关键件 |
|----------|----------|------|------|------------|
| MAT001 | 发动机 | 1 | 台 | 是 |
| MAT002 | 变速箱 | 1 | 台 | 是 |
| MAT003 | 轮胎 | 4 | 个 | 否 |
| MAT004 | 车门 | 4 | 扇 | 否 |
| MAT005 | 座椅 | 5 | 套 | 否 |
| MAT006 | 发动机控制单元 | 1 | 个 | 是 |