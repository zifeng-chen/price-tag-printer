# 价格展牌打印系统 (Price Tag Printer)

面向线下门店的价格展牌设计与打印工具。左侧配置商品信息、配件与服务，右侧实时预览展牌效果，支持批量生成与打印。

## 功能特性

- **实时预览**：所有配置项变化即时反映在右侧展牌预览中，无需刷新
- **商品信息配置**：名称、价格、原价、规格、单位、图片等
- **配件库 / 服务库管理**：可维护常用的配件与服务条目，勾选后自动计入总价
- **多种展牌模板**：内置多套视觉模板，适配不同门店风格
- **批量打印**：按 A4 尺寸排版，支持直接调用浏览器打印
- **数据导入导出**：通过 JSON 文件批量导入商品数据（见 `public/import-data.json`）

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Vue 3 (`<script setup>` SFC) |
| 语言 | TypeScript |
| 构建 | Vite 8 |
| UI 组件库 | ViewUIPlus |
| 状态管理 | Composables (`usePriceTagStore`) |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 类型检查 + 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

## 项目结构

```
price-tag-printer/
├── public/
│   ├── import-data.json     # 示例导入数据
│   └── *.png / favicon.svg  # 静态资源
├── src/
│   ├── components/
│   │   ├── ConfigPanel.vue    # 左侧配置面板（商品/配件/服务/模板）
│   │   ├── PreviewPanel.vue   # 右侧预览面板（缩放、打印）
│   │   └── PriceTagCard.vue   # 展牌卡片渲染组件
│   ├── composables/
│   │   └── usePriceTagStore.ts  # 全局状态与业务逻辑
│   ├── types/index.ts         # 类型定义
│   ├── accessory-data.ts      # 配件预设数据
│   ├── preset-data.ts         # 模板/商品预设数据
│   ├── App.vue                # 根组件（左右分栏布局）
│   ├── main.ts                # 应用入口
│   └── style.css              # 全局样式
├── index.html                 # 开发入口
├── debug.html                 # 调试页
└── vite.config.ts
```

## 使用说明

1. 在左侧「商品信息」中填写商品名称、价格、规格等
2. 按需从「配件库」「服务库」中勾选附加项，总价自动累加
3. 选择合适的展牌模板
4. 右侧预览确认效果，点击打印即可输出

## 许可证

MIT
