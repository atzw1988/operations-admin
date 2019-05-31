<template>
  <div class="row">
    <div class="opera">
      <div class="header">
        <div class="headertext">
          <span>区域内违停与空泊位对比分析</span>
        </div>
        <div class="input">
          <div class="block" >
            <el-date-picker
              v-model="time_interval"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <select name="distance" id="distance">
            <option value="两公里内">两公里内</option>
          </select>
        </div>
      </div>
      <div class="content">
        <div class="left">
          <img src="../assets/bj-1.png" alt="" class="bj-1">
          <img src="../assets/bj-2.png" alt="" class="bj-2">
          <img src="../assets/bj-3.png" alt="" class="bj-3">
          <img src="../assets/bj-4.png" alt="" class="bj-4">
          <!-- <baidu-map id="map" class="map" ref="map"  @ready='getLocation' >
          </baidu-map> -->
          <div v-if="detail_show" class="del_content">
            <div class="del_up">
              <span class="close" @click="close">X</span>
              <span>停车场信息</span>
              <div>
                <ul>
                  <li style="background: #bbd4e7;border-top-right-radius: 10px;border-top-left-radius: 10px">
                    <span style="width:40px">序号</span>
                    <span style="width:240px">停车场名称</span>
                    <span style="width:70px">总泊位数</span>
                    <span style="width:70px">剩余泊位数</span>
                  </li>
                  <li style="border-top:1px solid #bbd4e7" v-for="(park,index) in park_list" :key="index">
                    <span style="width:40px">{{index+1}}</span>
                    <span style="width:240px">{{park[2].name}}</span>
                    <span style="width:70px">{{park[2].maxCount}}</span>
                    <span style="width:70px">{{park[2].kyCount}}</span>
                  </li>
                </ul>
              </div>
            </div>
            <!-- <div class="del_down">
              <span>违停信息</span>
              <div>
                <ul>
                  <li style="background: #bbd4e7;border-top-right-radius: 10px;border-top-left-radius: 10px">
                    <span style="width:40px">序号</span>
                    <span style="width:300px">违停停车场名称</span>
                    <span style="width:80px">违停车辆数</span>
                  </li>
                  <li style="border-top:1px solid #bbd4e7" v-for="(vol,index) in vol_list" :key="index">
                    <span style="width:40px">{{index+1}}</span>
                    <span style="width:300px">{{vol.name}}</span>
                    <span style="width:80px">{{vol.num}}</span>
                  </li>
                </ul>
              </div>
            </div> -->
          </div>
          <div class="map" id="map">
          </div>
        </div>
        <div class="right">
          <div class="rtop">
            <img src="../assets/bj-1.png" alt="" class="bj-1">
            <img src="../assets/bj-2.png" alt="" class="bj-2">
            <img src="../assets/bj-3.png" alt="" class="bj-3">
            <img src="../assets/bj-4.png" alt="" class="bj-4">
            <span>多泊位低负荷停车场</span>
            <div id="high"></div>
          </div>
          <div class="rdown">
            <img src="../assets/bj-1.png" alt="" class="bj-1">
            <img src="../assets/bj-2.png" alt="" class="bj-2">
            <img src="../assets/bj-3.png" alt="" class="bj-3">
            <img src="../assets/bj-4.png" alt="" class="bj-4">
            <span>少泊位高负荷停车场</span>
            <div id="low"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import axios from 'axios';
