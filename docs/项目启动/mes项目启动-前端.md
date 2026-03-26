# MES系统前端对接后端启动方案

## 一、背景与目标

### 1.1 项目背景
基于研发流程模型和MES系统API接口文档，需要为前端团队提供一套完整的多Agent团队协作方案，实现前端与后端的高效对接。

### 1.2 技术栈
- **框架**: Vue 3 + TypeScript
- **UI库**: TDesign Vue Next
- **表格**: VxeTable
- **表单**: VbenForm
- **状态**: Pinia
- **HTTP**: Axios + RequestClient

### 1.3 预期产出
1. 多Agent团队架构设计
2. 各Agent详细提示词
3. Agent协作工作流程
4. 标准代码模板

---

## 二、多Agent团队架构设计

### 2.1 团队架构总览（每模块独立Agent）

```
┌─────────────────────────────────────────────────────────────────┐
│                     Team Lead (协调者)                           │
│                   负责任务分发和进度监控                           │
└─────────────────────────────────────────────────────────────────┘
                                │
    ┌───────────┬───────────┬───┴───┬───────────┬───────────┐
    │           │           │       │           │           │
    ▼           ▼           ▼       ▼           ▼           ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│agent- │ │agent- │ │agent- │ │agent- │ │agent- │ │agent- │
│product│ │bom    │ │workshp│ │prdline│ │team   │ │shift  │
│产品   │ │BOM    │ │车间   │ │产线   │ │班组   │ │班次   │
└───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘
    │           │           │       │           │           │
    └───────────┴───────────┴───┬───┴───────────┴───────────┘
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
            ▼                   ▼                   ▼
      ┌───────────┐       ┌───────────┐       ┌───────────┐
      │agent-     │       │agent-     │       │agent-     │
      │workorder  │       │workstation│       │routing    │
      │生产工单   │       │工作站     │       │工艺路线   │
      └───────────┘       └───────────┘       └───────────┘
            │                   │                   │
            └───────────────────┼───────────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
            ▼                   ▼                   ▼
      ┌───────────┐       ┌───────────┐       ┌───────────┐
      │agent-     │       │agent-     │       │agent-     │
      │operation  │       │stock      │       │trace      │
      │装配作业   │       │物料管理   │       │生产追溯   │
      └───────────┘       └───────────┘       └───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │     agent-mobile      │
                    │     移动端开发         │
                    └───────────────────────┘
```

### 2.2 15个独立Agent职责矩阵

| Phase | Agent名称 | 负责模块 | 依赖 | API文档 |
|-------|-----------|----------|------|---------|
| **P1** | agent-product | 产品管理 | 无 | basic/08-product.md |
| **P1** | agent-bom | 产品BOM | agent-product | basic/09-bom.md |
| **P1** | agent-workshop | 车间管理 | 无 | basic/10-workshop.md |
| **P1** | agent-prdline | 产线管理 | agent-workshop | basic/11-production-line.md |
| **P1** | agent-team | 班组管理 | agent-prdline | basic/12-team.md |
| **P1** | agent-shift | 班次管理 | 无 | basic/13-shift.md |
| **P2** | agent-workstation | 工作站管理 | agent-prdline | 03-workstation.md |
| **P2** | agent-routing | 工艺路线 | agent-product, agent-workstation | 02-routing.md |
| **P3** | agent-workorder | 生产工单 | agent-product, agent-routing, agent-prdline | 01-work-order.md |
| **P3** | agent-operation | 装配作业 | agent-workorder, agent-workstation | 04-operation.md |
| **P3** | agent-stock | 物料管理 | agent-workorder, agent-workstation | 05-material.md |
| **P4** | agent-trace | 生产追溯 | agent-operation | 06-trace.md |
| **P4** | agent-mobile | 移动终端 | agent-operation | 07-mobile.md |

### 2.3 模块依赖关系图

