<template>
  <div class="point-container">
    <a @click.prevent="handlePointClick" class="tab-btn" :class="{selected, disabled, highlight, matched, unreachable, mainflag, notallowed}">
      <el-popover
        v-show="highlight"
        :disabled="recommondSymDisabled"
        placement="bottom"
        :title="$t('recipeBrain.mainSymRecommondSym')"
        width="600"
        trigger="manual"
        popper-class="recommond-symptom-container"
        v-model="showPopover">
        <el-scrollbar class="scroll-height">
          <div v-if="!showLoading && recommondSym.length">
            <div v-for="(recommondSymType, index) in recommondSym" :key="'recommondSymType' + index">
              <p style="font-size:16px;font-family:PingFangTC-Semibold;font-weight:400;color:#49B8A3;margin: 10px 0;">| {{recommondSymType.name}}</p>
              <div v-for="(item, i) in recommondSymType.symptoms" :key="'recommondSym' + i" style="display:inline-block;font-size: 0;margin:0;margin-right: 8px;">
                <a @click.self="handleRecommondSymClick(item)" class="recommond-symptom-item tab-btn" :class="{'recommond-symptom-selected': item.recommondSymptomSelected}">{{item.name}}</a>
              </div>
            </div>
          </div>
          <loading :isShow="showLoading" marginTop="50px"/>
        </el-scrollbar>
        <span slot="reference">{{name}}</span>
      </el-popover>
      <span v-if="!highlight"><slot></slot></span>
      <el-tooltip v-if="remark">
        <div slot="content">
          <template><p style="max-width: 400px;">{{remark}}</p></template>
        </div>
        <i style="vertical-align: middle;"><img class="side-logo" :src="selected||highlight?require('@/assets/img/recipeBrain/question_light@3x.png'):require('@/assets/img/recipeBrain/question@3x.png')"/></i>
      </el-tooltip>
      <!-- click remark drawer -->
      <tip v-if="!remark && hasDesc" style="vertical-align: middle;width:14px;" :id="id" :selected="selected" :isLight="selected||highlight"/>
    </a>
    <!-- <input
      v-bind:value="v"
      v-on:input="inputHandle"
      :style="{width: inputWidth + 'px'}"
      @keyup.delete="deleteHandle(v)"
      :disabled="!deleteEnable"
      class="place-hold"
      @click.stop.self="inputClick"
      ref="input"/> -->
    <el-autocomplete
      @input.native="inputHandle"
      v-model="v"
      :style="{width: inputWidth + 'px'}"
      @keydown.delete.native="deleteHandle(v)"
      :disabled="!deleteEnable"
      class="place-hold"
      @click.stop.self="inputClick"
      ref="input"
      :trigger-on-focus="true"
      @select="select"
      :fetch-suggestions="fetchSuggestions"
      popper-class="medium-width"
    >
    </el-autocomplete>
    <pre style="font-size: 16px;visibility: hidden;position: fixed;z-index: -1;bottom: -99999px;" ref="sensor">{{v}}</pre>
  </div>
  <!-- :style="{width: isLast?'auto':'6px'}" -->
</template>