import echarts from "echarts";
export default {
  data() {
    return {
      time_interval: '',
      count: 0,
      isLoading: false,
      highcircle: [],
      highval: [],
      lowcircle: [],
      lowval: [],
      data:[],
      data_new:[],
      detail_show: false,
      park_list:[],
      vol_list:[
        {name:'停车场1',num:10},
        {name:'停车场2',num:10},
        {name:'停车场3',num:10},
        {name:'停车场4',num:10},
        {name:'停车场5',num:10}
      ],
      url_high:'/its/admin/area/highAnalyze',
      // url_high:'/its/admin/area/highAnalyze',
      url_low:'/its/admin/area/lowAnalyze',
      // url_low:'/its/admin/area/lowAnalyze',
      url_park: '/its/admin/query/berth'
    }
  },
  mounted() {
    this.get_high()
    this.get_low()
    this.getparks()
  },
  methods:{
    get_high(){
      axios({
        method: 'post',
        url: this.url_high,
        headers:{
        'Authorization':'Web 123213213',
        'content-type':'application/x-www-form-urlencoded'
        },
        data:{}
      }).then(res => {
        let data = res.data.data
        data.sort((a,b) => {
          return a.loads - b.loads
        })
        this.highcircle = res.data.data.map(element => {
          return element.parking_name
        });
        this.highval = res.data.data.map(element => {
          if(element.loads){
            return element.loads
          }else{
            return 0
          }
        })
        this.drawhigh();
      })
    },
    get_low(){
      axios({
        method: 'post',
        url: this.url_low,
        headers:{
        'Authorization':'Web 123213213',
        'content-type':'application/x-www-form-urlencoded'
        },
        data:{}
      }).then(res => {
        this.lowcircle = res.data.data.sort(function(a,b){
          return b.loads - a.loads
        }).map(element => {
          return element.parking_name
        });
        this.lowval = res.data.data.sort(function(a,b){
          return b.loads - a.loads
        }).map(element => {
          if(element.loads){
            return element.loads
          }else{
            return 0
          }
        });
        this.drawlow();
      })
    },
    getparks(){
      axios({
        method: 'post',
        url:this.url_park,
        headers:{
          'Authorization':'Web 123213213',
          'content-type':'application/x-www-form-urlencoded'
        },
        data: {}
      }).then(res => {
        let park = res.data.data
        //高德坐标转百度坐标
        let x_PI = 3.14159265358979324 * 3000.0 / 180.0;
        park.map(function (item) {
          let z = Math.sqrt(item.longitude * item.longitude + item.latitude * item.latitude) + 0.00002 * Math.sin(item.latitude * x_PI);
          let theta = Math.atan2(item.latitude, item.longitude) + 0.000003 * Math.cos(item.longitude * x_PI);
          item.longitude = z * Math.cos(theta) + 0.0065;
          item.latitude = z * Math.sin(theta) + 0.006;
        })
        for(var i =0;i < park.length;i++){
          let color = ''
          let pro = park[i].kyCount/park[i].maxCount
          if(pro==0){
            color = 'rgb(255, 0, 0)'
          }else if(pro>0&&pro<0.3){
            color = 'rgb(0, 153, 255)'
          }else{
            color = 'rgb(0, 255, 34)'
          }
          let arr = [park[i].longitude,park[i].latitude,{name:park[i].parking_name,kyCount:park[i].kyCount,maxCount:park[i].maxCount},color]
          this.data.push(arr)
        }
        this.mymap()
      })
    },
    drawmap(){
      $('#map').removeAttr('_echarts_instance_')
      let that = this
      let myChart = echarts.init(document.getElementById('map'));
      myChart.setOption({
        bmap: {
          center: [120.840358,29.585902],
          zoom: 14,
          roam: true,
          mapStyle: {
            'styleJson':[
              {
                "featureType": "water",
                "elementType": "all",
                "stylers": {
                  "color": "#021019"
                }
              },
              {
                "featureType": "highway",
                "elementType": "geometry.fill",
                "stylers": {
                  "color": "#000000"
                }
              },
              {
                "featureType": "highway",
                "elementType": "geometry.stroke",
                "stylers": {
                  "color": "#147a92"
                }
              },
              {
                "featureType": "arterial",
                "elementType": "geometry.fill",
                "stylers": {
                  "color": "#000000"
                }
              },
              {
                "featureType": "arterial",
                "elementType": "geometry.stroke",
                "stylers": {
                  "color": "#0b3d51"
                }
              },
              {
                "featureType": "local",
                "elementType": "geometry",
                "stylers": {
                  "color": "#000000"
                }
              },
              {
                "featureType": "land",
                "elementType": "all",
                "stylers": {
                  "color": "#08304b"
                }
              },
              {
                "featureType": "railway",
                "elementType": "geometry.fill",
                "stylers": {
                  "color": "#000000"
                }
              },
              {
                "featureType": "railway",
                "elementType": "geometry.stroke",
                "stylers": {
                  "color": "#08304b"
                }
              },
              {
                "featureType": "subway",
                "elementType": "geometry",
                "stylers": {
                  "lightness": -70
                }
              },
              {
                "featureType": "building",
                "elementType": "geometry.fill",
                "stylers": {
                  "color": "#000000"
                }
              },
              {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": {
                  "color": "#857f7f"
                }
              },
              {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": {
                  "color": "#000000"
                }
              },
              {
                "featureType": "building",
                "elementType": "geometry",
                "stylers": {
                  "color": "#022338"
                }
              },
              {
                "featureType": "green",
                "elementType": "geometry",
                "stylers": {
                  "color": "#062032"
                }
              },
              {
                "featureType": "boundary",
                "elementType": "all",
                "stylers": {
                  "color": "#1e1c1c"
                }
              },
              {
                "featureType": "manmade",
                "elementType": "geometry",
                "stylers": {
                  "color": "#022338"
                }
              },
              {
                "featureType": "poi",
                "elementType": "all",
                "stylers": {
                  "visibility": "off"
                }
              },
              {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": {
                  "visibility": "off"
                }
              },
              {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": {
                  "color": "#2da0c6",
                  "visibility": "on"
                }
              }
            ]
          }
        },
        series: [
          {
            name:'点',
            type: 'scatter',
            coordinateSystem: 'bmap',
            symbol: 'pin',
            symbolSize: function(val){
              var a = 0.3
              var b = 20
              return a*val[2].maxCount+b
            },
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#fff',
                  fontSize: 12,
                },
                formatter:function(params){
                  return params.data[2].maxCount;
                }
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                console.log(params)
                // return params.name + ' : ' + params.value[2];
              }
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  return params.data[3]
                },
              }
            },
            zlevel: 6,
            data: this.data
          }
        ]
      });
    },
    drawmapnew(point){
      $('#map').removeAttr('_echarts_instance_')
      let option = {}
      let that = this
      let myChart = echarts.init(document.getElementById('map'));
      myChart.setOption(option,true)
      myChart.setOption({
        bmap: {
          center: [120.840358,29.585902],
          zoom: 14,
          roam: true,
          mapStyle: {
            'styleJson':[
              {
                "featureType": "water",
                "elementType": "all",
                "stylers": {
                  "color": "#021019"
                }
              },
              {
                "featureType": "highway",
                "elementType": "geometry.fill",
                "stylers": {
                  "color": "#000000"
                }
              },
              {
                "featureType": "highway",
                "elementType": "geometry.stroke",
                "stylers": {
                  "color": "#147a92"
                }
              },
              {
                "featureType": "arterial",
                "elementType": "geometry.fill",
                "stylers": {
                  "color": "#000000"
                }
              },
              {
                "featureType": "arterial",
                "elementType": "geometry.stroke",
                "stylers": {
                  "color": "#0b3d51"
                }
              },
              {
                "featureType": "local",
                "elementType": "geometry",
                "stylers": {
                  "color": "#000000"
                }
              },
              {
                "featureType": "land",
                "elementType": "all",
                "stylers": {
                  "color": "#08304b"
                }
              },
              {
                "featureType": "railway",
                "elementType": "geometry.fill",
                "stylers": {
                  "color": "#000000"
                }
              },
              {
                "featureType": "railway",
                "elementType": "geometry.stroke",
                "stylers": {
                  "color": "#08304b"
                }
              },
              {
                "featureType": "subway",
                "elementType": "geometry",
                "stylers": {
                  "lightness": -70
                }
              },
              {
                "featureType": "building",
                "elementType": "geometry.fill",
                "stylers": {
                  "color": "#000000"
                }
              },
              {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": {
                  "color": "#857f7f"
                }
              },
              {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": {
                  "color": "#000000"
                }
              },
              {
                "featureType": "building",
                "elementType": "geometry",
                "stylers": {
                  "color": "#022338"
                }
              },
              {
                "featureType": "green",
                "elementType": "geometry",
                "stylers": {
                  "color": "#062032"
                }
              },
              {
                "featureType": "boundary",
                "elementType": "all",
                "stylers": {
                  "color": "#1e1c1c"
                }
              },
              {
                "featureType": "manmade",
                "elementType": "geometry",
                "stylers": {
                  "color": "#022338"
                }
              },
              {
                "featureType": "poi",
                "elementType": "all",
                "stylers": {
                  "visibility": "off"
                }
              },
              {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": {
                  "visibility": "off"
                }
              },
              {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": {
                  "color": "#2da0c6",
                  "visibility": "on"
                }
              }
            ]
          }
        },
        series: [
          {
            name:'点',
            type: 'scatter',
            coordinateSystem: 'bmap',
            symbol: 'pin',
            symbolSize: function(val){
              var a = 0.3
              var b = 20
              return a*val[2].maxCount+b
            },
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#000',
                  fontSize: 12,
                },
                formatter:function(params){
                  return params.data[2].maxCount;
                }
              }
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  return params.data[3]
                },
              }
            },
            zlevel: 6,
            data: this.data_new
          }
        ]
      });
      var bmap = myChart.getModel().getComponent('bmap').getBMap();
      let circle = new BMap.Circle(point,2000,{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5})
      bmap.addOverlay(circle)
    },
    mymap(){
      this.drawmap()
      let that = this
      let myChart = echarts.init(document.getElementById('map'));
      myChart.on('click',function (params) {
        var bmap = myChart.getModel().getComponent('bmap').getBMap();
        bmap.clearOverlays();
        if(params.componentSubType == "scatter"){
          bmap.addEventListener("click",function(){
            let point = new BMap.Point(params.value[0], params.value[1])
            that.detail_show = true
            that.data_new = that.data.filter(function(item){
              return that.get_dis(params.value[0],params.value[1],item[0],item[1]) < 2
            })
            that.park_list = that.data_new.slice(0,5)
            console.log(that.park_list)
            that.drawmapnew(point)
          })
        }
      })
    },
    //计算两个点距离
    get_dis(lat1,lng1,lat2,lng2){
      let radLat1 = lat1*Math.PI / 180.0
      let radLat2 = lat2*Math.PI / 180.0
      let a = radLat1 - radLat2
      let b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0
      let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
      s = s*6378.137
      return s
    },
    //关闭详情框
    close(){
      this.detail_show = false
      this.mymap()
    },
    drawhigh(){
      let that = this
      let high = this.$echarts.init(document.getElementById('high'))
      high.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          show: false,
        }],
        yAxis: {
          type: 'category',
          data: that.highcircle,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: '',
            type: 'bar',
            yAxisIndex: 0,
            data: that.highval,
            label: {
              normal: {
                show: true,
                position: 'right',
                textStyle: {
                  color: '#ffffff',
                  fontSize: '16',
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#d0570e',
                barBorderRadius: 10,
              }
            }
          }
        ]
      })
      window.addEventListener("resize",function(){
        high.resize();
      });
    },
    drawlow(){
      let that = this
      let low = this.$echarts.init(document.getElementById('low'))
      low.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          show: false,
        }],
        yAxis: {
          type: 'category',
          data: that.lowcircle,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: '',
            type: 'bar',
            yAxisIndex: 0,
            data: that.lowval,
            label: {
              normal: {
                show: true,
                position: 'right',
                textStyle: {
                  color: '#ffffff',
                  fontSize: '16',
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#34da62',
                barBorderRadius: 10,
              }
            }
          }
        ]
      })
      window.addEventListener("resize",function(){
        low.resize();
      });
    }
  }
}
</script>
<style scoped>
.opera{
  width: 100%;
  height: 904px;
  padding: 0;
  background: rgb(0, 19, 39);
  overflow-x: hidden;
  color: #fff;
}
.header{
  width: 90%;
  height: 100px;
  border: 2px solid #013254;
  margin: 20px auto 0;
  border-radius: 10px;
}
.headertext{
  height: 100%;
  float: left;
}

