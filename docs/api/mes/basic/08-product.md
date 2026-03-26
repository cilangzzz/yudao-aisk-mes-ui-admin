# 产品管理模块 API 接口文档

## 1. 模块概述

产品管理模块是 MES 系统基础数据管理的核心模块之一，主要用于管理生产制造过程中的产品信息。该模块提供了产品的增删改查、分页查询、列表查询以及 Excel 导出等功能，为后续的生产计划、工艺路线、BOM 管理等模块提供产品基础数据支撑。

**主要功能**：
- 产品信息的创建、更新、删除和查询
- 产品分页列表和全量列表查询
- 产品精简信息列表（用于前端下拉选项）
- 产品数据 Excel 导出

---

## 2. 接口列表

| 序号 | 接口名称 | HTTP方法 | 路径 | 权限标识 |
|------|----------|----------|------|----------|
| 1 | 创建产品 | POST | /mes/product/create | mes:product:create |
| 2 | 更新产品 | PUT | /mes/product/update | mes:product:update |
| 3 | 删除产品 | DELETE | /mes/product/delete | mes:product:delete |
| 4 | 获得产品 | GET | /mes/product/get | mes:product:query |
| 5 | 获得产品分页 | GET | /mes/product/page | mes:product:query |
| 6 | 获得产品列表 | GET | /mes/product/list | mes:product:query |
| 7 | 获得产品精简信息列表 | GET | /mes/product/simple-list | 无需权限 |
| 8 | 导出产品 Excel | GET | /mes/product/export-excel | mes:product:export |

---

## 3. 接口详细说明

### 3.1 创建产品

#### 基本信息
- **路径**: `/mes/product/create`
- **方法**: POST
- **描述**: 创建新的产品信息
- **权限**: `mes:product:create`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| productCode | String | 是 | 产品编码 | PROD001 |
| productName | String | 是 | 产品名称 | SUV整车 |
| productType | String | 否 | 产品类型 | 整车 |
| specification | String | 否 | 规格 | 标准版 |
| model | String | 否 | 型号 | MODEL-A |
| unit | String | 否 | 单位 | 辆 |
| status | Integer | 否 | 状态（0=启用，1=禁用） | 0 |
| description | String | 否 | 描述 | 这是SUV整车产品 |

#### 请求示例

