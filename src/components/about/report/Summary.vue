<template>
  <div id="row">
    <div class="header">
      <div class="total">
        <div class="text">今日营业收入(元)</div>
        <div class="num">{{sum_list.shouldmoney}}</div>
      </div>
      <div class="total">
        <div class="text">今日营业实收(元)</div>
        <div class="num">{{sum_list.offline}}</div>
      </div>
      <div class="total">
        <div class="text">今日欠费总额(元)</div>
        <div class="num">{{sum_list.evasionamount}}</div>
      </div>
      <div class="total">
        <div class="text">今日入账金额(元)</div>
        <div class="num">{{sum_list.total}}</div>
      </div>
      <div class="total">
        <div class="text">今日预收账款(元)</div>
        <div class="num">{{sum_list.deferredRevenue}}</div>
      </div>
    </div>
    <div class="content">
      <div class="chart" id="booked"></div>
      <div class="chart" id="income"></div>
      <div class="chart" id="pay"></div>
      <div class="chart" id="recharge"></div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import axios from 'axios';
export default {
  data() {
    return {
      sum_list:{},
      booked:[10000,9500,13000,11000,7000,5000,15000],
      income:[6000,7000,10000,8000,5000,4500,12000],
      advance:[4000,2500,3000,3000,2000,500,3000],
      owe:[3000,1000,5000,1500,1300,2500,1200],
      amount:[9000,8000,15000,9500,6300,7000,13200],
      xData:['6.11','6.12','6.13','6.14','6.15','6.16','6.17'],
      pay:[70,73,86,90,65,80,86,78.57],
      xData_pay:['6.11','6.12','6.13','6.14','6.15','6.16','6.17','7天付费率'],
      recharge:[3000,1500,1800,3600,2400,2800,2000],
      sum_url:'/its/operations/booked/amount'
    }
  },
  mounted() {
    this.get_summary()
    this.drowbooked()
    this.drowincome()
    this.drowpay()
    this.drowrecharge()
  },
  methods: {
    get_summary(){
      axios({
        method: 'get',
        url: this.sum_url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:{}
      }).then(res => {
        console.log(res)
        if(res.data.code == 0){
          this.sum_list = res.data.data
        }
      })
    },
    drowbooked(){
      let that = this
      let mybooked = this.$echarts.init(document.getElementById('booked'))
      mybooked.setOption({
        title: {
          "text": "入账金额",
          x: "10%",
          y:'10',
          textStyle: {
              color: '#000',
              fontSize: '22'
          }
        },
        tooltip:{
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            textStyle: {
              color: "#000"
            }
          }
        },
        grid: {
          "borderWidth": 0,
          "top": 90,
          "bottom": 0,
          containLabel: true,
          textStyle: {
            color: "#000"
          }
        },
        legend: {
          x: '50%',
          top: '10',
          textStyle: {
            color: '#90979c',
          },
          'data': ['营收实收', '预收账款', '入账总额']
        },
        calculable: true,
        xAxis: [{
          type: "category",
          axisLine: {
            lineStyle:{
              color: '#000'
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
        yAxis: [
          {
            name: '金额(元)',
            type: 'value',
            splitLine: {                // 网格线 y轴对应的是否显示
              show: false
            },
            axisLabel: {
              formatter: '{value}元'
            },
            axisLine: {
              lineStyle:{
                color: '#000'
              }
            },
          }
        ],
        series: [
          {
            name: '营收实收',
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
                    color: "#000"
                  },
                  position: "insideTop",
                  formatter: function (p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            data: that.income
          },
          {
            name: '预收账款',
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
            data: that.advance
          },
          {
            name: '入账总额',
            type: 'line',
            // stack: '总量',
            symbolSize: 5,
            symbol:'circle',
            itemStyle: {
              normal: {
                color: "rgba(0,191,183,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  textStyle: {
                    color: "#000"
                  },
                  position: "insideTop",
                  formatter: function (p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            data: that.booked
          }
        ]
      })
      window.addEventListener("resize",function(){
        mybooked.resize();
      });
    },
    drowincome(){
      let that = this
      let myincome = this.$echarts.init(document.getElementById('income'))
      myincome.setOption({
        title: {
          "text": "营业收入",
          x: "10%",
          y:'10',
          textStyle: {
              color: '#000',
              fontSize: '22'
          }
        },
        tooltip:{
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            textStyle: {
              color: "#000"
            }
          }
        },
        grid: {
          "borderWidth": 0,
          "top": 90,
          "bottom": 0,
          containLabel: true,
          textStyle: {
            color: "#000"
          }
        },
        legend: {
          x: '50%',
          top: '10',
          textStyle: {
            color: '#90979c',
          },
          'data': ['营收实收', '营收欠费', '营收总额']
        },
        calculable: true,
        xAxis: [{
          type: "category",
          axisLine: {
            lineStyle:{
              color: '#000'
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
        yAxis: [
          {
            name: '金额(元)',
            type: 'value',
            splitLine: {                // 网格线 y轴对应的是否显示
              show: false
            },
            axisLabel: {
              formatter: '{value}元'
            },
            axisLine: {
              lineStyle:{
                color: '#000'
              }
            },
          }
        ],
        series: [
          {
            name: '营收实收',
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
                    color: "#000"
                  },
                  position: "insideTop",
                  formatter: function (p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            data: that.income
          },
          {
            name: '营收欠费',
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
            data: that.owe
          },
          {
            name: '营收总额',
            type: 'line',
            // stack: '总量',
            symbolSize: 5,
            symbol:'circle',
            itemStyle: {
              normal: {
                color: "rgba(0,191,183,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  textStyle: {
                    color: "#000"
                  },
                  position: "insideTop",
                  formatter: function (p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            data: that.amount
          }
        ]
      })
      window.addEventListener("resize",function(){
        myincome.resize();
      });
    },
    drowpay(){
      let that = this
      let mypay = this.$echarts.init(document.getElementById('pay'))
      mypay.setOption({
        title: {
          "text": "付费率",
          x: "10%",
          y:'10',
          textStyle: {
              color: '#000',
              fontSize: '22'
          }
        },
        tooltip:{
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            textStyle: {
              color: "#000"
            }
          }
        },
        grid: {
          "borderWidth": 0,
          "top": 90,
          "bottom": 10,
          containLabel: true,
          textStyle: {
            color: "#000"
          }
        },
        legend: {
          x: '50%',
          top: '10',
          textStyle: {
            color: '#90979c',
          },
          'data': ['付费率']
        },
        calculable: true,
        xAxis: [{
          type: "category",
          axisLine: {
            lineStyle:{
              color: '#000'
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
          data: that.xData_pay
        }],
        yAxis: [
          {
            name: '付费率(%)',
            type: 'value',
            splitLine: {                // 网格线 y轴对应的是否显示
              show: false
            },
            axisLabel: {
              formatter: '{value}%'
            },
            axisLine: {
              lineStyle:{
                color: '#000'
              }
            },
          }
        ],
        series: [
          {
            name: '付费率',
            type: 'bar',
            barMaxWidth: 35,
            barCategoryGap:'10',
            itemStyle: {
              normal: {
                color: "rgba(0,191,183,1)",
                label: {
                  show: true,
                  textStyle: {
                    color: "#000"
                  },
                  position: "insideTop",
                  formatter: function (p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            data: that.pay
          }
        ]
      })
      window.addEventListener("resize",function(){
        mypay.resize();
      });
    },
    drowrecharge(){
      let that = this
      let myrecharge = this.$echarts.init(document.getElementById('recharge'))
      myrecharge.setOption({
        title: {
          "text": "充值金额",
          x: "10%",
          y:'10',
          textStyle: {
              color: '#000',
              fontSize: '22'
          }
        },
        tooltip:{
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            textStyle: {
              color: "#000"
            }
          }
        },
        grid: {
          "borderWidth": 0,
          "top": 90,
          "bottom": 10,
          containLabel: true,
          textStyle: {
            color: "#000"
          }
        },
        legend: {
          x: '50%',
          top: '10',
          textStyle: {
            color: '#90979c',
          },
          'data': ['充值金额']
        },
        calculable: true,
        xAxis: [{
          type: "category",
          axisLine: {
            lineStyle:{
              color: '#000'
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
        yAxis: [
          {
            name: '金额(元)',
            type: 'value',
            splitLine: {                // 网格线 y轴对应的是否显示
              show: false
            },
            axisLabel: {
              formatter: '{value}元'
            },
            axisLine: {
              lineStyle:{
                color: '#000'
              }
            },
          }
        ],
        series: [
          {
            name: '充值金额',
            type: 'bar',
            barMaxWidth: 35,
            barCategoryGap:'10',
            itemStyle: {
              normal: {
                color: "rgba(0,191,183,1)",
                label: {
                  show: true,
                  textStyle: {
                    color: "#000"
                  },
                  position: "insideTop",
                  formatter: function (p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            data: that.recharge
          }
        ]
      })
      window.addEventListener("resize",function(){
        myrecharge.resize();
      });
    }
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
    height: 100px;
    /* border: 1px solid saddlebrown; */
    margin: 0 auto;
    background: #fff;
  }
  .total{
    width: 20%;
    height: 100px;
    /* border: 1px solid darkcyan; */
    float: left;
    text-align: center;
  }
  .text{
    font-size: 18px;
    margin-top: 20px;
  }
  .num{
    margin-top: 10px;
  }
  .content{
    width: 100%;
    height: 780px;
    background: #fff;
    /* border: 1px solid forestgreen; */
    margin-top: 20px;
  }
  .chart{
    width: 50%;
    height: 390px;
    /* border: 1px solid sandybrown; */
    float: left;
  }
  .chart>div{
    height: 90%;
  }
</style>

