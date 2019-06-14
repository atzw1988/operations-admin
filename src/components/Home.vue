<template>
<!-- 实况主页面 -->
  <div class="row">
    <!-- 今日明细 -->
    <div id="home" class="col-sm-12 text-center detail">
      <div id="liveText" class="liveText">
        <span>智慧停车实时监控中心</span>
      </div>
      <div id="liveDetail" class="liveDetail">
        <ul>
          <li>
            <div class="div1"><img src="../assets/dingdan.png" alt=""></div>
            <div>
              <span class="order">今日总订单</span>
              <span class="ordertext">{{order}}</span><span class="unit">单</span>
            </div>
            <span class="ordermore">
              <router-link tag="a" :to="{name:'orderLink'}">更多></router-link>
            </span>
          </li>
          <li>
            <div class="div2"><img src="../assets/jine.png" alt=""></div>
            <div>
              <span class="income">今日总收入</span>
              <span class="incometext">{{income}}</span><span class="unit">元</span>
            </div>
            <span class="incomemore">
              <router-link tag="a" :to="{name:'operatingLink'}">更多></router-link>
            </span>
          </li>
          <li>
            <div class="div3"><img src="../assets/yonghu.png" alt=""></div>
            <div>
              <span class="user">今日注册用户数</span>
              <span class="usertext">{{user}}</span><span class="unit">人</span>
            </div>
            <span class="usermore">
              <router-link tag="a" :to="{name:'usersLink'}">更多></router-link>
            </span>
          </li>
        </ul>
      </div>
      <!-- 地图 -->
      <div id="map" class="map">
        <img src="../assets/bj-1.png" alt="" class="bj-1">
        <img src="../assets/bj-2.png" alt="" class="bj-2">
        <img src="../assets/bj-3.png" alt="" class="bj-3">
        <img src="../assets/bj-4.png" alt="" class="bj-4">
        <div id="mymap"></div>
      </div>
      <!-- 车位详情 -->
      <div class="details">
        <img src="../assets/bj-1.png" alt="" class="bj-1">
        <img src="../assets/bj-2.png" alt="" class="bj-2">
        <img src="../assets/bj-3.png" alt="" class="bj-3">
        <img src="../assets/bj-4.png" alt="" class="bj-4">
        <ul>
          <li>
            <div>
              <span class="chewei"><img style="width:60px;height:60px;margin-bottom:-10px" src="../assets/p.png" alt=""></span>
              <span>泊位停车</span>
            </div>
            <span class="sp">当前路边空泊位数/总泊位数</span>
            <span class="freesp">{{freesp}}</span>/<span class="allsp">{{allsp}}</span>
          </li>
          <li>
            <div>
              <img style="margin-bottom:10px" src="../assets/chewei.png" alt="">
              <span>车库停车</span>
            </div>
            <span class="lp">当前车库空车位数/总车位数</span>
            <span class="freelp">{{freelp}}</span>/<span class="alllp">{{alllp}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import axios from 'axios';
import $ from 'jquery';
import shenzhenJSON from '../components/datas/newshenzhen.json';
import shaoxingJSON from '../components/datas/shaoxing.json'
  export default{
    data() {
      return {
        freesp: '0',  //空余路内停车位
        allsp: '0',  //总路内停车位
        freelp: '0',  //空余路外停车位
        alllp: '0',    //总路外停车位
        order: '0',   //订单量
        income: '0',   //订单金额
        user: '0',   //注册用户数
        mapdata: [
          {name:'嵊州市',value:[120.766909,29.613277,0]},
          {name:'新昌县',value:[120.907412,29.467813,0]},
          {name:'诸暨市',value:[120.218340,29.737768,0]},
          {name:'上虞区',value:[120.874507,30.03349,0]},
          {name:'柯桥区',value:[120.4518,30.076753,0]},
          {name:'越城区',value:[120.590445,29.997687,0]}
        ],
        timer_home:null,
        socket: new WebSocket("ws://www.lcgxlm.com:13259/its/websocket"),
        // socket: new WebSocket("ws://192.168.1.104:13259/its/websocket"),
        url:'/its/operations/live/amount',
        // url:'/its/operations/live/amount'
      }
    },
    beforeCreate() {
      if(window.localStorage.getItem('token')){
        this.isLogin = true
      }else{
        alert('请先登录！')
      }
    },
    beforeMount() {
      //首页实时通讯
      let that = this
      this.socket.onopen = function() {
				console.log("Socket 已打开");
			};
      // 获得消息事件
			this.socket.onmessage = function(msg) {
        axios({
          method: 'post',
          url:that.url,
          headers:{
          'content-type':'application/x-www-form-urlencoded'
          },
          data:{
          }
        }).then(res => {
          that.income = res.data.data.amount
          that.user = res.data.data.total_revenue
          that.order = res.data.data.total_order
          that.freesp = res.data.data.usable
          that.allsp = res.data.data.parkTotal
          that.freelp = res.data.data.outerUsable
          that.alllp = res.data.data.outerParkTotal
          that.mapdata[0].value[2] = res.data.data.parkTotal
        })
			};
			//发生了错误事件
			this.socket.onerror = function() {
				console.log("Socket发生了错误");
			}
    },
    mounted() {
      // this.timer_home = setInterval(() => {
      //   axios({
      //     method: 'post',
      //     url:'/its/operations/live/amount',
      //     headers:{
      //     'content-type':'application/x-www-form-urlencoded'
      //     },
      //     data:{
      //     }
      //   }).then(res => {
      //     console.log(res)
      //     this.income = res.data.data.amount
      //     this.user = res.data.data.total_revenue
      //     this.order = res.data.data.total_order
      //     this.freesp = res.data.data.usable
      //     this.allsp = res.data.data.parkTotal
      //     this.freelp = res.data.data.outerUsable
      //     this.alllp = res.data.data.outerParkTotal
      //     this.mapdata[0].value[2] = res.data.data.parkTotal
      //   })
      // }, 500);
      let that = this
      axios({
        method: 'post',
        url:that.url,
        headers:{
        'content-type':'application/x-www-form-urlencoded'
        },
        data:{
        }
      }).then(res => {
        console.log(res)
        that.income = res.data.data.amount
        that.user = res.data.data.total_revenue
        that.order = res.data.data.total_order
        that.freesp = res.data.data.usable
        that.allsp = res.data.data.parkTotal
        that.freelp = res.data.data.outerUsable
        that.alllp = res.data.data.outerParkTotal
        that.mapdata[0].value[2] = res.data.data.parkTotal
        that.map();
      })
    },
    beforeDestroy(){
      this.socket.close()
      this.socket.onclose = function() {
				console.log("Socket已关闭");
      };
      // clearInterval(this.timer_home)
    },
    methods:{
      goToMenu(){
        this.$router.push({name:'menuLink'})
      },
      //地图
      map(){
        // $.get('../assets/json/newshenzhen.json',function(shenzhenJson){
        //   console.log(shenzhenJson)

        // })
        let that = this
        echarts.registerMap('shenzhen', shaoxingJSON);
          var mapChart = echarts.init(document.getElementById('mymap'));
          // var geoCoordMap = {
          //   '嵊州市':[120.766909,29.613277],
          //   '新昌县':[120.907412,29.467813],
          //   '诸暨市':[120.218340,29.737768],
          //   '上虞区':[120.874507,30.03349],
          //   '柯桥区':[120.4518,30.076753],
          //   '越城区':[120.590445,29.997687]
          // };
          // var data = [
          //   {name: '嵊州市', value: 452},
          //   {name: '新昌县', value: 0},
          //   {name: '诸暨市', value: 0},
          //   {name: '上虞区', value: 0},
          //   {name: '柯桥区', value: 0},
          //   {name: '越城区', value: 0},
          // ];
          var max = 480, min = 9; // todo
          var maxSize4Pin = 40, minSize4Pin = 20;
          // var convertData = function (data) {
          //   var res = [];
          //   for (var i = 0; i < data.length; i++) {
          //     var geoCoord = geoCoordMap[data[i].name];
          //     if (geoCoord) {
          //       res.push({
          //         name: data[i].name,
          //         value: geoCoord.concat(data[i].value)
          //       });
          //     }
          //   }
          //   return res;
          // };
          mapChart.setOption({
            backgroundColor: 'rgb(15, 24, 48)',
            title: {
              text: '',
              subtext: '',
              x: 'center',
              textStyle: {
                color: '#ccc'
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                if(typeof(params.data.value)[2] == "undefined"){
                  return params.name + ' : ' + 0;
                }else{
                  return params.name + ' : ' + params.data.value[2];
                }
              }
            },
            legend: {
              orient: 'vertical',
              y: 'bottom',
              x: 'right',
              data: ['车位数量'],
              textStyle: {
                  color: '#fff'
              }
            },
            visualMap: {
              show: false,
              min: 0,
              max: 500,
              left: 'left',
              top: 'bottom',
              text: ['高', '低'], // 文本，默认为数值文本
              calculable: true,
              seriesIndex: [1],
              inRange: {
                color: ['#0f0c29', '#302b63', '#24243e']
              }
            },
            geo: {
              show: true,
              map: 'shenzhen',
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false,
                }
              },
              roam: true,
              itemStyle: {
                normal: {
                  areaColor: '#031525',
                  borderColor: '#3B5077',
                },
                emphasis: {
                  areaColor: '#2B91B7',
                }
              }
            },
            series: [
              {
                name: 'credit_pm2.5',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: that.mapdata,
                symbolSize: function (val) {
                    return val[2] / 40;
                },
                label: {
                  normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                  },
                  emphasis: {
                    show: true
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#05C3F9'
                  }
                }
              },
              {
                type: 'map',
                map: 'jiangxi',
                geoIndex: 0,
                aspectScale: 0.75, //长宽比
                showLegendSymbol: false, // 存在legend时显示
                label: {
                  normal: {
                    show: false
                  },
                  emphasis: {
                    show: false,
                    textStyle: {
                      color: '#fff'
                    }
                  }
                },
                roam: true,
                itemStyle: {
                  normal: {
                    areaColor: '#031525',
                    borderColor: '#3B5077',
                  },
                  emphasis: {
                    areaColor: '#2B91B7'
                  }
                },
                animation: false,
                data: that.mapdata
              },
              {
                name: '点',
                type: 'scatter',
                coordinateSystem: 'geo',
                symbol: 'pin',
                symbolSize: function (val) {
                  var a = (maxSize4Pin - minSize4Pin) / (max - min);
                  var b = minSize4Pin - a*min;
                  b = maxSize4Pin - a*max;
                  return a*val[2]+b;
                },
                label: {
                  normal: {
                    show: true,
                    textStyle: {
                      color: '#fff',
                      fontSize: 9,
                    },
                    formatter:function(params){
                      return params.value[2];
                    }
                  }
                },
                tooltip: {
                  trigger: 'item',
                  formatter: function (params) {
                    return params.name + ' : ' + params.value[2];
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#F62157', //标志颜色
                  }
                },
                zlevel: 6,
                data: that.mapdata,
              },
              {
                name: 'Top 5',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: that.mapdata.slice(0, 5),
                symbolSize: function (val) {
                  return val[2] / 40;
                },
                showEffectOn: 'render',
                rippleEffect: {
                  brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                  normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#05C3F9',
                    shadowBlur: 10,
                    shadowColor: '#05C3F9'
                  }
                },
                zlevel: 1
              }
            ]
          })
          window.addEventListener("resize",function(){
            mapChart.resize();
          });
      }
    }
  }
