<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-28 11:03:06
 * @LastEditTime: 2019-09-02 18:25:23
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="app">
    <div class="container-fluid header">
      <app-header v-if="header_show"></app-header>
    </div>
    <div class="container-fluid content" ref="homePage" :class="{active:this.$route.name != 'loginLink'}">
      <router-view v-on:header="header"></router-view>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import Header from './components/Header';
export default {
  components:{
    "app-header":Header
  },
  computed: {
    // currentUser(){
    //   return this.$store.getters.currentUser
    // },
    // isLogin(){
    //   return this.$store.getters.isLogin
    // }
  },
  data() {
    return {
      // isLogin:false
      header_show:true,
      clientHeight: ''
    }
  },
  // beforeRouteEnter: (to, from, next) => {
  //     next(vm => {
  //       vm.$store.dispatch("setUser",null)
  //     })
  //   },
  beforeCreate() {
    // console.log(this.$store.getters.isLogin)
    console.log(this.$route.name)

  },
  mounted() {
    this.initHeight()

  },
  watch: {
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
    },
    $route(to, from){
      console.log(to);
      console.log(from)
      if(to.name == 'loginLink') {
        this.$refs.homePage.style.height = this.clientHeight + 'px'
      }else{
        this.$refs.homePage.style.height = this.clientHeight - 65 + 'px'
      }
    }
  },
  methods: {
    header:function (bool) {
      this.header_show = bool;
    },
    changeFixed(clientHeight){                        //动态修改样式
      console.log(clientHeight);
      if(this.$route.name != 'loginLink') {
        this.$refs.homePage.style.height = clientHeight - 65 + 'px';
      } else {
        this.$refs.homePage.style.height = clientHeight + 'px';
      }

    },
    initHeight(){  //获取高度
      //获取浏览器可视区域高度
      this.clientHeight = $(document).height();
      // console.log($(document).height());//浏览器可视区域对象宽度
      window.onresize = () => {  //当窗口或框架发生改变时触发
      //console.log("onresize进来了");
        this.clientHeight = $(document).height();
      };
    }
  },
  Destroyed() {
    window.localStorage.removeItem('token')
    console.log('摧毁')
    window.addEventListener('beforeunload',()=>{
      localStorage.removeItem('token');
    });
  }
}
</script>

<style scoped>
#app{
  z-index: 2000;
  height: 100%;
}
.container-fluid{
  width: 100%;
  padding: 0;
  /* overflow-x: hidden; */
  background: rgb(15, 24, 48);
  z-index: 2000;
}
.header{
  /* overflow-y: hidden; */
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
}
.content{
  /* height: calc(100% - 165px); */
  position: relative;
}
.active{
  margin-top: 65px;
}
li{
  list-style: none;
}
ul{
  margin: 0;
  padding: 0;
}
/* ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(252, 149, 14, 0.603);
    background: rgba(252, 149, 14, 0.603);
}
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(226, 216, 216, 0.651);
    border-radius: 0;
    background: rgba(226, 216, 216, 0.651);
} */
</style>
<style>
  li{
    list-style: none;
  }
  ul{
    margin: 0;
    padding: 0;
  }
  /* #row{
    background-color: #f5f5f5 !important;
  } */
</style>
