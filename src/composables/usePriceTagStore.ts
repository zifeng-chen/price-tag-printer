import { ref, watch, computed } from 'vue';
import type { CardData } from '../types';
import { createDefaultCard, generateId, CATEGORIES, DEFAULT_CATEGORY } from '../types';
import { PRESET_CARDS } from '../preset-data';
import { calcSubsidyPrice } from '../subsidy';

const STORAGE_KEY = 'price-tag-printer-data';
const SELECTED_KEY = 'price-tag-printer-selected';
const VERSION_KEY = 'price-tag-printer-version';
const CURRENT_VERSION = '7';

// 兼容旧数据 / 导入数据：无 category 或非法值统一归入默认分类
function normalizeCards(list: CardData[]): CardData[] {
  return list.map(card => ({
    ...card,
    category: (CATEGORIES as readonly string[]).includes(card.category)
      ? card.category
      : DEFAULT_CATEGORY,
  }));
}

function loadFromStorage(): CardData[] | null {
  try {
    const version = localStorage.getItem(VERSION_KEY);
    if (version !== CURRENT_VERSION) {
      // Version mismatch or first run: clear old data, use preset
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SELECTED_KEY);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // Ignore an empty list so the preset is shown again after a full delete
      if (Array.isArray(data) && data.length > 0) return normalizeCards(data);
    }
  } catch { /* ignore */ }
  return null;
}

function loadSelected(allIds: string[]): Set<string> {
  try {
    const raw = localStorage.getItem(SELECTED_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      // 旧版本会默认全选，若缓存里恰好是全选则视为未选择，不再默认勾选
      if (Array.isArray(arr) && !(arr.length > 0 && arr.length === allIds.length)) {
        return new Set(arr);
      }
    }
  } catch { /* ignore */ }
  return new Set();
}

// 序列化时清理国补价 0：未填写则不留字段
function serializeCards(list: CardData[]): string {
  const cleaned = list.map(card => ({
    ...card,
    products: card.products.map(p => ({
      ...p,
      colors: p.colors.map(c => {
        const { subsidyPrice, ...rest } = c;
        return subsidyPrice && subsidyPrice > 0 ? { ...rest, subsidyPrice } : rest;
      }),
    })),
  }));
  return JSON.stringify(cleaned, null, 2);
}