</script>

<style scoped>
#home{
  width: 100%;
  height: 904px;
  padding: 0;
  background: rgb(15, 24, 48);
  overflow-x: hidden;
}
.liveText{
  margin-top: 40px;
}
.liveText>span{
  color: #fff;
  font-size: 30px;
}
@media screen and (min-width:1526px){
  .liveDetail{
    width: 98%;
    height: 200px;
    margin: 40px auto 0;
    color: #fff;
    background: -webkit-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Firefox 3.6 - 15 */
    background: linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c );
  }
  .liveDetail>ul{
    padding: 0;
    width: 100%;
    height: 200px;
    margin: 0;
  }
  .liveDetail>ul>li{
    display: inline-block;
    width: 32%;
    height: 200px;
    border-right: 2px solid #0b3247;
    /* margin: 0 40px; */
  }
  .liveDetail>ul>li>div{
    height: 200px;
    border-radius: 10px;
    float: left;
  }
  .liveDetail>ul>li>div>img{
    width: 140px;
    height: 140px;
    margin: 30px 0 0 60px;
  }
  .liveDetail>ul>li>span{
    /* display: inline-block; */
    margin: 10px auto;
  }
  span{
    font-size: 13px;
  }
  .map{
    width: 60%;
    height: 500px;
    position: relative;
    margin-left: 20px;
    margin-top: 40px;
    border: 2px solid #013254;
    float: left;
  }
  .income,.order,.user{
    display: block;
    font-size: 20px;
    text-align: left;
    margin-left: 20px;
    margin-top: 60px;
  }
  .unit{
    display: inline-block;
    color: #16adf8;
    font-size: 16px;
  }
  .ordertext,.incometext,.usertext{
    display: inline-block;
    color: #16adf8;
    font-size: 40px;
    margin-left: 20px;
    margin-top: 20px;
    /* line-height: 300px; */
  }
  .ordermore,.incomemore,.usermore{
    color: #0064a2;
    float: right;
    font-size: 16px;
    margin-right: 40px;
    margin-top: 40px;
  }
  .details{
    width: 35%;
    height: 500px;
    border: 2px solid #013254;
    float: left;
    margin-top: 40px;
    margin-left: 3%;
    position: relative;
  }
  .details>ul>li{
    border: 2px solid #15345c;
    height: 200px;
    width: 95%;
    margin: 33px auto 0;
    color: #fff;
    font-size: 40px;
    list-style: none;
    background: -webkit-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Firefox 3.6 - 15 */
    background: linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c );
  }
  .details>ul>li>div{
    width: 198px;
    height: 198px;
    border-radius: 50%;
    border: 1px solid #0d9cfd;
    /* margin-top: 23px; */
    color: #fff;
    float: left;
  }
  .details>ul>li>div>img{
    display: block;
    width: 50px;
    height: 50px;
    margin: 50px auto 0;
  }
  .details>ul>li>div>span{
    display: block;
    font-size: 20px;
  }
  .chewei{
    font-size: 40px !important;
    font-weight: 700;
    margin-top: 60px;
    margin-bottom: 10px;
  }
  .details>ul>li>span{
    color: #fff;
  }
  .sp,.lp{
    font-size: 18px;
    color: #0d9cfd !important;
    display: block;
    margin-top: 3%;
    margin-bottom: 10%;
  }
  .freesp,.allsp,.freelp,.alllp{
    color: #0d9cfd !important;
    font-size: 50px;
  }
  #mymap{
    width: 100%;
    height: 100%;
  }
  .bj-1,.bj-2,.bj-3,.bj-4{
  position: absolute;
  }
  .bj-1{
    left: -2px;
    top: -2px;
  }
  .bj-2{
    right: -2px;
    top: -2px;
  }
  .bj-3{
    right: -2px;
    bottom: -2px;
  }
  .bj-4{
    left: -2px;
    bottom: -2px;
  }
}
@media screen and (max-width:1525px) and (min-width:1100px){
  .liveDetail{
    width: 98%;
    height: 150px;
    margin: 40px auto 0;
    color: #fff;
    background: -webkit-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Firefox 3.6 - 15 */
    background: linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c );
  }
  .liveDetail>ul{
    padding: 0;
    width: 100%;
    height: 150px;
    margin: 0;
  }
  .liveDetail>ul>li{
    display: inline-block;
    width: 32%;
    height: 150px;
    border-right: 2px solid #0b3247;
    /* margin: 0 40px; */
  }
  .liveDetail>ul>li>div{
    height: 150px;
    border-radius: 10px;
    float: left;
  }
  .liveDetail>ul>li>div>img{
    width: 100px;
    height: 100px;
    margin: 25px 0 0 10px;
  }
  .liveDetail>ul>li>span{
    margin: 10px auto;
  }

  span{
    font-size: 13px;
  }
  .income,.order,.user{
    display: block;
    font-size: 16px;
    text-align: left;
    margin-left: 10px;
    margin-top: 30px;
  }
  .unit{
    display: inline-block;
    color: #16adf8;
    font-size: 14px;
  }
  .ordertext,.incometext,.usertext{
    display: inline-block;
    color: #16adf8;
    font-size: 30px;
    margin-left: 10px;
    margin-top: 20px;
    /* line-height: 300px; */
  }
  .ordermore,.incomemore,.usermore{
    color: #0064a2;
    float: right;
    font-size: 12px;
    margin-right: 0;
    margin-top: 40px;
  }
  .map{
    width: 50%;
    height: 500px;
    position: relative;
    margin-left: 20px;
    margin-top: 40px;
    border: 2px solid #013254;
    float: left;
  }
  .details{
    width: 45%;
    height: 500px;
    border: 2px solid #013254;
    float: left;
    margin-top: 40px;
    margin-left: 3%;
    position: relative;
  }
  .details>ul>li{
    border: 2px solid #15345c;
    height: 200px;
    width: 95%;
    margin: 33px auto 0;
    color: #fff;
    font-size: 40px;
    list-style: none;
    background: -webkit-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Firefox 3.6 - 15 */
    background: linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c );
  }
  .details>ul>li>div{
    width: 198px;
    height: 198px;
    border-radius: 50%;
    border: 1px solid #0d9cfd;
    /* margin-top: 23px; */
    color: #fff;
    float: left;
  }
  .details>ul>li>div>img{
    display: block;
    width: 50px;
    height: 50px;
    margin: 50px auto 0;
  }
  .details>ul>li>div>span{
    display: block;
    font-size: 20px;
  }
  .chewei{
    font-size: 40px !important;
    font-weight: 700;
    margin-top: 60px;
    margin-bottom: 10px;
  }
  .details>ul>li>span{
    color: #fff;
  }
  .sp,.lp{
    font-size: 18px;
    color: #0d9cfd !important;
    display: block;
    margin-top: 3%;
    margin-bottom: 10%;
  }
  .freesp,.allsp,.freelp,.alllp{
    color: #0d9cfd !important;
    font-size: 50px;
  }
  #mymap{
    width: 100%;
    height: 100%;
  }
  .bj-1,.bj-2,.bj-3,.bj-4{
  position: absolute;
  }
  .bj-1{
    left: -2px;
    top: -2px;
  }
  .bj-2{
    right: -2px;
    top: -2px;
  }
  .bj-3{
    right: -2px;
    bottom: -2px;
  }
  .bj-4{
    left: -2px;
    bottom: -2px;
  }
}
@media screen and (max-width:1099px) and (min-width:650px) {
  .liveDetail{
    width: 98%;
    height: 100px;
    margin: 40px auto 0;
    color: #fff;
    background: -webkit-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Firefox 3.6 - 15 */
    background: linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c );
  }
  .liveDetail>ul{
    padding: 0;
    width: 100%;
    height: 100px;
    margin: 0;
  }
  .liveDetail>ul>li{
    display: inline-block;
    width: 32%;
    height: 100px;
    border-right: 2px solid #0b3247;
    /* margin: 0 40px; */
  }
  .liveDetail>ul>li>div{
    height: 100px;
    border-radius: 10px;
    float: left;
  }
  .liveDetail>ul>li>div>img{
    width: 100px;
    height: 100px;
    margin: 25px 0 0 10px;
    display: none;
  }
  .liveDetail>ul>li>span{
    margin: 10px auto;
  }

  span{
    font-size: 13px;
  }
  .income,.order,.user{
    display: block;
    font-size: 16px;
    text-align: left;
    margin-left: 10px;
    margin-top: 10px;
  }
  .unit{
    display: inline-block;
    color: #16adf8;
    font-size: 14px;
  }
  .ordertext,.incometext,.usertext{
    display: inline-block;
    color: #16adf8;
    font-size: 30px;
    margin-left: 10px;
    margin-top: 20px;
    /* line-height: 300px; */
  }
  .ordermore,.incomemore,.usermore{
    color: #0064a2;
    float: right;
    font-size: 12px;
    margin-right: 0;
    margin-top: 40px;
  }
  #mymap{
    width: 100%;
    height: 100%;
  }
  .bj-1,.bj-2,.bj-3,.bj-4{
  position: absolute;
  }
  .bj-1{
    left: -2px;
    top: -2px;
  }
  .bj-2{
    right: -2px;
    top: -2px;
  }
  .bj-3{
    right: -2px;
    bottom: -2px;
  }
  .bj-4{
    left: -2px;
    bottom: -2px;
  }
}
@media screen and (max-width:649px) {
  .liveDetail{
    width: 98%;
    height: 100px;
    margin: 40px auto 0;
    color: #fff;
    background: -webkit-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Firefox 3.6 - 15 */
    background: linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c );
  }
  .liveDetail>ul{
    padding: 0;
    width: 100%;
    height: 100px;
    margin: 0;
  }
  .liveDetail>ul>li{
    display: inline-block;
    width: 32%;
    height: 100px;
    border-right: 2px solid #0b3247;
    /* margin: 0 40px; */
  }
  .liveDetail>ul>li>div{
    height: 100px;
    border-radius: 10px;
    float: left;
  }
  .liveDetail>ul>li>div>img{
    width: 100px;
    height: 100px;
    margin: 25px 0 0 10px;
    display: none;
  }
  .liveDetail>ul>li>span{
    margin: 10px auto;
  }

  span{
    font-size: 13px;
  }
  .income,.order,.user{
    display: block;
    font-size: 14px;
    text-align: left;
    margin-left: 10px;
    margin-top: 10px;
  }
  .unit{
    display: inline-block;
    color: #16adf8;
    font-size: 14px;
  }
  .ordertext,.incometext,.usertext{
    display: inline-block;
    color: #16adf8;
    font-size: 20px;
    margin-left: 10px;
    margin-top: 20px;
    /* line-height: 300px; */
  }
  .ordermore,.incomemore,.usermore{
    color: #0064a2;
    float: right;
    font-size: 12px;
    margin-right: 0;
    margin-top: 40px;
  }
}
@media screen and (max-width:1099px) and (min-width:750px) {
  .map{
    width: 100%;
    height: 500px;
    position: relative;
    margin-left: 20px;
    margin-top: 40px;
    border: 2px solid #013254;
    /* float: left; */
  }
  .details{
    width: 100%;
    height: 200px;
    border: 2px solid #15345c;
    /* float: left; */
    margin-top: 40px;
    margin-left: 20px;
    position: relative;
  }
  .details>ul>li{
    border: 2px solid #15345c;
    height: 150px;
    width: 46%;
    margin-top: 25px;
    margin-left: 2%;
    color: #fff;
    font-size: 30px;
    list-style: none;
    float: left;
    background: -webkit-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Firefox 3.6 - 15 */
    background: linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c );
  }
  .details>ul>li>div{
    width: 148px;
    height: 148px;
    border-radius: 50%;
    border: 1px solid #0d9cfd;
    /* margin-top: 23px; */
    color: #fff;
    float: left;
  }
  .details>ul>li>div>img{
    display: block;
    width: 50px;
    height: 50px;
    margin: 30px auto 0;
  }
  .details>ul>li>div>span{
    display: block;
    font-size: 20px;
  }
  .chewei{
    font-size: 40px !important;
    font-weight: 700;
    margin-top: 40px;
    margin-bottom: 10px;
  }
  .details>ul>li>span{
    color: #fff;
  }
  .sp,.lp{
    font-size: 18px;
    color: #0d9cfd !important;
    display: block;
    margin-top: 3%;
    margin-bottom: 10%;
  }
  .freesp,.allsp,.freelp,.alllp{
    color: #0d9cfd !important;
    font-size: 40px;
  }
  #mymap{
    width: 100%;
    height: 100%;
  }
  .bj-1,.bj-2,.bj-3,.bj-4{
  position: absolute;
  }
  .bj-1{
    left: -2px;
    top: -2px;
  }
  .bj-2{
    right: -2px;
    top: -2px;
  }
  .bj-3{
    right: -2px;
    bottom: -2px;
  }
  .bj-4{
    left: -2px;
    bottom: -2px;
  }
}
@media screen and (max-width:749px) {
  .map{
    width: 100%;
    height: 500px;
    position: relative;
    margin-left: 20px;
    margin-top: 40px;
    border: 2px solid #013254;
    /* float: left; */
  }
  .details{
    width: 100%;
    height: 500px;
    border: 1px solid #fff;
    /* float: left; */
    margin-top: 40px;
    margin-left: 20px;
  }
  .details>ul>li{
    border: 2px solid #15345c;
    height: 150px;
    width: 50%;
    margin-top: 10px;
    color: #fff;
    font-size: 30px;
    list-style: none;
    float: left;
    background: -webkit-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c ); /* Firefox 3.6 - 15 */
    background: linear-gradient(#0f3e5c , #0e1c33 , #0f3e5c );
  }
  .details>ul>li>div{
    width: 148px;
    height: 148px;
    border-radius: 50%;
    border: 1px solid #0d9cfd;
    /* margin-top: 23px; */
    color: #fff;
    float: left;
    display: none;
  }
  .details>ul>li>div>img{
    display: block;
    width: 50px;
    height: 50px;
    margin: 30px auto 0;
  }
  .details>ul>li>div>span{
    display: block;
    font-size: 20px;
  }
  .chewei{
    font-size: 40px !important;
    font-weight: 700;
    margin-top: 40px;
    margin-bottom: 10px;
  }
  .details>ul>li>span{
    color: #fff;
  }
  .sp,.lp{
    font-size: 18px;
    color: #0d9cfd !important;
    display: block;
    margin-top: 3%;
    margin-bottom: 10%;
  }
  .freesp,.allsp,.freelp,.alllp{
    color: #0d9cfd !important;
    font-size: 40px;
  }
  .bj-1,.bj-2,.bj-3,.bj-4{
  position: absolute;
  }
  .bj-1{
    left: -2px;
    top: -2px;
  }
  .bj-2{
    right: -2px;
    top: -2px;
  }
  .bj-3{
    right: -2px;
    bottom: -2px;
  }
  .bj-4{
    left: -2px;
    bottom: -2px;
  }
  #mymap{
    width: 100%;
    height: 100%;
  }
}
</style>
