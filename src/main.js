import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mixins from './mixins'
import i18n from './i18n'

Vue.config.productionTip = false

Vue.mixin(mixins)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