```
Phase 1: 基础数据层 (6个Agent并行)
─────────────────────────────────────────
agent-product ──────┐
agent-bom ──────────┤ (依赖product)
agent-workshop ─────┤
agent-prdline ──────┤ (依赖workshop)
agent-team ─────────┤ (依赖prdline)
agent-shift ────────┘
        │
        ▼
Phase 2: 配置层 (2个Agent并行)
─────────────────────────────────────────
agent-workstation ───┐ (依赖prdline)
agent-routing ───────┘ (依赖product, workstation)
        │
        ▼
Phase 3: 核心业务层 (3个Agent并行)
─────────────────────────────────────────
agent-workorder ─────┐ (依赖product, routing, prdline)
agent-operation ─────┤ (依赖workorder, workstation)
agent-stock ─────────┘ (依赖workorder, workstation)
        │
        ▼
Phase 4: 扩展层 (2个Agent并行)
─────────────────────────────────────────
agent-trace ─────────┐ (依赖operation)
agent-mobile ────────┘ (依赖operation)
```

---

## 三、各Agent详细提示词

### 3.1 Phase 1 基础数据层Agent

#### Agent-Product (产品管理)

```markdown
# Agent-Product: 产品管理模块开发

## 任务信息
- 任务ID: T001
- 模块名: product
- API文档: H:\basePlatform\yudao-aisk-mes\docs\api\mes\basic\08-product.md
- 无依赖

## 技术栈
- Vue 3 + TypeScript
- TDesign Vue Next + VxeTable + VbenForm
- RequestClient (from #/api/request)

## 输出文件
1. src/api/mes/product/index.ts
2. src/views/mes/product/index.vue
3. src/views/mes/product/data.ts
4. src/views/mes/product/modules/form.vue

## 核心接口
- GET /admin-api/mes/product/page - 分页查询
- GET /admin-api/mes/product/get - 查询详情
- POST /admin-api/mes/product/create - 创建
- PUT /admin-api/mes/product/update - 更新
- DELETE /admin-api/mes/product/delete - 删除
- GET /admin-api/mes/product/simple-list - 精简列表(下拉用)

## 类型定义
export namespace MesProductApi {
  export interface Product {
    id?: number;
    productCode?: string;    // 产品编码
    productName?: string;    // 产品名称
    productType?: number;    // 产品类型
    unit?: string;           // 单位
    status?: number;         // 状态
    remark?: string;         // 备注
    createTime?: Date;
  }
}

## 权限标识
mes:product:query, mes:product:create, mes:product:update, mes:product:delete

## 完成通知
完成后发送消息给 team-lead，通知 agent-bom 可以开始。
```

#### Agent-BOM (产品BOM)

```markdown
# Agent-BOM: 产品BOM模块开发

## 任务信息
- 任务ID: T002
- 模块名: product-bom
- API文档: H:\basePlatform\yudao-aisk-mes\docs\api\mes\basic\09-bom.md
- 依赖: agent-product (T001)

## 依赖文件
- src/api/mes/product/index.ts (产品下拉)

## 输出文件
1. src/api/mes/product-bom/index.ts
2. src/views/mes/product-bom/index.vue
3. src/views/mes/product-bom/data.ts
4. src/views/mes/product-bom/modules/form.vue

## 核心接口
- GET /admin-api/mes/product-bom/page - 分页查询
- GET /admin-api/mes/product-bom/list-by-product - 按产品查询
- POST /admin-api/mes/product-bom/create - 创建
- PUT /admin-api/mes/product-bom/update - 更新
- DELETE /admin-api/mes/product-bom/delete - 删除

## 特殊配置
表单中产品选择使用 ApiSelect 组件，调用 getProductSimpleList。
BOM行中包含 keyPart 字段标识关键件。
```

#### Agent-Workshop (车间管理)

```markdown
# Agent-Workshop: 车间管理模块开发

## 任务信息
- 任务ID: T003
- 模块名: workshop
- API文档: H:\basePlatform\yudao-aisk-mes\docs\api\mes\basic\10-workshop.md
- 无依赖

## 特殊需求
- 树形结构 (parent_id)
- 支持多级车间层级

## 输出文件
1. src/api/mes/workshop/index.ts
2. src/views/mes/workshop/index.vue (树形表格)
3. src/views/mes/workshop/data.ts
4. src/views/mes/workshop/modules/form.vue (含父级选择)

## 核心接口
- GET /admin-api/mes/workshop/list - 列表(树形)
- GET /admin-api/mes/workshop/simple-list - 精简列表
- POST /admin-api/mes/workshop/create - 创建
- PUT /admin-api/mes/workshop/update - 更新
- DELETE /admin-api/mes/workshop/delete - 删除
```

#### Agent-PrdLine (产线管理)

