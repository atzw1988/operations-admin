<template>
  <div id="app">
    <div class="container-fluid header">
      <app-header v-if="header_show"></app-header>
    </div>
    <div class="container-fluid content">
      <router-view v-on:header="header"></router-view>
    </div>
  </div>
</template>

<script>
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
      header_show:true
    }
  },
  // beforeRouteEnter: (to, from, next) => {
  //     next(vm => {
  //       vm.$store.dispatch("setUser",null)
  //     })
  //   },
  beforeCreate() {
    // console.log(this.$store.getters.isLogin)

  },
  mounted() {

  },
  methods: {
    header:function (bool) {
      this.header_show = bool;
    },
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

<style>
#app{
  z-index: 2000;
}
.container-fluid{
  width: 100%;
  padding: 0;
  overflow-x: hidden;
  background: rgb(15, 24, 48);
  z-index: 2000;
}
.header{
  overflow-y: hidden;
  z-index: 2000;
}
li{
  list-style: none;
}
ul{
  margin: 0;
  padding: 0;
}
::-webkit-scrollbar {/*滚动条整体样式*/
  width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}
::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(252, 149, 14, 0.603);
    background: rgba(252, 149, 14, 0.603);
}
::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(226, 216, 216, 0.651);
    border-radius: 0;
    background: rgba(226, 216, 216, 0.651);
}
</style>
