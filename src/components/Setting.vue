<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-28 11:03:07
 * @LastEditTime: 2019-09-07 09:06:45
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="row">
    <div class="leftmenu">
      <!-- <ul>
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
      </ul> -->
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#38434e"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu index="1">
          <template slot="title">
            <img class="one_img" v-show="show_1" src="../assets/wenjianjia_1.png" alt="">
            <img class="one_img" v-show="!show_1" src="../assets/wenjianjia.png" alt="">
            <span class="title_text">安全设置</span>
          </template>
          <el-menu-item index="1-1">
            <template slot="title">
              <img src="../assets/wenjian.png" alt="">
              <router-link tag="li" class="twomenu" :to="{name:'passwordLink'}">密码修改</router-link>
            </template>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2" v-if="this.isHave('超级管理员')">
          <template slot="title">
            <img class="one_img" v-show="show_2" src="../assets/wenjianjia_1.png" alt="">
            <img class="one_img" v-show="!show_2" src="../assets/wenjianjia.png" alt="">
            <span class="title_text">账号管理</span>
          </template>
          <el-menu-item index="2-1">
            <template slot="title">
              <img src="../assets/wenjian.png" alt="">
              <router-link tag="li" class="twomenu" :to="{name:'alluserLink'}">账户列表</router-link>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="rightdetile">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
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
            {name:'账号日志',to:'userlogLink'}
          ]
        }
      ],
      show_1:true,
      show_2:true
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
    handleOpen(key, keyPath) {
      if(key == 1){
        this.show_1 = false
      }else{
        this.show_2 = false
      }
    },
    handleClose(key, keyPath) {
      if(key == 1){
        this.show_1 = true
      }else{
        this.show_2 = true
      }
    },
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
  width: 100%;
  /* height: 93.3vh; */
  min-height: 904px;
  background: #38434e;
  /* background: rgb(219, 219, 219) */
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
  width: calc(100% - 200px);
  margin-left: 200px;
  height: 100%;
  background: #fff;
}
.el-menu-item{
  padding-right: 0;
}
img{
  width: 30px;
  height: 30px;
  float: left;
  margin-top: 10px;
}
.one_img{
  margin-top: 13px;
}
.title_text{
  font-size: 20px;
  line-height: 56px;
  font-weight: 600;
  float: left;
}
.leftmenu>>>.el-menu-item{
  width: 199px;
}
.el-menu{
  border: 0;
}

</style>
