import { ref, watch } from 'vue';

export interface SubsidyRule {
  rate: number; // 补贴百分比，如 15 表示 15%
  cap: number;  // 封顶金额
}

export interface SubsidyConfig {
  computer: SubsidyRule; // 电脑（笔记本、台式机）
  mobile: SubsidyRule;   // 移动（手机、平板）
}

const CONFIG_KEY = 'price-tag-subsidy-config';

const DEFAULT_CONFIG: SubsidyConfig = {
  computer: { rate: 15, cap: 1500 },
  mobile: { rate: 15, cap: 500 },
};

function loadConfig(): SubsidyConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      const obj = JSON.parse(raw);
      return {
        computer: { ...DEFAULT_CONFIG.computer, ...(obj.computer || {}) },
        mobile: { ...DEFAULT_CONFIG.mobile, ...(obj.mobile || {}) },
      };
    }
  } catch { /* ignore */ }
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

export const subsidyConfig = ref<SubsidyConfig>(loadConfig());

watch(subsidyConfig, val => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(val));
  } catch { /* ignore */ }
}, { deep: true });

export function resetSubsidyConfig() {
  subsidyConfig.value = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

// 分类归入哪一档：笔记本/台式机 -> 电脑；手机/平板 -> 移动
function ruleOf(category?: string): SubsidyRule | null {
  if (category === '笔记本' || category === '台式机') return subsidyConfig.value.computer;
  if (category === '手机' || category === '平板') return subsidyConfig.value.mobile;
  return null;
}

export function hasSubsidyRule(category?: string): boolean {
  return !!ruleOf(category);
}

// 返回国补后价格；无规则或价格非法时返回 null（不自动计算）
export function calcSubsidyPrice(price: number, category?: string): number | null {
  const rule = ruleOf(category);
  if (!rule) return null;
  if (!Number.isFinite(price) || price <= 0) return null;
  const subsidy = Math.min(price * (rule.rate / 100), rule.cap);
  return Math.round((price - subsidy) * 10000) / 10000;
}
