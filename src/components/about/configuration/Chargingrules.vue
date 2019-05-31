<template>
  <div id="row">
    <div class="header">
      <ul>
        <li>
          <router-link tag='span' :to="{name:'rulesLink'}" :class="{active:this.$route.name === 'rulesLink'}">收费规则</router-link>
        </li>
        <li>
          <router-link tag='span' :to="{name:'standardLink'}" :class="{active:this.$route.name === 'standardLink'}">收费标准</router-link>
        </li>
        <li>
          <router-link tag='span' :to="{name:'environmentalLink'}" :class="{active:this.$route.name === 'environmentalLink'}">环保规则</router-link>
        </li>
      </ul>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
export default {
  data(){
    return{

    }
  },
  mounted() {

  },
}
</script>
<style scoped>
#row{
  width: 100%;
  height: 100%;
}
.header{
  width: 100%;
  height: 50px;
}
.header>ul>li{
  width: 150px;
  height: 48px;
  border: 1px solid rgb(126, 126, 126);
  float: left;
  font-size: 20px;
  text-align: center;
  line-height: 48px;
  cursor: pointer;
  margin-right: 5px;
}
.header>ul>li>span{
  font-weight: 600;
  display: block;
  width: 100%;
  height: 100%;
}
.active{
  background: rgb(126, 126, 126) !important;
  box-shadow: 2px 2px 2px rgb(126, 126, 126);
}
.content{
  width: 100%;
  height: calc(100% - 50px);
}
</style>

