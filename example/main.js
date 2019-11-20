import Vue from 'vue'
import App from './App.vue'
import 'multi-items-input'
import 'multi-items-input/dist/multi-items-input.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
