<template>
  <div v-if="show" class="pos-center">
    <div class="k-line k-line11-1"></div>
    <div class="k-line k-line11-2"></div>
    <div class="k-line k-line11-3"></div>
    <div class="k-line k-line11-4"></div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.k-line {
	display: inline-block;
	width: 12px;
	height: 12px;
	border-radius: 15px;
  background-color: #FFD100;
  margin-right: 10px;
}
.k-line11-1 {
	animation: k-loadingP 2s infinite
}
.k-line11-2 {
	animation: k-loadingP 2s infinite;
	animation-delay: .15s
}
.k-line11-3 {
	animation: k-loadingP 2s infinite;
	animation-delay: .30s
}
.k-line11-4 {
	animation: k-loadingP 2s infinite;
	animation-delay: .45s
}
.k-line11-5 {
	animation: k-loadingP 2s infinite;
	animation-delay: .60s
}
@keyframes k-loadingP {
	0% {
    transform: translateY(0)
  }
  35% {
    transform: translateY(0);
    opacity: .3
  }
  50% {
    transform: translateY(-20px);
    opacity: .8
  }
  70% {
    transform: translateY(3px);
    opacity: .8
  }
  85% {
    transform: translateY(-3px)
  }
}
</style>
