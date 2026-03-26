# MES 系统 API 接口文档

## 文档概述

本文档描述 MES（制造执行系统）P0 核心模块的 REST API 接口规范，供前端开发和系统集成参考。

## 基础信息

| 项目 | 说明 |
|------|------|
| 基础路径 | `/admin-api` (管理后台) / `/app-api` (移动端) |
| 接口协议 | RESTful API |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |
| 认证方式 | Token 认证 (请求头: `Authorization: Bearer {token}`) |

## 统一响应格式

所有接口返回统一的响应格式：

```json
{
  "code": 0,          // 状态码：0 表示成功，非 0 表示失败
  "msg": "操作成功",   // 提示信息
  "data": {}          // 返回数据
}
```

## 分页查询格式

分页查询接口统一使用以下参数：

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
|--------|------|------|------|--------|
| pageNo | Integer | 否 | 页码（从1开始） | 1 |
| pageSize | Integer | 否 | 每页条数 | 10 |

分页响应格式：

```json
{
  "code": 0,
  "msg": "操作成功",
  "data": {
    "list": [],           // 数据列表
    "total": 100          // 总记录数
  }
}
```

## 模块文档索引

### 核心业务模块

| 序号 | 模块名称 | 文档路径 | 接口数 | 功能描述 |
|------|---------|---------|--------|---------|
| 01 | 生产工单管理 | [01-work-order.md](01-work-order.md) | 11 | 工单创建、下发、进度跟踪、关闭 |
| 02 | 工艺路线管理 | [02-routing.md](02-routing.md) | 8 | 工艺路线、工序配置、版本管理 |
| 03 | 工作站管理 | [03-workstation.md](03-workstation.md) | 12 | 工位信息、设备绑定、启停控制 |
| 04 | 装配作业执行 | [04-operation.md](04-operation.md) | 8 | 扫码作业、工序报工、关键件绑定 |
| 05 | 物料管理 | [05-material.md](05-material.md) | 6 | 线边库存、物料消耗、缺料预警 |
| 06 | 生产追溯 | [06-trace.md](06-trace.md) | 4 | VIN正向追溯、关键件反向追溯 |
| 07 | 移动终端 | [07-mobile.md](07-mobile.md) | 5 | 移动端扫码作业、异常上报 |

### 基础数据模块

| 序号 | 模块名称 | 文档路径 | 功能描述 |
|------|---------|---------|---------|
| 08 | 产品管理 | [basic/08-product.md](basic/08-product.md) | 产品信息维护 |
| 09 | 产品BOM | [basic/09-bom.md](basic/09-bom.md) | 产品物料清单 |
| 10 | 车间管理 | [basic/10-workshop.md](basic/10-workshop.md) | 车间信息维护 |
| 11 | 产线管理 | [basic/11-production-line.md](basic/11-production-line.md) | 产线信息维护 |
| 12 | 班组管理 | [basic/12-team.md](basic/12-team.md) | 班组信息维护 |
| 13 | 班次管理 | [basic/13-shift.md](basic/13-shift.md) | 班次信息维护 |

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（Token无效或过期） |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 权限标识规范

权限标识格式：`{模块}:{资源}:{操作}`

示例：
- `mes:work-order:create` - 创建工单权限
- `mes:work-order:query` - 查询工单权限
- `mes:work-order:update` - 更新工单权限
- `mes:work-order:delete` - 删除工单权限

## 在线文档

启动后端服务后，可访问以下在线接口文档：
- Knife4j 文档：http://localhost:48080/doc.html
- Swagger UI：http://localhost:48080/swagger-ui.html

---

*文档版本：v1.0.0*
*更新日期：2026-03-25*