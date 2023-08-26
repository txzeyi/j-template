<template>
  <ListPopover :visible="visible && isClick" :top="top" :left="left">
    <div>
      <div class="list-popover-item" style="position: initial">
        <div class="list-popover-icon">
          <svg viewBox="0 0 1024 1024" width="18" height="18">
            <path
              d="M955.164444 892.017778H403.911111a42.666667 42.666667 0 0 1 0-85.333334h551.253333a42.666667 42.666667 0 0 1 0 85.333334zM997.831111 512a43.235556 43.235556 0 0 0-42.666667-42.666667H403.911111a42.666667 42.666667 0 0 0 0 85.333334h551.253333a43.235556 43.235556 0 0 0 42.666667-42.666667z m0-337.351111a42.666667 42.666667 0 0 0-42.666667-42.666667H403.911111a42.666667 42.666667 0 0 0 0 85.333334h551.253333a43.235556 43.235556 0 0 0 42.666667-42.666667zM194.56 413.013333V170.666667a42.097778 42.097778 0 0 0-61.44-38.115556L50.062222 170.666667a43.235556 43.235556 0 0 0-19.342222 56.888889 42.666667 42.666667 0 0 0 56.888889 19.342222l21.617778-10.808889v176.355555a42.666667 42.666667 0 0 0 85.333333 0zM269.653333 853.333333a42.666667 42.666667 0 0 0-42.097777-40.391111H170.666667l25.031111-22.186666 10.24-9.102223 18.773333-18.204444A113.777778 113.777778 0 0 0 227.555556 620.088889a103.537778 103.537778 0 0 0-133.12-31.857778 103.537778 103.537778 0 0 0-56.888889 83.057778 43.235556 43.235556 0 0 0 39.253333 46.648889 41.528889 41.528889 0 0 0 45.511111-38.684445 21.617778 21.617778 0 0 1 12.515556-14.791111 18.773333 18.773333 0 0 1 26.168889 6.826667 26.168889 26.168889 0 0 1 0 34.133333 191.146667 191.146667 0 0 1-14.222223 13.084445l-9.102222 8.533333C56.888889 796.444444 25.031111 833.991111 42.097778 873.244444a42.666667 42.666667 0 0 0 39.253333 25.031112H227.555556a42.097778 42.097778 0 0 0 42.097777-44.942223z"
              fill="#333333"
              p-id="3472"
            ></path>
          </svg>
        </div>
        <div class="list-popover-text">有序列表</div>

        <div class="list-mce-rightPopover">
          <div
            class="list-mce-rightPopover-item"
            :class="{
              active: value == 'lower-roman'
            }"
            @click="selectItem('lower-roman')"
          >
            <img src="./images/y1.png" style="width: 76px" />
          </div>
          <div
            class="list-mce-rightPopover-item"
            :class="{
              active: value == 'cjk-decimal'
            }"
            @click="selectItem('cjk-decimal')"
          >
            <img src="./images/y2.png" style="width: 76px" />
          </div>
          <div
            class="list-mce-rightPopover-item"
            :class="{
              active: value == 'decimal'
            }"
            key=""
            @click="selectItem('decimal')"
          >
            <img src="./images/y3.png" style="width: 76px" />
          </div>
        </div>
      </div>
      <div class="list-popover-item" style="position: initial">
        <div class="list-popover-icon">
          <svg viewBox="0 0 1024 1024" width="18" height="18">
            <path
              d="M955.164444 892.017778h-682.666666a42.666667 42.666667 0 1 1 0-85.333334h682.666666a42.666667 42.666667 0 0 1 0 85.333334zM997.831111 512a43.235556 43.235556 0 0 0-42.666667-42.666667h-682.666666a42.666667 42.666667 0 1 0 0 85.333334h682.666666a43.235556 43.235556 0 0 0 42.666667-42.666667z m0-337.351111a42.666667 42.666667 0 0 0-42.666667-42.666667h-682.666666a42.666667 42.666667 0 0 0 0 85.333334h682.666666a43.235556 43.235556 0 0 0 42.666667-42.666667zM89.884444 113.777778a63.715556 63.715556 0 1 0 63.146667 60.871111A63.715556 63.715556 0 0 0 89.884444 113.777778z m0 337.92A63.146667 63.146667 0 1 0 153.031111 512a63.146667 63.146667 0 0 0-63.146667-63.146667z m0 337.351111a63.715556 63.715556 0 1 0 63.146667 63.146667 63.715556 63.715556 0 0 0-63.146667-65.991112z"
              fill="#333333"
              p-id="3620"
            ></path>
          </svg>
        </div>
        <div class="list-popover-text">无序列表</div>
        <div class="list-mce-rightPopover">
          <div
            class="list-mce-rightPopover-item"
            :class="{
              active: value == 'disc'
            }"
            @click="selectItem('disc')"
          >
            <img src="./images/w1.png" style="width: 76px" />
          </div>
          <div
            class="list-mce-rightPopover-item"
            :class="{
              active: value == 'circle'
            }"
            @click="selectItem('circle')"
          >
            <img src="./images/w2.png" style="width: 76px" />
          </div>
          <div
            class="list-mce-rightPopover-item"
            :class="{
              active: value == 'square'
            }"
            @click="selectItem('square')"
          >
            <img src="./images/w3.png" style="width: 76px" />
          </div>
        </div>
      </div>
    </div>
  </ListPopover>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import ListPopover from "../../components/list-popover.vue"
import { editorData } from "../../common/globalData"

export default defineComponent({
  props: {
    isClick: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      top: 0,
      left: 0,
      visible: false,
      value: ""
    }
  },
  methods: {
    show(top, left) {
      this.top = top
      this.left = left
      this.visible = true
      this.value = editorData.listStyleType
    },
    hide() {
      this.visible = false
    },
    selectItem(value) {
      this.hide()
      this.$emit("selectItem", value)
    }
  },
  components: { ListPopover }
})
</script>
<style lang="scss">
.list-popover-item:hover {
  .list-mce-rightPopover {
    display: block;
  }
}
.list-mce-rightPopover {
  position: absolute;
  left: 100%;
  top: 0;
  display: none;
  padding: 16px 4px 4px 16px;
  width: 295px;
  background: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.14);
  border-radius: 8px;
  overflow: hidden;
  .list-mce-rightPopover-item {
    display: inline-block;
    vertical-align: top;
    margin-right: 12px;
    margin-bottom: 12px;
    border: 1px solid #eeeeee;
    &:hover {
      border: 1px solid #cccccc;
    }
    &.active {
      border: 1px solid #ff8909 !important;
    }
  }
}
</style>