<script>
// import { removeSelectedPoints } from '@/api/'
import loading from '@/components/Loading/index.vue'
import tip from '../tip/'
export default {
  name: 'symptom',
  components: {
    loading,
    tip
  },
  props: {
    cancelShow: {
      default: false
    },
    id: {
      type: [Boolean, String, Number]
    },
    disabled: {
      type: [Boolean, String, Number],
      default: false
    },
    selected: {
      type: [Boolean],
      default: false
    },
    highlight: {
      type: [Boolean],
      default: false
    },
    deleteEnable: {
      type: [Boolean],
      default: false
    },
    // 状态栏中diabled的样式
    unreachable: {
      type: [Boolean],
      default: false
    },
    // 设置最后的width 是否为auto(占满同行剩余空间)
    isLast: {
      type: [Boolean],
      default: false
    },
    pointerIndex: {
      type: [Number],
      default: 99999
    },
    name: {
      type: [String]
    },
    matched: {
      type: [Boolean],
      default: false
    },
    remark: {},
    fetchSuggestions: {},
    // 推高主症推荐症状
    recommondSym: {
      type: [Array],
      default () {
        return []
      }
    },
    recommondSymDisabled: {
      type: Boolean,
      default: false
    },
    notallowed: {
      type: [Boolean],
      default: false
    },
    mainflag: {
      type: [Boolean],
      default: false
    },
    showLoading: {},
    // 是否说drawer说明
    hasDesc: {
      type: [Boolean],
      default: false
    },
    // 初始化时候是否自动获取当前焦点
    isFocusWhenIniting: {
      type: [Boolean],
      default: true
    }
  },
  data () {
    return {
      showPopover: false,
      show: true,
      relativeShow: false,
      v: '',
      inputWidth: 6,
      t_l: 0 // 寄存input中内容的宽度
    }
  },
  mounted () {
    this.isFocusWhenIniting && this.focusDelete()
    this.$root.Bus.$on('symDelete', (pointerIndex) => {
      console.log('deleted:', pointerIndex)
      // 如果接收到后一个病症被清除，那个光标回到当前这个这里
      if (this.id === pointerIndex) {
        console.log(this.id + '的后一个是：' + pointerIndex)
        this.$nextTick(() => {
          console.log('focus id:', this.id)
          this.focusDelete()
        })
      }
    })
  },
  computed: {
    hasPrescription () {
      return this.$store.state.prescription.id
    },
    isDrawerOpen () {
      return this.$store.state.drawer.isOpen
    },
    index () {
      let names = this.$store.state.prescription.selectedPoints.map(item => {
        return item.genreCode === this.genreCode && item.pointId === this.id
      })
      return names.indexOf(this.name)
    },
    // selected () {
    //   let filterPoint = this.$store.state.prescription.selectedPoints.filter(item => {
    //     return this.id && (item.genreCode === this.genreCode) && (item.pointId === this.id)
    //   })
    //   return filterPoint.length > 0
    // },
    pointInfo () {
      let filterPoint = this.$store.state.prescription.selectedPoints.filter(item => {
        return item.genreCode === this.genreCode && item.pointId === this.id
      })
      return filterPoint[0]
    }
  },
  destroyed () {
  },
  methods: {
    select (item) {
      this.v = ''
      this.inputWidth = 6
      this.$emit('select', item)
    },
    cancel () {
      this.$emit('cancel', this.id)
    },
    handlePointClick () {
      if (this.disabled || this.unreachable || this.notallowed) {
        this.focusDelete()
        return
      }
      this.$emit('symclick', this.id)
      if (!this.highlight) {
        this.relativeShow = true
      }
      // if (this.selected) {
      //   removeSelectedPoints(this.pointInfo.choosePointType, this.pointInfo.delId).then(res => {
      //     this.$store.dispatch('resetSelectedPoints', res.data)
      //     this.$emit('cancel', this.id)
      //   })
      // } else {
      //   // 由于经验取穴和辩证取穴调用方式不同，所以把增加穴位的调用通过事件方式调用
      //   this.$emit('symclick', this.id)
      // }
    },
    // 推高主症推荐症状
    handleRecommondSymClick (item) {
      this.$emit('recommondSymClick', item)
    },
    deleteHandle (v) {
      console.log('deleteHandle', v.length)
      // this.t_l = this.v.length
      // 如果输入框中没有内容，则触发删除按钮
      if (this.v.length === 0) { // 这里特殊处理，防止内容长度为1的时候，按delete键也触发删除
        this.$emit('deleteClick', this.id)
      }
      // if (this.v.length === 0) {
      //   setTimeout(() => {
      //     this.t_l = this.v.length
      //   }, 0)
      // }
    },
    inputHandle (e) {
      console.log('inputHandle', this.v.length)
      // this.v = e.target.value = ''
      this.v = e.target.value
      // this.inputWidth = this.$refs['input'].offsetWidth
      this.$nextTick(() => {
        this.inputWidth = this.$refs['sensor'].clientWidth + 6
      })
      // setTimeout(() => {
      //   this.t_l = this.v.length
      // }, 0)
    },
    focusDelete () {
      if (this.deleteEnable) {
        this.$refs.input && this.$refs.input.focus()
      }
    },
    openDetail () {
      this.show = true
    },
    inputClick () {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
.point-container {
  display: inline-block;
  margin:0;
  margin-right: 0px;
  .place-hold {
    border: none;
    outline: none;
    -webkit-appearance: none;
    background: transparent;
    width: 6px;
    color: white;
    font-size: 16px;
    line-height: 30px;
    vertical-align: middle;
    margin-top: 5px;
    height: 25px;
    float: left;
    padding-left:5px;
    /deep/ input {
      border: none;
      border-radius: 0;
      background-color: transparent;
      color: white;
      font-size: 16px;
      padding: 0;
      line-height: 30px;
      outline: none;
      vertical-align: middle;
      height: 25px;
      float: left;
      margin-top: 3px;
      &::placeholder {
        color:rgb(129, 127, 127);
        font-size: 16px;
        padding-bottom: 10px;
      }
    }
  }
}
.tab-btn {
  border: 1px solid #AAAAAA;
  font-size: 14px;
  padding: 4px 12px;
  line-height: 22px;
  cursor: pointer;
  color: #b4babf;
  display: inline-block;
  margin: 0;
  box-sizing: border-box;
  float: left;
  margin-top: 3px;
  &.selected {
    background: transparent;
    // border-color: #45d1b6;
    border: 1px solid rgb(69, 209, 182);
    box-shadow: rgb(73, 184, 163) 0px 0px 14px inset;
  }
  &.disabled {
    cursor: auto;
    background-color: rgba(73,184,163,0.20);
    border: 1px solid rgba(73,184,163,0.20);
  }
  &.highlight {
    background: #49B8A3;
    color: #FFFFFF;
    border: 1px solid #49B8A3;
    color: white;
  }
  &.unreachable {
    cursor: not-allowed;
    border: 1px solid #373737;
    color: #4A4A4A;
    background: rgba(74,74,74,0.20);
  }
  &.matched {
    // border: 3px solid #49B8A3;
    // box-shadow: inset 0 2px 19px 4px #49B8A3;
    background: transparent;
    // border-color: #45d1b6;
    border: 1px solid rgb(69, 209, 182);
    box-shadow: #45d1b6 0px 0px 7px 5px;
  }

  .side-logo {
    width: 14px;
  }
  // 推高主症推荐症状
  &.recommond-symptom-selected{
    background: #49B8A3;
    color: #FFFFFF;
    border: 1px solid #49B8A3;
  }
  &.notallowed{
    cursor: not-allowed;
  }
  &.mainflag{
    background-image: url('~@/assets/img/recipeBrain/main-flag@3x.png');
    background-repeat:no-repeat;
    background-position:bottom right;
    background-size: 12px;
  }
}
// 推高主症推荐症状
.recommond-symptom-container{
  .scroll-height{
    height: 200px;
  }
}
</style>
