<template>
  <div id="row">
    <div class="header">
      <div class="headertitle">
        <div class="roadname">
          <img src="../assets/tingchechang1.png" alt="">
          <span>{{roadname}}</span>
        </div>
        <div class="parknum">
          <span class="freenum">
            剩<a href="javascript:void(0)">{{freenum}}</a>空车位
          </span>
          <span class="allnum">
            总车位<a href="javascript:void(0)">{{allnum}}</a>个
          </span>
        </div>
        <!-- <div class="title">基础信息</div> -->
        <div class="detail">
          <span>行政区：<a href="javascript:void(0)">{{region}}</a></span>
          <span>片区：<a href="javascript:void(0)">{{area}}</a></span>
          <div @click="back_parklist">返回车位列表</div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="contentheader">泊位展示</div>
      <div class="main">
        <div class="up">
          <span class="upfristnum">{{upfristnum}}</span>
          <span class="upendnum">{{upparks.length}}</span>
          <div class="park upparks">
            <ul class="uppark">
              <li class="parkimg" v-for="uppark in upparks" :key="uppark.parkno">
                <div><div v-if="uppark.status != '0'"></div></div>
                <span>{{uppark.parking_no}} <h5 v-if="uppark.status != '0'">有车</h5><h5 v-if="uppark.status == '0'">无车</h5></span>
                <span class="text">电量：<h6>100%</h6></span>
                <span class="text">电压：<h6>3.6伏</h6></span>
              </li>
            </ul>
          </div>
        </div>
        <div class="road">
          <ul>
            <li class="direction1">南</li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li class="direction2">北</li>
          </ul>
        </div>
        <div class="down">
          <span class="downfristnum">{{downfristnum}}</span>
          <span class="downendnum">{{downparks.length}}</span>
          <div class="park downparks">
            <ul class="downpark">
              <li class="parkimg" v-for="downpark in downparks" :key="downpark.parkno">
                <div><div v-if="downpark.status != '0'"></div></div>
                <span>{{downpark.parking_no}} <h5 v-if="downpark.status != '0'">有车</h5><h5 v-if="downpark.status == '0'">无车</h5></span>
                <span class="text">电量：<h6>100%</h6></span>
                <span class="text">电压：<h6>3.6伏</h6></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios';
export default {
  data() {
    return {
      roadname: '',
      freenum: '28',
      allnum: '44',
      region: '嵊州市',
      area: '嵊州市',
      upfristnum: '1',
      downfristnum: '1',
      upparks: [],
      downparks: [],
      url:'/its/operations/parking/parkNo'
    };
  },
  computed: {

  },
  beforeCreate() {

  },
  created() {

  },
  mounted() {
    this.roadname = window.localStorage.getItem('parkname')
    let parkno = window.localStorage.getItem('parkno')
    let params = new URLSearchParams();
    params.append('parkingNo', parkno);
    axios({
      method: 'post',
      url:this.url,
      headers:{
        'content-type':'application/x-www-form-urlencoded'
      },
      data: params
    }).then(res => {
      console.log(res)
      let num = 0
      let parks = res.data.data
      let len = parks.length
      let a = parks.length/2
      this.allnum = len
      for(var i = 0;i < len; i++){
        if(parks[i].status == 1){
          num ++
        }
        if (i<a) {
          this.upparks.push(parks[i])
        }else{
          this.downparks.push(parks[i])
        }
        this.freenum = len - num
      }
    })
    let that = this
    $(function(){
      $('.upparks').scroll(function(){
        let left = $('.upparks').scrollLeft()
        let width = $('.park').width()
        let num = that.upparks.length*240 - $('.park').width()
        that.upfristnum = Math.ceil(left/(num/(that.upparks.length-(width/240))))
      })
      $('.downparks').scroll(function(){
        let left = $('.downparks').scrollLeft()
        console.log(left)

        let width = $('.park').width()
        console.log(width)
        let num = that.downparks.length*240 - $('.park').width()
        that.downfristnum = Math.ceil(left/(num/(that.downparks.length-(width/240))))
      })
    })
  },
  methods: {
    back_parklist(){
      this.$router.push({name:'adminLink'})
    }
  }
};
</script>
<style scoped>
#row{
  width: 100%;
  height: 904px;
  background: #f5f5f5;
}
.header{
  width: 80%;
  height: 200px;
  margin: 0 auto;
}
.roadname{
  width: 400px;
  height: 50px;
  float: left;
  font-size: 25px;
  color: rgb(77, 76, 76);
  font-weight: 700;
  margin-top: 30px;
}
.roadname>img{
  width: 50px;
  height: 50px;
  float: left;
}
.roadname>span{
  float: left;
  line-height: 50px;
}
.parknum{
  width: 200px;
  height: 100px;
  float: right;
}
.parknum>span{
  display: block;
  width: 80%;
  height: 50px;
  margin: 0 auto;
  text-align: center;
  line-height: 50px;
  font-size: 14px;
}
.parknum .allnum{
  background: #1296db;
  border-radius: 5px;
  color: #fff;
}
.parknum .allnum>a{
  font-size: 25px;
  /* color: #000; */
  text-decoration: none;
  color: #fff;
  font-weight: 600;
  cursor: none;
}
.parknum .freenum>a{
  font-size: 25px;
  text-decoration: none;
  color: rgb(255, 156, 8);
  font-weight: 600;
  cursor: none;
}
.title{
  width: 100px;
  height: 30px;
  float: left;
  background: #1296db;
  margin-top: 70px;
  margin-left: -200px;
  line-height: 30px;
  text-align: center;
}
.detail{
  width: 100%;
  height: 80px;
  float: left;
  margin-top: 20px;
  border-top: 1px solid burlywood;
  border-bottom: 1px solid burlywood;
}
.detail>span{
  line-height: 80px;
  margin-left: 50px;
}
.detail>div{
  float: right;
  height: 40px;
  width: 120px;
  line-height: 40px;
  text-align: center;
  margin-top: 20px;
  margin-right: 10px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  background: #1296db;
  box-shadow: 2px 2px 2px #57c1fa;
}
.content{
  width: 100%;
  height: 553px;
  /* border: 1px solid brown; */
  margin-top: 20px;
}
.contentheader{
  margin-left: 10%;
  width: 100px;
  height: 30px;
  background: #1296db;
  line-height: 30px;
  text-align: center;
}
.main{
  width: 100%;
  height: 510px;
  /* border: 1px solid cyan; */
  margin-top: 10px;
}
.main .up{
  width: 80%;
  height: 205px;
  margin: 0 auto;
  position: relative;
}
.main .road{
  width: 100%;
  height: 100px;
  /* border: 1px solid darkorange; */
}
.main .down{
  width: 80%;
  height: 205px;
  margin: 0 auto;
  position: relative;
}
.park::-webkit-scrollbar {/*滚动条整体样式*/
  width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}
