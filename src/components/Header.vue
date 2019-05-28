<template>
  <header>
    <div class="menu">
      <div class="log">
        <img src="../assets/log.png" alt="">
      </div>
      <ul class="menulist">
        <li class="one">
          <router-link :to="{name:'homeLink'}" class="nav-link" :class="{active:this.$route.name === 'homeLink'}">
            <img src="../assets/diqiu.png" alt="" id="headerImg" class="headerImg">
            <span>实况</span>
          </router-link>
        </li>
        <li class="">
          <router-link :to="{name:'analyzeLink'}" class="nav-link" :class="{active:this.$route.name === 'analyzeLink'}">
            <img src="../assets/diqiu.png" alt="" id="headerImg" class="headerImg">
            <span>大屏</span>
          </router-link>
        </li>
        <li class="">
          <router-link :to="{name:'operationsLink'}" class="nav-link" :class="{active:this.$route.name === 'operationsLink'}">
            <img src="../assets/erji-yingyongyunhangbaobiao.png" alt="" id="headerImg" class="headerImg">
            <span>分析</span>
          </router-link>
        </li>
        <li class="">
          <router-link :to="{name:'adminLink'}" class="nav-link" :class="{active:$route.name === 'historyLink'||$route.name === 'parksLink'}">
            <img src="../assets/zaixianjianguan.png" alt="" id="headerImg" class="headerImg">
            <span>监管</span>
          </router-link>
        </li>
        <li class="">
          <router-link :to="{name:'aboutLink'}" class="nav-link" :class="{active:this.$route.path.match(/about/g)}">
            <img src="../assets/baobiao.png" alt="" id="headerImg" class="headerImg">
            <span>报表</span>
          </router-link>
        </li>
        <li class="">
          <router-link :to="{name:'settingLink'}" class="nav-link" :class="{active:this.$route.path.match(/setting/g)}">
            <img src="../assets/shezhi.png" alt="" id="headerImg" class="headerImg">
            <span>设置</span>
          </router-link>
        </li>
      </ul>
      <ul class="right">
        <!-- <li class="login"  v-if="!isLogin"><router-link :to="{name:'loginLink'}" class="nav-link">登录</router-link></li> -->
        <li class="userdet">
          <span>您好！</span>
          <img @click="userinfo" src="../assets/caidan.png" alt="">
        </li>
      </ul>
    </div>
    <div class="userinfo">
      <div class="gomy" style="cursor: pointer" @click="userinfo">
        <router-link tag='span' :to="{name:'usernameLink'}">安全设置</router-link>
      </div>
      <div class="gomy" style="cursor: pointer" @click="userinfo">
        <router-link tag='span' :to="{name:'passwordLink'}">个人设置</router-link>
      </div>
      <div style="cursor: pointer" class="exit" @click="exit">退出</div>
    </div>
  </header>
</template>
<script>
  import $ from 'jquery';
  export default{
    computed: {
      currentUser(){
        return this.$store.getters.currentUser
      },
      isLogin(){
        return this.$store.getters.isLogin
      }
    },
    data() {
      return {
        infoshow:false,
        headerlist: [
          {
            name: '实况',
            isactive: false
          }
        ]
      }
    },
    mounted() {
      console.log(this.$store.getters.isLogin)
      console.log(window.localStorage.getItem('token'))

      // $(
      //   $('.menulist li').click(function(){
      //     if(window.localStorage.getItem('token')){
      //       $(this).addClass('active').siblings().removeClass('active')
      //     }
      //      console.log(this.$route.path)
      //   })
      // )
    },
    methods: {
      userinfo(){
        if(!this.infoshow){
          $('.userinfo').animate({top:65+'px'})
          this.infoshow = !this.infoshow
          setTimeout(() => {
            $('.userinfo').animate({top:-55+'px'})
            this.infoshow = false
          }, 5000);
        }else{
          $('.userinfo').animate({top:-55+'px'})
          this.infoshow = !this.infoshow
        }
      },
      exit(){
        window.localStorage.removeItem('token')
        // this.isLogin = false
        this.$store.dispatch("setUser",null)
        $('.userinfo').animate({top:-55+'px'})
        this.$router.push({name:"loginLink"})
        this.infoshow = !this.infoshow
      },
    },
  }

</script>
<style scoped>
.menu{
  display: block;
  width: 100%;
  height: 65px;
  background: rgb(1, 2, 3);
  position: relative;
  z-index: 10000;
}
.userinfo{
  position: absolute;
  width: 150px;
  right: 0;
  top: -55px;
  z-index: 9999;
  color: #fff;
}
.gomy,.exit{
  background: rgb(1, 2, 3);
  height: 40px;
  text-align: center;
  color: #fff;
  line-height: 40px;
}
.menulist{
  height: 100%;
  float: left;
}
.right{
  width: 140px;
  height: 65px;
  float: right;
  color: #fff;
  line-height: 65px;
}
.right>li{
  float: left;
  width: 100%;
  height: 100%
}
.headrtext{
  display: block;
  margin: 0 auto;
}
.headrtext>a{
  color: #fff;
}
.navbar{
  background: rgb(1, 2, 3);
}
.log{
  width: 200px;
  height: 100%;
  float: left;
  margin: 0 20px;
}
.log>img{
  width: 65px;
  height: 65px;
  margin-left: 80px;
}
.active{
  background: rgb(13, 75, 247);
}
.userdet>span{
  float: left;
}
.userdet>img{
  width: 30px;
  height: 30px;
  float: left;
  margin-top: 17.5px;
  cursor: pointer;
}
@media screen and (min-width: 1400px) {
  .headerImg{
    width: 30px;
    height: 30px;
    margin-top: 17.5px;
    float: left;
    margin-left: 35px;
  }
  .menulist>li{
    width:150px;
    height: 100%;
    float: left;
  }
  .nav-link{
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
  .nav-link span{
    display: block;
    font-size: 16px;
    color: #fff;
    float: left;
    line-height: 65px;
    margin-left: 10px;
  }
}
@media screen and (max-width: 1399px) {
  .headerImg{
    width: 30px;
    height: 30px;
    margin-top: 17.5px;
    float: left;
    margin-left: 35px;
    display: none;
  }
  .menulist>li{
    width:80px;
    height: 100%;
    float: left;
  }
  .nav-link{
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
  .nav-link span{
    display: block;
    font-size: 16px;
    color: #fff;
    float: left;
    line-height: 65px;
    margin-left: 25px;
  }
}
</style>
