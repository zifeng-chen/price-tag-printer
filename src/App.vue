<script setup lang="ts">
import { computed, ref } from 'vue';
import { Modal } from 'view-ui-plus';
import { usePriceTagStore } from './composables/usePriceTagStore';
import ConfigPanel from './components/ConfigPanel.vue';
import PreviewPanel from './components/PreviewPanel.vue';
import PriceTagCard from './components/PriceTagCard.vue';
import type { CardData } from './types';
import { DEFAULT_CATEGORY } from './types';
import { COPY_CARDS } from './copy-data';

const store = usePriceTagStore();

const cards = computed(() => store.cards.value);
const activeIndex = computed({
  get: () => store.activeCardIndex.value,
  set: (val: number) => { store.activeCardIndex.value = val; },
});

const searchQuery = computed({
  get: () => store.searchQuery.value,
  set: (val: string) => { store.searchQuery.value = val; },
});

const filteredCards = computed(() => store.filteredCards.value);
const selectedIds = computed(() => store.selectedIds.value);

const groupedCards = computed(() => store.groupedCards.value);

// 手风琴式：同一时刻最多只展开一个分类，默认展开「笔记本」
const expandedCategory = ref<string | null>(DEFAULT_CATEGORY);

function toggleCategory(category: string) {
  // 点击已展开的分类则收起，点击其他分类则展开它并收起其余
  expandedCategory.value = expandedCategory.value === category ? null : category;
}

// 上半部分：当前展开的分类（含其展牌列表）
const expandedGroups = computed(() =>
  expandedCategory.value
    ? groupedCards.value.filter(g => g.category === expandedCategory.value)
    : []
);

// 底部固定区：其余分类，点击即可展开（展开时其余自动收起）
const pinnedGroups = computed(() =>
  groupedCards.value.filter(g => g.category !== expandedCategory.value)
);

const isAllSelected = computed(() => {
  return cards.value.length > 0 && selectedIds.value.size === cards.value.length;
});

function toggleSelectAll() {
  if (isAllSelected.value) store.deselectAll();
  else store.selectAll();
}

const previewCards = computed(() => {
  const ids = new Set(selectedIds.value);
  const currentId = cards.value[activeIndex.value]?.id;
  if (currentId) ids.add(currentId);
  return cards.value.filter(c => ids.has(c.id));
});

const activeCardId = computed(() => cards.value[activeIndex.value]?.id);

const printPages = computed<CardData[][]>(() => {
  const list = store.selectedCards.value;
  const result: CardData[][] = [];
  for (let i = 0; i < list.length; i += 2) {
    result.push(list.slice(i, i + 2));
  }
  return result;
});

function handlePrintSelected() {
  window.print();
}

function handleDeleteById(id: string) {
  const idx = cards.value.findIndex(c => c.id === id);
  if (idx >= 0) confirmDelete(idx);
}

function confirmDelete(index: number) {
  const name = cards.value[index]?.productTitle || '未命名';
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除展牌「${name}」吗？`,
    onOk: () => store.deleteCard(index),
  });
}

function confirmDeleteSelected() {
  const count = selectedIds.value.size;
  if (count === 0) return;
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除选中的 ${count} 张展牌吗？`,
    onOk: () => store.deleteSelected(),
  });
}

function confirmDuplicate(index: number) {
  const name = cards.value[index]?.productTitle || '未命名';
  Modal.confirm({
    title: '确认复制',
    content: `确定要复制展牌「${name}」吗？`,
    onOk: () => store.duplicateCard(index),
  });
}

function handleImportCopy() {
  const blank: CardData[] = JSON.parse(JSON.stringify(COPY_CARDS));
  const n = store.importCopyData(blank);
  Modal.info({
    title: '导入内置文案',
    content: `已导入 ${n} 张展牌文案（同名展牌内容已覆盖，保留原有勾选状态）。`,
  });
}
</script>

