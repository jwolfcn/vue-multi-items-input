<template>
  <div class="point-container" @click.prevent="itemClick">
    <span class="label">{{name + suffix}}</span>
    <autocomplete
      @input.native="inputHandle"
      v-model="v"
      :style="{width: inputWidth + 'px'}"
      @keydown.delete.native="deleteHandle(v)"
      :disabled="!editable"
      class="place-hold"
      ref="input"
      :triggerOnFocus="triggerOnFocus"
      @select="select"
      @blur="blur"
      :fetch="fetchSuggestions"
    >
    </autocomplete>
    <pre style="font-size: 16px;visibility: hidden;position: fixed;z-index: -1;bottom: -99999px;" ref="sensor">{{v}}</pre>
  </div>
</template>

<script>
import autocomplete from './AutoCompleteInput.vue'
export default {
  name: 'InputItem',
  components: {
    autocomplete
  },
  props: {
    triggerOnFocus: {
      type: Boolean
    },
    id: {
      type: [Boolean, String, Number]
    },
    editable: {
      type: [Boolean],
      default: false
    },
    name: {
      type: [String]
    },
    suffix: {
      type: [String]
    },
    fetchSuggestions: {
      type: Function
    }
  },
  data () {
    return {
      v: '',
      inputWidth: 6
    }
  },
  methods: {
    itemClick () {
      if (!this.disabled) {
        this.__focus()
        return
      }
      this.$emit('itemClick', this.id)
    },
    __focus() {
      var dom = this.$refs.input.$el.querySelector('input')
      dom && dom.focus()
    },
    select (item) {
      this.v = ''
      this.inputWidth = 6
      this.$emit('select', item)
    },
    deleteHandle () {
      if (this.v.length === 0) {
        this.$emit('deleteClick', this.id)
      }
    },
    inputHandle (e) {
      this.v = e.target.value
      this.$nextTick(() => {
        this.inputWidth = this.$refs['sensor'].clientWidth + 6
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.point-container {
  display: inline-block;
  margin:0;
  margin-right: 0px;
  .label {
    float: left;
  }
  .place-hold {
    border: none;
    outline: none;
    -webkit-appearance: none;
    background: transparent;
    width: 6px;
    font-size: 16px;
    line-height: 100%;
    vertical-align: middle;
    margin-top: 0;
    float: left;
    padding-left:2px;
    /deep/ input {
      border: none;
      border-radius: 0;
      background-color: transparent;
      font-size: 16px;
      padding: 0;
      line-height: 100%;
      outline: none;
      vertical-align: middle;
      // height: 25px;
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
</style>
