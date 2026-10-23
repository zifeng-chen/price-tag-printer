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

export const DEFAULT_SUBSIDY_CONFIG: SubsidyConfig = {
  computer: { rate: 15, cap: 1500 },
  mobile: { rate: 15, cap: 500 },
};

function clone(cfg: SubsidyConfig): SubsidyConfig {
  return JSON.parse(JSON.stringify(cfg));
}

function normalize(obj: unknown): SubsidyConfig {
  const o = (obj || {}) as Partial<SubsidyConfig>;
  return {
    computer: { ...DEFAULT_SUBSIDY_CONFIG.computer, ...(o.computer || {}) },
    mobile: { ...DEFAULT_SUBSIDY_CONFIG.mobile, ...(o.mobile || {}) },
  };
}

function loadConfig(): SubsidyConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch { /* ignore */ }
  return clone(DEFAULT_SUBSIDY_CONFIG);
}

// 已生效的配置（持久化）
export const subsidyConfig = ref<SubsidyConfig>(loadConfig());

watch(subsidyConfig, val => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(val));
  } catch { /* ignore */ }
}, { deep: true });

// 显式应用新配置（保存按钮确认后调用）
export function applySubsidyConfig(cfg: SubsidyConfig) {
  subsidyConfig.value = normalize(cfg);
}

// 按指定配置计算国补价（用于保存前的预览/重算，不影响已生效配置）
export function calcSubsidyPriceWith(price: number, category: string | undefined, cfg: SubsidyConfig): number | null {
  const rule = ruleOf(category, cfg);
  if (!rule) return null;
  if (!Number.isFinite(price) || price <= 0) return null;
  const subsidy = Math.min(price * (rule.rate / 100), rule.cap);
  return Math.round((price - subsidy) * 10000) / 10000;
}

// 分类归入哪一档：笔记本/台式机 -> 电脑；手机/平板 -> 移动
function ruleOf(category: string | undefined, cfg: SubsidyConfig): SubsidyRule | null {
  if (category === '笔记本' || category === '台式机') return cfg.computer;
  if (category === '手机' || category === '平板') return cfg.mobile;
  return null;
}

export function hasSubsidyRule(category?: string): boolean {
  return !!ruleOf(category, subsidyConfig.value);
}

// 按已生效配置计算国补价；无规则或价格非法时返回 null（不自动计算）
export function calcSubsidyPrice(price: number, category?: string): number | null {
  return calcSubsidyPriceWith(price, category, subsidyConfig.value);
}
