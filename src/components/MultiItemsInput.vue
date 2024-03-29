<template>
  <div class="jw-container" :style="{height: height + 'px', width: 'auto'}" @click.self.prevent="setLastItemFocus">
    <input-item
      v-for="(item,i) in selectedItems"
      :key="'selectedItems'+i"
      :uId="'selectedItems'+i"
      :name="item.name"
      :editable="!disabled"
      @deleteClick="() => {return deleteItemGenerator(i)(item)}"
      :id="item.id"
      :ref="'jw-selectedItems'+i"
      @select="(obj) => {return addSelectedItemsGenerator(i)(obj)}"
      :fetch-suggestions="fetch"
      :trigger-on-focus="triggerOnFocus"
      :suffix="separator"
      :selection-only="selectionOnly"
      :marked="marked"
      @itemClick="handleItemClick"
      :zIndexOfPopper="zIndexOfPopper"
    ></input-item>
    <auto-complete-input
      ref="pre-input"
      v-if="!disabled && selectedItems.length === 0"
      class="pre-input"
      v-model="keywords"
      :trigger-on-focus="triggerOnFocus"
      @select="(obj) => {return addSelectedItemsGenerator(-1)(obj)}"
      :fetch="fetch"
      :placeholder="placeholder"
      :selection-only="selectionOnly"
      :zIndexOfPopper="zIndexOfPopper"
    ></auto-complete-input>
  </div>
</template>

<script>
import AutoCompleteInput from "./AutoCompleteInput.vue";
import InputItem from "./InputItem.vue";

export default {
  name: "MultiItemsInput",
  components: {
    AutoCompleteInput,
    InputItem
  },
  props: {
    value: {
      type: Array
    },
    fetch: {
      type: Function
    },
    triggerOnFocus: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String
    },
    height: {
      type: Number
    },
    separator: {
      type: String,
      default: ' '
    },
    selectionOnly: {
      type: Boolean,
      default: false
    },
    zIndexOfPopper: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // inputWidth: "60",
      editable: true,
      selectedItems: [],
      keywords: "",
      marked: ""
    };
  },
  mounted() {
    Array.isArray(this.value) && (this.selectedItems = this.value)
    this.$refs["pre-input"].$el.querySelector("input").focus();
  },
  methods: {
    /**
     * @deprecated
     */
    // addSelectedItems (item, i) {
    //   var index = i || 0
    //   this.selectedItems.splice(index, 0, item)
    //   // this.selectedItems.push(item)
    //   this.$nextTick(() => {
    //     if (this.selectedItems.length > 0) {
    //       var dom = this.$refs['jw-selectedItems' + (this.selectedItems.length-1)]
    //       dom && dom[0] && dom[0].$el.querySelector('input').focus()
    //     }
    //   })
    // },

    /**
     * @description Use closure to store the index of the item.
     * @params {i} Index of the item
     */
    addSelectedItemsGenerator(i) {
      var index = i + 1;
      return item => {
        this.selectedItems.splice(index, 0, item);
        this.$nextTick(() => {
          if (this.selectedItems.length > 0) {
            var dom = this.$refs["jw-selectedItems" + index];
            dom && dom[0] && dom[0].$el.querySelector("input").focus();
          }
        });
        this.$emit('select', this.selectedItems, item);
        this.$emit('input', this.selectedItems)
        this.marked = ''
      };
    },
    /**
     * @description Delete the specific item by arg, then reset the cursor.
     * @param {item} Item which should be delete
     */
    deleteItemGenerator(index) {
      return item => {
        this.selectedItems.splice(index, 1);
        if (index) {
          let currentIndex = index - 1
          this.$nextTick(() => {
            let dom = this.$refs["jw-selectedItems" + currentIndex][0];
            dom && dom.$el.querySelector("input").focus();
          });
        } else {
          this.$nextTick(() => {
            let dom = this.$refs["pre-input"];
            dom && dom.$el.querySelector("input").focus();
          });
        }
        this.$emit('delete', item, this.selectedItems)
        this.$emit('input', this.selectedItems)
        this.marked = ''
      }
    },
    setLastItemFocus () {
      if (this.selectedItems.length < 1) {
        return
      }
      var component = this.$refs['jw-selectedItems' + (this.selectedItems.length-1)][0]
      component && component.$el.querySelector('input').focus()
    },
    handleItemClick (item) {
      this.marked = item.uId
    }
  },
  watch: {
    value () {
      let result = [];
      if (Array.isArray(this.value)) {
        this.value.forEach(value => {
          result.push(value);
        });
      }
      this.selectedItems = result;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.jw-container {
  color: #2c3e50;
  // margin-top: 60px;
  background-color: #e5e9f2;
  padding: 5px;
  text-align: left;
  cursor: text;
  overflow-y: auto;
  &::-webkit-scrollbar {/*滚动条整体样式*/
    width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 6px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
    background: rgba(51, 51, 51, 0.14);
  }
  &::-webkit-scrollbar-track {/*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(255, 255, 255, 0);
    border-radius: 6px;
    background: transparent;
  }
  input {
    width: 100%;
    border: none;
    outline: none;
    appearance: none;
  }
  &:after {
    content: "";
    display: block;
    clear: both;
  }
  .pre-input {
    border: none;
    outline: none;
    appearance: none;
    border-radius: 0;
    background-color: transparent;
    font-size: 16px;
    padding: 0;
    line-height: 100%;
    outline: none;
    vertical-align: middle;
    height: 22px;
    float: left;
    margin-top: 3px;
    &::placeholder {
      color: rgb(129, 127, 127);
      font-size: 16px;
      padding-bottom: 10px;
    }
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
      color: #5f5f6e;
      width: 100%;
    }
  }
}
</style>
