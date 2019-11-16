// 导入 Vue.js 和组件，进行测试
import { shallowMount } from '@vue/test-utils'
import AutoCompleteInput from '@/components/AutoCompleteInput.vue'

describe('AutoCompleteInput', () => {
  // 检查原始组件选项
  const msg = 'new message'
  const wrapper = shallowMount(AutoCompleteInput, {
    propsData: { vModel: msg }
  })
  it('init value by v-model', () => {
    expect(wrapper.find('input').element.value).toBe(msg)
  })
})