<template>
  <!-- 购物车按钮 -->
  <div class="cart-btn-wrapper">
    <img :src="icon" :class="imgClass" />
    <div class="badge" v-if="count > 0">{{ count >= 10 ? '9+': count }}</div>
  </div>
</template>

<script>
export default {
  name: "CartIcon",
  props: {
    count: {
      type: Number,
      default: 0
    },
    icon: {
      type: String
    },
    imgClass: {
      type: String
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-btn-wrapper{
  position: relative;
  .badge{
    background-color: #FF3838;
    color: #ffffff;
    font-size: 10px;
    // padding: 0 3px;
    border-radius: 50%;
    position: absolute;
    top: -6px;
    right: -4px;
    // min-width: 8px;
    // height: 17px;
    // line-height: 17px;
    text-align: center;
    // padding: 3px 5px;
    width: 18px;
    height: 18px;
    line-height: 18px;
  }
}
</style>