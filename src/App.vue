<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { Modal } from 'view-ui-plus';
import { usePriceTagStore } from './composables/usePriceTagStore';
import ConfigPanel from './components/ConfigPanel.vue';
import PreviewPanel from './components/PreviewPanel.vue';
import PriceTagCard from './components/PriceTagCard.vue';
import type { CardData } from './types';
import { DEFAULT_CATEGORY } from './types';
import { COPY_CARDS } from './copy-data';
import { subsidyConfig, applySubsidyConfig, DEFAULT_SUBSIDY_CONFIG, type SubsidyConfig } from './subsidy';

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
const sidebarListRef = ref<HTMLElement | null>(null);

function toggleCategory(category: string) {
  // 点击已展开的分类则收起，点击其他分类则展开它并收起其余
  const expanding = expandedCategory.value !== category;
  expandedCategory.value = expanding ? category : null;
  // 新展开的分类列表回到最顶部
  if (expanding) {
    nextTick(() => {
      sidebarListRef.value?.scrollTo({ top: 0 });
    });
  }
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

// ===== 使用帮助弹窗 =====
const helpVisible = ref(false);
function openHelp() {
  helpVisible.value = true;
}

// ===== 设置弹窗 =====
const settingsVisible = ref(false);
// 草稿配置：弹窗内编辑，点保存并二次确认后才生效
const subsidyDraft = ref<SubsidyConfig>(JSON.parse(JSON.stringify(subsidyConfig.value)));

function openSettings() {
  subsidyDraft.value = JSON.parse(JSON.stringify(subsidyConfig.value));
  settingsVisible.value = true;
}

function handleSaveSubsidy() {
  const d = subsidyDraft.value;
  Modal.confirm({
    title: '保存确认',
    content: `即将保存国补规则：电脑 ${d.computer.rate}% / 封顶 ${d.computer.cap} 元；移动 ${d.mobile.rate}% / 封顶 ${d.mobile.cap} 元。保存后新输入的国补价将按此规则计算。是否继续？`,
    okText: '确认保存',
    onOk: () => {
      applySubsidyConfig(d);
      Modal.info({ title: '已保存', content: '国补规则已更新。如需将新规则应用到已有展牌，请点击「按新规则重算」。' });
    },
  });
}

function handleResetSubsidy() {
  subsidyDraft.value = JSON.parse(JSON.stringify(DEFAULT_SUBSIDY_CONFIG));
}

function handleRecalcSubsidy() {
  Modal.confirm({
    title: '重算确认',
    content: '将按「已保存」的国补规则，重算所有展牌的国补价，并覆盖现有国补价（含手动修改过的值）。此操作不可撤销，是否继续？',
    okText: '确认重算',
    onOk: () => {
      const n = store.recalcAllSubsidy();
      Modal.info({ title: '重算完成', content: `已更新 ${n} 张展牌的国补价。` });
    },
  });
}

function handleImportData(file: File) {
  store.importData(file);
  return false;
}
</script>

<template>
  <div class="app-root">
    <div class="app-layout screen-only">
      <!-- Left Sidebar -->
      <aside class="list-sidebar">
        <div class="sidebar-header">
          <h1>展牌管理</h1>
          <div class="header-actions">
            <Button class="header-btn" size="small" icon="md-help-circle" @click="openHelp">使用帮助</Button>
            <Button class="header-btn" size="small" icon="md-settings" @click="openSettings">设置</Button>
          </div>
        </div>

        <div class="sidebar-search">
          <i-input v-model:model-value="searchQuery" placeholder="搜索产品名称..." search clearable size="small" />
        </div>

        <div ref="sidebarListRef" class="sidebar-list">
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

    <!-- 使用帮助弹窗 -->
    <Modal v-model="helpVisible" title="使用帮助" :footer-hide="true" :width="680">
      <div class="help-body">
        <p class="help-intro">
          本工具用于制作联想产品<b>价格展牌（价签）</b>：左侧选展牌、中间改内容、右侧实时预览，最后打印。所有修改自动保存在本地浏览器。
        </p>

        <div class="help-section">
          <div class="help-h">① 界面布局</div>
          <ul>
            <li><b>左侧 · 展牌管理</b>：按分类（笔记本 / 手机 / 平板 / 台式机）分组列出所有展牌，可搜索、勾选、新建、复制、删除。</li>
            <li><b>中间 · 展牌编辑</b>：编辑当前展牌的卖点、价格、配件、服务四块内容。</li>
            <li><b>右侧 · 实时预览</b>：所见即所得的 A4 效果预览。</li>
          </ul>
        </div>

        <div class="help-section">
          <div class="help-h">② 选择与打印展牌</div>
          <ol>
            <li>在左侧分类下<b>勾选</b>需要打印的展牌（可点底部"全选"）。</li>
            <li>点左下角<b>「打印选中」</b>，浏览器弹出打印窗口。</li>
            <li>打印设置里选择纸张 A4、边距"无"、关闭页眉页脚，即可输出。</li>
          </ol>
          <p class="help-note">提示：每张展牌占一页，只打印勾选的内容。</p>
        </div>

        <div class="help-section">
          <div class="help-h">③ 编辑卖点信息</div>
          <ul>
            <li>每条卖点包含：<b>图标</b>、<b>标题</b>、<b>副标题</b>。</li>
            <li>图标有三种类型：<b>内置图标</b>（随展牌分类自动切换图标库）、<b>上传图片</b>、<b>SVG</b>。</li>
            <li>选内置图标后，可在<b>「关联文案」</b>下拉里一键套用推荐文案；自定义文案可点<b>「保存到文案库」</b>，之后同图标的卖点都能复用。</li>
            <li>可拖动/调整图标大小（1–100%），并增删卖点条目。</li>
          </ul>
        </div>

        <div class="help-section">
          <div class="help-h">④ 编辑价格与国补</div>
          <ul>
            <li>每行包含：产品配置名、颜色名、<b>原价</b>、<b>国补价</b>。</li>
            <li>输入<b>原价</b>时，系统会按当前展牌分类<b>自动计算国补价</b>，也可手动改；再次改原价会重新算。</li>
            <li>国补规则可在「设置」里修改百分比与封顶（见下）。</li>
            <li>国补价为国补后价格；价格行间距可调。</li>
          </ul>
        </div>

        <div class="help-section">
          <div class="help-h">⑤ 编辑配件与服务</div>
          <ul>
            <li><b>配件</b>：从配件库选择配件 1 / 配件 2 的名称与价格，可控制是否显示。</li>
            <li><b>服务</b>：服务库已<b>按产品分类隔离</b>——编辑手机展牌时只显示手机适用的服务，不会混入平板专属服务。</li>
            <li>服务选定后可自行修改名称与价格，并可点<b>「保存到服务库」</b>写回，供其他展牌复用。</li>
          </ul>
        </div>

        <div class="help-section">
          <div class="help-h">⑥ 设置 · 国补规则</div>
          <ul>
            <li>点击顶部<b>「设置」</b>打开。国补规则分两档，可分别设置<b>百分比</b>与<b>封顶金额</b>：
              <br>· 电脑（笔记本 / 台式机）· 移动（手机 / 平板）</li>
            <li>计算公式：<b>补贴 = 原价 × 百分比</b>，超过封顶按封顶计；<b>国补价 = 原价 − 补贴</b>。</li>
            <li>修改后需点<b>「保存」并二次确认</b>才生效。</li>
            <li>点<b>「按新规则重算」</b>并二次确认，可用新规则<b>重算所有展牌</b>的国补价（会覆盖现有值）。</li>
          </ul>
        </div>

        <div class="help-section">
          <div class="help-h">⑦ 数据导入 / 导出</div>
          <ul>
            <li>在「设置」弹窗的<b>数据管理</b>区：可<b>导出选中</b> / <b>导出全部</b>当前数据为 JSON 备份。</li>
            <li><b>导入数据</b>：选择之前导出的 JSON，按机型名合并覆盖。</li>
            <li><b>导入内置文案</b>：一键套用内置的 17 款机型文案。</li>
          </ul>
          <p class="help-note">数据保存在浏览器本地。更换浏览器或清理缓存会丢失，重要数据请及时导出备份。</p>
        </div>
      </div>
    </Modal>

    <!-- 设置弹窗 -->
    <Modal v-model="settingsVisible" title="设置" :footer-hide="true" :width="520">
      <div class="settings-section">
        <div class="settings-title">国补规则</div>
        <div class="settings-tip">补贴 = 原价 × 百分比，超过封顶则按封顶计算；国补价 = 原价 − 补贴。修改后需点「保存」并确认才生效。</div>
        <div class="rule-block">
          <div class="rule-name">电脑（笔记本 / 台式机）</div>
          <div class="rule-inputs">
            <label>百分比</label>
            <InputNumber :min="0" :max="100" v-model="subsidyDraft.computer.rate" :step="1" style="width:110px">
              <template #append>%</template>
            </InputNumber>
            <label>封顶</label>
            <InputNumber :min="0" v-model="subsidyDraft.computer.cap" :step="100" style="width:130px">
              <template #append>元</template>
            </InputNumber>
          </div>
        </div>
        <div class="rule-block">
          <div class="rule-name">移动（手机 / 平板）</div>
          <div class="rule-inputs">
            <label>百分比</label>
            <InputNumber :min="0" :max="100" v-model="subsidyDraft.mobile.rate" :step="1" style="width:110px">
              <template #append>%</template>
            </InputNumber>
            <label>封顶</label>
            <InputNumber :min="0" v-model="subsidyDraft.mobile.cap" :step="100" style="width:130px">
              <template #append>元</template>
            </InputNumber>
          </div>
        </div>
        <div class="rule-actions">
          <Button size="small" @click="handleResetSubsidy">恢复默认</Button>
          <Button size="small" type="primary" icon="md-checkmark" @click="handleSaveSubsidy">保存</Button>
          <Button size="small" type="warning" icon="md-refresh" @click="handleRecalcSubsidy">按新规则重算</Button>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-title">数据管理</div>
        <div class="settings-btns">
          <Button size="small" :disabled="selectedIds.size === 0" @click="store.exportSelected()">导出选中</Button>
          <Button size="small" @click="store.exportData()">导出全部</Button>
          <Upload action="" :before-upload="handleImportData" accept=".json" class="inline-upload">
            <Button size="small">导入数据</Button>
          </Upload>
          <Button size="small" icon="md-albums" @click="handleImportCopy">导入内置文案</Button>
        </div>
      </div>
    </Modal>

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
  padding: 14px 16px;
  background: var(--brand-gradient);
  color: #fff;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(228, 90, 0, 0.25);
}

