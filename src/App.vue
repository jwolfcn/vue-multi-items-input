<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <multi-items-input
      v-model="arr"
      :fetch="search"
      placeholder="请输入关键字"
      :height="100"
      separator=";"
      :selection-only="false"
      @select="select"
      @delete="onDelete"
    />
    <p>{{arr}}</p>
  </div>
</template>

<script>
import MultiItemsInput from './components/MultiItemsInput.vue'

export default {
  name: 'app',
  components: {
    MultiItemsInput
  },
  data () {
    return {
      data: null,
      arr: [
        { name: "雪梨", id: 23 },
        { name: "牛杂", id: 24 },
        { name: "牛油", id: 25 },
        { name: "牛舌", id: 26 },
        { name: "牛鼻", id: 27 },
        { name: "牛尾", id: 28 },
        { name: "牛百叶", id: 29 }
      ]
    }
  },
  methods: {
    search (keywords, cb) {
      var list = [
        { name: "牛奶", id: 1 },
        { name: "猪肉", id: 2 },
        { name: "牛肉", id: 3 },
        { name: "苹果", id: 12 },
        { name: "香蕉", id: 13 },
        { name: "牛腿", id: 14 },
        { name: "猪肝", id: 21 },
        { name: "牛排", id: 22 },
        { name: "雪梨", id: 23 },
        { name: "牛杂", id: 24 },
        { name: "牛油", id: 25 },
        { name: "牛舌", id: 26 },
        { name: "牛鼻", id: 27 },
        { name: "牛尾", id: 28 },
        { name: "牛百叶", id: 29 }
      ];
      setTimeout(() => {
        if (keywords) {
          let r = list.filter(item => {
            return item.name.indexOf(keywords) > -1;
          });
          // let r = mailList.map(item => {
          //   return {
          //       ...item,
          //       name: keywords + item.name
          //     }
          // });
          cb(r);
        } else {
          cb(list);
        }
      }, 100);
    },
    select (item, i) {
      this.data = JSON.stringify(item) + i
    },
    onDelete (item, selectedItems) {
      this.data = JSON.stringify(item) + ',   ' + JSON.stringify(selectedItems)
    }
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
