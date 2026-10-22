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
  { name: '高性能', src: '/icons/i10_高性能.png', category: '性能' },
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

// 图标关联文案：选中内置图标后可选用的候选文案（标题 / 副标题）
export const ICON_COPY_MAP: Record<string, { title: string; desc: string }[]> = {
  '智能体': [
    { title: '联想天禧个人超级智能体', desc: '系统级伴随交互 随时AI随时问' },
    { title: '联想天禧个人超级智能体', desc: '专属游戏超能搭档' },
    { title: '性能 AI 双在线', desc: '3.4克拉钻石铜散热系统及天禧4.0' },
    { title: '性能 AI 双在线', desc: '酷睿Ultra处理器及天禧4.0' },
  ],
  '屏幕': [
    { title: '紧凑机身 便携大屏 超轻重量', desc: '15英寸机身 轻至1.69kg' },
    { title: '超高亮双层OLED专业超感屏', desc: '逐屏逐色域专业校色 潘通双认证' },
    { title: '高分高刷 1100尼特高亮屏', desc: '色域100%全覆盖设计师首选' },
    { title: '1100尼特星耀舒视屏', desc: '色彩准,屏幕大,久看不累' },
    { title: '1100尼特星耀舒视屏', desc: '小巧便携,色彩精准,久看不累' },
    { title: '高分高刷专业超竞屏', desc: '0.08ms响应/1100nits超高亮度' },
    { title: '专业超竞屏OLED', desc: '游戏无拖影强大广色域' },
    { title: '旗舰 OLED 专业屏', desc: '2.8K/120Hz/1100 尼特' },
    { title: '14 英寸高分高刷高亮度广色域屏', desc: '2.8K 120Hz 1100nits护眼认证' },
    { title: '16英寸高分高刷IPS屏', desc: '全DC调光无频闪' },
    { title: '16:10黄金比例臻彩屏', desc: 'DC调光+高色域,色彩鲜活清晰' },
  ],
  '静音散热': [
    { title: '灵境引擎 乾坤散热', desc: '100+软件调优 游戏同源散热' },
    { title: '独特极简底面设计', desc: '运行安静防尘优秀' },
  ],
  '数位板': [
    { title: '7英寸全域妙写数位板', desc: 'Wacom系统级认证' },
  ],
  '旗舰性能': [
    { title: '不妥协的大尺寸高性能轻薄本', desc: '整机性能释放至高85W' },
    { title: '高性能兼顾长续航 便于携带', desc: '性能小钢炮 至高75W (UX7 358H)' },
    { title: 'A/C面镁合金材质', desc: '兼具轻盈与坚固' },
  ],
  '长续航': [
    { title: '99.9Whr高密度高放电能力电池', desc: '超长续航 插电拔电都有高性能' },
    { title: '92.5Whr高密度高放电能力电池', desc: '超长续航 插电拔电都有高性能' },
    { title: '高性能,长续航,低噪音', desc: '80Whr大电池' },
    { title: '高性能,长续航,低噪音', desc: '60Whr大电池' },
    { title: '长续航,低噪音舒适体验', desc: '旗舰高能量密度电池(ED900Whr/L)' },
  ],
  '内存扩展': [
    { title: '双内存插槽扩展', desc: '全能扩展,大内存,大存储' },
  ],
  '处理器': [
    { title: '旗舰处理器,可选RTX 5070显卡', desc: '乾坤Pro散热架构 6400满速内存' },
    { title: '轻薄高颜值 X基因', desc: '便携的桌面级性能' },
  ],
  '拯救者外观': [
    { title: '经典大Y LOGO外观', desc: '四扬声器立体声 快充生态' },
  ],
  '轻薄机身': [
    { title: '轻薄坚固美学', desc: '975g超轻超薄镁合金机身' },
    { title: '极致轻薄机身', desc: '13.9mm 刀锋设计' },
    { title: '11.9mm致薄 约1.06kg超轻', desc: '全金属丝绸铝机身 多彩可选' },
    { title: '约1kg超轻薄机身', desc: '超轻大屏本一手掌握' },
    { title: '约990g与约12.95mm超薄轻机身', desc: '轻若无物的手感与便携体验' },
  ],
  '高性能': [
    { title: '长续航全场景配置', desc: '27小时超长续航/高密度电池' },
  ],
  '色彩表现': [
    { title: '亲肤丝绸机身三色可选', desc: '丝绸灵感配色:云绢/烟绫/夜缎' },
  ],
  '丝绸质感': [
    { title: '丝绸铝双色全金属机身', desc: '浅海贝/霁空蓝' },
  ],
  '键盘': [
    { title: '独立数字键 浮萍式大键帽键盘', desc: '办公输入更高效' },
  ],
  '第三代酷睿': [
    { title: '第三代英特尔酷睿处理器', desc: '全场景适配,办公娱乐学习更高效' },
  ],
  '独显光追': [
    { title: 'RTX3050 光追独显', desc: '8 核处理器畅玩 3A' },
  ],
  '165Hz高刷': [
    { title: '165Hz 电竞高刷屏', desc: '画面丝滑无拖影' },
  ],
  '散热风扇': [
    { title: '智能散热调校', desc: '长时间游戏不降频' },
  ],
  '品质保障': [
    { title: '联想大品牌', desc: '全国联保售后省心' },
  ],
  '本地大模型': [
    { title: '无网本地运行', desc: '超千亿参数大模型' },
  ],
  'AI算力': [
    { title: 'RTX Spark超级芯片', desc: '1PFlops AI 算力' },
  ],
  '大内存架构': [
    { title: '64G/128G', desc: '超大统一内存架构' },
  ],
  'OLED创作屏': [
    { title: 'OLED 专业创作屏', desc: '2.5K 165Hz 高刷' },
  ],
  '游戏手柄': [
    { title: '入门游戏优选', desc: 'RTX3050 独显够用' },
  ],
  '16G内存': [
    { title: '16G 内存', desc: '多开程序流畅运行' },
  ],
  '16寸大屏': [
    { title: '16 英寸大屏', desc: '高刷电竞视野广' },
  ],
  '售后无忧': [
    { title: '联想售后保障', desc: '全国 4400＋服务点' },
  ],
};
