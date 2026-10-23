import { ref, watch, computed } from 'vue';

export interface AccessoryOption { name: string; price: number; category: string; }

const ACCESSORY_STORAGE_KEY = 'price-tag-accessories-v2';

const DEFAULT_ACCESSORIES: AccessoryOption[] = [
  { name: '拯救者R360无线耳机', price: 249, category: '耳机' },
  { name: '拯救者Y360电竞耳机', price: 199, category: '耳机' },
  { name: '异能者无线耳机', price: 159, category: '耳机' },
  { name: '异能者旋转支架', price: 199, category: '支架' },
  { name: '拯救者Z4支架', price: 199, category: '支架' },
  { name: '拯救者Z7支架', price: 299, category: '支架' },
  { name: 'ThinkPlus C06适配器', price: 159, category: '电脑配件' },
  { name: 'ThinkPlus C08适配器', price: 199, category: '电脑配件' },
  { name: 'K7机械键盘', price: 599, category: '键鼠' },
  { name: '小新K5Pro机械键盘', price: 299, category: '键鼠' },
  { name: '小新K5机械键盘', price: 199, category: '键鼠' },
  { name: '极光键盘GK10三模98键', price: 299, category: '键鼠' },
  { name: 'Lenovo键鼠套装', price: 159, category: '键鼠' },
  { name: '小新K1P键鼠套装', price: 199, category: '键鼠' },
  { name: '异能者EKM801键鼠套装', price: 169, category: '键鼠' },
  { name: '小新M1蓝牙鼠标', price: 99, category: '键鼠' },
  { name: '联想M30双模充电鼠标', price: 99, category: '键鼠' },
  { name: '异能者M201有线鼠标', price: 99, category: '键鼠' },
  { name: '小新M2蓝牙鼠标', price: 159, category: '键鼠' },
  { name: '小新人体工学鼠标', price: 159, category: '键鼠' },
  { name: '拯救者M7X炫光版鼠标', price: 269, category: '键鼠' },
  { name: '拯救者M5游戏鼠标', price: 169, category: '键鼠' },
  { name: '极光三模GM11Pro游戏鼠标', price: 199, category: '键鼠' },
  { name: '拯救者M6X系列鼠标', price: 199, category: '键鼠' },
  { name: '拯救者C4双肩包', price: 299, category: '背包' },
  { name: '小新B1 可可蛋奶双肩包', price: 199, category: '背包' },
  { name: '拯救者C-Sport双肩包', price: 399, category: '背包' },
  { name: '拯救者X7多功能背包', price: 599, category: '背包' },
  { name: '异能者101双肩包', price: 159, category: '背包' },
  { name: '联想B41背包', price: 99, category: '背包' },
  { name: '拯救者P4双肩包', price: 499, category: '背包' },
  { name: '拯救者X4双肩背包', price: 599, category: '背包' },
  { name: 'ThinkPlus GaN 三口65W充电器', price: 159, category: '充电器' },
  { name: '小新GaN 125W多口适配器', price: 399, category: '充电器' },
  { name: '拯救者300W GaN适配器', price: 599, category: '充电器' },
  { name: '拯救者245W GaN适配器', price: 499, category: '充电器' },
  { name: '拯救者Y960电竞耳机', price: 599, category: '耳机' },
  { name: '拯救者M7XPro游戏鼠标', price: 359, category: '键鼠' },
  { name: '小新蓝牙鼠标Plus', price: 129, category: '键鼠' },
  { name: '拯救者双肩包 C1', price: 199, category: '背包' },
  { name: '拯救者极光R7游戏键盘', price: 1599, category: '键鼠' },
  { name: '拯救者Y7 MG 游戏鼠标', price: 699, category: '键鼠' },
  { name: '拯救者 Z7Pro 支架', price: 399, category: '支架' },
  { name: '联想B43背包', price: 99, category: '背包' },
  { name: '拯救者 MK2有线游戏键盘', price: 199, category: '键鼠' },
  { name: '启天双口闪存盘32G', price: 99, category: '电脑配件' },
  { name: '启天双口闪存盘64G', price: 129, category: '电脑配件' },
  { name: '拯救者 游戏手柄G3', price: 169, category: '手机配件' },
  { name: '拯救者 游戏手柄 G9', price: 499, category: '手机配件' },
  { name: '小新K1S轻音无线键鼠套装', price: 199, category: '键鼠' },
  { name: '联想KN210无线键鼠套装', price: 159, category: '键鼠' },
  { name: '拯救者 R9 68 磁轴电竞键盘', price: 999, category: '键鼠' },
  { name: '联想手提内胆包B14', price: 99, category: '背包' },
  { name: '异能者MK82机械键盘', price: 289, category: '键鼠' },
  { name: '小新小Q蓝牙无线鼠标', price: 99, category: '键鼠' },
  { name: '小新K2有线游戏键盘', price: 159, category: '键鼠' },
  { name: '拯救者R7轻量化电竞鼠标', price: 429, category: '键鼠' },
];

