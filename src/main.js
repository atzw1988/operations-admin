import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './routes';
import axios from 'axios';
import Qs from 'qs';
import BaiduMap from 'vue-baidu-map';
import echarts from 'echarts';
import $ from 'jquery';
import 'echarts/extension/bmap/bmap';
import "echarts/map/js/china.js";
import "echarts/map/js/province/guangdong.js";
import fortime from './assets/js/time.js';
import get_list from './assets/js/forward.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'



import { store } from './store/store.js';

// 配置默认根路径
// axios.defaults.baseURL = 'https://wd0992259444dcaaxf.wilddogio.com/';
// axios.defaults.baseURL = 'http://192.168.1.104:13259';
axios.defaults.baseURL = 'http://www.lcgxlm.com:13259';
// axios.defaults.headers.common['Authorization'] = 'Web ' + store.state.token

axios.interceptors.request.use((config) => {
  if (window.localStorage.getItem('token')) {
    config.headers.common['Authorization'] = 'Web ' + window.localStorage.getItem('token')
  }else{
    // config.headers.common['Authorization'] = 'Web null'
  }
  return config
}, (error) => {
  router.push('/')
  return Promise.reject(error)
})

// 配置Vue原型 (在任何组件中都可以正常使用axios)
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;

Vue.use(ElementUI);
Vue.use(fortime)
Vue.use(get_list)
Vue.use(VueRouter);
Vue.use(BaiduMap, {
  ak: 'm8KV2NkBXQLvGzvLO30Gt9mGgGWBW1rR' //这个地方是官方提供的ak密钥
});

const router = new VueRouter({
  routes,
  mode: 'hash',
  scrollBehavior(to, from, savedPosition) {
    // return { x:0, y:100 }
    // return { selector: '.btn'}

    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

//全局守卫
router.beforeEach((to, from, next) => {
  if (window.localStorage.getItem('token')){
    next()
  }else{
    if(to.path == '/'){
      next()
    }else{
      alert('还没有登录，请先登录')
      next('/')
    }
  }
})


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