```markdown
# Agent-PrdLine: 产线管理模块开发

## 任务信息
- 任务ID: T004
- 模块名: production-line
- API文档: H:\basePlatform\yudao-aisk-mes\docs\api\mes\basic\11-production-line.md
- 依赖: agent-workshop (T003)

## 依赖文件
- src/api/mes/workshop/index.ts (车间下拉)

## 输出文件
1. src/api/mes/production-line/index.ts
2. src/views/mes/production-line/index.vue
3. src/views/mes/production-line/data.ts
4. src/views/mes/production-line/modules/form.vue

## 核心接口
- GET /admin-api/mes/production-line/page - 分页查询
- GET /admin-api/mes/production-line/simple-list - 精简列表
- GET /admin-api/mes/production-line/list-by-workshop - 按车间查询
```

#### Agent-Team (班组管理)

```markdown
# Agent-Team: 班组管理模块开发

## 任务信息
- 任务ID: T005
- 模块名: team
- API文档: H:\basePlatform\yudao-aisk-mes\docs\api\mes\basic\12-team.md
- 依赖: agent-prdline (T004)

## 依赖文件
- src/api/mes/production-line/index.ts (产线下拉)

## 输出文件
1. src/api/mes/team/index.ts
2. src/views/mes/team/index.vue
3. src/views/mes/team/data.ts
4. src/views/mes/team/modules/form.vue

## 核心接口
- GET /admin-api/mes/team/page - 分页查询
- GET /admin-api/mes/team/simple-list - 精简列表
- GET /admin-api/mes/team/list-by-line - 按产线查询
```

#### Agent-Shift (班次管理)

```markdown
# Agent-Shift: 班次管理模块开发

## 任务信息
- 任务ID: T006
- 模块名: shift
- API文档: H:\basePlatform\yudao-aisk-mes\docs\api\mes\basic\13-shift.md
- 无依赖

## 特殊需求
- 时间格式: HH:mm
- 班次时间段显示

## 输出文件
1. src/api/mes/shift/index.ts
2. src/views/mes/shift/index.vue
3. src/views/mes/shift/data.ts
4. src/views/mes/shift/modules/form.vue

## 核心接口
- GET /admin-api/mes/shift/page - 分页查询
- POST /admin-api/mes/shift/create - 创建
- PUT /admin-api/mes/shift/update - 更新
```

### 3.2 Phase 2 配置层Agent

#### Agent-Workstation (工作站管理)

```markdown
# Agent-Workstation: 工作站管理模块开发

## 任务信息
- 任务ID: T007
- 模块名: workstation
- API文档: H:\basePlatform\yudao-aisk-mes\docs\api\mes\03-workstation.md
- 依赖: agent-prdline (T004)

## 依赖文件
- src/api/mes/production-line/index.ts (产线下拉)

## 输出文件
1. src/api/mes/workstation/index.ts
2. src/views/mes/workstation/index.vue
3. src/views/mes/workstation/data.ts
4. src/views/mes/workstation/modules/form.vue

## 核心接口
- GET /admin-api/mes/workstation/page - 分页查询
- GET /admin-api/mes/workstation/list-all-simple - 精简列表
- GET /admin-api/mes/workstation/list-by-line - 按产线查询
- PUT /admin-api/mes/workstation/enable - 启用
- PUT /admin-api/mes/workstation/disable - 停用

## 工作站类型
- PRODUCTION: 生产工位 (0)
- INSPECTION: 检测工位 (1)
- STORAGE: 仓储工位 (2)
```

#### Agent-Routing (工艺路线管理)

```markdown
# Agent-Routing: 工艺路线管理模块开发

## 任务信息
- 任务ID: T008
- 模块名: routing
- API文档: H:\basePlatform\yudao-aisk-mes\docs\api\mes\02-routing.md
- 依赖: agent-product (T001), agent-workstation (T007)

## 依赖文件
- src/api/mes/product/index.ts (产品下拉)
- src/api/mes/workstation/index.ts (工作站下拉)

## 输出文件
1. src/api/mes/routing/index.ts
2. src/views/mes/routing/index.vue
3. src/views/mes/routing/data.ts
4. src/views/mes/routing/modules/form.vue (嵌套表格)
5. src/views/mes/routing/modules/operation-form.vue (工序编辑)

## 核心接口
- GET /admin-api/mes/routing/page - 分页查询
- GET /admin-api/mes/routing/get - 查询详情(含工序列表)
- POST /admin-api/mes/routing/create - 创建
- PUT /admin-api/mes/routing/update - 更新
- PUT /admin-api/mes/routing/activate - 生效
- PUT /admin-api/mes/routing/deactivate - 失效
- POST /admin-api/mes/routing/copy - 复制

## 特殊需求
嵌套数据结构:
- Routing → Operation[] → Material[]
工艺路线包含多道工序，每道工序包含多个物料。
```