.sidebar-header h1 {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 头部按钮：白底橙字，高对比醒目 */
.header-btn {
  background: #fff !important;
  border: none !important;
  color: var(--brand-primary) !important;
  font-weight: 700 !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15) !important;
  transition: transform 0.15s, box-shadow 0.15s;
}

.header-btn:hover {
  background: #fff !important;
  color: var(--brand-primary-dark) !important;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.22) !important;
}

.header-btn i {
  color: var(--brand-primary) !important;
}

.settings-section {
  padding: 12px 0;
}

/* 使用帮助 */
.help-body {
  max-height: 68vh;
  overflow-y: auto;
  padding-right: 8px;
}

.help-intro {
  font-size: 13px;
  line-height: 1.7;
  color: #444;
  background: #FFF6EF;
  border-left: 3px solid var(--brand-primary);
  padding: 10px 12px;
  border-radius: 4px;
  margin-bottom: 14px;
}

.help-section {
  margin-bottom: 14px;
}

.help-h {
  font-size: 14px;
  font-weight: 700;
  color: var(--brand-primary);
  margin-bottom: 6px;
}

.help-section ul,
.help-section ol {
  margin: 0;
  padding-left: 20px;
}

.help-section li {
  font-size: 13px;
  line-height: 1.75;
  color: #555;
}

.help-section b {
  color: #333;
}

.help-note {
  font-size: 12px;
  color: #999;
  margin-top: 6px;
}

.settings-section + .settings-section {
  border-top: 1px solid #f0f0f0;
}

.settings-title {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin-bottom: 6px;
}

.settings-tip {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
  line-height: 1.5;
}

.rule-block {
  padding: 8px 10px;
  margin-bottom: 10px;
  background: #fafafa;
  border-radius: 6px;
}

.rule-name {
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
}

.rule-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rule-inputs label {
  font-size: 12px;
  color: #888;
}

.rule-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.settings-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.inline-upload {
  display: inline-block;
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
  position: sticky;
  top: -6px;
  z-index: 2;
  background: #fff;
  box-shadow: 0 1px 0 #f0f0f0;
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
