export interface BuiltinIcon {
  name: string;
  src: string;
  category: string;
}

export const BUILTIN_ICONS: BuiltinIcon[] = [
  { name: '屏幕', src: '/icons/i1_屏幕.png', category: '显示' },
  { name: '16寸大屏', src: '/icons/i25_16寸大屏.png', category: '显示' },
  { name: 'OLED创作屏', src: '/icons/i22_OLED创作屏.png', category: '显示' },
  { name: '165Hz高刷', src: '/icons/i16_165Hz高刷.png', category: '显示' },
  { name: '色彩表现', src: '/icons/i11_色彩表现.png', category: '显示' },

  { name: '处理器', src: '/icons/i7_处理器.png', category: '性能' },
  { name: '第三代酷睿', src: '/icons/i14_第三代酷睿.png', category: '性能' },
  { name: '旗舰性能', src: '/icons/i4_旗舰性能.png', category: '性能' },
  { name: '独显光追', src: '/icons/i15_独显光追.png', category: '性能' },
  { name: '拯救者外观', src: '/icons/i8_拯救者外观.png', category: '性能' },

  { name: '16G内存', src: '/icons/i24_16G内存.png', category: '存储' },
  { name: '内存扩展', src: '/icons/i6_内存扩展.png', category: '存储' },
  { name: '大内存架构', src: '/icons/i21_大内存架构.png', category: '存储' },

  { name: 'AI算力', src: '/icons/i20_AI算力.png', category: 'AI' },
  { name: '智能体', src: '/icons/i0_智能体.png', category: 'AI' },
  { name: '本地大模型', src: '/icons/i19_本地大模型.png', category: 'AI' },

  { name: '轻薄机身', src: '/icons/i9_轻薄机身.png', category: '设计' },
  { name: '丝绸质感', src: '/icons/i12_丝绸质感.png', category: '设计' },
  { name: '键盘', src: '/icons/i13_键盘.png', category: '设计' },
  { name: '数位板', src: '/icons/i3_数位板.png', category: '设计' },
  { name: '游戏手柄', src: '/icons/i23_游戏手柄.png', category: '设计' },

  { name: '散热风扇', src: '/icons/i17_散热风扇.png', category: '散热续航' },
  { name: '静音散热', src: '/icons/i2_静音散热.png', category: '散热续航' },
  { name: '长续航', src: '/icons/i5_长续航.png', category: '散热续航' },

  { name: '品质保障', src: '/icons/i18_品质保障.png', category: '服务' },
  { name: '售后无忧', src: '/icons/i26_售后无忧.png', category: '服务' },
];

export const ICON_CATEGORIES: string[] = [
  ...new Set(BUILTIN_ICONS.map(i => i.category)),
];

const ICON_MAP = new Map(BUILTIN_ICONS.map(i => [i.name, i.src]));

export function getBuiltinIconSrc(name: string): string {
  return ICON_MAP.get(name) || '';
}
