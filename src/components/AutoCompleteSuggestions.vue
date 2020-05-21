<template>
  <transition name="drawer" @after-leave="doDestroy">
    <div v-show="showPopper">
        <p v-if="!parent.hideLoading && parent.loading"><i class="icon-loading"></i></p>
        <slot v-else>
        </slot>
    </div>
  </transition>
</template>
<script>
  import Popper from '../utils/vue-popper';
  export default {
    mixins: [Popper],
    componentName: 'AutocompleteSuggestions',
    data() {
      return {
        parent: this.$parent,
        dropdownWidth: ''
      };
    },
    props: {
      options: {
        default() {
          return {
            gpuAcceleration: false
          };
        }
      },
      id: String
    },
    methods: {
    },
    updated() {
      this.$nextTick(() => {
        this.popperJS && this.updatePopper();
      });
    },
    mounted() {
      this.$parent.popperElm = this.popperElm = this.$el;
      this.referenceElm = this.$parent.$refs.input || this.$parent.$refs.textarea;
    },
    // created() {
    //   this.$on('visible', (val, inputWidth) => {
    //     this.dropdownWidth = inputWidth + 'px';
    //     this.showPopper = val;
    //   });
    // }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.drawer-enter-active, .drawer-leave-active {
  transition: all .1s;
  // transform: translateY(-10px)
}
.drawer-enter, .drawer-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  // transform: translateY(0);
}
</style>