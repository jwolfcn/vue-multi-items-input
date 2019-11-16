<template lang="html">
  <div class="jw__container">
    <input type="search" 
          v-bind:value="value"
          @input="input"
          v-bind="[$attrs]"
          :placeholder="placeholder"
          :disabled="disabled"
          @blur="blur" @focus="focus"
          @keyup.enter="keyEnter" @keydown.tab="keyEnter" 
          @keydown.up="keyUp" @keydown.down="keyDown">
    <div class="jw-list" v-if="show">
      <div class="jw-list-item" v-for="(item, i) in internalItems" :ref="'jw__item'+i" v-bind:key="'jw__item'+i" @click="onClickItem(item)"
           :class="{'jw-list-active': i === cursor}">
        <div>{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {debounce} from 'throttle-debounce'
export default {
  name: 'AutoCompleteInput',
  inheritAttrs: false,
  props: {
    value: null,
    getLabel: {
      type: Function,
      default: item => item
    },
    triggerWhileFocus: {
      type: Boolean
    },
    fetch: {
      type: Function
    },
    placeholder: String,
    disabled: { type: Boolean, default: false },
    keepOpen: { type: Boolean, default: false }
  },
  data() {
    return {
      searchText: '',
      showList: false,
      cursor: -1,
      selectedItem: null,
      internalItems: []
    };
  },
  computed: {
    hasItems() {
      return !!this.internalItems.length
    },
    show() {
      return (this.showList && this.hasItems) || this.keepOpen
    }
  },
  methods: {
    input(e) {
      this.$emit('input', e.target.value)
      this.__fetch()
    },
    focus() {
      return this.triggerWhileFocus && this.__fetch()
    },
    /** 
     * Trigger this.fetch, set the items by argument of callback
     * */
    __fetch: debounce(300, function () {
        if (typeof this.fetch === 'function') {
          this.fetch(this.value, (arr) => {
            this.internalItems = arr
            this.showList = true
          })}
        }),
    /**
     * Just like clickoutside, setTimeout makes the "item click" event work
     */
    blur () {
      this.$emit('blur')
      setTimeout(() => {
        this.showList = false
      }, 200)
    },
    onClickItem(item) {
      this.showList = false
      this.__selectItem(item)
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
    keyUp() {
      if (this.cursor > -1) {
        this.cursor --
        this.itemView(
          this.$el.getElementsByClassName('jw-list-item')[
            this.cursor
          ]
        );
      }
    },
    keyDown() {
      if (this.cursor < this.internalItems.length) {
        this.cursor ++
        this.itemView(
          this.$el.getElementsByClassName('jw-list-item')[
            this.cursor
          ]
        );
      }
    },
    /** 
     * Make the focus item scroll into view
    */
    itemView(item) {
      if (item && item.scrollIntoView) {
        item.scrollIntoView(false)
      }
    },
    keyEnter() {
      if (this.showList && this.internalItems[this.cursor]) {
        this.__selectItem(this.internalItems[this.cursor])
        this.showList = false
      }
    }
  },
  watch: {
    show () {
      this.cursor = 0
    }
  }
}
</script>

<style  lang='scss'>
.jw__container {
  position: relative;
  input {
    width: 100%;
  }
  .jw-list {
    position: absolute;
    max-height: 200px;
    border: 1px solid #eee;
    overflow-y: auto;
    .jw-list-item {
      padding: 2px 7px;
      min-width: 50px;
      cursor: pointer;
      text-align: center;
      &:hover, &.jw-list-active {
        background: #eee;
      }
    }
  }
}
</style>