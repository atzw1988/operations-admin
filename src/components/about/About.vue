<template>
  <div id="row">
    <div class="leftmenu">
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
          <img class="one_img" v-show="show_1" src="../../assets/wenjianjia_1.png" alt="">
          <img class="one_img" v-show="!show_1" src="../../assets/wenjianjia.png" alt="">
          <span class="title_text">运营报表</span>
        </template>
        <el-menu-item index="1-1">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'operatingLink'}">收入报表</router-link>
          </template>
        </el-menu-item>
        <el-menu-item index="1-2">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'orderLink'}">订单报表</router-link>
          </template>
        </el-menu-item>
        <el-menu-item index="1-3">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'rechargeLink'}">充值报表</router-link>
          </template>
        </el-menu-item>
        <el-menu-item index="1-4">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'usersLink'}">用户报表</router-link>
          </template>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <img class="one_img" v-show="show_2" src="../../assets/wenjianjia_1.png" alt="">
          <img class="one_img" v-show="!show_2" src="../../assets/wenjianjia.png" alt="">
          <span class="title_text">订单管理</span>
        </template>
        <el-submenu index="2-1">
          <template slot="title"><img src="../../assets/wenjian.png" alt="">停车订单</template>
          <el-menu-item index="2-1-1">
            <template slot="title">
              <img src="../../assets/wenjian.png" alt="">
              <router-link tag="li" class="twomenu" :to="{name:'parkorderLink'}">网络订单</router-link>
            </template>
          </el-menu-item>
          <el-menu-item index="2-1-2">
            <template slot="title">
              <img src="../../assets/wenjian.png" alt="">
              <router-link tag="li" class="twomenu" :to="{name:'pdaorderLink'}">PDA订单</router-link>
            </template>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="2-2">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'rechargeorderLink'}">充值订单</router-link>
          </template>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <img class="one_img" v-show="show_3" src="../../assets/wenjianjia_1.png" alt="">
          <img class="one_img" v-show="!show_3" src="../../assets/wenjianjia.png" alt="">
          <span class="title_text">用户管理</span>
        </template>
        <el-menu-item index="3-1">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'userslistLink'}">用户信息</router-link>
          </template>
        </el-menu-item>
        <el-menu-item index="3-2">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'userblacklistLink'}">用户黑名单</router-link>
          </template>
        </el-menu-item>
        <el-menu-item index="3-3">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'carwhitelistLink'}">车辆白名单</router-link>
          </template>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <img class="one_img" v-show="show_4" src="../../assets/wenjianjia_1.png" alt="">
          <img class="one_img" v-show="!show_4" src="../../assets/wenjianjia.png" alt="">
          <span class="title_text">配置管理</span>
        </template>
        <el-menu-item index="4-1">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'chargingrulesLink'}">收费管理</router-link>
          </template>
        </el-menu-item>
        <el-menu-item index="4-2">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'parkmanaLink'}">泊位管理</router-link>
          </template>
        </el-menu-item>
        <el-menu-item index="4-3">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'garagemanaLink'}">车库管理</router-link>
          </template>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <img class="one_img" v-show="show_5" src="../../assets/wenjianjia_1.png" alt="">
          <img class="one_img" v-show="!show_5" src="../../assets/wenjianjia.png" alt="">
          <span class="title_text">月卡管理</span>
        </template>
        <el-menu-item index="5-1">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'userpreferenLink'}">月卡用户</router-link>
          </template>
        </el-menu-item>
        <el-menu-item index="5-2">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'addpreferenLink'}">月卡配置</router-link>
          </template>
        </el-menu-item>
        <el-menu-item index="5-3">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'setpreferenLink'}">月卡类型配置</router-link>
          </template>
        </el-menu-item>
        <el-menu-item index="5-4">
          <template slot="title">
            <img src="../../assets/wenjian.png" alt="">
            <router-link tag="li" class="twomenu" :to="{name:'numpreferenLink'}">月卡名额配置</router-link>
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
  data() {
    return {
      show_1:true,
      show_2:true,
      show_3:true,
      show_4:true,
      show_5:true
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      if(key == 1){
        this.show_1 = false
      }else if(key == 2){
        this.show_2 = false
      }else if(key == 3){
        this.show_3 = false
      }else if(key == 4){
        this.show_4 = false
      }else{
        this.show_5 = false
      }
    },
    handleClose(key, keyPath) {
      if(key == 1){
        this.show_1 = true
      }else if(key == 2){
        this.show_2 = true
      }else if(key == 3){
        this.show_3 = true
      }else if(key == 4){
        this.show_4 = true
      }else{
        this.show_5 = true
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
  height: 904px;
  background: #f5f5f5
}
.leftmenu{
  float: left;
  width: 200px;
  height: 100%;
  color: #fff;
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
