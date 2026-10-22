<script setup lang="ts">
import { computed, ref } from 'vue';
import { Modal } from 'view-ui-plus';
import type { CardData } from '../types';
import { useAccessoryStore } from '../accessory-data';
import { useServiceStore } from '../accessory-data';
import type { AccessoryOption, ServiceOption } from '../accessory-data';
import { BUILTIN_ICONS, ICON_CATEGORIES } from '../icon-library';
import type { FeatureItem } from '../types';

const accessoryStore = useAccessoryStore();
const serviceStore = useServiceStore();

const props = defineProps<{
  cards: CardData[];
  activeIndex: number;
}>();

const currentCard = computed(() => props.cards[props.activeIndex]);

const collapsed = ref({
  productImage: false,
  features: false,
  products: false,
  accessory: false,
  service: false,
});

const featureCollapsed = ref([false, false, false, false]);

function toggleSection(key: keyof typeof collapsed.value) {
  collapsed.value[key] = !collapsed.value[key];
}

function toggleFeature(idx: number) {
  featureCollapsed.value[idx] = !featureCollapsed.value[idx];
}

const MAX_FEATURES = 4;
const MIN_FEATURES = 3;

const featureImageInputs = ref<(HTMLInputElement | null)[]>([]);

function setFeatureInputRef(idx: number, el: any) {
  featureImageInputs.value[idx] = el as HTMLInputElement;
}

const MAX_COLOR_ROWS = 6;

function getTotalColorRows(card: CardData): number {
  let total = 0;
  card.products.forEach(p => { total += p.colors.length; });
  return total;
}

function canAddProduct(card: CardData): boolean {
  return getTotalColorRows(card) < MAX_COLOR_ROWS;
}

function canAddColor(card: CardData): boolean {
  return getTotalColorRows(card) < MAX_COLOR_ROWS;
}

function uploadProductImage(event: Event) {
  const card = currentCard.value;
  if (!card) return;
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { card.productImageSrc = reader.result as string; };
  reader.readAsDataURL(file);
}

function addProduct() {
  const card = currentCard.value;
  if (!card || !canAddProduct(card)) return;
  card.products.push({ config: '', colors: [{ name: '黑', price: 0 }] });
}

function deleteProduct(index: number) {
  const card = currentCard.value;
  if (!card) return;
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除产品 ${index + 1} 吗？`,
    onOk: () => {
      card.products.splice(index, 1);
      if (card.products.length === 0) {
        card.products.push({ config: '', colors: [] });
      }
    },
  });
}

function selectAccessory(slot: 1 | 2, name: string) {
  const card = currentCard.value;
  if (!card || !name) return;
  const item = accessoryStore.accessories.value.find(a => a.name === name);
  if (!item) return;
  if (slot === 1) {
    card.accessory1Name = item.name;
    card.accessory1Price = item.price;
  } else {
    card.accessory2Name = item.name;
    card.accessory2Price = item.price;
  }
}

const accessoryCategories = computed(() => accessoryStore.categories.value);

// Accessory management
const showAccessoryManager = ref(false);
const newAccessory = ref<AccessoryOption>({ name: '', price: 0, category: '' });
const editingAccessoryIndex = ref(-1);

function openAddAccessory() {
  newAccessory.value = { name: '', price: 0, category: '' };
  editingAccessoryIndex.value = -1;
  showAccessoryManager.value = true;
}

function openEditAccessory(index: number) {
  const item = accessoryStore.accessories.value[index];
  newAccessory.value = { ...item };
  editingAccessoryIndex.value = index;
  showAccessoryManager.value = true;
}

function saveAccessory() {
  if (!newAccessory.value.name.trim()) return;
  if (editingAccessoryIndex.value >= 0) {
    accessoryStore.updateAccessory(editingAccessoryIndex.value, { ...newAccessory.value });
  } else {
    accessoryStore.addAccessory({ ...newAccessory.value });
  }
  showAccessoryManager.value = false;
}

function confirmDeleteAccessory(index: number) {
  const name = accessoryStore.accessories.value[index]?.name;
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除配件「${name}」吗？`,
    onOk: () => accessoryStore.deleteAccessory(index),
  });
}