### 3.3 Phase 3 核心业务层Agent

#### Agent-WorkOrder (生产工单管理)

```markdown
# Agent-WorkOrder: 生产工单管理模块开发

## 任务信息
- 任务ID: T009
- 模块名: work-order
- API文档: H:\basePlatform\yudao-aisk-mes\docs\api\mes\01-work-order.md
- 依赖: agent-product (T001), agent-routing (T008), agent-prdline (T004)

## 依赖文件
- src/api/mes/product/index.ts (产品下拉)
- src/api/mes/routing/index.ts (工艺路线下拉)
- src/api/mes/production-line/index.ts (产线下拉)

## 输出文件
1. src/api/mes/work-order/index.ts
2. src/views/mes/work-order/index.vue
3. src/views/mes/work-order/data.ts
4. src/views/mes/work-order/modules/form.vue

## 核心接口
- GET /admin-api/mes/work-order/page - 分页查询
- POST /admin-api/mes/work-order/create - 创建
- PUT /admin-api/mes/work-order/update - 更新
- DELETE /admin-api/mes/work-order/delete - 删除
- PUT /admin-api/mes/work-order/release - 下发
- PUT /admin-api/mes/work-order/start - 开始生产
- PUT /admin-api/mes/work-order/complete - 完成
- PUT /admin-api/mes/work-order/close - 关闭

## 工单状态流转
新建(0) → 下发(1) → 生产中(2) → 已完成(3) → 已关闭(4)

操作按钮需根据状态显示/隐藏:
- 编辑: 仅新建状态
- 下发: 仅新建状态
- 开始: 仅已下发状态
- 完成: 仅生产中状态
- 关闭: 新建/已下发/生产中状态
- 删除: 仅新建状态
```

#### Agent-Operation (装配作业执行)

```markdown
# Agent-Operation: 装配作业执行模块开发

## 任务信息
- 任务ID: T010
- 模块名: operation
- API文档: H:\basePlatform\yudao-aisk-mes\docs\api\mes\04-operation.md
- 依赖: agent-workorder (T009), agent-workstation (T007)

## 输出文件
1. src/api/mes/operation/index.ts
2. src/views/mes/operation/index.vue
3. src/views/mes/operation/data.ts
4. src/views/mes/operation/modules/scan-dialog.vue (扫码弹窗)
5. src/views/mes/operation/modules/operation-exec.vue (作业执行)

## 核心接口
- POST /admin-api/mes/operation/scan - 扫码识别
- POST /admin-api/mes/operation/start - 开始作业
- PUT /admin-api/mes/operation/complete - 完成作业
- POST /admin-api/mes/operation/bind-part - 绑定关键件
- GET /admin-api/mes/operation/progress - 车辆进度

## 特殊组件
- 扫码输入组件
- 作业状态时间线
- 关键件绑定列表
```

#### Agent-Stock (物料管理)

```markdown
# Agent-Stock: 物料管理模块开发

## 任务信息
- 任务ID: T011
- 模块名: stock
- API文档: H:\basePlatform\yudao-aisk-mes\docs\api\mes\05-material.md
- 依赖: agent-workorder (T009), agent-workstation (T007)

## 输出文件
1. src/api/mes/stock/index.ts
2. src/views/mes/stock/index.vue
3. src/views/mes/stock/data.ts
4. src/views/mes/stock/modules/form.vue
5. src/views/mes/stock/modules/warning-list.vue (缺料预警)

## 核心接口
- GET /admin-api/mes/stock/page - 库存分页
- GET /admin-api/mes/stock/list-by-workstation - 按工位查询
- GET /admin-api/mes/stock/warning-list - 缺料预警
- POST /admin-api/mes/stock/consume - 物料消耗
- POST /admin-api/mes/stock/in - 线边入库
```

