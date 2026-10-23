export interface BuiltinIcon {
  name: string;
  src: string;
  category: string;
}

// 各分类的内置图标库：切换展牌分类时，卖点图标选择器随之切换
export const BUILTIN_ICONS_BY_CATEGORY: Record<string, BuiltinIcon[]> = {
  '笔记本': [
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
  ],
  '手机': [
  { name: '智能体', src: '/icons/i0_智能体.png', category: 'AI智能' },
  { name: '影像', src: '/icons/i5_影像.png', category: '影像' },
  { name: '品质', src: '/icons/i6_品质.png', category: '品质服务' },
  { name: '钻石', src: '/icons/i7_钻石.png', category: '设计外观' },
  { name: '续航', src: '/icons/i8_续航.png', category: '续航充电' },
  { name: '芯片', src: '/icons/i9_芯片.png', category: '性能' },
  { name: '轻薄', src: '/icons/i16_轻薄.png', category: '设计外观' },
  { name: '外屏', src: '/icons/i17_外屏.png', category: '显示' },
  { name: '转轴', src: '/icons/i18_转轴.png', category: '设计外观' },
  { name: '施华洛世奇', src: '/icons/i19_施华洛世奇.png', category: '设计外观' },
  { name: '影像-2', src: '/icons/i20_影像-2.png', category: '影像' },
  { name: '影像-3', src: '/icons/i21_影像-3.png', category: '影像' },
  { name: '机身', src: '/icons/i22_机身.png', category: '设计外观' },
  { name: '续航-3', src: '/icons/i23_续航-3.png', category: '续航充电' },
  { name: '防护', src: '/icons/i24_防护.png', category: '设计外观' },
  { name: '多开', src: '/icons/i25_多开.png', category: '互联办公' },
  { name: '影像-4', src: '/icons/i38_影像-4.png', category: '影像' },
  { name: '护眼-3', src: '/icons/i39_护眼-3.png', category: '显示' },
  { name: '影像-5', src: '/icons/i40_影像-5.png', category: '影像' },
  { name: 'Pantone', src: '/icons/i41_Pantone.png', category: '影像' },
  { name: '钻石-2', src: '/icons/i42_钻石-2.png', category: '设计外观' },
  { name: '转轴-2', src: '/icons/i43_转轴-2.png', category: '设计外观' },
  { name: '施华洛世奇-2', src: '/icons/i44_施华洛世奇-2.png', category: '设计外观' },
  { name: '音质-2', src: '/icons/i45_音质-2.png', category: '音质' },
  { name: '音质-3', src: '/icons/i46_音质-3.png', category: '音质' },
  { name: '夹耳', src: '/icons/i47_夹耳.png', category: '设计外观' },
  { name: '转轴-3', src: '/icons/i48_转轴-3.png', category: '设计外观' },
  { name: '影像-6', src: '/icons/i49_影像-6.png', category: '影像' },
  { name: 'Pantone-2', src: '/icons/i50_Pantone-2.png', category: '影像' },
  { name: '影像-7', src: '/icons/i51_影像-7.png', category: '影像' },
  { name: 'Pantone-3', src: '/icons/i52_Pantone-3.png', category: '影像' },
  { name: '机身-2', src: '/icons/i53_机身-2.png', category: '设计外观' },
  { name: '智能体-3', src: '/icons/i54_智能体-3.png', category: 'AI智能' },
  { name: '防护-2', src: '/icons/i55_防护-2.png', category: '设计外观' },
  { name: '护眼-4', src: '/icons/i56_护眼-4.png', category: '显示' },
  { name: 'NFC', src: '/icons/i57_NFC.png', category: '互联办公' },
  { name: '游戏', src: '/icons/i58_游戏.png', category: '性能' },
  { name: '游戏-2', src: '/icons/i59_游戏-2.png', category: '性能' },
  { name: '屏幕-7', src: '/icons/i60_屏幕-7.png', category: '显示' },
  { name: '散热-2', src: '/icons/i61_散热-2.png', category: '散热' },
  { name: '材质', src: '/icons/i62_材质.png', category: '设计外观' },
  { name: '转轴-4', src: '/icons/i63_转轴-4.png', category: '设计外观' },
  { name: '材质-2', src: '/icons/i64_材质-2.png', category: '设计外观' },
  { name: '护眼-5', src: '/icons/i65_护眼-5.png', category: '显示' },
  ],
  '平板': [
  { name: '智能体', src: '/icons/i0_智能体.png', category: 'AI智能' },
  { name: '屏幕', src: '/icons/i1_屏幕.png', category: '显示' },
  { name: '护眼', src: '/icons/i2_护眼.png', category: '显示' },
  { name: '芯片', src: '/icons/i9_芯片.png', category: '性能' },
  { name: '续航-2', src: '/icons/i10_续航-2.png', category: '续航充电' },
  { name: '护眼-2', src: '/icons/i11_护眼-2.png', category: '显示' },
  { name: '性能-2', src: '/icons/i26_性能-2.png', category: '性能' },
  { name: '屏幕-6', src: '/icons/i27_屏幕-6.png', category: '显示' },
  { name: '轻薄-2', src: '/icons/i28_轻薄-2.png', category: '设计外观' },
  { name: '笔写', src: '/icons/i29_笔写.png', category: '互联办公' },
  { name: '笔写-2', src: '/icons/i30_笔写-2.png', category: '互联办公' },
  { name: '学习', src: '/icons/i31_学习.png', category: '互联办公' },
  { name: '性能-3', src: '/icons/i32_性能-3.png', category: '性能' },
  { name: '游戏-3', src: '/icons/i66_游戏-3.png', category: '性能' },
  { name: '续航-4', src: '/icons/i67_续航-4.png', category: '续航充电' },
  { name: '游戏-4', src: '/icons/i68_游戏-4.png', category: '性能' },
  { name: '续航-5', src: '/icons/i69_续航-5.png', category: '续航充电' },
  { name: '散热-3', src: '/icons/i70_散热-3.png', category: '散热' },
  { name: '性能-4', src: '/icons/i71_性能-4.png', category: '性能' },
  { name: '充电', src: '/icons/i72_充电.png', category: '续航充电' },
  { name: '性能-5', src: '/icons/i73_性能-5.png', category: '性能' },
  { name: '游戏-5', src: '/icons/i74_游戏-5.png', category: '性能' },
  { name: '屏幕-8', src: '/icons/i75_屏幕-8.png', category: '显示' },
  { name: '学习-2', src: '/icons/i76_学习-2.png', category: '互联办公' },
  { name: '性能-6', src: '/icons/i77_性能-6.png', category: '性能' },
  { name: '笔写-3', src: '/icons/i78_笔写-3.png', category: '互联办公' },
  { name: '互联-2', src: '/icons/i79_互联-2.png', category: '互联办公' },
  { name: '性能-7', src: '/icons/i80_性能-7.png', category: '性能' },
  { name: '学习-3', src: '/icons/i81_学习-3.png', category: '互联办公' },
  { name: '性能-8', src: '/icons/i82_性能-8.png', category: '性能' },
  { name: '互联-3', src: '/icons/i83_互联-3.png', category: '互联办公' },
  { name: '笔写-4', src: '/icons/i84_笔写-4.png', category: '互联办公' },
  { name: '续航-6', src: '/icons/i85_续航-6.png', category: '续航充电' },
  { name: '笔写-5', src: '/icons/i86_笔写-5.png', category: '互联办公' },
  { name: '续航-7', src: '/icons/i87_续航-7.png', category: '续航充电' },
  { name: '性能-9', src: '/icons/i88_性能-9.png', category: '性能' },
  { name: '品质-2', src: '/icons/i89_品质-2.png', category: '品质服务' },
  { name: '芯片-2', src: '/icons/i90_芯片-2.png', category: '性能' },
  { name: '互联-4', src: '/icons/i91_互联-4.png', category: '互联办公' },
  { name: '笔写-6', src: '/icons/i92_笔写-6.png', category: '互联办公' },
  { name: '屏幕-9', src: '/icons/i93_屏幕-9.png', category: '显示' },
  { name: '性能-10', src: '/icons/i94_性能-10.png', category: '性能' },
  { name: '续航-8', src: '/icons/i95_续航-8.png', category: '续航充电' },
  { name: '笔写-7', src: '/icons/i96_笔写-7.png', category: '互联办公' },
  { name: '互联-5', src: '/icons/i97_互联-5.png', category: '互联办公' },
  { name: '音质-4', src: '/icons/i98_音质-4.png', category: '音质' },
  { name: '5G', src: '/icons/i99_5G.png', category: '互联办公' },
  ],
  '台式机': [
  { name: '智能体', src: '/icons/i0_智能体.png', category: 'AI智能' },
  { name: '音质', src: '/icons/i3_音质.png', category: '音质' },
  { name: '屏幕-2', src: '/icons/i4_屏幕-2.png', category: '显示' },
  { name: '屏幕-3', src: '/icons/i12_屏幕-3.png', category: '显示' },
  { name: '性能', src: '/icons/i13_性能.png', category: '性能' },
  { name: '屏幕-4', src: '/icons/i14_屏幕-4.png', category: '显示' },
  { name: '屏幕-5', src: '/icons/i15_屏幕-5.png', category: '显示' },
  { name: '处理器', src: '/icons/i33_处理器.png', category: '性能' },
  { name: '智能体-2', src: '/icons/i34_智能体-2.png', category: 'AI智能' },
  { name: '互联', src: '/icons/i35_互联.png', category: '互联办公' },
  { name: '打印', src: '/icons/i36_打印.png', category: '互联办公' },
  { name: '散热', src: '/icons/i37_散热.png', category: '散热' },
  { name: '銮光棱镜', src: '/icons/i100_銮光棱镜.png', category: '其他' },
  { name: '互联-6', src: '/icons/i101_互联-6.png', category: '互联办公' },
  { name: '系统', src: '/icons/i102_系统.png', category: 'AI智能' },
  { name: '内存', src: '/icons/i103_内存.png', category: '性能' },
  { name: '屏幕-10', src: '/icons/i104_屏幕-10.png', category: '显示' },
  { name: '屏幕-11', src: '/icons/i105_屏幕-11.png', category: '显示' },
  { name: '屏幕-12', src: '/icons/i106_屏幕-12.png', category: '显示' },
  { name: '互联-7', src: '/icons/i107_互联-7.png', category: '互联办公' },
  { name: '处理器-2', src: '/icons/i108_处理器-2.png', category: '性能' },
  { name: '处理器-3', src: '/icons/i109_处理器-3.png', category: '性能' },
  { name: '显卡', src: '/icons/i110_显卡.png', category: '性能' },
  { name: '存储', src: '/icons/i111_存储.png', category: '性能' },
  { name: '性能-11', src: '/icons/i112_性能-11.png', category: '性能' },
  { name: '机身-3', src: '/icons/i113_机身-3.png', category: '设计外观' },
  { name: '存储-2', src: '/icons/i114_存储-2.png', category: '性能' },
  { name: '存储-3', src: '/icons/i115_存储-3.png', category: '性能' },
  { name: '学习-4', src: '/icons/i116_学习-4.png', category: '互联办公' },
  { name: '品质-3', src: '/icons/i117_品质-3.png', category: '品质服务' },
  { name: '打印-2', src: '/icons/i118_打印-2.png', category: '互联办公' },
  { name: '网络', src: '/icons/i119_网络.png', category: '互联办公' },
  { name: '微信聊天', src: '/icons/i120_微信聊天.png', category: '互联办公' },
  { name: '鼓粉', src: '/icons/i121_鼓粉.png', category: '品质服务' },
  { name: '支架', src: '/icons/i122_支架.png', category: '设计外观' },
  { name: '处理器-4', src: '/icons/i123_处理器-4.png', category: '性能' },
  { name: '芯片-3', src: '/icons/i124_芯片-3.png', category: '性能' },
  { name: '散热-4', src: '/icons/i125_散热-4.png', category: '散热' },
  { name: '智能体-4', src: '/icons/i126_智能体-4.png', category: 'AI智能' },
  { name: '处理器-5', src: '/icons/i127_处理器-5.png', category: '性能' },
  { name: '供电', src: '/icons/i128_供电.png', category: '续航充电' },
  ],
};

// 兼容旧引用：默认指向笔记本图标集
export const BUILTIN_ICONS: BuiltinIcon[] = BUILTIN_ICONS_BY_CATEGORY['笔记本'];

export function getBuiltinIcons(category?: string): BuiltinIcon[] {
  return BUILTIN_ICONS_BY_CATEGORY[category || ''] || BUILTIN_ICONS_BY_CATEGORY['笔记本'];
}

export function iconCategoriesOf(category?: string): string[] {
  return [...new Set(getBuiltinIcons(category).map(i => i.category))];
}


export const ICON_CATEGORIES: string[] = [
  ...new Set(BUILTIN_ICONS.map(i => i.category)),
];

export function getBuiltinIconSrc(name: string, category?: string): string {
  const scoped = getBuiltinIcons(category).find(i => i.name === name);
  if (scoped) return scoped.src;
  for (const list of Object.values(BUILTIN_ICONS_BY_CATEGORY)) {
    const hit = list.find(i => i.name === name);
    if (hit) return hit.src;
  }
  return '';
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
