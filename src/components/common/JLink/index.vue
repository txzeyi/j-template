<template>
  <a :class="['j-link group', linkKls]" :href="disabled || !href ? undefined : href" @click="handleClick">
    <slot>{{ props.text }}</slot>
  </a>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: { type: String, values: ["primary", "danger", "main"], default: "default" },
  disabled: { type: Boolean, default: false },
  href: { type: String, default: "" },
  // icon: { type: String, default: "" },
  text: { type: String, default: "" }
})
const emit = defineEmits({ click: (evt: MouseEvent) => evt instanceof MouseEvent })

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit("click", event)
  }
}
const linkKls = computed(() => [props.disabled ? "is-disabled cursor-not-allowed" : "cp", props.type == "default" ? "" : "is-" + props.type])
</script>

<style lang="scss" scoped>
.j-link {
  color: var(--el-text-color-primary);
  &.is-disabled {
    opacity: 0.57;
  }
  &.is-primary {
    color: var(--el-text-color-success, #5789ff);
    &:hover {
      color: var(--el-text-color-success-hover, #5789dd);
    }
  }
  &.is-main {
    color: var(--el-text-color-primary, #5789ff);
    &:hover {
      color: var(--el-text-color-primary-hover, #5789dd);
    }
  }
  &.is-danger {
    color: var(--el-text-color-danger);
    &:hover {
      color: var(--el-text-color-danger-hover);
    }
  }
  & + .j-link {
    margin-left: 24px;
  }
}
</style>
