<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <multi-items-input
      v-model="arr"
      :fetch="search"
      placeholder="请输入关键字"
      :height="50"
      separator=";"
      :selection-only="false"
      @select="select"
      @delete="onDelete"
      :zIndexOfPopper="9999999"
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
        { name: "xueli@jwolf.cn", id: 23 },
        { name: "xiaohong@jwolf.cn", id: 24 },
        { name: "xiaoming@jwolf.cn", id: 25 },
        { name: "xiaoting@jwolf.cn", id: 26 },
        { name: "xiaoze@jwolf.cn", id: 27 },
        { name: "xiaobei@jwolf.cn", id: 28 },
        { name: "xiaowei@jwolf.cnxxx", id: 29 }
      ]
    }
  },
  methods: {
    search (keywords, cb) {
      var list = [
        { name: "xiaob@jwolf.cn", id: 1 },
        { name: "xiaorou@jwolf.cn", id: 2 },
        { name: "liming@jwolf.cn", id: 3 },
        { name: "lizz@jwolf.cn", id: 12 },
        { name: "wess@jwolf.cn", id: 13 },
        { name: "liang@jwolf.cn", id: 14 },
        { name: "abd@jwolf.cn", id: 21 },
        { name: "bbcc@jwolf.cn", id: 22 },
        { name: "xueli@jwolf.cn", id: 23 },
        { name: "xiaohong@jwolf.cn", id: 24 },
        { name: "xiaoming@jwolf.cn", id: 25 },
        { name: "xiaoting@jwolf.cn", id: 26 },
        { name: "xiaoze@jwolf.cn", id: 27 },
        { name: "xiaobei@jwolf.cn", id: 28 },
        { name: "xiaowei@jwolf.cn", id: 29 }
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

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
