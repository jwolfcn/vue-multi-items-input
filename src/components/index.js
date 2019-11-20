// src/components/index.js

import Vue from "vue";
import MultiItemsInput from "./MultiItemsInput.vue";

const Components = {
  MultiItemsInput
};

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name]);
});

export default Components;