### 3.4 Phase 4 扩展层Agent

#### Agent-Trace (生产追溯)

```markdown
# Agent-Trace: 生产追溯模块开发

## 任务信息
- 任务ID: T012
- 模块名: trace
- API文档: H:\basePlatform\yudao-aisk-mes\docs\api\mes\06-trace.md
- 依赖: agent-operation (T010)

## 输出文件
1. src/api/mes/trace/index.ts
2. src/views/mes/trace/index.vue (VIN追溯)
3. src/views/mes/trace/data.ts
4. src/views/mes/trace/modules/vin-detail.vue (车辆详情)
5. src/views/mes/trace/modules/part-trace.vue (关键件追溯)

## 核心接口
- GET /admin-api/mes/trace/vin - VIN正向追溯
- GET /admin-api/mes/trace/part - 关键件反向追溯
- GET /admin-api/mes/trace/operation - 工序作业详情
- GET /admin-api/mes/trace/operator - 操作员作业记录

## 特殊组件
- 追溯时间线组件
- 树形追溯展示
```

#### Agent-Mobile (移动终端)

```markdown
# Agent-Mobile: 移动终端页面开发

## 任务信息
- 任务ID: T013
- 模块名: mobile
- API文档: H:\basePlatform\yudao-aisk-mes\docs\api\mes\07-mobile.md
- 依赖: agent-operation (T010)

## 输出文件
1. src/api/mes/mobile/index.ts
2. src/views/mes/mobile/scan/index.vue (扫码作业)
3. src/views/mes/mobile/key-part/index.vue (关键件绑定)
4. src/views/mes/mobile/exception/index.vue (异常上报)

## 核心接口
- POST /app-api/mes/operation/scan - 扫码解析
- POST /app-api/mes/operation/start - 开始作业
- PUT /app-api/mes/operation/complete - 完成作业
- POST /app-api/mes/operation/bind-part - 绑定关键件
- POST /app-api/mes/exception/report - 异常上报

## 移动端特殊处理
- 响应式布局 (375px-414px)
- 触屏交互优化
- 扫码SDK集成
- 离线缓存策略

## 组合式函数
- src/composables/useScan.ts - 扫码功能
- src/utils/scanner.ts - 扫码工具
```

---

## 四、Agent团队协作流程

### 4.1 团队创建配置

```yaml
team_name: mes-frontend-team
description: MES前端开发多Agent团队 - 每模块独立Agent

members:
  # Phase 1: 基础数据层 (6个Agent并行)
  - name: agent-product
    type: Frontend Developer
    model: sonnet
    task_id: T001
    module: product
    depends_on: []

  - name: agent-bom
    type: Frontend Developer
    model: sonnet
    task_id: T002
    module: product-bom
    depends_on: [T001]

  - name: agent-workshop
    type: Frontend Developer
    model: sonnet
    task_id: T003
    module: workshop
    depends_on: []

  - name: agent-prdline
    type: Frontend Developer
    model: sonnet
    task_id: T004
    module: production-line
    depends_on: [T003]

  - name: agent-team
    type: Frontend Developer
    model: sonnet
    task_id: T005
    module: team
    depends_on: [T004]

  - name: agent-shift
    type: Frontend Developer
    model: sonnet
    task_id: T006
    module: shift
    depends_on: []

  # Phase 2: 配置层 (2个Agent)
  - name: agent-workstation
    type: Frontend Developer
    model: sonnet
    task_id: T007
    module: workstation
    depends_on: [T004]

  - name: agent-routing
    type: Frontend Developer
    model: sonnet
    task_id: T008
    module: routing
    depends_on: [T001, T007]

  # Phase 3: 核心业务层 (3个Agent)
  - name: agent-workorder
    type: Frontend Developer
    model: sonnet
    task_id: T009
    module: work-order
    depends_on: [T001, T008, T004]

  - name: agent-operation
    type: Frontend Developer
    model: sonnet
    task_id: T010
    module: operation
    depends_on: [T009, T007]

  - name: agent-stock
    type: Frontend Developer
    model: sonnet
    task_id: T011
    module: stock
    depends_on: [T009, T007]

  # Phase 4: 扩展层 (2个Agent)
  - name: agent-trace
    type: Frontend Developer
    model: sonnet
    task_id: T012
    module: trace
    depends_on: [T010]

  - name: agent-mobile
    type: Mobile Developer
    model: sonnet
    task_id: T013
    module: mobile
    depends_on: [T010]
```

