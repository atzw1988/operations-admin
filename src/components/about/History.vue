<template>
  <div class="content">
    <div class="region">
      <select class="regionslt">
        <option value="">--请选择--</option>
        <option v-for="item in region_list">{{item}}</option>

      </select>
      <span class="regionText">区域</span>
    </div>
    <div class="area">
      <select class="areaslt">
        <option value="">--请选择--</option>
        <option v-for="item in area_list">{{item.parking_name}}</option>
      </select>
      <span class="areaText">片区</span>
    </div>
    <div class="search">
      <input type="text" v-model="parkname" placeholder="请输入路段名称">
      <button @click="search" class="btn" style="background:rgb(57, 102, 252);">搜索</button>
    </div>
    <div class="detail">
      <div class="deheader">
        <span>泊位数据列表</span>
        <span class="text">共有<a href="javascript:void(0)">{{roadnum}}</a>条结果</span>
      </div>
      <ul>
        <li v-for="road in roads" :key="road.parking_name">
          <h6 v-on:click='toroad(road)'>{{road.parking_name}}</h6>
          <span>泊位数量：剩余{{road.kyCount}}个，总共{{road.maxCount}}个</span>
        </li>
      </ul>
      <div class="button">
        <span>{{pageindex}}/{{allps}}</span>
        <button @click="back" class="back"  style="background:rgb(57, 102, 252);">下一页</button>
        <button @click="forward" class="forward">上一页</button>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import axios from 'axios';
export default {
  data() {
    return {
      region_list:['嵊州市','新昌县','诸暨市','上虞区','柯桥区','越城区'],
      area_list:[],
      roads: [],
      pageindex: '1',
      allps: '1',
      roadnum: '0',
      ps: 7,
      parkname:'',
      url_park:'/its/operations/query/berth'
    }
  },
  mounted() {
    this.getparks()
    this.get_all_parks()
  },
  methods: {
    get_all_parks(){
      axios({
        method: 'post',
        url:this.url_park,
        headers:{
          'content-type':'application/x-www-form-urlencoded'
        },
        data: {}
      }).then(res => {
        this.area_list = res.data.data
      })
    },
    getparks(){
      let params = new URLSearchParams();
      params.append('pageIndex', this.pageindex);
      params.append('ps', this.ps);
      axios({
        method: 'post',
        url:this.url_park,
        headers:{
          'content-type':'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        this.roads = res.data.data.data
        this.pageindex = res.data.data.pc
        this.allps = res.data.data.tp
        this.roadnum = res.data.data.tr
      })
    },
    toroad(e){
      window.localStorage.setItem('parkname', e.parking_name)
      window.localStorage.setItem('parkno', e.parking_weiyi_no)
      this.$router.push({name: 'parksLink'})
    },
    search(){
      console.log(this.parkname)
      let params = new URLSearchParams();
      params.append('roadName', this.parkname);
      params.append('pageIndex', this.pageindex);
      params.append('ps', this.ps);
      axios({
        method: 'post',
        url:this.url_park,
        headers:{
          'content-type':'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        this.roads = res.data.data.data
        this.pageindex = res.data.data.pc
        this.allps = res.data.data.tp
        this.roadnum = res.data.data.tr
      })
    },
    forward(){
      if(this.pageindex == 1){
        alert('已经是第一页了')
      }else{
        this.pageindex --
        let params = new URLSearchParams();
        params.append('roadName', this.parkname);
        params.append('pageIndex', this.pageindex);
        params.append('ps', this.ps);
        axios({
          method: 'post',
          url:this.url_park,
          headers:{
            'content-type':'application/x-www-form-urlencoded'
          },
          data: params
        }).then(res => {
          this.roads = res.data.data.data
          this.pageindex = res.data.data.pc
          this.allps = res.data.data.tp
        })
      }
    },
    back(){
      if(this.pageindex == this.allps){
        alert('已经是最后一页了')
      }else{
        this.pageindex ++
        let params = new URLSearchParams();
        params.append('roadName', this.parkname);
        params.append('pageIndex', this.pageindex);
        params.append('ps', this.ps);
        axios({
          method: 'post',
          url:this.url_park,
          headers:{
            'content-type':'application/x-www-form-urlencoded'
          },
          data: params
        }).then(res => {
          this.roads = res.data.data.data
          this.pageindex = res.data.data.pc
          this.allps = res.data.data.tp
        })
      }
    }
  },
}
</script>
<style scoped>
.region,.area,.search{
  width: 80%;
  /* border: 1px solid black; */
  margin: 40px auto 0;
  height: 30px;
}
select{
  width: 80%;
  /* margin-left: 5%; */
}
.search>input,button{
  /* display: inline-block; */
  float: left;
}
.search>input{
  height: 100%;
  width: 70%;
  border: 1px solid #013254;
  border-radius: 5px;
  padding-left: 10px;
}
.btn{
  height: 100%;
  margin-left: 3%;
  line-height: 10px;
}
.detail{
  width: 80%;
  height: 520px;
  margin: 40px auto 0;
  /* border: 1px solid rgb(194, 194, 194); */
}
.deheader{
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 13px;
  margin-left: 10px;
}
.text{
  margin-left: 45px;
}
.text>a{
  font-size: 15px;
  font-weight: 700;
  color: rgb(235, 105, 58);
}
.detail>ul{
  padding: 0;
}
.detail>ul>li{
  list-style: none;
}
.detail>ul>li>h6{
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 0 15px;
  cursor: pointer;
}
.detail>ul>li>span{
  font-size: 13px;
  display: block;
  margin: 5px 0 20px 30px;
}
.button>span,button{
  display: inline-block;
  border: 0;
}
.button>span{
  margin-left: 20px;
  font-weight: 500;
}
.button>button{
  width: 60px;
  height: 25px;
  float: right;
  margin-right: 10px;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
}
.areaslt,.regionslt{
  width: 80%;
  height: 30px;
  border: 1px solid #013254;
  border-radius: 5px;
}
</style>
