<template>
  <div class="jw-container" :style="{height: height + 'px'}" @click.self.prevent="setLastItemFocus">
    <input-item
      v-for="(item,i) in selectedItems"
      :key="'selectedItems'+i"
      :uId="'selectedItems'+i"
      :name="item.name"
      :editable="true"
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
    ></input-item>
    <auto-complete-input
      ref="pre-input"
      v-if="selectedItems.length === 0"
      class="pre-input"
      v-model="keywords"
      :trigger-on-focus="triggerOnFocus"
      @select="(obj) => {return addSelectedItemsGenerator(-1)(obj)}"
      :fetch="fetch"
      :placeholder="placeholder"
      :selection-only="selectionOnly"
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
    }
  },
  data() {
    return {
      test: "test",
      inputWidth: "60",
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
  font-smoothing: antialiased;
  font-smoothing: grayscale;
  color: #2c3e50;
  // margin-top: 60px;
  background-color: #e5e9f2;
  padding: 5px;
  text-align: left;
  cursor: text;
  overflow-y: auto;
  &:after {
    content: "";
    display: block;
    clear: both;
  }
  .pre-input {
    border: none;
    outline: none;
    -webkit-appearance: none;
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
      background-color: transparent;
      line-height: 100%;
      font-size: 16px;
    }
  }
}
</style>
