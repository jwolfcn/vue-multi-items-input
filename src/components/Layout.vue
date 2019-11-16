<template>
  <div class="item-value" style="cursor: text;" @click.self="symItemClick(selectedDiseases[selectedDiseases.length-1])">
    <item
      v-for="(sym,i) in selectedDiseases"
      :name="sym.name"
      :deleteEnable="true"
      @deleteClick="diseaseDeleteHandler(sym)"
      unselectable="on"
      :id="sym.id"
      :highlight="Boolean(sym.id && recommondSym.length)"
      :remark="sym.remark"
      :ref="'jwolfcnMultiItemsInput'+(i === selectedDiseases.length-1?'last':i)"
      :key="'jwolfcnMultiItemsInput'+i"
      @select="handleAddSearchSelectedSymptom"
      :fetch-suggestions="querySearch"
      :recommondSym="recommondSym"
      @recommondSymClick="recommondSymClick"
      :showLoading="showRecommondLoading"
      :isFocusWhenIniting="false" 
    />
  </div>
</template>

<script>
import Item from './MultiItemsInput.vue'
export default {
  name: 'app',
  components: {
    Item
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