export function usePriceTagStore() {
  const stored = loadFromStorage();
  const initialCards = stored ?? (PRESET_CARDS as CardData[]);
  const cards = ref<CardData[]>(initialCards);
  const activeCardIndex = ref(0);
  const selectedIds = ref<Set<string>>(loadSelected(cards.value.map(c => c.id)));
  const searchQuery = ref('');
  const viewMode = ref<'list' | 'edit'>('list');

  watch(cards, (val) => {
    localStorage.setItem(STORAGE_KEY, serializeCards(val));
  }, { deep: true });

  watch(selectedIds, (val) => {
    localStorage.setItem(SELECTED_KEY, JSON.stringify([...val]));
  }, { deep: true });

  const filteredCards = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    let list = cards.value.map((card, index) => ({ card, index }));
    if (q) {
      list = list.filter(({ card }) => card.productTitle.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.card.productTitle.localeCompare(b.card.productTitle, 'zh-CN'));
  });

  // 左侧展牌管理：按分类分组，笔记本始终在最前，其余按 CATEGORIES 顺序；
  // 空分类也保留（作为底部固定分组）
  const groupedCards = computed(() => {
    return CATEGORIES.map(category => ({
      category,
      items: filteredCards.value.filter(({ card }) => card.category === category),
    }));
  });

  const selectedCards = computed(() => {
    return cards.value.filter(c => selectedIds.value.has(c.id));
  });

  function toggleSelect(id: string) {
    const s = new Set(selectedIds.value);
    if (s.has(id)) s.delete(id); else s.add(id);
    selectedIds.value = s;
  }

  function selectAll() {
    selectedIds.value = new Set(cards.value.map(c => c.id));
  }

  function deselectAll() {
    selectedIds.value = new Set();
  }

  function addCard() {
    cards.value.push(createDefaultCard());
    activeCardIndex.value = cards.value.length - 1;
    selectedIds.value = new Set([...selectedIds.value, cards.value[cards.value.length - 1].id]);
  }

  function deleteCard(index: number) {
    if (cards.value.length <= 1) return;
    const id = cards.value[index].id;
    cards.value.splice(index, 1);
    const s = new Set(selectedIds.value);
    s.delete(id);
    selectedIds.value = s;
    if (activeCardIndex.value >= cards.value.length) {
      activeCardIndex.value = cards.value.length - 1;
    }
  }

  function deleteSelected() {
    if (selectedIds.value.size === 0) return;
    const ids = new Set(selectedIds.value);
    cards.value = cards.value.filter(c => !ids.has(c.id));
    selectedIds.value = new Set();
    if (activeCardIndex.value >= cards.value.length) {
      activeCardIndex.value = Math.max(0, cards.value.length - 1);
    }
  }

  function duplicateCard(index: number) {
    const source = cards.value[index];
    if (!source) return;
    const clone: CardData = JSON.parse(JSON.stringify(source));
    clone.id = generateId();
    // 复制件名称加前缀，便于区分原牌与复制牌
    clone.productTitle = `复制 - ${source.productTitle || ''}`;
    cards.value.splice(index + 1, 0, clone);
    activeCardIndex.value = index + 1;
    selectedIds.value = new Set([...selectedIds.value, clone.id]);
  }

  function exportData() {
    const blob = new Blob([serializeCards(cards.value)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `价格展牌_全部_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportSelected() {
    const selected = cards.value.filter(c => selectedIds.value.has(c.id));
    if (selected.length === 0) return;
    const blob = new Blob([serializeCards(selected)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `价格展牌_选中_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function mergeCards(incoming: CardData[], selectNew = false) {
    const normalized = normalizeCards(incoming);
    const existingMap = new Map(cards.value.map(c => [c.productTitle, c]));
    const added: string[] = [];
    for (const item of normalized) {
      const existing = existingMap.get(item.productTitle);
      if (existing) {
        Object.assign(existing, item, { id: existing.id });
      } else {
        cards.value.push(item);
        added.push(item.id);
      }
    }
    if (selectNew && added.length) {
      selectedIds.value = new Set([...selectedIds.value, ...added]);
    }
  }

  function importCopyData(incoming: CardData[]): number {
    if (!Array.isArray(incoming) || incoming.length === 0) return 0;
    mergeCards(incoming, true);
    return incoming.length;
  }

  function importData(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          if (Array.isArray(data) && data.length > 0) {
            mergeCards(data, true);
            resolve();
          } else {
            reject(new Error('无效的数据格式'));
          }
        } catch {
          reject(new Error('JSON解析失败'));
        }
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsText(file);
    });
  }

  function getTotalColorRows(card: CardData): number {
    let total = 0;
    card.products.forEach(p => { total += p.colors.length; });
    return total;
  }

  // 按当前生效的国补规则重算所有展牌的国补价，返回被更新的展牌数
  function recalcAllSubsidy(): number {
    let changed = 0;
    cards.value.forEach(card => {
      let touched = false;
      card.products.forEach(p => {
        p.colors.forEach(color => {
          const next = calcSubsidyPrice(color.price, card.category);
          if (next === null) return; // 无规则/价格非法：跳过，保持原值
          if (color.subsidyPrice !== next) {
            color.subsidyPrice = next;
            touched = true;
          }
        });
      });
      if (touched) changed++;
    });
    return changed;
  }

  function checkAndSyncAccessory(card: CardData) {
    card.showAccessory = getTotalColorRows(card) <= 5;
  }

  return {
    cards,
    activeCardIndex,
    selectedIds,
    searchQuery,
    viewMode,
    filteredCards,
    groupedCards,
    selectedCards,
    toggleSelect,
    selectAll,
    deselectAll,
    addCard,
    deleteCard,
    deleteSelected,
    duplicateCard,
    exportData,
    exportSelected,
    importData,
    importCopyData,
    getTotalColorRows,
    checkAndSyncAccessory,
    recalcAllSubsidy,
  };
}