.park::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(252, 149, 14, 0.603);
    background: rgba(252, 149, 14, 0.603);
}
.park::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(226, 216, 216, 0.651);
    border-radius: 0;
    background: rgba(226, 216, 216, 0.651);
}
.park{
  width: 100%;
  height: 100%;
  overflow-x:auto;
  overflow-y:hidden;
  position: relative;
}
.park>ul{
  height: 100%;
  float: left;
  white-space: nowrap;
}
.park,ul,li{
  padding: 0;
}
.park>ul>li{
  list-style: none;
  display: inline-block;
  width: 240px;
  height: 100%;
  text-align: center;
}
.park>ul>li>div{
  width: 200px;
  height: 98px;
  margin: 0 auto;
  background-image: url('../assets/chewei.jpg');
  background-size: 100%;
}
.park>ul>li>div>div{
  width: 70%;
  height: 100%;
  background-image: url('../assets/xinqiche.png');
  background-size: 100%;
  margin: 0 auto;
}
.park>ul>li>span{
  display: block;
  font-size: 20px;
  font-weight: 700;
}
.park>ul>li>.text{
  font-size: 14px;
}
.park>ul>li>span>h5{
  display: inline-block;
  font-size: 16px;
}
.park>ul>li>span>h6{
  display: inline-block;
  font-size: 16px;
  color: green;
}
.upfristnum,.upendnum,.downfristnum,.downendnum{
  position: absolute;
  font-weight: 600;
  color: tomato;
}
.upfristnum,.downfristnum{
  bottom: 10px;
  left: 0;
}
.upendnum,.downendnum{
  bottom: 10px;
  right: 0;
}
.road{
  background: #6d6d6d;
}
.road>ul{
  display: block;
  padding: 0;
  width: 80%;
  height: 100%;
  /* border: 1px solid darkgoldenrod; */
  margin: 0 auto;
}
.road>ul>li{
  list-style: none;
  display: inline-block;
  width: 3.6%;
  height: 10px;
  background: #fff;
  margin: 37px 36px 0 0;
}
.road>ul>.direction1,.road>ul>.direction2{
  width: 25px;
  height: 25px;
  text-align: center;
  line-height: 25px;
  border-radius: 50%;
}
.road>ul>.direction2{
  margin: 37px 0;
}
</style>