function loadAccessories(): AccessoryOption[] {
  try {
    const raw = localStorage.getItem(ACCESSORY_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch { /* ignore */ }
  return DEFAULT_ACCESSORIES;
}

export function useAccessoryStore() {
  const accessories = ref<AccessoryOption[]>(loadAccessories());

  watch(accessories, (val) => {
    localStorage.setItem(ACCESSORY_STORAGE_KEY, JSON.stringify(val));
  }, { deep: true });

  function addAccessory(item: AccessoryOption) {
    accessories.value.push(item);
  }

  function updateAccessory(index: number, item: AccessoryOption) {
    if (index >= 0 && index < accessories.value.length) {
      accessories.value[index] = item;
    }
  }

  function deleteAccessory(index: number) {
    if (index >= 0 && index < accessories.value.length) {
      accessories.value.splice(index, 1);
    }
  }

  const categories = computed(() => [...new Set(accessories.value.map(a => a.category))]);

  return { accessories, categories, addAccessory, updateAccessory, deleteAccessory };
}

// ==================== Service Store ====================

export interface ServiceOption { name: string; price: number; category: string; productCategory?: string; }

const SERVICE_STORAGE_KEY = 'price-tag-services-v2';

const DEFAULT_SERVICES: ServiceOption[] = [
  { name: '一年延保服务', price: 69, category: '延长保修', productCategory: '手机' },
  { name: '一年延保服务', price: 89, category: '延长保修', productCategory: '手机' },
  { name: '一年延保服务', price: 99, category: '延长保修', productCategory: '手机' },
  { name: '一年延保服务', price: 119, category: '延长保修', productCategory: '手机' },
  { name: '一年延保服务', price: 199, category: '延长保修', productCategory: '手机' },
  { name: '一年延保服务', price: 259, category: '延长保修', productCategory: '手机' },
  { name: '一年延保服务', price: 329, category: '延长保修', productCategory: '手机' },
  { name: '一年延保服务', price: 599, category: '延长保修', productCategory: '手机' },
  { name: '一年碎屏保', price: 79, category: '意外保障', productCategory: '手机' },
  { name: '一年碎屏保服务', price: 119, category: '意外保障', productCategory: '手机' },
  { name: '一年碎屏保服务', price: 159, category: '意外保障', productCategory: '手机' },
  { name: '一年碎屏保服务', price: 169, category: '意外保障', productCategory: '手机' },
  { name: '一年碎屏保服务', price: 199, category: '意外保障', productCategory: '手机' },
  { name: '一年碎屏保服务', price: 249, category: '意外保障', productCategory: '手机' },
  { name: '一年碎屏保服务', price: 499, category: '意外保障', productCategory: '手机' },
  { name: '一年碎屏保服务', price: 599, category: '意外保障', productCategory: '手机' },
  { name: '一年碎屏保服务', price: 999, category: '意外保障', productCategory: '手机' },
  { name: '一年碎屏服务', price: 99, category: '意外保障', productCategory: '手机' },
  { name: '三年电池延保', price: 159, category: '延长保修', productCategory: '手机' },
  { name: '二年保值换新服务', price: 199, category: '保值换新', productCategory: '手机' },
  { name: 'Lenovo Care 平板智享2年', price: 149, category: '延长保修', productCategory: '平板' },
  { name: 'Lenovo Care 平板智享3年', price: 279, category: '延长保修', productCategory: '平板' },
  { name: 'Lenovo Care 平板智享4年', price: 409, category: '延长保修', productCategory: '平板' },
  { name: '联想平板1年延保服务', price: 129, category: '延长保修', productCategory: '平板' },
  { name: '联想平板1年碎屏无忧服务', price: 129, category: '意外保障', productCategory: '平板' },
  { name: 'Lenovo Care 智享4年 延长保修+上门+上门清洁', price: 279, category: '延长保修', productCategory: '台式机' },
  { name: 'Lenovo Care 智臻4年 延长保修+上门+上门体检', price: 719, category: '延长保修', productCategory: '台式机' },
  { name: 'Lenovo Care 智臻4年 意外+上门+延保', price: 539, category: '意外保障', productCategory: '台式机' },
  { name: 'LenovoCare智臻04 延长保修+上门+意外', price: 599, category: '意外保障', productCategory: '台式机' },
  { name: 'LenovoCare智享3年 延长保修+上门+清洁', price: 439, category: '延长保修', productCategory: '笔记本' },
  { name: 'LenovoCare智享4年 延长保修+上门+清洁', price: 899, category: '延长保修', productCategory: '笔记本' },
  { name: 'LenovoCare智臻3年 意外+延长保修+上门+清洁', price: 799, category: '意外保障', productCategory: '笔记本' },
  { name: 'YOGA笔记本4年保值换新', price: 499, category: '保值换新', productCategory: '笔记本' },
  { name: '小新笔记本4年保值换新', price: 299, category: '保值换新', productCategory: '笔记本' },
  { name: '联想原厂 16G DDR5笔记本内存升级服务（5600MHz）', price: 1799, category: '升级安装', productCategory: '笔记本' },
  { name: '联想原厂 1T SSD升级服务', price: 1999, category: '升级安装', productCategory: '笔记本' },
];

function loadServices(): ServiceOption[] {
  try {
    const raw = localStorage.getItem(SERVICE_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch { /* ignore */ }
  return DEFAULT_SERVICES;
}

export function useServiceStore() {
  const services = ref<ServiceOption[]>(loadServices());

  watch(services, (val) => {
    localStorage.setItem(SERVICE_STORAGE_KEY, JSON.stringify(val));
  }, { deep: true });

  function addService(item: ServiceOption) {
    services.value.push(item);
  }

  function updateService(index: number, item: ServiceOption) {
    if (index >= 0 && index < services.value.length) {
      services.value[index] = item;
    }
  }

  function deleteService(index: number) {
    if (index >= 0 && index < services.value.length) {
      services.value.splice(index, 1);
    }
  }

  const serviceCategories = computed(() => [...new Set(services.value.map(s => s.category))]);

  return { services, serviceCategories, addService, updateService, deleteService };
}
