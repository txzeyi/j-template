<template>
  <div class="w-full">
    <div
      class="virtual-input truncate"
      :class="[{ 'text-gray-900': !props.modelValue && props.placeholder }, props.class]"
      @click="focusInput"
      v-show="!isFocused"
    >
      {{ props.modelValue || props.placeholder }}
    </div>
    <span v-if="isFocused" v-auto-focus>
      <slot></slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
interface VirInputProps {
  placeholder?: string
  modelValue?: string | number
  class?: string
  focused?: boolean
}

const props = withDefaults(defineProps<VirInputProps>(), {
  placeholder: "请输入",
  focused: false
})

const isFocused = ref(props.focused)

function focusInput() {
  isFocused.value = true
}
</script>

<style lang="scss" scoped>
.virtual-input {
  width: 100%;
  height: 36px;
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  display: inline-flex;
  flex-grow: 1;
  align-items: center;
  padding: 1px 12px;
  background-color: var(--el-input-bg-color,#ffffff);
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
}
</style>
