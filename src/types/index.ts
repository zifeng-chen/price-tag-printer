export interface ColorItem {
  name: string;
  subsidyPrice?: number; // 国补价（空/0 表示不展示）
  price: number;         // 原价
}

export interface ProductItem {
  config: string;
  colors: ColorItem[];
}

export interface FeatureItem {
  title: string;
  desc: string;
  iconType: 'default' | 'image' | 'svg' | 'builtin';
  iconName: string; // builtin icon name from icon-library
  iconSrc: string;
  iconSize: number; // 1-100, percentage of color block size
}

export interface CardData {
  id: string;
  productTitle: string;
  showProductImage: boolean;
  productImageType: 'default' | 'custom';
  productImageSrc: string;
  features: FeatureItem[];
  products: ProductItem[];
  showAccessory: boolean;
  accessory1Name: string;
  accessory1Price: number;
  accessory2Name: string;
  accessory2Price: number;
  serviceTitle: string;
  service1Name: string;
  service1Price: number;
  service2Name: string;
  service2Price: number;
  priceRowSpacing: number; // px offset for product row height on card
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function createDefaultCard(): CardData {
  return {
    id: generateId(),
    productTitle: 'YOGA Pro 15 Aura AI元启版',
    showProductImage: true,
    productImageType: 'default',
    productImageSrc: '',
    features: [
      { title: '紧凑机身 便携大屏', desc: '15英寸 轻至1.69kg', iconType: 'builtin', iconName: '屏幕', iconSrc: '', iconSize: 70 },
      { title: '联想天禧AI智能体', desc: '系统级智能交互', iconType: 'builtin', iconName: '智能体', iconSrc: '', iconSize: 70 },
      { title: '灵境引擎 散热优化', desc: '性能释放更强', iconType: 'builtin', iconName: '静音散热', iconSrc: '', iconSize: 70 },
      { title: '全域妙写数位板', desc: 'Wacom认证', iconType: 'builtin', iconName: '数位板', iconSrc: '', iconSize: 70 },
    ],
    products: [
      {
        config: '酷睿Ultra7 RTX5060 32G 1T',
        colors: [
          { name: '黑', subsidyPrice: 0, price: 14999 },
          { name: '白', subsidyPrice: 0, price: 15499 },
        ],
      },
      {
        config: '酷睿Ultra9 RTX5060 32G 1T',
        colors: [
          { name: '黑', subsidyPrice: 0, price: 15999 },
          { name: '白', subsidyPrice: 0, price: 16499 },
        ],
      },
      {
        config: '酷睿Ultra9 RTX5070 32G 1T',
        colors: [{ name: '黑', subsidyPrice: 0, price: 16999 }],
      },
    ],
    showAccessory: true,
    accessory1Name: 'YOGA M5 无线鼠标',
    accessory1Price: 99,
    accessory2Name: 'YOGA 双肩包',
    accessory2Price: 299,
    serviceTitle: '想帮帮',
    service1Name: 'LenovoCare智享4年',
    service1Price: 899,
    service2Name: 'YOGA笔记本保值换新',
    service2Price: 499,
    priceRowSpacing: 0,
  };
}