### 4.2 并行执行计划

```
┌─────────────────────────────────────────────────────────────────┐
│                    执行时间轴                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Phase 1: 基础数据层 (并行启动6个Agent)                          │
│  ════════════════════════════════════════════════════════════   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│  │product  │ │  bom    │ │workshop │ │ prdline │ │  team   │ │  shift  │
│  │ T001    │ │ T002    │ │ T003    │ │ T004    │ │ T005    │ │ T006    │
│  │ (独立)  │ │→等T001  │ │ (独立)  │ │→等T003  │ │→等T004  │ │ (独立)  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
│       │           │           │           │           │           │
│       └───────────┴───────────┴───────────┴───────────┴───────────┘
│                                       │
│                                       ▼ 等待所有Phase1完成
│  ════════════════════════════════════════════════════════════════
│  Phase 2: 配置层 (并行启动2个Agent)                              │
│  ════════════════════════════════════════════════════════════════
│  ┌─────────────────┐     ┌─────────────────┐
│  │  workstation    │     │     routing     │
│  │     T007        │     │      T008       │
│  │   →等T004       │     │  →等T001,T007   │
│  └─────────────────┘     └─────────────────┘
│           │                       │
│           └───────────────────────┘
│                       │
│                       ▼ 等待Phase2完成
│  ════════════════════════════════════════════════════════════════
│  Phase 3: 核心业务层 (并行启动3个Agent)                          │
│  ════════════════════════════════════════════════════════════════
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  │  workorder    │  │   operation   │  │     stock     │
│  │     T009      │  │     T010      │  │     T011      │
│  │→等T001,T008   │  │→等T009,T007   │  │→等T009,T007   │
│  └───────────────┘  └───────────────┘  └───────────────┘
│         │                   │                   │
│         └───────────────────┴───────────────────┘
│                             │
│                             ▼ 等待Phase3完成
│  ════════════════════════════════════════════════════════════════
│  Phase 4: 扩展层 (并行启动2个Agent)                              │
│  ════════════════════════════════════════════════════════════════
│  ┌─────────────────┐     ┌─────────────────┐
│  │     trace       │     │    mobile       │
│  │      T012       │     │      T013       │
│  │   →等T010       │     │   →等T010       │
│  └─────────────────┘     └─────────────────┘
│           │                       │
│           └───────────────────────┘
│                       │
│                       ▼ 完成
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Agent启动命令模板

```
创建MES前端开发团队:

团队名称: mes-frontend-team
团队描述: MES系统前端对接后端 - 13个模块独立Agent

API文档目录: H:\basePlatform\yudao-aisk-mes\docs\api\mes\
输出目录: src/views/mes/

执行计划:
Phase 1 (并行): agent-product, agent-workshop, agent-shift
Phase 1 (串行): agent-bom(等product), agent-prdline(等workshop), agent-team(等prdline)
Phase 2 (串行): agent-workstation(等prdline), agent-routing(等product+workstation)
Phase 3 (串行): agent-workorder(等product+routing), agent-operation(等workorder), agent-stock(等workorder)
Phase 4 (并行): agent-trace(等operation), agent-mobile(等operation)

请按照依赖关系顺序启动各Agent。
```

### 4.4 单个Agent启动示例

```
启动agent-product开发产品管理模块:

你是agent-product，负责开发产品管理模块。

任务ID: T001
模块名: product
API文档: H:\basePlatform\yudao-aisk-mes\docs\api\mes\basic\08-product.md
无依赖

需要生成:
1. src/api/mes/product/index.ts
   - MesProductApi.Product 类型定义
   - getProductPage, getProduct, createProduct, updateProduct, deleteProduct
   - getProductSimpleList (下拉选项)

2. src/views/mes/product/
   - index.vue (列表页)
   - data.ts (表单Schema + 表格列)
   - modules/form.vue (表单弹窗)

权限标识: mes:product:create, mes:product:update, mes:product:delete

完成要求:
1. 遵循项目代码规范
2. 使用useVbenVxeGrid实现表格
3. 使用useVbenForm实现表单
4. 集成权限控制

