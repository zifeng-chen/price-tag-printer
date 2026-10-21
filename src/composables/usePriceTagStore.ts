import { ref, watch, computed } from 'vue';
import type { CardData } from '../types';
import { createDefaultCard, generateId } from '../types';
import { PRESET_CARDS } from '../preset-data';

const STORAGE_KEY = 'price-tag-printer-data';
const SELECTED_KEY = 'price-tag-printer-selected';
const VERSION_KEY = 'price-tag-printer-version';
const CURRENT_VERSION = '2';

function loadFromStorage(): CardData[] {
  try {
    const version = localStorage.getItem(VERSION_KEY);
    if (version !== CURRENT_VERSION) {
      // Version mismatch or first run: clear old data, use preset
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SELECTED_KEY);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      return [];
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length > 0 && data[0]?.products) {
        return data;
      }
    }
  } catch { /* ignore */ }
  return [];
}

function loadSelected(ids: string[]): Set<string> {
  try {
    const raw = localStorage.getItem(SELECTED_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch { /* ignore */ }
  return new Set(ids);
}

export function usePriceTagStore() {
  const stored = loadFromStorage();
  // Use preset data if no stored data or only default placeholder
  const initialCards = stored.length > 0 ? stored : PRESET_CARDS as CardData[];
  const cards = ref<CardData[]>(initialCards);
  const activeCardIndex = ref(0);
  const selectedIds = ref<Set<string>>(loadSelected(cards.value.map(c => c.id)));
  const searchQuery = ref('');
  const viewMode = ref<'list' | 'edit'>('list');

  watch(cards, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
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

  function duplicateCard(index: number) {
    const source = cards.value[index];
    if (!source) return;
    const clone: CardData = JSON.parse(JSON.stringify(source));
    clone.id = generateId();
    cards.value.splice(index + 1, 0, clone);
    activeCardIndex.value = index + 1;
    selectedIds.value = new Set([...selectedIds.value, clone.id]);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(cards.value, null, 2)], { type: 'application/json' });
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
    const blob = new Blob([JSON.stringify(selected, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `价格展牌_选中_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          if (Array.isArray(data) && data.length > 0) {
            // Merge: update existing by productTitle, add new ones
            const existingMap = new Map(cards.value.map(c => [c.productTitle, c]));
            for (const item of data) {
              const existing = existingMap.get(item.productTitle);
              if (existing) {
                // Overwrite existing card's content but keep its id
                Object.assign(existing, item, { id: existing.id });
              } else {
                // New card
                cards.value.push(item);
                selectedIds.value = new Set([...selectedIds.value, item.id]);
              }
            }
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
    selectedCards,
    toggleSelect,
    selectAll,
    deselectAll,
    addCard,
    deleteCard,
    duplicateCard,
    exportData,
    exportSelected,
    importData,
    getTotalColorRows,
    checkAndSyncAccessory,
  };
}
