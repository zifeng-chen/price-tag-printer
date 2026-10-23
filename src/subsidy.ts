import type { Category } from './types';

// 国补规则：补贴 = min(原价 × 15%, 封顶)；国补后 = 原价 − 补贴
// 电脑类（笔记本/台式机）封顶 1500，移动类（手机/平板）封顶 500
const SUBSIDY_RULES: Partial<Record<Category, { rate: number; cap: number }>> = {
  笔记本: { rate: 0.15, cap: 1500 },
  台式机: { rate: 0.15, cap: 1500 },
  手机: { rate: 0.15, cap: 500 },
  平板: { rate: 0.15, cap: 500 },
};

export function hasSubsidyRule(category?: string): boolean {
  return !!category && category in SUBSIDY_RULES;
}

// 返回国补后价格；无规则或价格非法时返回 null（不自动计算）
export function calcSubsidyPrice(price: number, category?: string): number | null {
  if (!category) return null;
  const rule = SUBSIDY_RULES[category as Category];
  if (!rule) return null;
  if (!Number.isFinite(price) || price <= 0) return null;
  const subsidy = Math.min(price * rule.rate, rule.cap);
  return Math.round((price - subsidy) * 10000) / 10000;
}