```json
{
  "productCode": "PROD001",
  "productName": "SUV整车",
  "productType": "整车",
  "specification": "标准版",
  "model": "MODEL-A",
  "unit": "辆",
  "status": 0,
  "description": "这是SUV整车产品"
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Long | 产品ID |
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

### 3.2 更新产品

#### 基本信息
- **路径**: `/mes/product/update`
- **方法**: PUT
- **描述**: 更新已有产品信息
- **权限**: `mes:product:update`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 产品编号 | 1 |
| productCode | String | 是 | 产品编码 | PROD001 |
| productName | String | 是 | 产品名称 | SUV整车 |
| productType | String | 否 | 产品类型 | 整车 |
| specification | String | 否 | 规格 | 豪华版 |
| model | String | 否 | 型号 | MODEL-A |
| unit | String | 否 | 单位 | 辆 |
| status | Integer | 否 | 状态（0=启用，1=禁用） | 0 |
| description | String | 否 | 描述 | 这是SUV整车产品 |

#### 请求示例

```json
{
  "id": 1,
  "productCode": "PROD001",
  "productName": "SUV整车",
  "productType": "整车",
  "specification": "豪华版",
  "model": "MODEL-A",
  "unit": "辆",
  "status": 0,
  "description": "更新后的SUV整车产品描述"
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

### 3.3 删除产品

#### 基本信息
- **路径**: `/mes/product/delete`
- **方法**: DELETE
- **描述**: 根据ID删除产品
- **权限**: `mes:product:delete`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 产品编号 | 1 |

#### 请求示例

```
DELETE /mes/product/delete?id=1
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

### 3.4 获得产品

#### 基本信息
- **路径**: `/mes/product/get`
- **方法**: GET
- **描述**: 根据ID获取产品详情
- **权限**: `mes:product:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | Long | 是 | 产品编号 | 1 |

#### 请求示例

```
GET /mes/product/get?id=1
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Object | 产品信息 |
| data.id | Long | 产品编号 |
| data.productCode | String | 产品编码 |
| data.productName | String | 产品名称 |
| data.productType | String | 产品类型 |
| data.specification | String | 规格 |
| data.model | String | 型号 |
| data.unit | String | 单位 |
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
    "productCode": "PROD001",
    "productName": "SUV整车",
    "productType": "整车",
    "specification": "标准版",
    "model": "MODEL-A",
    "unit": "辆",
    "status": 0,
    "description": "这是SUV整车产品",
    "createTime": "2024-01-15 10:30:00"
  },
  "msg": "操作成功"
}
```

---

### 3.5 获得产品分页

#### 基本信息
- **路径**: `/mes/product/page`
- **方法**: GET
- **描述**: 分页查询产品列表
- **权限**: `mes:product:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| pageNo | Integer | 否 | 页码，默认1 | 1 |
| pageSize | Integer | 否 | 每页条数，默认10 | 10 |
| productCode | String | 否 | 产品编码（模糊查询） | PROD |
| productName | String | 否 | 产品名称（模糊查询） | SUV |
| productType | String | 否 | 产品类型 | 整车 |
| status | Integer | 否 | 状态 | 0 |

#### 请求示例

```
GET /mes/product/page?pageNo=1&pageSize=10&productCode=PROD&status=0
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Object | 分页数据 |
| data.list | Array | 产品列表 |
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
        "productCode": "PROD001",
        "productName": "SUV整车",
        "productType": "整车",
        "specification": "标准版",
        "model": "MODEL-A",
        "unit": "辆",
        "status": 0,
        "description": "这是SUV整车产品",
        "createTime": "2024-01-15 10:30:00"
      },
      {
        "id": 2,
        "productCode": "PROD002",
        "productName": "轿车整车",
        "productType": "整车",
        "specification": "豪华版",
        "model": "MODEL-B",
        "unit": "辆",
        "status": 0,
        "description": "这是轿车整车产品",
        "createTime": "2024-01-16 09:20:00"
      }
    ],
    "total": 2
  },
  "msg": "操作成功"
}
```

---

### 3.6 获得产品列表

#### 基本信息
- **路径**: `/mes/product/list`
- **方法**: GET
- **描述**: 查询产品全量列表（不分页）
- **权限**: `mes:product:query`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| productCode | String | 否 | 产品编码（模糊查询） | PROD |
| productName | String | 否 | 产品名称（模糊查询） | SUV |
| productType | String | 否 | 产品类型 | 整车 |
| status | Integer | 否 | 状态 | 0 |

#### 请求示例

```
GET /mes/product/list?status=0
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | 产品列表 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "productCode": "PROD001",
      "productName": "SUV整车",
      "productType": "整车",
      "specification": "标准版",
      "model": "MODEL-A",
      "unit": "辆",
      "status": 0,
      "description": "这是SUV整车产品",
      "createTime": "2024-01-15 10:30:00"
    }
  ],
  "msg": "操作成功"
}
```

---

### 3.7 获得产品精简信息列表

#### 基本信息
- **路径**: `/mes/product/simple-list`
- **方法**: GET
- **描述**: 获取启用状态的产品精简信息列表，主要用于前端下拉选项
- **权限**: 无需权限

#### 请求参数

无

#### 请求示例

```
GET /mes/product/simple-list
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码，0表示成功 |
| data | Array | 产品列表 |
| msg | String | 提示信息 |

#### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "productCode": "PROD001",
      "productName": "SUV整车",
      "productType": "整车",
      "specification": "标准版",
      "model": "MODEL-A",
      "unit": "辆",
      "status": 0,
      "description": "这是SUV整车产品",
      "createTime": "2024-01-15 10:30:00"
    }
  ],
  "msg": "操作成功"
}
```

---

### 3.8 导出产品 Excel

#### 基本信息
- **路径**: `/mes/product/export-excel`
- **方法**: GET
- **描述**: 导出产品数据为 Excel 文件
- **权限**: `mes:product:export`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| productCode | String | 否 | 产品编码（模糊查询） | PROD |
| productName | String | 否 | 产品名称（模糊查询） | SUV |
| productType | String | 否 | 产品类型 | 整车 |
| status | Integer | 否 | 状态 | 0 |

#### 请求示例

```
GET /mes/product/export-excel?status=0
```

#### 响应参数

返回 Excel 文件流，文件名为 `产品.xls`

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

## 6. 数据字典

### 产品类型（productType）

| 编码 | 名称 |
|------|------|
| 整车 | 整车产品 |
| 零部件 | 零部件产品 |
| 原材料 | 原材料 |
| 辅材 | 辅助材料 |

### 单位（unit）

| 编码 | 名称 |
|------|------|
| 辆 | 辆 |
| 台 | 台 |
| 个 | 个 |
| 件 | 件 |
| 套 | 套 |