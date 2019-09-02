<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-28 11:03:07
 * @LastEditTime: 2019-09-02 18:31:15
 * @LastEditors: Please set LastEditors
 -->
<template>
<!-- 实况主页面 -->
  <div id="row">
    <!-- 今日明细 -->
    <div id="home" class="col-sm-12 text-center detail">
      <div class="leftcont">
        <div class="movements">
          <img src="../assets/bj-1.png" alt="" class="bj-1">
          <img src="../assets/bj-2.png" alt="" class="bj-2">
          <img src="../assets/bj-3.png" alt="" class="bj-3">
          <img src="../assets/bj-4.png" alt="" class="bj-4">
          <span>停车指数变化</span>
          <div id="myChart" style="width: 100%;height: 80%;"></div>
        </div>
        <div class="predict">
          <img src="../assets/bj-1.png" alt="" class="bj-1">
          <img src="../assets/bj-2.png" alt="" class="bj-2">
          <img src="../assets/bj-3.png" alt="" class="bj-3">
          <img src="../assets/bj-4.png" alt="" class="bj-4">
          <span>营收趋势变化</span>
          <div id="mypredict"></div>
        </div>
        <div class="load">
          <img src="../assets/bj-1.png" alt="" class="bj-1">
          <img src="../assets/bj-2.png" alt="" class="bj-2">
          <img src="../assets/bj-3.png" alt="" class="bj-3">
          <img src="../assets/bj-4.png" alt="" class="bj-4">
          <span>收入来源统计分析</span>
          <div id="myload"></div>
        </div>
      </div>
      <div class="middlecont">
        <img src="../assets/bj-1.png" alt="" class="bj-1">
        <img src="../assets/bj-2.png" alt="" class="bj-2">
        <img src="../assets/bj-3.png" alt="" class="bj-3">
        <img src="../assets/bj-4.png" alt="" class="bj-4">
        <div class="midheader">
          <span class="data">{{nowday}}</span>
          <!-- <span class="headertext">嵊州市泊位负荷热力图</span> -->
          <span class="headertext">泊位负荷热力图</span>
          <span class="time">{{nowtime}}</span>
        </div>
        <div class="midcont">
          <div id="map" class="map"></div>
        </div>
      </div>
      <div class="rightcont">
        <div class="analyze">
          <img src="../assets/bj-1.png" alt="" class="bj-1">
          <img src="../assets/bj-2.png" alt="" class="bj-2">
          <img src="../assets/bj-3.png" alt="" class="bj-3">
          <img src="../assets/bj-4.png" alt="" class="bj-4">
          <span>停车用户增长</span>
          <div class="ownanalyze" id="myanalyze"></div>
        </div>
        <div class="warning">
          <img src="../assets/bj-1.png" alt="" class="bj-1">
          <img src="../assets/bj-2.png" alt="" class="bj-2">
          <img src="../assets/bj-3.png" alt="" class="bj-3">
          <img src="../assets/bj-4.png" alt="" class="bj-4">
          <span>停车待缴路段分析</span>
          <div id="mywarning"></div>
        </div>
        <div class="owe">
          <img src="../assets/bj-1.png" alt="" class="bj-1">
          <img src="../assets/bj-2.png" alt="" class="bj-2">
          <img src="../assets/bj-3.png" alt="" class="bj-3">
          <img src="../assets/bj-4.png" alt="" class="bj-4">
          <span>区域追缴完成情况</span>
          <div id="myowe"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import 'echarts/lib/chart/map';
  import $ from 'jquery';
  import axios from 'axios';
  import baiduJSON from '../components/datas/baiduData.json';
  export default{
    data() {
      return {
        today: [5, 20, 36, 10, 10, 20, 35],
        yesterday: [6, 12, 25, 40, 15, 10, 26],
        car_index: [],
        car_date: [],
        money_data: [],
        money_date: [],
        user_list:[],
        user_date: [],
        area: [],
        areaval: [{value: [60,70,85,40,25,46,90,18,65,35,47,86,100]}],
        carkind: [{value:1548, name:'本市车辆'},{value:335, name:'外市车辆'}],
        carnum: [],
        income_num: [
          {
            name: '现金',
            value: 0
          },
          {
            name: '微信',
            value: 0
          },
          {
            name: '支付宝',
            value: 0
          },
          {
            name: '余额',
            value: 0
          }
        ],
        realtime: ["60", "89", "59", "70", "71", "89", "64"],
        predict: ["45", "67", "34", "90", "23", "45", "100"],
        auxiliary: ["45", "67", "34", "70", "23", "45", "64"],
        balance: ['15', '22', '25', '20', '48', '44', '36'],
        circle1: ['诸暨市', '新昌县', '嵊州市'],
        circle2: ['越城区', '柯桥区', '上虞区'],
        load1: [1050, 1100, 1150],
        load2: [800,850,900],
        color1: ['#d0570e', '#eb3600', '#eb2100'],
        color2: ['#0096f3', '#00c0e9', '#00e9db'],
        // load: [0.76, 0.78, 0.79, 0.79, 0.82, 0.83, 0.85, 0.89, 0.91, 0.95],
        nowday: '',
        nowtime: '',
        recovered: [709,1917,2455,2610,1719,1433,1544,3285,5208],
        norecovered: [327,1776,507,1200,800,482,204,1390,1001],
        allrecovered: [1036,3693,2962,3810,2519,1915,1748,4675,6209],
        xData: ['无名路(龙盛路-双塔大桥)','长宁路（长广路-长泰中路）','龙盛路（嵊州大道-无名路）','相公殿路(嵊州大道-官河横路','长广路（东南路-长泰西路）','经环西路（双塔大桥-达成路）','信杨路（一景路-环城南路）','商业城（北直街-官河路）','三江南街（剡兴路-四海路）'],
        owes: [],
        owes_name: [],
        owes_list: [],
        predicts: [],
        recovered_max: [],
        recovered_owe: [],
        recovered_chase: [],
        timer: null,
        owetimer: null,
        predicttimer: null,
        url_predicts: '/its/operations/load/dateQueryOrder',
        url_load:'/its/operations/area/parking',
        url_owe:'/its/operations/not/unpaid',
        url_line:'/its/operations/countParking/index',
        url_user: '/its/operations/new/registeredUser',
        url_income: '/its/operations/income/source',
        url_money: '/its/operations/revenue/income',
        url_recovered: '/its/operations/area/recovered'
      }
    },
    mounted() {
      this.get_map()
      this.getpredicts()
      this.getload()
      this.getmyowe()
      this.nowtimes()
      this.get_line()
      this.get_user_list()
      this.get_income()
      this.get_money()
      this.get_recovered()
    },
    methods:{
      //地图数据
      get_map(){
        let myChart = this.$echarts.init(document.getElementById('map'));
        let pointsData = baiduJSON;
        var points = [].concat.apply([],pointsData.map(function(track){
          return track.map(function(seg){
            return seg.coord.concat([1]);
          })
        }));
        myChart.setOption({
          animation: false,
          bmap: {
            center: [120.140501,30.250184],
            zoom: 14,
            roam: true
          },
          visualMap: {
            show: false,
            top: 'top',
            min: 0,
            max: 5,
            seriesIndex: 0,
            calculable: true,
            inRange: {
              color: ['blue', 'blue', 'green', 'yellow', 'red']
            }
          },
          series: [{
            type: 'heatmap',
            coordinateSystem: 'bmap',
            data: points,
            pointSize: 5,
            blurSize: 6
          }]
        });
        var bmap = myChart.getModel().getComponent('bmap').getBMap();
        bmap.addControl(new BMap.MapTypeControl());
        bmap.setMapStyle({  style : "midnight" });
      },
      //获取在场车辆走势数据
      get_line(){
        axios({
          method: 'post',
          url:this.url_line,
          headers:{
            'content-type':'application/x-www-form-urlencoded'
          },
          data: {}
        }).then(res => {
          console.log(res)
          this.car_index = res.data.data.map(item => {
            return (item.sum).toFixed(2)
          })
          this.car_date = res.data.data.map(item => {
            return item.click_date.split('-').slice(1,3).join('-')
          })
          this.drawLine()
        })
      },
      //在场车辆走势图
      drawLine(){
        let that = this
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        myChart.setOption({
            title: { text: '' },
            grid: {
              left: 60,
              right: 60
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data:['停车指数'],
              textStyle: {
                color: '#fff'
              }
            },
            toolbox: {
              show: true,
              feature: {
                dataZoom: {
                  show: false
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {
                  show:false
                },
                saveAsImage: {
                  show: false
                }
              }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.car_date,
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  }
                }
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value}',
                textStyle: {
                  color: '#fff'
                }
              },
              splitLine: {
                show: false
              }
            },
            series: [
              {
                name: '停车指数',
                type: 'line',
                data: this.car_index,
                markPoint: {
                  data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                  ]
                },
                // markLine: {
                //   data: [
                //     {type: 'average', name: '平均值'}
                //   ]
                // }
              }
            ]
        });
        window.addEventListener("resize",function(){
          myChart.resize();
        });
      },
      //获取收入来源
      get_income(){
        axios({
          method:'post',
          url: this.url_income,
          headers:{
            'content-type':'application/x-www-form-urlencoded'
          },
          data: {}
        }).then(res => {
          let data = res.data.data
          data.forEach(item => {
            if(item.pay_way == 0){
              this.income_num[0].value += item.pay_money
            }else if(item.pay_way == 1){
              this.income_num[1].value += item.pay_money
            }else if(item.pay_way == 2){
              this.income_num[2].value += item.pay_money
            }else{
              this.income_num[3].value += item.pay_money
            }
          })
          this.drawload()
        })
      },
      //收入来源统计分析
      drawload(){
        let that = this
        let myload = this.$echarts.init(document.getElementById('myload'))
        myload.setOption({
          tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}:{c}({d}%)"
          },
          legend: {
            orient: 'vertical',
            x:'left',
            data:[]
          },
          series: [
            {
              name: '金额',
              type:'pie',
              radius: ['40%','60%'],
              center: ['50%', '60%'],
              label: {
                normal: {
                  formatter: '{b|{b}：}{c}元{per|{d}%}',
                  borderWidth: 1,
                  borderRadius: 4,
                  rich: {
                    hr: {
                      borderColor: '#aaa',
                      width: '100%',
                      borderWidth: 0.5,
                      height: 0
                    },
                    b: {
                      fontSize: 14,
                      lineHeight: 20
                    },
                    per: {
                      color: '#eee',
                      padding: [2, 4],
                      borderRadius: 2,
                      lineHeight: 20
                    }
                  },
                  color:'#fff'
                }
              },
              data: this.income_num
            }
          ]
        });
        window.addEventListener("resize",function(){
          myload.resize();
        });
      },
      //获取7天的营收
      get_money(){
        axios({
          method:'post',
          url: this.url_money,
          headers:{
            'content-type':'application/x-www-form-urlencoded'
          },
          data: {}
        }).then(res => {
          console.log(res)
          this.money_data = res.data.data.map(item => {
            return item.sum
          })
          this.money_date = res.data.data.map(item => {
            return item.click_date.split('-').slice(1,3).join('-')
          })
          this.drawpredict()
        })
      },
      //营收趋势变化
      drawpredict(){
        let myChart = this.$echarts.init(document.getElementById('mypredict'))
        myChart.setOption({
            title: { text: '' },
            grid: {
              left: 60,
              right: 60
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data:['营收'],
              textStyle: {
                color: '#fff'
              }
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                      show: false
                    },
                    dataView: {readOnly: false},
                    magicType: {type: ['line', 'bar']},
                    restore: {
                      show:false
                    },
                    saveAsImage: {
                      show: false
                    }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.money_date,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value}',
                textStyle: {
                  color: '#fff'
                }
              },
              splitLine: {
                show: false
              }
            },
            series: [
              {
                name: '营收',
                type: 'line',
                data: this.money_data,
                markPoint: {
                  data: [
                      {type: 'max', name: '最大值'},
                      {type: 'min', name: '最小值'}
                  ]
                },
                markLine: {
                  data: [
                      {type: 'average', name: '平均值'}
                  ]
                }
              }
            ]
        });
        window.addEventListener("resize",function(){
          myChart.resize();
        });
      },
      // 获取停车用户状况
      get_user_list(){
        axios({
          method:'post',
          url: this.url_user,
          headers:{
            'content-type':'application/x-www-form-urlencoded'
          },
          data: {}
        }).then(res => {
          console.log(res)
          this.user_list = res.data.data.map(item => {
            return item.sum
          })
          this.user_date = res.data.data.map(item => {
            return item.click_date.split('-').slice(1,3).join('-')
          })
          this.drawanalyze()
        })
      },
      //停车用户情况
      drawanalyze(){
        let myChart = this.$echarts.init(document.getElementById('myanalyze'))
        myChart.setOption({
            title: { text: '' },
            grid: {
              left: 60,
              right: 60
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data:['新增用户'],
              textStyle: {
                color: '#fff'
              }
            },
            toolbox: {
              show: true,
              feature: {
                dataZoom: {
                  show: false
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {
                  show:false
                },
                saveAsImage: {
                  show: false
                }
              }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.user_date,
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  }
                }
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value}',
                textStyle: {
                  color: '#fff'
                }
              },
              splitLine: {
                show: false
              }
            },
            series: [
              {
                name: '新增用户',
                type: 'line',
                data: this.user_list,
                markPoint: {
                  data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                  ]
                },
                // markLine: {
                //   data: [
                //     {type: 'average', name: '平均值'}
                //   ]
                // }
              }
            ]
        });
        window.addEventListener("resize",function(){
          myChart.resize();
        });
      },
      //停车待缴路段分析
      drawwarning(){
        let that = this
        let mywarning = this.$echarts.init(document.getElementById('mywarning'))
        mywarning.setOption({
          tooltip:{
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series : [
            {
              name: '待缴金额(元)',
              type: 'pie',
              radius : '60%',
              center: ['50%', '50%'],
              data: this.owes_list,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
        window.addEventListener("resize",function(){
          mywarning.resize();
        });
      },
      // 获取区域追缴完成情况
      get_recovered(){
        this.recovered_owe = []
        this.recovered_max = []
        this.recovered_chase = []
        axios({
          method:'post',
          url: this.url_recovered,
          headers:{
            'content-type':'application/x-www-form-urlencoded'
          },
          data: {}
        }).then(res => {
          console.log(res)
          if (res.data.code == 0) {
            let list = res.data.data
            list.forEach(item => {
              let ele = {
                name: item.parking_name,
                max: item.owe
              }
              this.recovered_max.push(ele)
              this.recovered_owe.push(item.owe)
              this.recovered_chase.push(item.chase)
            })
            this.drawown()
          }
        })
      },
      //区域追缴完成分析
      drawown(){
        let myChart = this.$echarts.init(document.getElementById('myowe'))
        myChart.setOption({
          tooltip: {},
          radar: {
            center: ['50%', '50%'],
            // shape: 'circle',
            indicator: this.recovered_max
          },
          series: [{
            name: '欠费VS追缴',
            type: 'radar',
            // areaStyle: {normal: {}},
            data : [
              {
                value : this.recovered_chase,
                name : '追缴金额'
              },
              {
                value : this.recovered_owe,
                name : '欠费金额'
              }
            ]
          }]
        })
        window.addEventListener("resize",function(){
          myChart.resize();
        })
      },
      goToMenu(){
        this.$router.push({name:'menuLink'})
      },
      //时间实时显示
      nowtimes(){
        this.timeday()
        setInterval(this.timeday, 1000);
      },
      //获取当前时间
      timeday(){
        let data = new Date()
        let year = data.getFullYear();
        let month =data.getMonth() + 1 < 10? "0" + (data.getMonth() + 1): data.getMonth() + 1;
        let date =data.getDate() < 10? "0" + data.getDate(): data.getDate();
        let hh =data.getHours() < 10? "0" + data.getHours(): data.getHours();
        let mm =data.getMinutes() < 10? "0" + data.getMinutes(): data.getMinutes();
        let ss =data.getSeconds() < 10? "0" + data.getSeconds(): data.getSeconds();
        this.nowday = year + '-' + month + '-' + date;
        this.nowtime = hh + ':' + mm + ':' + ss;
        // if(hh%2 ==0){
        //   this.get_line()
        // }
      },
      //获取TOP负荷停车场数据
      getpredicts(){
        axios({
          method: 'post',
          url:this.url_predicts,
          headers:{
            'content-type':'application/x-www-form-urlencoded'
          },
          data: {}
        }).then(res => {
          if(res.data.code == 0){
            let data = res.data.data
            this.predicts = data.sort(function(a,b){
              return b.times/b.parkingTotal - a.times/a.parkingTotal
            })
            if(this.predicts.length > 5){
              this.predicts_lunbo()
            }
          }
        })
      },
      //获取区域停泊车辆分析数据
      getload(){
        axios({
          method: 'post',
          url:this.url_load,
          headers:{
            'content-type':'application/x-www-form-urlencoded'
          },
          data: {}
        }).then(res => {
          let val = res.data.data
          val.forEach(ele => {
            if(ele.inthe>0){
              this.carnum.push({value:ele.inthe,name:ele.parking_name})
            }
          });
        })
      },
      //获取TOP待缴车场数据
      getmyowe(){
        axios({
          method: 'post',
          url:this.url_owe,
          headers:{
            'content-type':'application/x-www-form-urlencoded'
          },
          data: {}
        }).then(res => {
          if(res.data.code == 0){
            let data = res.data.data
            this.owes = data.sort(function(a,b){
              return b.totalMoney - a.totalMoney
            })
            this.owes_name = this.owes.map(item => {
              return item.parking_name
            })
            this.owes.forEach(item => {
              let data = {
                name: item.parking_name,
                value: item.totalMoney
              }
              this.owes_list.push(data)
            })
            this.drawwarning()
          }
        })
      },
    }
  }
</script>

<style scoped>
#home{
  width: 100%;
  height: 904px;
  padding: 0;
  background: rgb(0, 19, 39);
  overflow-x: hidden;
  color: #fff;
}
.leftcont{
  width: 30%;
  height: 100%;
  float: left;
}
.movements,.predict{
  width: 90%;
  height: 28%;
  border: 2px solid #013254;
  margin: 2% auto 0;
  position: relative;
}
.load{
  width: 90%;
  height: 38%;
  border: 2px solid #013254;
  margin: 2% auto 0;
  position: relative;
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
.middlecont{
  width: 40%;
  height: 96.5%;
  border: 1px solid #005791;
  float: left;
  position: relative;
  margin-top: 0.6%;
}
.rightcont{
  width: 30%;
  height: 100%;
  float: left;
}
.analyze,.owe{
  width: 90%;
  height: 28%;
  border: 2px solid #013254;
  margin: 2% auto 0;
  position: relative;
}
.warning{
  width: 90%;
  height: 38%;
  border: 2px solid #013254;
  margin: 2% auto 0;
  position: relative;
}
.leftcont>div>span,.rightcont>div>span{
  color: #01fbfe;
  font-weight: 600;
  position: absolute;
  left: 20px;
  top: 20px;
}
.midheader{
  width: 100%;
  height: 20%;
  border-bottom: 3px solid #01eced;
}
.data,.time{
  color: #4e99b2;
}
.midcont{
  width: 100%;
  height: 78%;
}
.map{
  width: 99%;
  height: 100%;
  margin: 2% auto 0;
}
@media screen and (min-width: 1450px) {
  .headertext{
    font-size: 40px;
    color: #01eced;
    font-weight: 700;
    line-height: 150px;
  }
}
@media screen and (max-width: 1449px) and (min-width: 960px) {
  .headertext{
    font-size: 25px;
    color: #01eced;
    font-weight: 700;
    line-height: 150px;
  }
}
@media screen and (max-width: 959px) {
  .headertext{
    font-size: 16px;
    color: #01eced;
    font-weight: 700;
    line-height: 150px;
  }
}
.data{
  float: left;
  margin-top: 10%;
}
.time{
  float: right;
  margin-top: 10%;
}
#myChart{
  margin-top: 10%;
  color: #fff !important;
}
#myload{
  width: 95%;
  height: 90%;
  margin: 0 auto;
}
#myanalyze{
  width: 100%;
  height: 90%;
  margin: 8% auto 0;
}
#myanalyzenew{
  width: 100%;
  height: 90%;
  margin: 8% auto 0;
}
#myanalyze>div,#myanalyzenew>div{
  width: 100%;
  height: 100%;
}
#mypredict{
  width: 100%;
  height: 80%;
  margin: 14% auto 0;
}
#mywarning{
  width: 100%;
  height: 90%;
  margin: 8% auto 0;
}
#myowe{
  width: 90%;
  height: 100%;
  margin: 0 auto 0;
}
.head{
  width: 90%;
  height: 15%;
  margin: 5% auto 0;
  font-size: 18px;
  color: darkcyan;
}
.headarea,.owecontarea,.predictscontarea{
  float: left;
}
.headmoney,.owecontmoney,.predictscontmoney{
  float: right;
}
.predictscontmoney{
  margin-right: 5%;
}
.owecontpark{
  margin-left: -5%;
}
.predictscontpark{
  margin-left: -7%;
}
.owecont,.predictscont{
  width: 90%;
  height: 70%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}
.owecont>ul,.predictscont>ul{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
}
.owecont>ul>li,.predictscont>ul>li{
  display: block;
  width: 100%;
  height: 20%;
}
@media screen and (min-width: 1680px) {
  .owecont>ul>li>span,.predictscont>ul>li>span{
    font-size: 16px;
  }
}
@media screen and (max-width: 1679px) and (min-width: 1350px) {
  .owecont>ul>li>span,.predictscont>ul>li>span{
    font-size: 14px;
  }
}
@media screen and (max-width: 1349px) and (min-width: 1150px) {
  .owecont>ul>li>span,.predictscont>ul>li>span{
    font-size: 12px;
  }
}
@media screen and (max-width: 1149px) {
  .owecont>ul>li>span,.predictscont>ul>li>span{
    font-size: 10px;
  }
}
</style>