<template>
  <div class="app-root">
    <div class="app-layout screen-only">
      <!-- Left Sidebar -->
      <aside class="list-sidebar">
        <div class="sidebar-header">
          <h1>展牌管理</h1>
        </div>

        <div class="sidebar-search">
          <i-input v-model:model-value="searchQuery" placeholder="搜索产品名称..." search clearable size="small" />
        </div>

        <div class="sidebar-list">
          <template v-for="group in expandedGroups" :key="group.category">
            <div class="group-header" @click="toggleCategory(group.category)">
              <Icon type="ios-arrow-down" class="group-arrow" />
              <span class="group-title">{{ group.category }}</span>
              <span class="group-count">{{ group.items.length }}</span>
            </div>
            <div
              v-for="{ card, index } in group.items"
              :key="card.id"
              class="list-item"
              :class="{ active: index === activeIndex }"
              @click="activeIndex = index"
            >
              <Checkbox :model-value="selectedIds.has(card.id)" @click.stop @on-change="store.toggleSelect(card.id)" />
              <div class="item-info">
                <div class="item-name">{{ card.productTitle || '未命名' }}</div>
                <div class="item-meta">{{ card.products.reduce((s, p) => s + p.colors.length, 0) }}行</div>
              </div>
              <div class="item-actions">
                <Button size="small" type="text" icon="md-copy" title="复制" @click.stop="confirmDuplicate(index)" />
                <Button size="small" type="text" icon="md-trash" title="删除" :disabled="cards.length <= 1" @click.stop="confirmDelete(index)" class="danger-btn" />
              </div>
            </div>
            <div v-if="group.items.length === 0" class="empty-hint">暂无展牌</div>
          </template>
          <div v-if="filteredCards.length === 0" class="empty-hint">无匹配结果</div>
        </div>

        <div v-if="pinnedGroups.length" class="sidebar-pinned">
          <div
            v-for="group in pinnedGroups"
            :key="group.category"
            class="group-header pinned"
            @click="toggleCategory(group.category)"
          >
            <Icon type="ios-arrow-forward" class="group-arrow" />
            <span class="group-title">{{ group.category }}</span>
            <span class="group-count">{{ group.items.length }}</span>
          </div>
        </div>

        <div class="sidebar-footer">
          <div class="footer-row">
            <Button size="small" :icon="isAllSelected ? 'md-checkbox-outline' : 'md-square-outline'" @click="toggleSelectAll">
              {{ isAllSelected ? '取消全选' : '全选' }}
            </Button>
            <Button size="small" type="primary" icon="md-add" @click="store.addCard()" style="flex:1">新建</Button>
          </div>
          <div class="footer-row">
            <Button size="small" long type="error" icon="md-trash" :disabled="selectedIds.size === 0" @click="confirmDeleteSelected">
              删除选中（{{ selectedIds.size }}）
            </Button>
          </div>
          <div class="footer-row">
            <Button size="small" @click="store.exportSelected()" style="flex:1">导出选中</Button>
            <Button size="small" @click="store.exportData()" style="flex:1">导出全部</Button>
          </div>
          <div class="footer-row import-row">
            <Upload action="" :before-upload="(file: File) => { store.importData(file); return false; }" accept=".json" class="full-upload">
              <Button size="small" long>导入数据</Button>
            </Upload>
          </div>
          <div class="footer-row import-row">
            <Button size="small" long icon="md-albums" @click="handleImportCopy">导入内置文案</Button>
          </div>
          <Button type="warning" long :disabled="selectedIds.size === 0" @click="handlePrintSelected">
            🖨️ 打印选中（{{ selectedIds.size }}）
          </Button>
        </div>
      </aside>

      <!-- Middle: Config Panel -->
      <ConfigPanel :cards="cards" :active-index="activeIndex" />

      <!-- Right: Preview Panel -->
      <div class="preview-wrapper">
        <PreviewPanel :cards="previewCards" :active-card-id="activeCardId" @delete-card="handleDeleteById($event)" />
      </div>
    </div>

    <!-- Print-only -->
    <div class="print-only">
      <div v-for="(page, pageIdx) in printPages" :key="pageIdx" class="print-a4-page">
        <template v-for="slotIdx in 2" :key="slotIdx">
          <div v-if="slotIdx - 1 < page.length" class="print-card-slot">
            <PriceTagCard :card="page[slotIdx - 1]" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #app { height: 100%; width: 100%; overflow: hidden; }