// Service management
const showServiceManager = ref(false);
const newService = ref<ServiceOption>({ name: '', price: 0, category: '' });
const editingServiceIndex = ref(-1);

function selectService(slot: 1 | 2, name: string) {
  const card = currentCard.value;
  if (!card || !name) return;
  const item = serviceStore.services.value.find(s => s.name === name);
  if (!item) return;
  if (slot === 1) {
    card.service1Name = item.name;
    card.service1Price = item.price;
  } else {
    card.service2Name = item.name;
    card.service2Price = item.price;
  }
}

function openAddService() {
  newService.value = { name: '', price: 0, category: '' };
  editingServiceIndex.value = -1;
  showServiceManager.value = true;
}

function openEditService(index: number) {
  const item = serviceStore.services.value[index];
  newService.value = { ...item };
  editingServiceIndex.value = index;
  showServiceManager.value = true;
}

function saveService() {
  if (!newService.value.name.trim()) return;
  if (editingServiceIndex.value >= 0) {
    serviceStore.updateService(editingServiceIndex.value, { ...newService.value });
  } else {
    serviceStore.addService({ ...newService.value });
  }
  showServiceManager.value = false;
}

function confirmDeleteService(index: number) {
  const name = serviceStore.services.value[index]?.name;
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除服务「${name}」吗？`,
    onOk: () => serviceStore.deleteService(index),
  });
}

function addColor(productIndex: number) {
  const card = currentCard.value;
  if (!card || !canAddColor(card)) return;
  card.products[productIndex].colors.push({ name: '', subsidyPrice: 0, price: 0 });
}

function deleteColor(productIndex: number, colorIndex: number) {
  const card = currentCard.value;
  if (!card) return;
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除该颜色吗？`,
    onOk: () => {
      card.products[productIndex].colors.splice(colorIndex, 1);
    },
  });
}

function triggerFeatureImageUpload(idx: number) {
  featureImageInputs.value[idx]?.click();
}

function uploadFeatureImage(idx: number, event: Event) {
  const card = currentCard.value;
  if (!card) return;
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { card.features[idx].iconSrc = reader.result as string; };
  reader.readAsDataURL(file);
}

function onIconTypeChange(feature: FeatureItem) {
  feature.iconSrc = '';
  if (feature.iconType === 'builtin' && !feature.iconName) {
    feature.iconName = BUILTIN_ICONS[0].name;
  }
}

function iconsByCategory(category: string) {
  return BUILTIN_ICONS.filter(i => i.category === category);
}

function addFeature() {
  const card = currentCard.value;
  if (!card || card.features.length >= MAX_FEATURES) return;
  card.features.push({ title: '', desc: '', iconType: 'builtin', iconName: BUILTIN_ICONS[0].name, iconSrc: '', iconSize: 70 });
  featureCollapsed.value.push(false);
}

