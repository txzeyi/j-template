<template>
  <j-dialog title="插入链接" width="528px" v-model="visible">
    <div class="linkSelectComp-content">
      <el-input v-model="label" placeholder="请输入链接文本" />
      <el-input style="margin-top:24px" v-model="href" placeholder="请输入链接地址" />
    </div>
    <template #footer>
      <div class="p-6 w-full flex items-center linkSelectComp-footer">
        <el-button @click="hide">取消</el-button>
        <el-button style="width: 94px;" type="primary" :disabled="label.length == 0 || href.length == 0" @click="selectItem">确定</el-button>
      </div>
    </template>
  </j-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  data() {
    return {
      top: 0,
      left: 0,
      visible: false,
      label: '',
      href: '',
    }
  },
  methods: {
    show() {
      this.visible = true
      this.label = ''
      this.href = ''
    },
    hide() {
      this.visible = false
    },
    selectItem() {
      this.hide()
      this.$emit("selectItem", {
        label: this.label,
        href: this.href,
      })
    }
  },
})
</script>
<style lang="scss" scoped>
.linkSelectComp-content {
  padding: 24px 24px 10px 24px;
  max-height: 512px;
  overflow-x: hidden;
  overflow-y: auto;
}

.linkSelectComp-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 20px 24px;
}
</style>
