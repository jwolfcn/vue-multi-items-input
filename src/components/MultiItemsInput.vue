<template>
  <div class="jw-container" :style="{height: height + 'px'}" @click.self.prevent="setLastItemFocus">
    <input-item
      v-for="(item,i) in selectedItems"
      :key="'selectedItems'+i"
      :name="item.name"
      :editable="true"
      @deleteClick="deleteItem(item)"
      :id="item.id"
      :ref="'jw-selectedItems'+i"
      @select="(item) => {return addSelectedItemsGenerator(i)(item)}"
      :fetch-suggestions="fetch"
      :trigger-on-focus="true"
      :suffix="separator"
    ></input-item>
    <auto-complete-input
      ref="pre-input"
      v-if="selectedItems.length === 0"
      class="pre-input"
      v-model="keywords"
      :trigger-on-focus="true"
      @select="(item) => {return addSelectedItemsGenerator(-1)(item)}"
      :fetch="fetch"
      :placeholder="placeholder"
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
    fetch: {
      type: Function
    },
    triggerOnFocus: {
      type: Boolean
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
    }
  },
  data() {
    return {
      test: "test",
      inputWidth: "60",
      editable: true,
      selectedItems: [],
      keywords: ""
    };
  },
  mounted() {
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
        this.$emit('select', item, index);
      };
    },
    /**
     * @description Delete the specific item by arg, then reset the cursor.
     * @param {item} Item which should be delete
     */
    deleteItem(item) {
      var [...reverseArr] = this.selectedItems;
      reverseArr.reverse();
      var index = reverseArr.findIndex(obj => {
        return item.id === obj.id;
      });
      index = this.selectedItems.length - 1 - index;
      var currentIndex = index > 0 ? index - 1 : undefined;
      this.selectedItems.splice(index, 1);
      if (typeof currentIndex !== "undefined") {
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
    },
    setLastItemFocus () {
      var component = this.$refs['jw-selectedItems' + (this.selectedItems.length-1)][0]
      component && component.$el.querySelector('input').focus()
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.jw-container {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  background-color: #e5e9f2;
  padding: 5px;
  text-align: left;
  cursor: text;
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
