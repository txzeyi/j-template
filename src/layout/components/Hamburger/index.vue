<script lang="ts" setup>
const props = defineProps({
  isActive: { type: Boolean, default: false }
})

const emit = defineEmits<{ (e: "toggle-click"): void }>()

const toggleClick = () => {
  emit("toggle-click")
}
</script>

<template>
  <div @click="toggleClick">
    <el-icon :size="20" class="icon !text-lg">
      <i class="iconfont YJSHHT-a-18zhankaicaidanlan" v-if="props.isActive" />
      <i class="iconfont YJSHHT-a-18shouqicaidanlan" v-else />
    </el-icon>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  vertical-align: middle;
}
</style>
