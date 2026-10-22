<script setup lang="ts">
import type { CardData } from '../types';
import { getBuiltinIconSrc } from '../icon-library';

defineProps<{
  card: CardData;
}>();
</script>

<template>
  <!-- 外层容器：实际输出尺寸110mm -->
  <div class="card-outer">
  <!-- 价签UI样式（不可修改）- 直接从原始代码引用 -->
  <div class="card">
    <div class="product-header">
      <div class="product-title">{{ card.productTitle }}</div>
      <div v-if="card.showProductImage" class="product-image-box">
        <img src="/ai.png" alt="AI元启" class="default-icon-img" />
      </div>
    </div>
    <div class="feature-grid">
      <div v-for="(f, i) in card.features" :key="i" class="feature">
        <div class="icon">
          <img v-if="f.iconType === 'image' && f.iconSrc" :src="f.iconSrc" class="icon-custom" :style="{ width: (f.iconSize || 70) + '%', height: (f.iconSize || 70) + '%' }" alt="" />
          <div v-else-if="f.iconType === 'svg' && f.iconSrc" class="icon-svg" :style="{ width: (f.iconSize || 70) + '%', height: (f.iconSize || 70) + '%' }" v-html="f.iconSrc"></div>
          <img v-else-if="f.iconType === 'builtin' && getBuiltinIconSrc(f.iconName)" :src="getBuiltinIconSrc(f.iconName)" class="icon-custom" :style="{ width: (f.iconSize || 70) + '%', height: (f.iconSize || 70) + '%' }" alt="" />
        </div>
        <div class="feature-text">
          <div class="feature-title">{{ f.title }}</div>
          <div class="feature-desc">{{ f.desc }}</div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="product-list" :style="{ '--row-spacing': (card.priceRowSpacing || 0) + 'px' }">
      <template v-for="(product, pIdx) in card.products" :key="pIdx">
        <template v-if="product.config">
          <template v-for="(color, cIdx) in product.colors" :key="cIdx">
            <div v-if="cIdx === 0" class="product-row">
              <span>{{ product.config }}</span>
              <span class="price">
                <span class="color-text">{{ color.name }}</span>
                <span v-if="(color.subsidyPrice || 0) > 0" class="subsidy-price">¥{{ color.subsidyPrice }}</span>
                <span class="origin-price" :class="{ 'with-subsidy': (color.subsidyPrice || 0) > 0 }">¥{{ color.price }}</span>
              </span>
            </div>
            <div v-else class="product-row">
              <span class="price" style="margin-left:auto;">
                <span class="color-text">{{ color.name }}</span>
                <span v-if="(color.subsidyPrice || 0) > 0" class="subsidy-price">¥{{ color.subsidyPrice }}</span>
                <span class="origin-price" :class="{ 'with-subsidy': (color.subsidyPrice || 0) > 0 }">¥{{ color.price }}</span>
              </span>
            </div>
          </template>
        </template>
      </template>
    </div>
    <div class="flex-spacer"></div>
    <div v-if="card.showAccessory" class="accessory">
      <div class="accessory-title">
        <span>{{ card.accessory1Name }}</span>
        <span class="accessory-price">¥<span>{{ card.accessory1Price }}</span></span>
      </div>
      <div class="accessory-title">
        <span>{{ card.accessory2Name }}</span>
        <span class="accessory-price">¥<span>{{ card.accessory2Price }}</span></span>
      </div>
    </div>
    <div class="service">
      <div class="service-header">
        <img src="/xbb.png" alt="想帮帮" class="service-logo" />
        <div class="service-line"></div>
      </div>
      <div class="service-row">
        <span>{{ card.service1Name }}</span>
        <span class="service-price">¥<span>{{ card.service1Price }}</span></span>
      </div>
      <div class="service-row">
        <span>{{ card.service2Name }}</span>
        <span class="service-price">¥<span>{{ card.service2Price }}</span></span>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
/* 外层容器：实际输出110mm，内部按120mm设计后等比缩放 */
.card-outer {
    width: 110mm;
    height: 110mm;
    overflow: hidden;
    border: 0.5px solid #ccc;
}

/* ==================== 价签UI样式（不可修改） ==================== */
/*
 * 价签尺寸：120mm × 120mm
 * 边框：0.5px solid #222
 * 内边距：上3mm 左右6mm 下5mm
 * 背景：白色
 * 布局：纵向弹性布局
 */
.card {
    width: 120mm;
    height: 120mm;
    border: none;
    /* 【锁定】底部padding 13.09px = 实际输出12px，未经用户确认禁止修改 */
    padding: 3mm 6mm 13.09px 6mm;
    background: transparent;
    display: flex;
    flex-direction: column;
    transform: scale(calc(11 / 12));
    transform-origin: top left;
    font-family: "Source Han Sans SC", "思源黑体", "Noto Sans SC", sans-serif;
}

/* 产品名称区域：高度15mm，不可修改 */
.product-header {
    display: flex;
    align-items: center;
    height: 15mm;
    flex: none;
}

