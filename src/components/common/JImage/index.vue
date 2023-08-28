<template>
  <el-image :src="src" v-bind="$attrs" class="j-image">
    <template #error>
      <div class="w-full h-full flex justify-center items-center bg-gray-50">
        <i class="iconfont YJSHHT-a-18morentupian1 text-gray-80"></i>
      </div>
    </template>
  </el-image>
</template>

<script setup lang="ts">
interface IProps {
  src: string
}
withDefaults(defineProps<IProps>(), {})
</script>

<style scoped></style>
