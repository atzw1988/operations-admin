<template>
  <div id="row">
    <div class="leftmenu">
      <ul>
        <li v-for="(menulist,index) in menulists" :key="menulist.name">
          <div class="onemenu" @click="showToggle(menulist,index)">
            <span>{{menulist.name}}</span>
            <img v-show="!menulist.issubshow" src="../assets/web__xiala_you.png" alt="">
            <img v-show="!menulist.issubshow" src="../assets/wenjianjia_1.png" alt="">
            <img v-show="menulist.issubshow" src="../assets/web__xiala.png" alt="">
            <img v-show="menulist.issubshow" src="../assets/wenjianjia.png" alt="">
          </div>
          <ul v-show="menulist.issubshow" class="twomenus">
            <li v-for="subitem in menulist.subitems" :key="subitem.name">
              <img v-show="menulist.issubshow" src="../assets/wenjian.png" alt="">
              <router-link tag="li" class="twomenu" :to="{name:subitem.to}">{{subitem.name}}</router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="rightdetile">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import $ from 'jquery';
export default {
  name: "echarts",
  props: ["userJson"],
  data() {
    return {
      chart: null,
      menulists: [
        {
          name: '安全设置',
          issubshow: false,
          subitems: [
            {name:'密码修改',to:'passwordLink'},
            // {name:'用户信息',to:'usernameLink'},
          ]
        },
        {
          name: '账号管理',
          issubshow: false,
          subitems: [
            {name:'账号列表',to:'alluserLink'},
            {name:'添加账号',to:'adduserLink'},
            // {name:'账号日志',to:'userlogLink'}
          ]
        }
      ]
    };
  },
  mounted() {
    // if(window.localStorage.getItem('token')){
    //   this.isLogin = true
    // }else{
    //   window.location.pathname = '/login'
    //   alert('请先登录！')
    // }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    showToggle:function(item,ind){
      this.menulists.forEach(i => {
        // 判断如果数据中的menuList[i]的show属性不等于当前数据的isSubShow属性那么menuList[i]等于false
        if (i.issubshow !== this.menulists[ind].issubshow) {
          i.issubshow = false;
        }
      });
      item.issubshow = !item.issubshow;
    },
  }
}
</script>

<style scoped>
#row{
  width: 88.9%;
  height: 93.3vh;
  background: rgb(219, 219, 219)
}
.leftmenu{
  float: left;
  width: 200px;
  height: 100%;
  color: #fff;
  /* border-right: 1px solid #000; */
  background: #38434e;
}
.rightdetile{
  width: 100%;
  margin-left: 210px;
  height: 100%;
  background: #fff;
}
.onemenu{
  width: 100%;
  height: 50px;
  margin: 2px auto 0;
  position: relative;
  cursor: pointer;
}
.onemenu>span{
  line-height: 50px;
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px;
}
.onemenu>img{
  width: 30px;
  height: 30px;
  float: left;
  margin-top: 10px;
}
.twomenus>li{
  width: 160px;
  height: 40px;
  margin: 2px 0 0 40px;
  font-size: 16px;
  font-weight: 500;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}
.twomenus>li>img{
  width: 30px;
  height: 30px;
  float: left;
  margin: 5px 0 0 20px;
}
</style>
