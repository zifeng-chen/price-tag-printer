<script setup lang="ts">
import { computed } from 'vue';
import type { CardData } from '../types';
import PriceTagCard from './PriceTagCard.vue';

const props = defineProps<{
  cards: CardData[];
  activeCardId?: string;
}>();

const emit = defineEmits<{
  deleteCard: [id: string];
}>();

const pages = computed(() => {
  const result: CardData[][] = [];
  for (let i = 0; i < props.cards.length; i += 2) {
    result.push(props.cards.slice(i, i + 2));
  }
  return result;
});

function hasMissingSubsidy(card: CardData): boolean {
  return card.products.some(p => p.colors.some(c => !c.subsidyPrice || c.subsidyPrice <= 0));
}
</script>

<template>
  <div class="preview-panel">
    <div class="a4-pages">
      <div v-for="(page, pageIdx) in pages" :key="pageIdx" class="a4-page">
        <template v-for="slotIdx in 2" :key="slotIdx">
          <div
            v-if="slotIdx - 1 < page.length"
            class="card-slot filled"
          >
            <PriceTagCard :card="page[slotIdx - 1]" />
            <template v-if="page[slotIdx - 1].id === activeCardId && hasMissingSubsidy(page[slotIdx - 1])">
              <div class="subsidy-warning subsidy-warning-left">未输入国补价格</div>
              <div class="subsidy-warning subsidy-warning-right">未输入国补价格</div>
            </template>
            <button
              class="btn-remove-from-a4"
              title="删除此展牌"
              @click="emit('deleteCard', page[slotIdx - 1].id)"
            >×</button>
          </div>
          <div v-else class="card-slot">
            <span class="card-slot-empty-text">空位</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
  background: #f5f5f5;
}

.a4-pages {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}

.a4-page {
  width: 210mm;
  height: 297mm;
  background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex: none;
  position: relative;
  padding-top: 14.25mm;
  gap: 4.5mm;
}

.card-slot {
  width: 110mm;
  height: 110mm;
  border: 0.5px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex: none;
}

.card-slot.filled {
  border: none;
}

.subsidy-warning {
  position: absolute;
  top: 50%;
  writing-mode: vertical-rl;
  background: #ff4d4f;
  color: #fff;
  border: 2px solid #cf1322;
  border-radius: 6px;
  padding: 14px 8px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 4px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.4);
  z-index: 5;
}

.subsidy-warning-left {
  left: -62px;
  animation: subsidy-pulse-left 1.2s ease-in-out infinite;
}

.subsidy-warning-right {
  right: -62px;
  animation: subsidy-pulse-right 1.2s ease-in-out infinite;
}

.subsidy-warning-left::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 12px solid #cf1322;
}

.subsidy-warning-right::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 100%;
  transform: translateY(-50%);
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 12px solid #cf1322;
}

@keyframes subsidy-pulse-left {
  0%, 100% { transform: translateY(-50%) scale(1); }
  50% { transform: translateY(-50%) scale(1.12); }
}

@keyframes subsidy-pulse-right {
  0%, 100% { transform: translateY(-50%) scale(1); }
  50% { transform: translateY(-50%) scale(1.12); }
}

.card-slot-empty-text {
  font-size: 12px;
  color: #ccc;
}

.btn-remove-from-a4 {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ff4d4f;
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s;
}

.card-slot:hover .btn-remove-from-a4 {
  opacity: 1;
}
</style>
