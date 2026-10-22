# 价格展牌打印系统

面向联想门店的**价格展牌（价签）制作与打印工具**。在浏览器中编辑机型卖点、配置价格、配件与服务信息，实时预览 110mm × 110mm 的展牌效果，并一键打印到 A4 纸张（每页 2 张）。

- **技术栈**：Vue 3 + TypeScript + Vite + view-ui-plus
- **运行形态**：纯前端 SPA，无后端依赖，数据保存在浏览器 localStorage
- **仓库**：`git@github.com:zifeng-chen/price-tag-printer.git`

---

## 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [系统架构](#系统架构)
- [数据模型](#数据模型)
- [目录结构](#目录结构)
- [数据来源与维护](#数据来源与维护)
- [打印与排版](#打印与排版)
- [构建与部署](#构建与部署)
- [更新日志](#更新日志)

---

## 功能特性

### 展牌管理（左侧栏）

- **列表与搜索**：按机型名称实时过滤；列表按机型名（拼音）排序
- **多选**：单张勾选 / 全选 / 取消全选，选中状态独立持久化
- **新建**：基于默认模板新增一张展牌，自动进入编辑
- **复制**：一键复制选中展牌（含全部字段），自动进入编辑
- **删除**：单张删除（需确认，至少保留 1 张）、删除选中（批量，需确认，可清空全部）
- **导入 / 导出**：导出全部、导出选中、导入 JSON 数据（按机型名合并覆盖）
- **导入内置文案**：一键导入 `COPY_CARDS` 内置的 17 款机型文案
- **打印**：打印所有选中的展牌

### 展牌编辑（中间栏）

四个可折叠区块：

| 区块 | 可编辑内容 |
|---|---|
| **卖点信息** | 每条卖点的标题、说明、图标（内置图标库 / 自定义图片 / SVG）、图标大小（1–100%）、关联文案选择 |
| **产品价格配置** | 产品配置名、颜色名、国补价、原价；增删配置行与颜色行；价格行间距（0–12px） |
| **配件信息** | 配件 1/2 名称与价格（可从配件库选择），显示开关 |
| **服务信息** | 服务标题、服务 1/2 名称与价格（可从服务库选择） |

### 实时预览（右侧栏）

- 按 A4 幅面渲染，**每页上下 2 张**展牌
- 只有**选中**的展牌 + **当前编辑**的展牌会出现在预览中
- 当前编辑的展牌若存在**未填写国补价的颜色**，在展牌**左右两侧**显示脉冲警示条「未输入国补价格」，箭头指向展牌
- 预览中可直接删除单张展牌

### 价格展示规则

- 国补价 `> 0` 时展示：**国补价在前，原价在后**（原价带删除线样式）
- 国补价为空（0/未填）时**不展示**，仅显示原价
- 编辑区输入框在值为 0 时**留空**，不显示数字 0
- 导出与本地存储时，**国补价为 0 的字段会被清除**，不留 `subsidyPrice: 0`

---

## 快速开始

```bash
# 环境要求：Node.js 18+（Vite 5 / Vue 3 要求）
npm install

# 开发（监听 0.0.0.0，便于容器/远程访问）
npm run dev

# 类型检查 + 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

开发服务器默认监听 `0.0.0.0`，并开启了轮询式文件监听（`usePolling`），适配容器化 / 挂载卷环境。

---

## 系统架构

### 整体结构

纯前端单页应用，无后端。数据流单向：

```
                    ┌──────────────────────────────────────┐
                    │         usePriceTagStore (总状态)      │
                    │  cards / selectedIds / searchQuery    │
                    │  ↕ localStorage 双向持久化             │
                    └──────────────────────────────────────┘
                       │            │              │
        ┌──────────────┘            │              └──────────────┐
        ▼                           ▼                             ▼
  ConfigPanel               PreviewPanel                   App 侧边栏
  （编辑当前展牌）           （A4 实时预览）                 （列表/批量操作）
        │                           │
        └──────────► PriceTagCard ◄─┘
                  （展牌渲染，共用同一组件）
```

### 关键设计

1. **单一状态源**：`usePriceTagStore()` 是组合式函数（composable），持有全部状态与业务方法。通过 `ref` + `computed` 暴露，所有组件共享同一实例（模块级单例语义）。

2. **渲染组件复用**：`PriceTagCard.vue` 同时被**右侧预览**和**打印输出**使用，保证「所见即所得」。

3. **打印用独立 DOM 树**：屏幕布局容器带 `screen-only`，打印容器带 `print-only`。`@media print` 下屏幕 DOM 隐藏、打印 DOM 显示，通过 `@page { size: A4 }` 控制分页。

4. **持久化策略**：`watch(cards, ..., { deep: true })` 实时写入 localStorage；写入前经 `serializeCards()` 清洗（移除 0 值国补价）。版本号 `CURRENT_VERSION` 变化时会清空旧缓存并加载预设数据。

5. **预设数据回退**：首次访问或版本变更时加载 `PRESET_CARDS`（17 款机型）；若本地列表为空数组，同样回退到预设，避免"删空后刷新空白"。

---

## 数据模型

核心类型定义在 `src/types/index.ts`：

```ts
interface ColorItem {
  name: string;           // 颜色名称
  subsidyPrice?: number;  // 国补价（空/0 表示不展示）
  price: number;          // 原价
}

interface ProductItem {
  config: string;         // 配置描述
  colors: ColorItem[];    // 该配置下的颜色与价格
}

interface FeatureItem {
  title: string;          // 卖点标题
  desc: string;           // 卖点说明
  iconType: 'image' | 'svg' | 'builtin';
  iconName: string;       // 内置图标名称（icon-library）
  iconSrc: string;        // 自定义图片/SVG 内容
  iconSize: number;       // 1-100，相对色块尺寸的百分比
  linkedCopy?: string;    // 已关联文案的来源标识
}

interface CardData {
  id: string;
  productTitle: string;       // 机型名称
  showProductImage: boolean;  // 是否显示产品图片框
  features: FeatureItem[];    // 卖点（4 条）
  products: ProductItem[];    // 配置与价格
  showAccessory: boolean;     // 是否展示配件区
  accessory1Name/1Price: ...  // 配件 1
  accessory2Name/2Price: ...  // 配件 2
  serviceTitle: string;       // 服务区标题
  service1Name/1Price: ...    // 服务 1
  service2Name/2Price: ...    // 服务 2
  priceRowSpacing: number;    // 价格区行间距（px）
}
```

### 图标体系

- `src/icon-library.ts` 定义 `BUILTIN_ICONS`——27 个内置图标，含 `name / src / category`
- 图标文件位于 `public/icons/`，命名规则 `i{序号}_{名称}.png`，例如 `i1_屏幕.png`
- 使用方式：`iconType: 'builtin'` + `iconName: '屏幕'` → 通过 `getBuiltinIconSrc()` 解析为 `/icons/i1_屏幕.png`
- `ICON_COPY_MAP` 提供「图标 → 推荐文案」映射，编辑时可一键关联

### 配件库与服务库

`src/accessory-data.ts` 提供两套可维护的选项库，存储在 localStorage：

- **配件库**（`useAccessoryStore`）：按分类（耳机 / 支架 / 键鼠 / 背包 / 充电器 等）管理名称与价格
- **服务库**（`useServiceStore`）：管理服务名称、价格与分类

编辑展牌时可从库中选择，也可在「管理配件库 / 管理服务库」中增删改。

---

## 目录结构

```
price-tag-printer/
├── index.html                    # 入口 HTML
├── package.json                  # 依赖与脚本
├── vite.config.ts                # Vite 配置（监听 0.0.0.0 + usePolling）
├── public/
│   ├── icons/                    # 27 个内置图标（i{序号}_{名称}.png）
│   └── import-data.json          # 导入模板示例（与 PRESET_CARDS 同源）
└── src/
    ├── main.ts                   # 应用入口
    ├── App.vue                   # 三栏布局 + 侧边栏 + 打印 DOM
    ├── types/index.ts            # 类型定义 + 默认卡片
    ├── icon-library.ts           # 内置图标库 + 图标文案映射
    ├── accessory-data.ts         # 配件库 / 服务库（localStorage）
    ├── preset-data.ts            # PRESET_CARDS：首次访问的预设数据（17 款）
    ├── copy-data.ts              # COPY_CARDS：内置文案（17 款）
    ├── composables/
    │   └── usePriceTagStore.ts   # 全局状态与业务逻辑（核心）
    └── components/
        ├── ConfigPanel.vue       # 中间栏：展牌编辑
        ├── PreviewPanel.vue      # 右侧栏：A4 实时预览
        └── PriceTagCard.vue      # 展牌渲染（预览与打印共用）
```

### 状态与数据边界

| 存储键 | 内容 | 说明 |
|---|---|---|
| `price-tag-printer-data` | 展牌列表 | 核心数据，deep watch 持久化 |
| `price-tag-printer-selected` | 选中 id 集合 | 独立持久化 |
| `price-tag-printer-version` | 数据版本号 | 与 `CURRENT_VERSION` 不符时清缓存 |
| `price-tag-accessories` | 配件库 | 用户可增删改 |
| `price-tag-services` | 服务库 | 用户可增删改 |

### 数据源优先级

```
localStorage（有效且非空）
    │ 命中 → 使用本地数据
    ▼ 未命中 / 版本不符 / 空数组
PRESET_CARDS（src/preset-data.ts）
```

---

## 数据来源与维护

项目内的机型数据主要有三处，用途不同：

| 文件 | 导出 | 用途 | 规模 |
|---|---|---|---|
| `src/preset-data.ts` | `PRESET_CARDS` | **首次访问的预设数据**，浏览器无缓存时展示 | 17 款 |
| `src/copy-data.ts` | `COPY_CARDS` | **内置文案**，「导入内置文案」按钮的数据源 | 17 款 |
| `public/import-data.json` | — | **导入模板**，供用户下载/参照格式 | 17 款 |

三份数据内容同源（机型 / 配置 / 图标 / 文案 / 颜色 / 价格一致），分别服务于「初始展示」「一键导入文案」「格式样例」三个场景。维护时应保持同步。

**数据来自「离线版整合数据」**，字段对应关系：

| 来源字段 | 项目字段 |
|---|---|
| 机型 | `productTitle` |
| 卖点[].图标名称（如 `i1_屏幕.png`） | `features[].iconName`（`屏幕`） |
| 卖点[].标题 / 说明 | `features[].title` / `desc` |
| 配置[].配置 | `products[].config` |
| 配置[].颜色[].名称 | `colors[].name` |
| 配置[].颜色[].国补前 | `colors[].price` |
| 配置[].颜色[].国补后 | `colors[].subsidyPrice`（0 表示未填） |

> **说明**：当前「国补后」价格尚未落地，数据中统一为 `0`（表示未填）。填入后展牌会自动以「国补价在前、原价在后」展示。

---

## 打印与排版

### 尺寸规范

| 项 | 尺寸 |
|---|---|
| 单张展牌 | 110mm × 110mm |
| A4 纸张 | 210mm × 297mm |
| 每页张数 | 2 张（上下排列） |
| 页内上边距 | 14.25mm |
| 卡片间距 | 4.5mm |

### 打印实现

- 屏幕与打印使用**两套 DOM**：`.screen-only` / `.print-only`
- `@media print` 中：隐藏屏幕布局、显示打印布局、`@page { size: A4; margin: 0 }`
- 强制保留背景色：`print-color-adjust: exact`
- 分页：`.print-a4-page { page-break-after: always }`，最后一页自动取消

### 打印步骤

1. 在左侧勾选需要打印的展牌（可用「全选」）
2. 点击「🖨️ 打印选中（N）」
3. 在浏览器打印对话框中选择 **A4** 纸张、**无边距**、**背景图形开启**
4. 确认打印

---

## 构建与部署

### 构建产物

```bash
npm run build
```

产物输出到 `dist/`，为纯静态文件（HTML + JS + CSS + icons），**无任何服务端依赖**。

### 本地验证

```bash
npm run preview
```

### 部署方式

由于是纯静态应用，任意静态托管均可：

**方式一：静态服务器 / Nginx**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/price-tag-printer/dist;
    index index.html;

    # SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 图标等静态资源缓存
    location /icons/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# 部署示例：构建后拷贝到 web 目录
npm run build
scp -r dist/* user@server:/var/www/price-tag-printer/
```

**方式二：对象存储 / CDN**

将 `dist/` 全量上传至 COS / OSS / S3 等，开启静态网站托管即可。注意 `index.html` 应设为**不缓存**（或短缓存），`/icons/` 与 `/assets/` 可长缓存。

**方式三：GitHub Pages**

```bash
npm run build
# 将 dist/ 内容推送到 gh-pages 分支
```

> 若部署在**子路径**（如 `https://example.com/price-tag/`），需在 `vite.config.ts` 中设置 `base: '/price-tag/'`，否则静态资源路径会 404。

### 部署注意事项

1. **数据存储在浏览器本地** —— 换设备 / 换浏览器 / 清缓存后数据不共享。跨设备请用「导出全部」+「导入数据」迁移。
2. **升级数据版本** —— 修改 `usePriceTagStore.ts` 中的 `CURRENT_VERSION`，可让所有用户强制刷新为新的预设数据。
3. **无鉴权** —— 工具本身不含登录，如需权限控制请在网关/反向代理层处理。

---

## 更新日志

### v0.4.0 — 数据对齐与体验优化

- **数据**：17 款机型按「离线版整合数据」全量对齐（机型名 / 配置 / 图标 / 文案 / 颜色 / 价格）
- **编辑**：国补价为 0 时输入框留空，不再回显 `0`
- **数据**：序列化时清除 0 值国补价字段（导出与本地存储均不含 `subsidyPrice: 0`）
- **预览**：当前编辑展牌缺失国补价时，左右两侧显示脉冲警示条「未输入国补价格」，箭头指向展牌
- **侧栏**：新增「删除选中」批量删除，配合「全选」可一键清空
- **修复**：空列表不再被持久化，刷新页面后正常回退预设数据
- **修复**：修复删空后刷新页面空白的问题

### v0.3.0 — 国补价支持

- 新增 `ColorItem.subsidyPrice`（国补价）字段
- 展牌价格展示调整：有国补价时**国补价在前、原价在后**（原价带删除线）

### v0.2.0 — 内置图标库与文案

- 新增 27 个内置图标（`public/icons/`，分 7 大类：显示 / 性能 / 存储 / AI / 设计 / 散热续航 / 服务），分类由 `ICON_CATEGORIES` 从图标数据自动汇总
- 新增 `ICON_COPY_MAP` 图标文案映射
- 新增「导入内置文案」功能（数据源 `COPY_CARDS`）
- 新增配件库 / 服务库（可维护分类与价格）

### v0.1.0 — 初始版本

- 价格展牌打印系统初始版本
- 三栏布局：展牌列表 / 配置编辑 / A4 实时预览
- 展牌管理：新建、复制、删除、搜索、多选
- 数据导入导出（JSON）
- A4 打印（每页 2 张，110mm × 110mm/张）
- localStorage 本地持久化