/* 产品名称文字：20px 加粗 */
.product-title {
    font-size: 20px;
    font-weight: 900;
    color: #000;
    display: flex;
    align-items: center;
}

/* 产品图片框：9mm × 9mm，距名称5px */
.product-image-box {
    width: 9mm;
    height: 9mm;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 6px;
    color: #999;
    overflow: hidden;
    flex: none;
    margin-left: 5px;
    background: transparent;
}

.product-image-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 默认图标：AI元启图片 */
.default-icon-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* 四卖点网格：2列布局 */
.feature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 7mm;
    row-gap: calc(6mm - 5px);
    flex: none;
}

.feature {
    display: flex;
    align-items: center;
}

.feature:nth-child(2n) {
    margin-left: -5px;
}

/* 卖点色块：32.73px × 32.73px 橙色，尺寸锁死不可修改 */
.icon {
    width: 32.73px;
    height: 32.73px;
    background: #FF6A00;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 自定义图片：大小由iconSize控制，居中 */
.icon-custom {
    object-fit: contain;
}

/* SVG容器：大小由iconSize控制，居中 */
.icon-svg {
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-svg :deep(svg) {
    width: 100%;
    height: 100%;
}

.feature-text {
    margin-left: 3mm;
}

/* 卖点标题：13px 加粗 */
.feature-title {
    font-size: 11.91px;
    font-weight: 700;
    color: #000;
    line-height: 1.3;
    white-space: nowrap;
}

/* 卖点副标题：13px 加粗 */
.feature-desc {
    font-size: 10.82px;
    font-weight: 700;
    color: #000;
    margin-top: 1mm;
    line-height: 1.3;
    white-space: nowrap;
}

/* 分割线：深灰色 0.5px */
.line {
    margin-top: 6mm;
    height: 0.5px;
    background: #333;
    flex: none;
}

/* 产品价格列表 */
.product-list {
    margin-top: calc(5mm - 4.5px);
    flex: none;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

/* 产品行：高7mm */
.product-row {
    height: calc(20.18px + var(--row-spacing, 0px));
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
    color: #000;
    flex: none;
}

/* 价格 */
.price {
    font-size: 13px;
    font-weight: 900;
    color: #000;
    display: inline-flex;
    align-items: baseline;
    gap: 0.5em;
}

/* 颜色文字 */
.color-text {
    font-size: 13px;
    font-weight: 700;
    color: #000;
    flex: none;
}

/* 国补价（在前，突出显示） */
.subsidy-price {
    font-size: 13px;
    font-weight: 900;
    color: #000;
    flex: none;
}

/* 原价（在后） */
.origin-price {
    font-size: 13px;
    font-weight: 900;
    color: #000;
    flex: none;
}

/* 存在国补价时，原价弱化并加删除线 */
.origin-price.with-subsidy {
    font-size: 12px;
    font-weight: 700;
    color: #666;
    text-decoration: line-through 1px;
    text-decoration-thickness: 1px;
}

/* 国补价与原价之间略微拉开距离 */
.subsidy-price + .origin-price {
    margin-left: 1px;
}

/* ============================================================
 * 【锁定区域】配件信息 - 固定位置，未经用户确认禁止修改以下约束
 * - margin-top: 0（无顶部约束，由flex-spacer控制与上方间距）
 * - margin-bottom: 7.64px（实际输出7px，距xbb logo顶部的固定距离）
 * - flex: none（不参与弹性伸缩）
 * ============================================================ */
.accessory {
    margin-top: 0;
    flex: none;
    margin-bottom: 7.64px;
}

.accessory-title {
    font-size: 11px;
    font-weight: 700;
    color: #000;
    line-height: 1.2;
    display: flex;
    justify-content: space-between;
    margin-bottom: 3px;
}

.accessory-price {
    font-size: 11px;
    font-weight: 700;
    color: #000;
    display: inline-flex;
    align-items: baseline;
    gap: 0.5em;
}

/* 弹性填充：吸收产品信息与配件之间的多余空间，确保配件和服务固定在底部 */
.flex-spacer {
    flex: 1;
}

/* ============================================================
 * 【锁定区域】服务信息 - 固定位置，未经用户确认禁止修改以下约束
 * - 卡片底部padding: 13.09px（实际输出12px，距底部的固定距离）
 * - margin-top: 0, padding-top: 0（无额外间距）
 * - flex: none（不参与弹性伸缩）
 * ============================================================ */
.service {
    margin-top: 0;
    padding-top: 0;
    flex: none;
}

.service-header {
    display: flex;
    align-items: center;
    font-size: 9.82px;
    font-weight: 900;
    line-height: 1.2;
    margin-bottom: 4.91px;
}

.service-logo {
    height: 6.5mm;
    width: auto;
    object-fit: contain;
    flex: none;
}

.service-line {
    height: 0.5px;
    background: #333;
    flex: 1;
    margin-left: 3mm;
}

.service-row {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 700;
    color: #000;
    line-height: 1.2;
    margin-bottom: 3px;
}

.service-price {
    font-size: 11px;
    font-weight: 700;
    color: #000;
    display: inline-flex;
    align-items: baseline;
    gap: 0.5em;
}
</style>