完成后通知team-lead，让agent-bom可以开始工作。
```

### 4.5 Agent间通信协议

```typescript
// 任务完成通知
{
  to: "team-lead",
  message: {
    type: "task_completed",
    task_id: "T001",
    agent: "agent-product",
    module: "product",
    outputs: [
      "src/api/mes/product/index.ts",
      "src/views/mes/product/index.vue",
      "src/views/mes/product/data.ts",
      "src/views/mes/product/modules/form.vue"
    ]
  }
}

// 依赖就绪通知 (由team-lead发送给等待的Agent)
{
  to: "agent-bom",
  message: {
    type: "dependency_ready",
    task_id: "T002",
    ready_dependencies: ["T001"],
    api_files: ["src/api/mes/product/index.ts"]
  }
}

// 阻塞报告
{
  to: "team-lead",
  message: {
    type: "blocked",
    task_id: "T008",
    agent: "agent-routing",
    reason: "等待agent-workstation完成",
    waiting_for: ["T007"]
  }
}
```

---

## 五、启动命令

### 5.1 完整团队启动命令

```
创建MES前端开发团队:

团队名称: mes-frontend-team
团队描述: MES系统前端对接后端 - 13个模块独立Agent并行开发

API文档目录: H:\basePlatform\yudao-aisk-mes\docs\api\mes\
输出目录: src/views/mes/
参考页面: src/views/system/user/

成员配置 (13个独立Agent):
Phase 1: agent-product, agent-bom, agent-workshop, agent-prdline, agent-team, agent-shift
Phase 2: agent-workstation, agent-routing
Phase 3: agent-workorder, agent-operation, agent-stock
Phase 4: agent-trace, agent-mobile

依赖关系:
- agent-bom 等待 agent-product
- agent-prdline 等待 agent-workshop
- agent-team 等待 agent-prdline
- agent-workstation 等待 agent-prdline
- agent-routing 等待 agent-product + agent-workstation
- agent-workorder 等待 agent-product + agent-routing + agent-prdline
- agent-operation 等待 agent-workorder + agent-workstation
- agent-stock 等待 agent-workorder + agent-workstation
- agent-trace 等待 agent-operation
- agent-mobile 等待 agent-operation

请按照Phase顺序和依赖关系启动各Agent。
```

### 5.2 Phase 1 并行启动示例

```
并行启动Phase 1的基础Agent:

需要同时启动以下Agent (无依赖的先启动):
1. agent-product (T001) - 产品管理
2. agent-workshop (T003) - 车间管理
3. agent-shift (T006) - 班次管理

然后启动有依赖的Agent:
4. agent-bom (T002) - 等待T001完成
5. agent-prdline (T004) - 等待T003完成
6. agent-team (T005) - 等待T004完成

每个Agent使用相同的提示词模板，替换对应的模块信息。
```

---

## 六、关键文件索引

| 文件 | 用途 |
|------|------|
| `src/api/request.ts` | HTTP请求封装 |
| `src/adapter/vxe-table.ts` | 表格适配器 |
| `src/adapter/form.ts` | 表单适配器 |
| `src/views/system/user/index.vue` | 标准CRUD页面模板 |
| `src/views/system/user/data.ts` | 表单Schema示例 |
| `H:\basePlatform\yudao-aisk-mes\docs\api\mes\` | API文档目录 |

---

## 七、验收标准

| 验收项 | 标准 | 验证方式 |
|--------|------|----------|
| 代码完整性 | 13个模块全部生成 | 文件检查 |
| 类型一致 | TypeScript编译通过 | `pnpm build` |
| 代码规范 | ESLint检查通过 | `pnpm lint` |
| 功能正确 | 手动测试CRUD操作 | 功能测试 |
| 权限控制 | 按钮权限正确 | 角色测试 |
| 模块协作 | 联动功能正常 | 集成测试 |

---

## 八、待办事项

- [ ] 创建团队 (TeamCreate: mes-frontend-team)
- [ ] Phase 1: 启动6个基础Agent (product, workshop, shift 并行; bom, prdline, team 串行)
- [ ] Phase 2: 启动2个配置Agent (workstation, routing)
- [ ] Phase 3: 启动3个核心业务Agent (workorder, operation, stock)
- [ ] Phase 4: 启动2个扩展Agent (trace, mobile)
- [ ] 代码审查与集成测试
- [ ] 关闭团队 (TeamDelete)