body {
  background: #f5f6fa;
  font-family: "Source Han Sans SC", "思源黑体", "Noto Sans SC", "Microsoft YaHei", sans-serif;
}
</style>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ===== Left Sidebar ===== */
.list-sidebar {
  width: 260px;
  min-width: 260px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 16px;
  background: linear-gradient(135deg, #FF6A00, #ff9a44);
  color: #fff;
  flex: none;
}

.sidebar-header h1 {
  font-size: 15px;
  font-weight: 700;
}

.sidebar-search {
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
  flex: none;
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: 6px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 8px;
  margin: 4px 0 2px;
  font-size: 12px;
  font-weight: 700;
  color: #555;
  cursor: pointer;
  border-radius: 6px;
  user-select: none;
}

.group-header:hover { background: #f5f5f5; }

.group-header .group-arrow { font-size: 12px; color: #999; flex: none; }
.group-header .group-title { flex: 1; }
.group-header .group-count {
  font-size: 10px;
  font-weight: 500;
  color: #aaa;
  background: #f0f0f0;
  border-radius: 8px;
  padding: 0 6px;
  line-height: 16px;
}

.sidebar-pinned {
  flex: none;
  border-top: 1px solid #f0f0f0;
  background: #fcfcfc;
  padding: 4px 6px;
}

.group-header.pinned {
  margin: 2px 0;
  color: #FF6A00;
}

.group-header.pinned:hover { background: #fff7f0; }
.group-header.pinned .group-arrow { color: #FF6A00; }

.list-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: 2px;
}

.list-item:hover { background: #f8f8f8; }
.list-item.active { background: #fff7f0; border: 1px solid #FF6A00; }

.item-info { flex: 1; min-width: 0; }

.item-name {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta { font-size: 10px; color: #999; margin-top: 1px; }

.item-actions {
  display: flex; gap: 2px;
  opacity: 0; transition: opacity 0.15s;
}

.list-item:hover .item-actions { opacity: 1; }

.empty-hint { text-align: center; padding: 24px 0; color: #ccc; font-size: 12px; }

.sidebar-footer {
  padding: 10px 12px;
  border-top: 1px solid #e8e8e8;
  display: flex; flex-direction: column; gap: 6px;
  flex: none;
  background: #fafafa;
}

.footer-row { display: flex; gap: 6px; align-items: center; }
.import-row { display: block; }
.full-upload { width: 100%; }
.full-upload :deep(.ivu-upload) { width: 100%; }
.danger-btn:hover .ivu-icon { color: #ff4d4f !important; }

/* ===== Preview ===== */
.preview-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.print-only { display: none; }

@media print {
  @page { margin: 0; size: A4; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  html, body, #app { height: auto !important; overflow: visible !important; display: block !important; }
  body { background: white; margin: 0; padding: 0; }
  .screen-only { display: none !important; }
  .print-only { display: block !important; }
  .app-root { display: block !important; height: auto !important; overflow: visible !important; }
  .print-a4-page {
    width: 210mm; height: 297mm;
    display: flex; flex-direction: column; align-items: center;
    justify-content: flex-start; padding-top: 14.25mm; gap: 4.5mm;
    page-break-after: always; margin: 0;
  }
  .print-a4-page:last-child { page-break-after: auto; }
  .print-card-slot { width: 110mm; height: 110mm; flex: none; }
}
</style>
