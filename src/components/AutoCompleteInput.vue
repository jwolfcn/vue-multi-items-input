<template lang="html">
  <div class="jwolfcn-container">
      <input type="text" 
        slot="reference"
        autocomplete="off"
        v-bind:value="value"
        @input="input"
        v-bind="[$attrs]"
        :placeholder="placeholder"
        :disabled="disabled"
        @blur="blur" @focus="focus"
        @keyup.enter="keyEnter" @keydown.tab.prevent="keyEnter" 
        @keydown.up="keyUp" @keydown.down="keyDown"
        ref="input"/>
      <autoCompleteSuggestions
        :class="[popperClass ? popperClass : '']"
        :append-to-body="true"
        ref="suggestions"
        :placement="placement"
        :value="show"
        :zIndexOfPopper="zIndexOfPopper"
      >
        <div class="wrapper">
          <div class="items-container">
            <div class="jwolfcn-list-item" v-for="(item, i) in internalItems" :ref="'jwolfcn__item'+i" v-bind:key="'jw__item'+i"
              @click.stop.prevent="onClickItem($event, item)"
              :class="{'jwolfcn-list-active': i === cursor}">
              <div>{{item.name}}</div>
            </div>
          </div>
        </div>
      </autoCompleteSuggestions>
  </div>
</template>

<script>
import {debounce} from 'throttle-debounce'
// import Popper from 'vue-popperjs'
import 'vue-popperjs/dist/vue-popper.css'
import autoCompleteSuggestions from './AutoCompleteSuggestions'
export default {
  name: 'AutoCompleteInput',
  inheritAttrs: false,
  components: {
    autoCompleteSuggestions
  },
  props: {
    value: null,
    getLabel: {
      type: Function,
      default: item => item
    },
    triggerOnFocus: {
      type: Boolean
    },
    fetch: {
      type: Function
    },
    placeholder: String,
    disabled: { type: Boolean, default: false },
    keepOpen: { type: Boolean, default: false },
    selectionOnly: { type: Boolean, default: false },
    placement: {},
    zIndexOfPopper: {type: Number}
  },
  data() {
    return {
      showList: false,
      cursor: -1,
      selectedItem: null,
      internalItems: [],
      popperClass: 'items-container'
    };
  },
  mounted() {
    /* eslint-disable no-alert, no-console */
    // console.log('test')
  },
  computed: {
    hasItems() {
      return !!this.internalItems.length
    },
    show() {
      return (this.showList && this.hasItems) || this.keepOpen
    },
    minCursor () {
      return this.selectionOnly ? 0 : -1
    }
  },
  methods: {
    /** 
     * Trigger this.fetch, set the items by argument of callback
     * */
    __fetch: debounce(300, function () {
        if (typeof this.fetch === 'function') {
          this.fetch(this.value, (arr) => {
            this.internalItems = arr
            this.showList = true
          })
        }
      }
    ),
    /** 
     * Make the focus item scroll into view
    */
    __itemView(item) {
      if (item && item.scrollIntoView) {
        item.scrollIntoView(false)
      }
    },
    /** 
     * Set one item selected
     * @param {item} Item which should be selected
     */
    __selectItem(item) {
      if (item) {
        this.selectedItem = item
        this.$emit('select', item)
      } 
    },
    input(e) {
      this.$emit('input', e.target.value)
      this.__fetch()
    },
    focus() {
      return this.triggerOnFocus && this.__fetch()
    },
    /**
     * Just like clickoutside, setTimeout makes the "item click" event work
     */
    blur () {
      this.$emit('blur')
      setTimeout(() => {
        this.showList = false
      }, 200)
    },
    onClickItem(e, item) {
      /* eslint-disable no-alert, no-console */
      // console.log(e)
      // alert(e)
      this.showList = false
      this.__selectItem(item)
    },

    keyUp() {
      if (this.cursor > this.minCursor) {
        this.cursor --
        this.__itemView(
          // this.$el.getElementsByClassName('jwolfcn-list-item')[
          //   this.cursor
          // ]
          this.$refs['jwolfcn__item' + this.cursor][0]
        );
      }
    },
    keyDown() {
      if (this.cursor < this.internalItems.length - 1) {
        this.cursor ++
        this.__itemView(
          // this.$el.getElementsByClassName('jwolfcn-list-item')[
          //   this.cursor
          // ]
          this.$refs['jwolfcn__item' + this.cursor][0]
        );
      }
    },

    keyEnter() {
      if (this.cursor < 0 && this.value.length > 0) {
        this.__selectItem({
          name: this.value, id: null
        })
      }
      if (this.showList && this.internalItems[this.cursor]) {
        this.__selectItem(this.internalItems[this.cursor])
        this.showList = false
      }
    }
  },
  watch: {
    show () {
      this.cursor = this.minCursor
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.jwolfcn-container {
  position: relative;
  input {
    width: 100%;
    border: none;
    outline: none;
    -webkit-appearance: none;
  }
}
.items-container {
  max-height: 200px;
  max-height: 200px;
  color: #2c3e50;
  overflow: auto;
  border: 1px solid #eee;
  // border: 1px solid #eee;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  .popper {
    box-shadow: none;
  }
  .jwolfcn-list-item {
    padding: 4px 7px;
    min-width: 50px;
    cursor: pointer;
    text-align: center;
    background: #fff;
    &:hover, &.jwolfcn-list-active {
      background: #20a0ff;
      color: #fff;
    }
  }
}
</style>