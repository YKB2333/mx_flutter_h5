<template>
  <div class="page">
    <img :src="require('_images/error/error.jpeg')" />
  </div>
</template>

<script>
export default {
  name: "ErrorPage",
  data() {
    return {
      
    }
  }
}
</script>

<style lang="scss" scoped>
.page{
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  // /* no */在css有效，在scss无效（dev模式下有效），如果不想转rem，px大写
  img{
    max-width: 300PX; /* no */
  }
}
</style>