function deleteFeature(index: number) {
  const card = currentCard.value;
  if (!card || card.features.length <= MIN_FEATURES) return;
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除卖点${index + 1}吗？`,
    onOk: () => {
      card.features.splice(index, 1);
      featureCollapsed.value.splice(index, 1);
    },
  });
}
</script>

<template>
  <div class="config-panel">
    <div class="config-header">
      <h1>展牌编辑</h1>
    </div>
    <div class="config-body">
      <template v-if="currentCard">
        <div class="form-group">
          <label>产品名称</label>
          <input type="text" v-model="currentCard.productTitle" />
        </div>

        <!-- 产品图片 -->
        <div class="config-section">
          <h3 class="section-header" @click="toggleSection('productImage')">
            <span class="collapse-arrow" :class="{ collapsed: collapsed.productImage }">▾</span>
            产品图片
          </h3>
          <div v-show="!collapsed.productImage">
            <div class="switch-wrapper">
              <label class="switch">
                <input type="checkbox" v-model="currentCard.showProductImage" />
                <span class="switch-slider"></span>
              </label>
              <label>显示产品图片</label>
            </div>
            <div class="sub-panel" :class="{ show: currentCard.showProductImage }">
              <div class="form-group">
                <label>图片类型</label>
                <select v-model="currentCard.productImageType">
                  <option value="default">默认图标</option>
                  <option value="custom">自定义图片</option>
                </select>
              </div>
              <div v-if="currentCard.productImageType === 'custom'" class="form-group">
                <label>上传图片</label>
                <div class="image-preview-box" @click="(($refs.productImageInput as HTMLInputElement).click())">
                  <img v-if="currentCard.productImageSrc" :src="currentCard.productImageSrc" alt="产品图片" />
                  <span v-else>点击上传</span>
                </div>
                <input ref="productImageInput" type="file" class="hidden-input" accept="image/*" @change="uploadProductImage" />
              </div>
            </div>
          </div>
        </div>

        <!-- 卖点信息 -->
        <div class="config-section">
          <h3 class="section-header" @click="toggleSection('features')">
            <span class="collapse-arrow" :class="{ collapsed: collapsed.features }">▾</span>
            卖点信息
          </h3>
          <div v-show="!collapsed.features">
            <template v-for="(feature, idx) in currentCard.features" :key="idx">
              <div class="feature-block">
                <div class="feature-header" @click="toggleFeature(idx)">
                  <span class="collapse-arrow" :class="{ collapsed: featureCollapsed[idx] }">▾</span>
                  <span>卖点{{ idx + 1 }}</span>
                  <button
                    v-if="currentCard.features.length > MIN_FEATURES"
                    class="btn-delete-feature"
                    title="删除此卖点"
                    @click.stop="deleteFeature(idx)"
                  >×</button>
                </div>
                <div v-show="!featureCollapsed[idx]" class="feature-body">
                  <div class="form-group">
                    <label>标题</label>
                    <input type="text" v-model="feature.title" />
                  </div>
                  <div class="form-group">
                    <label>副标题</label>
                    <input type="text" v-model="feature.desc" />
                  </div>
                  <div class="form-group">
                    <label>图标</label>
                    <select v-model="feature.iconType" @change="onIconTypeChange(feature)">
                      <option value="default">默认色块</option>
                      <option value="builtin">内置图标</option>
                      <option value="image">上传图片</option>
                      <option value="svg">粘贴SVG代码</option>
                    </select>
                  </div>
                  <div v-if="feature.iconType === 'builtin'" class="form-group">
                    <div class="builtin-icon-picker">
                      <div v-for="cat in ICON_CATEGORIES" :key="cat" class="builtin-icon-group">
                        <div class="builtin-icon-cat">{{ cat }}</div>
                        <div class="builtin-icon-grid">
                          <button
                            v-for="icon in iconsByCategory(cat)"
                            :key="icon.name"
                            type="button"
                            class="builtin-icon-item"
                            :class="{ active: feature.iconName === icon.name }"
                            :title="icon.name"
                            @click="feature.iconName = icon.name"
                          >
                            <img :src="icon.src" :alt="icon.name" />
                            <span>{{ icon.name }}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="icon-size-inline" style="margin-top:6px;">
                      <label>大小（%）</label>
                      <input type="number" v-model.number="feature.iconSize" min="1" max="100" step="1" />
                    </div>
                  </div>
                  <div v-if="feature.iconType === 'image'" class="form-group icon-row">
                    <button class="btn-upload-icon" @click="triggerFeatureImageUpload(idx)">选择图片</button>
                    <input :ref="(el: any) => setFeatureInputRef(idx, el)" type="file" class="hidden-input" accept="image/*" @change="(e: Event) => uploadFeatureImage(idx, e)" />
                    <span v-if="feature.iconSrc" class="icon-file-name">已选择</span>
                    <div class="icon-size-inline">
                      <label>大小（%）</label>
                      <input type="number" v-model.number="feature.iconSize" min="1" max="100" step="1" />
                    </div>
                  </div>
                  <div v-if="feature.iconType === 'svg'" class="form-group">
                    <textarea v-model="feature.iconSrc" placeholder="粘贴SVG代码，如：<svg>...</svg>" rows="3" class="svg-textarea"></textarea>
                    <div class="icon-size-inline" style="margin-top:6px;">
                      <label>大小（%）</label>
                      <input type="number" v-model.number="feature.iconSize" min="1" max="100" step="1" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <button
              v-if="currentCard.features.length < MAX_FEATURES"
              class="btn-add-feature"
              @click="addFeature"
            >+ 添加卖点</button>
          </div>
        </div>

        <!-- 产品价格配置 -->
        <div class="config-section">
          <h3 class="section-header" @click="toggleSection('products')">
            <span class="collapse-arrow" :class="{ collapsed: collapsed.products }">▾</span>
            产品价格配置
          </h3>
          <div v-show="!collapsed.products">
            <div class="spacing-control">
              <label>价格行间距</label>
              <input type="range" v-model.number="currentCard.priceRowSpacing" min="0" max="12" step="1" />
              <span class="spacing-value">{{ (currentCard.priceRowSpacing || 0) > 0 ? '+' : '' }}{{ currentCard.priceRowSpacing || 0 }}px</span>
            </div>
            <div v-for="(product, pIdx) in currentCard.products" :key="pIdx" class="product-item">
              <div class="product-item-header">
                <span>产品 {{ pIdx + 1 }}</span>
                <button class="btn-delete" @click="deleteProduct(pIdx)">×</button>
              </div>
              <div class="form-group">
                <label>配置信息</label>
                <input type="text" v-model="product.config" />
              </div>
              <div v-for="(color, cIdx) in product.colors" :key="cIdx" class="color-row">
                <input type="text" v-model="color.name" placeholder="颜色" />
                <input type="number" v-model.number="color.subsidyPrice" placeholder="国补价" />
                <input type="number" v-model.number="color.price" placeholder="原价" />
                <button class="btn-delete" @click="deleteColor(pIdx, cIdx)">×</button>
              </div>
              <button class="btn-add-color" :disabled="!canAddColor(currentCard)" @click="addColor(pIdx)">+ 添加颜色</button>
            </div>
            <button class="btn-add-product" :disabled="!canAddProduct(currentCard)" @click="addProduct">+ 添加产品</button>
            <p v-if="currentCard && getTotalColorRows(currentCard) >= MAX_COLOR_ROWS" class="row-limit-hint">已达到最大行数（{{ MAX_COLOR_ROWS }}行），请先删除已有产品或颜色</p>
          </div>
        </div>

        <!-- 配件信息 -->
        <div class="config-section">
          <h3 class="section-header" @click="toggleSection('accessory')">
            <span class="collapse-arrow" :class="{ collapsed: collapsed.accessory }">▾</span>
            配件信息
            <button class="btn-manage-link" @click.stop="openAddAccessory">管理配件库</button>
          </h3>
          <div v-show="!collapsed.accessory">
            <div class="switch-wrapper">
              <label class="switch">
                <input type="checkbox" v-model="currentCard.showAccessory" />
                <span class="switch-slider"></span>
              </label>
              <label>显示配件信息</label>
            </div>
            <div class="sub-panel" :class="{ show: currentCard.showAccessory }">
              <div class="form-group">
                <label>配件1</label>
                <select @change="selectAccessory(1, ($event.target as HTMLSelectElement).value)">
                  <option value="">-- 选择配件 --</option>
                  <optgroup v-for="cat in accessoryCategories" :key="cat" :label="cat">
                    <option
                      v-for="acc in accessoryStore.accessories.value.filter(a => a.category === cat)"
                      :key="acc.name"
                      :value="acc.name"
                      :selected="acc.name === currentCard.accessory1Name"
                    >{{ acc.name }} ¥{{ acc.price }}</option>
                  </optgroup>
                </select>
              </div>
              <div class="form-group">
                <label>配件2</label>
                <select @change="selectAccessory(2, ($event.target as HTMLSelectElement).value)">
                  <option value="">-- 选择配件 --</option>
                  <optgroup v-for="cat in accessoryCategories" :key="cat" :label="cat">
                    <option
                      v-for="acc in accessoryStore.accessories.value.filter(a => a.category === cat)"
                      :key="acc.name"
                      :value="acc.name"
                      :selected="acc.name === currentCard.accessory2Name"
                    >{{ acc.name }} ¥{{ acc.price }}</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 服务信息 -->
        <div class="config-section">
          <h3 class="section-header" @click="toggleSection('service')">
            <span class="collapse-arrow" :class="{ collapsed: collapsed.service }">▾</span>
            服务信息
            <button class="btn-manage-link" @click.stop="openAddService">管理服务库</button>
          </h3>
          <div v-show="!collapsed.service">
            <div class="form-group">
              <label>服务1</label>
              <select @change="selectService(1, ($event.target as HTMLSelectElement).value)">
                <option value="">-- 选择服务 --</option>
                <optgroup v-for="cat in serviceStore.serviceCategories.value" :key="cat" :label="cat">
                  <option
                    v-for="svc in serviceStore.services.value.filter(s => s.category === cat)"
                    :key="svc.name"
                    :value="svc.name"
                    :selected="svc.name === currentCard.service1Name"
                  >{{ svc.name }} ¥{{ svc.price }}</option>
                </optgroup>
              </select>
            </div>
            <div class="form-group">
              <label>服务2</label>
              <select @change="selectService(2, ($event.target as HTMLSelectElement).value)">
                <option value="">-- 选择服务 --</option>
                <optgroup v-for="cat in serviceStore.serviceCategories.value" :key="cat" :label="cat">
                  <option
                    v-for="svc in serviceStore.services.value.filter(s => s.category === cat)"
                    :key="svc.name"
                    :value="svc.name"
                    :selected="svc.name === currentCard.service2Name"
                  >{{ svc.name }} ¥{{ svc.price }}</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Accessory Manager Modal -->
    <Modal v-model="showAccessoryManager" :title="editingAccessoryIndex >= 0 ? '编辑配件' : '管理配件库'" :width="600">
      <div class="acc-manager">
        <div class="acc-form">
          <div class="form-group">
            <label>名称</label>
            <input type="text" v-model="newAccessory.name" placeholder="配件名称" />
          </div>
          <div class="form-group">
            <label>价格</label>
            <input type="number" :value="newAccessory.price" @input="newAccessory.price = Number(($event.target as HTMLInputElement).value)" placeholder="价格" />
          </div>
          <div class="form-group">
            <label>分类</label>
            <input type="text" v-model="newAccessory.category" placeholder="分类" list="category-list" />
            <datalist id="category-list">
              <option v-for="cat in accessoryCategories" :key="cat" :value="cat" />
            </datalist>
          </div>
          <button class="btn-add-product" @click="saveAccessory">{{ editingAccessoryIndex >= 0 ? '保存修改' : '添加配件' }}</button>
        </div>
        <div class="acc-list">
          <div v-for="(acc, idx) in accessoryStore.accessories.value" :key="idx" class="acc-item">
            <div class="acc-info">
              <span class="acc-name">{{ acc.name }}</span>
              <span class="acc-meta">¥{{ acc.price }} · {{ acc.category }}</span>
            </div>
            <div class="acc-actions">
              <button class="btn-edit-sm" @click="openEditAccessory(idx)">✎</button>
              <button class="btn-del-sm" @click="confirmDeleteAccessory(idx)">×</button>
            </div>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Service Manager Modal -->
    <Modal v-model="showServiceManager" :title="editingServiceIndex >= 0 ? '编辑服务' : '管理服务库'" :width="600">
      <div class="acc-manager">
        <div class="acc-form">
          <div class="form-group">
            <label>名称</label>
            <input type="text" v-model="newService.name" placeholder="服务名称" />
          </div>
          <div class="form-group">
            <label>价格</label>
            <input type="number" :value="newService.price" @input="newService.price = Number(($event.target as HTMLInputElement).value)" placeholder="价格" />
          </div>
          <div class="form-group">
            <label>分类</label>
            <input type="text" v-model="newService.category" placeholder="分类" list="service-category-list" />
            <datalist id="service-category-list">
              <option v-for="cat in serviceStore.serviceCategories.value" :key="cat" :value="cat" />
            </datalist>
          </div>
          <button class="btn-add-product" @click="saveService">{{ editingServiceIndex >= 0 ? '保存修改' : '添加服务' }}</button>
        </div>
        <div class="acc-list">
          <div v-for="(svc, idx) in serviceStore.services.value" :key="idx" class="acc-item">
            <div class="acc-info">
              <span class="acc-name">{{ svc.name }}</span>
              <span class="acc-meta">¥{{ svc.price }} · {{ svc.category }}</span>
            </div>
            <div class="acc-actions">
              <button class="btn-edit-sm" @click="openEditService(idx)">✎</button>
              <button class="btn-del-sm" @click="confirmDeleteService(idx)">×</button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.config-panel {
  width: 420px;
  min-width: 420px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
}

.config-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: linear-gradient(135deg, #FF6A00, #ff9a44);
  color: white;
  flex: none;
}

.config-header h1 {
  font-size: 15px;
  font-weight: 700;
}

.config-body {
  padding: 20px;
  flex: 1;
}

.form-group { margin-bottom: 18px; }

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #555;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #FF6A00;
  box-shadow: 0 0 0 2px rgba(255, 106, 0, 0.1);
}

.config-section {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.spacing-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
}

.spacing-control label { white-space: nowrap; }

.spacing-control input[type="range"] {
  flex: 1;
  accent-color: #FF6A00;
  cursor: pointer;
}

.spacing-value {
  min-width: 40px;
  text-align: right;
  font-weight: 600;
  color: #FF6A00;
}

.section-header {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  user-select: none;
  padding: 4px 0;
  border-radius: 4px;
  transition: background 0.15s;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 14px;
}

.section-header:hover { background: #f8f8f8; }

.feature-block {
  margin-bottom: 8px;
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #fafafa;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  user-select: none;
  transition: background 0.15s;
}

.feature-header:hover { background: #f0f0f0; }

.btn-delete-feature {
  margin-left: auto;
  background: none;
  border: none;
  color: #ff4d4f;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.15s;
}

.btn-delete-feature:hover { background: rgba(255, 77, 79, 0.1); }

.btn-add-feature {
  background: #f5f5f5;
  border: 1px dashed #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  color: #888;
  width: 100%;
  margin-top: 8px;
  transition: all 0.15s;
}

.btn-add-feature:hover { background: #fff7f0; border-color: #FF6A00; color: #FF6A00; }

.feature-body {
  padding: 12px;
}

.collapse-arrow {
  display: inline-block;
  font-size: 11px;
  transition: transform 0.2s;
  width: 14px;
  text-align: center;
  color: #999;
}

.collapse-arrow.collapsed { transform: rotate(-90deg); }

.switch-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.switch-wrapper label {
  font-size: 13px;
  font-weight: 600;
  color: #555;
  cursor: pointer;
}

.switch {
  position: relative;
  width: 36px;
  height: 20px;
  cursor: pointer;
  flex: none;
}

.switch input { display: none; }

.switch-slider {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #ddd;
  border-radius: 20px;
  transition: 0.3s;
}

.switch-slider::before {
  content: "";
  position: absolute;
  width: 16px; height: 16px;
  left: 2px; bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.switch input:checked + .switch-slider { background: #FF6A00; }
.switch input:checked + .switch-slider::before { transform: translateX(16px); }

.sub-panel {
  display: none;
  margin-top: 8px;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 6px;
}

.sub-panel.show { display: block; }

.image-preview-box {
  width: 50px; height: 50px;
  border: 1px dashed #ddd;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  margin-top: 6px;
  font-size: 10px;
  color: #bbb;
}

.image-preview-box img { width: 100%; height: 100%; object-fit: cover; }

.hidden-input { display: none; }

.product-item {
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 14px;
}

.product-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.product-item-header span {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.btn-delete {
  background: #ff4d4f;
  color: white;
  border: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  transition: background 0.15s;
}

.btn-delete:hover { background: #cf1322; }

.color-row {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 10px;
}

.color-row input[type="text"] { flex: 1; min-width: 0; padding: 7px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; outline: none; }
.color-row input[type="number"] { flex: 1; min-width: 0; padding: 7px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; outline: none; }
.color-row input:focus { border-color: #FF6A00; }

.btn-add-color {
  background: #f5f5f5;
  border: 1px dashed #ddd;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  color: #888;
  width: 100%;
  margin-top: 8px;
  transition: all 0.15s;
}

.btn-add-color:hover:not(:disabled) { background: #fff7f0; border-color: #FF6A00; color: #FF6A00; }

.btn-add-product {
  background: #FF6A00;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 8px;
  transition: background 0.15s;
}

.btn-add-product:hover:not(:disabled) { background: #e55f00; }
.btn-add-product:disabled, .btn-add-color:disabled { opacity: 0.4; cursor: not-allowed; }

.row-limit-hint {
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 8px;
  font-weight: 600;
}

.svg-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  font-family: monospace;
  outline: none;
  resize: vertical;
  min-height: 60px;
}

.svg-textarea:focus { border-color: #FF6A00; }

.icon-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-upload-icon {
  padding: 6px 14px;
  background: #FF6A00;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}

.btn-upload-icon:hover { background: #e55f00; }

.icon-file-name {
  font-size: 11px;
  color: #52c41a;
  font-weight: 600;
}

.icon-size-inline { flex: 1; }

.icon-size-inline label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #555;
  margin-bottom: 4px;
}

.icon-size-inline input {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
}

.icon-size-inline input:focus { border-color: #FF6A00; }

.builtin-icon-picker {
  max-height: 260px;
  overflow-y: auto;
  padding: 8px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #fafafa;
}

.builtin-icon-group + .builtin-icon-group { margin-top: 10px; }

.builtin-icon-cat {
  font-size: 12px;
  color: #888;
  margin-bottom: 6px;
  font-weight: 600;
}

.builtin-icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: 6px;
}

.builtin-icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 2px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
}

.builtin-icon-item:hover { border-color: #FF6A00; }

.builtin-icon-item.active {
  border-color: #FF6A00;
  background: #FFF3E8;
  box-shadow: 0 0 0 1px #FF6A00 inset;
}

.builtin-icon-item img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.builtin-icon-item span {
  font-size: 10px;
  color: #666;
  line-height: 1.1;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.builtin-icon-item.active span { color: #FF6A00; }

.btn-manage-link {
  margin-left: auto;
  background: none;
  border: none;
  color: #FF6A00;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.btn-manage-link:hover { text-decoration: underline; }

.acc-manager { max-height: 400px; overflow-y: auto; }

.acc-form {
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  margin-bottom: 12px;
}

.acc-list { max-height: 300px; overflow-y: auto; }

.acc-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.acc-info { flex: 1; min-width: 0; }

.acc-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  display: block;
}

.acc-meta { font-size: 11px; color: #999; }

.acc-actions { display: flex; gap: 4px; flex-shrink: 0; }

.btn-edit-sm, .btn-del-sm {
  width: 24px; height: 24px;
  border: 1px solid #ddd; border-radius: 4px;
  background: #fff; cursor: pointer; font-size: 12px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}

.btn-edit-sm:hover { border-color: #FF6A00; color: #FF6A00; }
.btn-del-sm:hover { border-color: #ff4d4f; color: #ff4d4f; }
</style>
