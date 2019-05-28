<template>
<!-- 实况主页面 -->
  <div class="row">
    <!-- 今日明细 -->
    <div id="home" class="col-sm-12 text-center detail">
      <div class="leftcont">
        <div class="movements">
          <img src="../assets/bj-1.png" alt="" class="bj-1">
          <img src="../assets/bj-2.png" alt="" class="bj-2">
          <img src="../assets/bj-3.png" alt="" class="bj-3">
          <img src="../assets/bj-4.png" alt="" class="bj-4">
          <span>在场车辆走势</span>
          <div id="myChart" style="width: 100%;height: 80%;"></div>
        </div>
        <div class="load">
          <img src="../assets/bj-1.png" alt="" class="bj-1">
          <img src="../assets/bj-2.png" alt="" class="bj-2">
          <img src="../assets/bj-3.png" alt="" class="bj-3">
          <img src="../assets/bj-4.png" alt="" class="bj-4">
          <span>区域下单车辆分析</span>
          <div id="myload"></div>
        </div>
        <div class="predict">
          <img src="../assets/bj-1.png" alt="" class="bj-1">
          <img src="../assets/bj-2.png" alt="" class="bj-2">
          <img src="../assets/bj-3.png" alt="" class="bj-3">
          <img src="../assets/bj-4.png" alt="" class="bj-4">
          <span>TOP下单停车场</span>
          <div id="mypredict">
            <div class="head">
              <span class="headarea">区域</span>
              <span class="headpark">停车场</span>
              <span class="headmoney">经停车辆/车位</span>
            </div>
            <div class="predictscont">
              <ul>
                <li v-for="(predict,index) in predicts" :key="index">
                  <span class="predictscontarea">嵊州市</span>
                  <span class="predictscontpark">{{predict.parking_name}}</span>
                  <span class="predictscontmoney">{{predict.times}}/{{predict.parkingTotal}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="middlecont">
        <img src="../assets/bj-1.png" alt="" class="bj-1">
        <img src="../assets/bj-2.png" alt="" class="bj-2">
        <img src="../assets/bj-3.png" alt="" class="bj-3">
        <img src="../assets/bj-4.png" alt="" class="bj-4">
        <div class="midheader">
          <span class="data">{{nowday}}</span>
          <span class="headertext">嵊州市泊位负荷热力图</span>
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
          <span>待缴区域排行</span>
          <div class="ownanalyze" id="myanalyze"></div>
          <div class="ownanalyze" id="myanalyzenew"></div>
        </div>
        <div class="owe">
          <img src="../assets/bj-1.png" alt="" class="bj-1">
          <img src="../assets/bj-2.png" alt="" class="bj-2">
          <img src="../assets/bj-3.png" alt="" class="bj-3">
          <img src="../assets/bj-4.png" alt="" class="bj-4">
          <span>TOP待缴停车场</span>
          <div id="myowe">
            <div class="head">
              <span class="headarea">区域</span>
              <span class="headpark">停车场</span>
              <span class="headmoney">待缴金额(元)</span>
            </div>
            <div class="owecont">
              <ul>
                <li v-for="(owe,index) in owes" :key="index">
                  <span class="owecontarea">嵊州市</span>
                  <span class="owecontpark">{{owe.parking_name}}</span>
                  <span class="owecontmoney">{{owe.totalMoney}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="warning">
          <img src="../assets/bj-1.png" alt="" class="bj-1">
          <img src="../assets/bj-2.png" alt="" class="bj-2">
          <img src="../assets/bj-3.png" alt="" class="bj-3">
          <img src="../assets/bj-4.png" alt="" class="bj-4">
          <span>区域追缴完成情况</span>
          <div id="mywarning"></div>
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
        area: [],
        areaval: [{value: [60,70,85,40,25,46,90,18,65,35,47,86,100]}],
        carkind: [{value:1548, name:'本市车辆'},{value:335, name:'外市车辆'}],
        carnum: [
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
        predicts: [],
        timer: null,
        owetimer: null,
        predicttimer: null,
        url_predicts: 'http://www.lcgxlm.com:13259/its/admin/load/dateQueryOrder',
        url_load:'http://www.lcgxlm.com:13259/its/admin/area/parking',
        url_owe:'http://www.lcgxlm.com:13259/its/admin/not/unpaid',
        url_line:'http://www.lcgxlm.com:13259/its/admin/vehicle/movements'
      }
    },
    mounted() {

      this.get_map()
      this.getpredicts()
      this.getload()
      this.getmyowe()
      this.drawLine()

      this.drawanalyze()
      this.drawwarning()
      this.nowtimes()
      this.get_line()

      let that = this
      let index = 0;
      that.timer = setInterval(function(){
        index = (index == 1)? 0 : index + 1;
        if(index == 0){
          $('#myanalyzenew').slideUp()
          $('#myanalyze').slideDown()
          $('#myanalyze').removeAttr('_echarts_instance_')
          that.drawanalyze();
        }else{
          $('#myanalyze').slideUp()
          $('#myanalyzenew').slideDown()
          $('#myanalyzenew').removeAttr('_echarts_instance_')
          that.drawanalyzenew()
        }
      },5000)
      $('.ownanalyze').bind('mouseenter',function(){
        clearInterval(that.timer)
      })
      $('.ownanalyze').bind('mouseleave',function(){
        that.timer = setInterval(function(){
          index = (index == 1)? 0 : index + 1;
          if(index == 0){
            $('#myanalyzenew').slideUp()
            $('#myanalyze').slideDown()
            $('#myanalyze').removeAttr('_echarts_instance_')
            that.drawanalyze();
        }else{
            $('#myanalyze').slideUp()
            $('#myanalyzenew').slideDown()
            $('#myanalyzenew').removeAttr('_echarts_instance_')
            that.drawanalyzenew()
        }
        },5000)
      })
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
            center: [120.840358,29.585902],
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
            'Authorization':'Web 123213213',
            'content-type':'application/x-www-form-urlencoded'
          },
          data: {}
        }).then(res => {
          console.log(res)
        })
      },
      //在场车辆走势图
      drawLine(){
        let that = this
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        myChart.setOption({
            title: { text: '' },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data:['今天','昨天'],
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
                data: ['0','4','8','12','16','20','24'],
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
            },
            series: [
              {
                name: '今天',
                type: 'line',
                data: that.today,
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
              },
              {
                name: '昨天',
                type: 'line',
                data: that.yesterday,
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
      //区域停泊车辆分析图表
      drawbread(){
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
            // {
            //   name: '车辆类别',
            //   type:'pie',
            //   selectedMode: 'single',
            //   radius: [0,'30%'],
            //   label: {
            //     normal: {
            //       position: 'inner'
            //     }
            //   },
            //   labelLine: {
            //     normal: {
            //       show: false
            //     }
            //   },
            //   data: that.carkind
            // },
            {
              name: '车辆数量',
              type:'pie',
              radius: ['40%','55%'],
              label: {
                normal: {
                  formatter: '{b|{b}：}{c}辆{per|{d}%}  ',
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
              data: that.carnum
            }
          ]
        });
        window.addEventListener("resize",function(){
          myload.resize();
        });
      },
      //待缴排行
      drawanalyze(){
        let that = this
        let myanalyze = this.$echarts.init(document.getElementById('myanalyze'))
        let myColor = that.color1
        myanalyze.setOption({
          grid: {
            left: '8%',
            top: '1%',
            right: '10%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: [{
            show: false,
          }],
          yAxis: [
            {
              axisTick: 'none',
              axisLine: 'none',
              offset: '27',
              axisLabel: {
                textStyle: {
                  color: '#ffffff',
                  fontSize: '16',
                }
              },
              data: that.circle1
            },
            {
              axisTick: 'none',
              axisLine: 'none',
                axisLabel: {
                    textStyle: {
                        color: '#ffffff',
                        fontSize: '16',
                    }
                },
              data: ['','','','','']
            },
            {
              name: '区域负荷指数TOP10',
              nameGap: '50',
              nameTextStyle: {
                  color: '#ffffff',
                  fontSize: '16',
              },
              axisLine: {
                  lineStyle: {
                      color: 'rgba(0,0,0,0)'
                  }
              },
              data: [],
            }
          ],
          series: [
            {
              name: '条',
              type: 'bar',
              yAxisIndex: 0,
              data: that.load1,
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
              barWidth: 12,
              itemStyle: {
                normal: {
                  color: function(params) {
                    var num = myColor.length;
                    return myColor[params.dataIndex % num]
                  },
                }
              },
              z:2
            },
          ]
        });
        window.addEventListener("resize",function(){
          myanalyze.resize();
        });
      },
      //待缴排行
      drawanalyzenew(){
        let that = this
        let myanalyzenew = this.$echarts.init(document.getElementById('myanalyzenew'))
        let myColor = that.color2
        myanalyzenew.setOption({
          grid: {
            left: '8%',
            top: '1%',
            right: '10%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: [{
            show: false,
          }],
          yAxis: [
            {
              axisTick: 'none',
              axisLine: 'none',
              offset: '27',
              axisLabel: {
                textStyle: {
                  color: '#ffffff',
                  fontSize: '16',
                }
              },
              data: that.circle2
            },
            {
              axisTick: 'none',
              axisLine: 'none',
                axisLabel: {
                    textStyle: {
                        color: '#ffffff',
                        fontSize: '16',
                    }
                },
              data: ['','','','','']
            },
            {
              name: '区域负荷指数TOP10',
              nameGap: '50',
              nameTextStyle: {
                  color: '#ffffff',
                  fontSize: '16',
              },
              axisLine: {
                  lineStyle: {
                      color: 'rgba(0,0,0,0)'
                  }
              },
              data: [],
            }
          ],
          series: [
            {
              name: '条',
              type: 'bar',
              yAxisIndex: 0,
              data: that.load2,
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
              barWidth: 12,
              itemStyle: {
                normal: {
                  color: function(params) {
                    var num = myColor.length;
                    return myColor[params.dataIndex % num]
                  },
                }
              },
              z:2
            },
          ]
        });
        window.addEventListener("resize",function(){
          myanalyzenew.resize();
        });
      },
      drawpredict(){
        let that = this
        let mypredict = this.$echarts.init(document.getElementById('mypredict'))
        mypredict.setOption({
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(67,100,247,0.8)',
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                  color: 'rgba(67,100,247,0.08)'
              }
            },
          },
          legend: {
            data:['实时','预测'],
             textStyle: {
                                color: '#fff'
                            }
          },
          xAxis: [{
            axisLine: {
              lineStyle: {
                  color: '#666'
              }
            },
            type: 'category',
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            data: ['0时', '4时', '8时', '12时', '16时', '20时', '24时'],
            axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        }
          }],
          yAxis: [
            {
              type: 'value',
              name: '万辆',
              color: '#fff',
              splitLine: {
                  show: false
              },
              axisTick: {
                  show: false
              },
              axisLine: {
                  lineStyle: {
                      color: '#666'
                  }
              },
              position: 'left',
              axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        }
            },
          ],
          series:[
            {
              name: '实时',
              type: 'line',
              smooth: true,
              symbol: 'emptyCircle',
              symbolSize: 2,
              yAxisIndex: 0,
              itemStyle: {
                  color: '#01fbfe',
              },
              data: that.realtime
            },
            {
              name: '预测',
              type: 'line',
              smooth: true,
              symbol: 'emptyCircle',
              symbolSize: 2,
              yAxisIndex: 0,
              itemStyle: {
                  color: 'rgb(214,127,143)',
              },
              data: that.predict
            },
            {
              name: '辅助',
              type: 'bar',
              barWidth: 10,
              yAxisIndex: 0,
              stack: '总人数',
              itemStyle: {
                  normal: {
                      barBorderColor: 'rgba(0,0,0,0)',
                      color: 'rgba(0,0,0,0)',
                  },
                  emphasis: {
                      barBorderColor: 'rgba(0,0,0,0)',
                      color: 'rgba(0,0,0,0)'
                  }
              },
              data: that.auxiliary
            },
            {
              name: '差值',
              type: 'bar',
              stack: '总人数',
              yAxisIndex: 0,
              barWidth: 10,
              itemStyle: {
                  color: 'rgb(86,135,196)',
              },
              label: {
                  normal: {
                      show: false,
                      position: 'top'
                  }
              },
              data: that.balance
            }
          ]
        });
        window.addEventListener("resize",function(){
          mypredict.resize();
        });
      },
      //追缴完成情况
      drawwarning(){
        let that = this
        let mywarning = this.$echarts.init(document.getElementById('mywarning'))
        mywarning.setOption({
          tooltip:{
            trigger: "axis",
            axisPointer: {
              type: "shadow",
              textStyle: {
                color: "#fff"
              }
            }
          },
          grid: {
            "borderWidth": 0,
            "top": 10,
            "bottom": 65,
            textStyle: {
              color: "#fff"
            }
          },
          legend: {
            x: '15%',
            top: '10%',
            textStyle: {
              color: '#90979c',
            },
            'data': ['已追回', '未追回', '平均']
          },
          calculable: true,
          xAxis: [{
            type: "category",
            show: false,
            axisLine: {
              lineStyle:{
                color: '#90979c'
              }
            },
            splitLine: {
              show:false
            },
            axisTick: {
              show:false
            },
            splitArea: {
              show:false
            },
            axisLabel: {
              interval: 0
            },
            data: that.xData
          }],
          yAxis: [{
            type: "value",
            splitLine: {
              show:false
            },
            axisLine: {
              lineStyle:{
                color: '#90979c'
              }
            },
            axisTick: {
              show:false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show:false
            }
          }],
          dataZoom: [{
            show: true,
            height: 20,
            xAxisIndex: [0],
            bottom: 20,
            start: 10,
            end: 80,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color:"#d3dee5",
            },
            textStyle: {
              color:"#fff"
            },
            borderColor:"#90979c"
          },
          {
            "type": "inside",
            "show": true,
            "height": 15,
            "start": 1,
            "end": 35
          }],
          series: [
            {
              name: '已追回',
              type: 'bar',
              stack: '总量',
              barMaxWidth: 35,
              barGap: '10%',
              itemStyle: {
                normal: {
                  color: "rgba(0,191,183,1)",
                  label: {
                    show: true,
                    textStyle: {
                      color: "#fff"
                    },
                    position: "insideTop",
                    formatter: function (p) {
                      return p.value > 0 ? (p.value) : '';
                    }
                  }
                }
              },
              data: that.recovered
            },
            {
              name: '未追回',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                normal: {
                  color: "rgba(255,144,128,1)",
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    position: "top",
                    formatter: function (p) {
                      return p.value > 0 ? (p.value) : '';
                    }
                  }
                }
              },
              data: that.norecovered
            },
            {
              name: '总数',
              type: 'line',
              stack: '总量',
              symbolSize: 5,
              symbol:'circle',
              itemStyle: {
                normal: {
                  color: "rgba(252,230,48,1)",
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    textStyle: {
                      color: "#fff"
                    },
                    position: "insideTop",
                    formatter: function (p) {
                      return p.value > 0 ? (p.value) : '';
                    }
                  }
                }
              },
              data: that.allrecovered
            }
          ]
        })
        window.addEventListener("resize",function(){
          mywarning.resize();
        });
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
            'Authorization':'Web 123213213',
            'content-type':'application/x-www-form-urlencoded'
          },
          data: {}
        }).then(res => {
          let data = res.data.data
          this.predicts = data.sort(function(a,b){
            return b.times/b.parkingTotal - a.times/a.parkingTotal
          })
          if(this.predicts.length > 5){
            this.predicts_lunbo()
          }
        })
      },
      //获取TOP负荷停车场轮播
      predicts_lunbo(){
        let that = this
        let no = 0
        let dic = this.predicts.length - 5
        that.predicttimer = setInterval(function(){
          no = (no == dic)? 0 : no + 1;
          let height = $('.predictscont ul li').height()
          $('.predictscont ul').animate({top: -height*no + 'px'})
        },5000)
        $('.predictscont ul').bind('mouseenter',function(){
          clearInterval(that.predicttimer)
        })
        $('.predictscont ul').bind('mouseleave',function(){
          that.predicttimer = setInterval(function(){
          no = (no == dic)? 0 : no + 1;
            let height = $('.predictscont ul li').height()
            $('.predictscont ul').animate({top: -height*no + 'px'})
          },5000)
        })
      },
      //获取区域停泊车辆分析数据
      getload(){
        axios({
          method: 'post',
          url:this.url_load,
          headers:{
            'Authorization':'Web 123213213',
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
          this.drawbread();
        })
      },
      //获取TOP待缴车场数据
      getmyowe(){
        axios({
          method: 'post',
          url:this.url_owe,
          headers:{
            'Authorization':'Web 123213213',
            'content-type':'application/x-www-form-urlencoded'
          },
          data: {}
        }).then(res => {
          console.log(res)
          let data = res.data.data
          this.owes = data.sort(function(a,b){
            return b.totalMoney - a.totalMoney
          })
          if(this.owes.length > 5){
            this.myowe_lunbo()
          }
        })
        // this.myowe_lunbo()
      },
      //TOP待缴车场轮播
      myowe_lunbo(){
        let that = this
        let num = 0
        let dic = this.owes.length - 5
        that.owetimer = setInterval(function(){
          num = (num == dic)? 0 : num + 1;
          let height = $('.owecont ul li').height()
          $('.owecont ul').animate({top: -height*num + 'px'})
        },5000)
        $('.owecont ul').bind('mouseenter',function(){
          clearInterval(that.owetimer)
        })
        $('.owecont ul').bind('mouseleave',function(){
          that.owetimer = setInterval(function(){
          num = (num == dic)? 0 : num + 1;
            let height = $('.owecont ul li').height()
            $('.owecont ul').animate({top: -height*num + 'px'})
          },5000)
        })
      }
    },
    beforeDestroy(){
      clearInterval(this.timer)
      clearInterval(this.owetimer)
      clearInterval(this.predicttimer)
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
  height: 85%;
  margin: 14% auto 0;
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
