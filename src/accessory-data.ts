import { ref, watch, computed } from 'vue';

export interface AccessoryOption { name: string; price: number; category: string; }

const ACCESSORY_STORAGE_KEY = 'price-tag-accessories';

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
  { name: '拯救者M7X炫光版鼠标', price: 199, category: '键鼠' },
  { name: '拯救者M5游戏鼠标', price: 299, category: '键鼠' },
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

export interface ServiceOption { name: string; price: number; category: string; }

const SERVICE_STORAGE_KEY = 'price-tag-services';

const DEFAULT_SERVICES: ServiceOption[] = [
  { name: 'LenovoCare智享4年', price: 899, category: '延保服务' },
  { name: 'LenovoCare智享3年', price: 699, category: '延保服务' },
  { name: 'YOGA笔记本保值换新', price: 499, category: '增值服务' },
  { name: '拯救者保值换新', price: 399, category: '增值服务' },
  { name: '意外保护2年', price: 599, category: '保险服务' },
  { name: '意外保护1年', price: 399, category: '保险服务' },
  { name: '上门安装服务', price: 199, category: '安装服务' },
  { name: '数据迁移服务', price: 149, category: '安装服务' },
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
