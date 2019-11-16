<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <HelloWorld 
    v-model="test"
    :style="{width: inputWidth + 'px'}"
    :disabled="!deleteEnable"
    class="place-hold"
    @select="select"
    :fetch ="search"
    :triggerWhileFocus="true"
    ></HelloWorld>
  </div>
</template>

<script>
import HelloWorld from './components/AutoCompleteInput.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  data () {
    return {
      test: 'test',
      inputWidth: '60',
      deleteEnable: true
    }
  },
  methods: {
    select (item) {
      this.test = item.name
      // alert(item.id)
    },
    search (keywords, cb) {
      var list = [
          { name: '牛奶', id: 1 },
          { name: '猪肉', id: 2 },
          { name: '牛肉', id: 3 },
          { name: '苹果', id: 12 },
          { name: '香蕉', id: 13 },
          { name: '牛腿', id: 14 },
          { name: '猪肝', id: 21 },
          { name: '牛排', id: 22 },
          { name: '雪梨', id: 23 },
          { name: '牛杂', id: 24 },
          { name: '牛油', id: 25 },
          { name: '牛舌', id: 26 },
          { name: '牛鼻', id: 27 },
          { name: '牛尾', id: 28 },
          { name: '牛百叶', id: 29 },
        ]
        setTimeout(() => {
          if (keywords) {
            let r = list.filter((item) => {
              return item.name.indexOf(keywords) > -1
            })
            cb(r)}
          else {
            cb(list)
          }
        }, 1000)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
