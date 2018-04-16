// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
// import VueRouter from 'vue-router';
// import router from './router'

// Vue.use(VueRouter);

// const persInfo = resolve => require(['./components/persInfo.vue'], resolve)

// const router = new VueRouter({
// 	mode: 'history',
//     routes : [
//         { path: '/info', component: persInfo}
//     ]
// })

Vue.config.productionTip = true

/* eslint-disable no-new */
new Vue({
  el: '#chat-app',
  template: '<App/>',
  // router,
  components: { App },
  store 
})