.content{
  width: 90%;
  height: 80%;
  margin: 40px auto 0;
  /* border: 1px solid red; */
}
.left{
  width: 60%;
  height: 100%;
  float: left;
  border: 2px solid #013254;
  position: relative;
}
.map{
  width: 100%;
  height: 100%;
  z-index: 9000;
}
.del_content{
  width: 500px;
  height: 250px;
  background: rgba(255, 255, 255, 0.3);
  z-index: 9001;
  position: absolute;
  border: 2px solid rgba(0, 10, 100, 0.3);
  border-radius: 10px;
  right: 0;
  top: 50%;
  margin-top: -125px;
}
.del_up,.del_down{
  width:500px;
  height:250px;
  position: relative;
}
.close{
  position: absolute;
  right: 10px;
  top: 5px;
}
.del_up>span,.del_down>span{
  margin-left:20px;
  color:#fff
}
.del_up>div,.del_down>div{
  width:450px;
  height:180px;
  background:#cae2f7;
  margin: 20px auto;
  border-radius: 10px;
  font-size: 14px;
  color: #000;
}
.del_up>div>ul>li,.del_down>div>ul>li{
  width:100%;
  height:30px;
  line-height:30px;
}
.del_up>div>ul>li>span,.del_down>div>ul>li>span{
  display:inline-block;
  text-align: center
}
.right{
  width: 38%;
  height: 100%;
  float: right;
}
.rtop{
  width: 100%;
  height: 48%;
  border: 2px solid #013254;
  position: relative;
}
.rtop>span,.rdown>span{
  display: block;
  font-size: 30px;
  font-weight: 700;
  color: #01fbfe;
  margin-top: 10px;
  margin-left: 20px;
}
.rdown{
  width: 100%;
  height: 48%;
  border: 2px solid #013254;
  position: relative;
  margin-top: 4%;
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
#high,#low{
  width: 100%;
  height: 80%;
}
.input>span{
  float: left;
  font-size: 20px;
  line-height: 40px;
  width: 40px;
  height: 40px;
}
@media screen and (min-width: 1400px) {
  .input{
    float: left;
    height: 40px;
    margin-top: 30px;
    margin-left: 20%;
    color: #000;
  }
  .headertext>span{
    font-size: 30px;
    line-height: 100px;
    color: #01fbfe;
    font-weight: 700;
    margin-left: 20px;
  }
}
@media screen and (max-width: 1399px) and (min-width: 1030px) {
  .input{
    float: left;
    height: 40px;
    margin-top: 30px;
    margin-left: 10%;
    color: #000;
  }
  .headertext>span{
    font-size: 20px;
    line-height: 100px;
    color: #01fbfe;
    font-weight: 700;
    margin-left: 0px;
  }

}
@media screen and (max-width: 1029px) {
  .input{
    float: left;
    height: 40px;
    margin-top: 30px;
    margin-left: 0;
    color: #000;
  }
  .headertext>span{
    font-size: 20px;
    line-height: 100px;
    color: #01fbfe;
    font-weight: 700;
    margin-left: 0px;
    display: none;
  }
}
#distance{
  width: 100px;
  height: 40px;
  background: rgb(0, 19, 39);
  border-radius: 10px;
  margin-left: 20px;
  color: #01fbfe;
  border-color: #025b9b;
}
.block{
  float: left;
}
</style>
