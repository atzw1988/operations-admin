<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 10:24:10
 * @LastEditTime: 2019-09-02 18:19:18
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="row">
    <div class="header">
      <div class="total">
        <div class="text">今日营业收入</div>
        <div class="num">{{sum_list.shouldmoney}}(元)</div>
      </div>
      <div class="total">
        <div class="text">今日欠费总额</div>
        <div class="num">{{sum_list.evasionamount}}(元)</div>
      </div>
      <div class="total">
        <div class="text">今日入账金额</div>
        <div class="num">{{sum_list.total}}(元)</div>
      </div>
      <div class="total">
        <div class="text">今日预收账款</div>
        <div class="num">{{sum_list.deferredRevenue}}(元)</div>
      </div>
      <div class="total">
        <div class="text">今日营业实收</div>
        <div class="num">{{sum_list.offline}}(元)</div>
      </div>
      <div class="total">
        <div class="text">今日营业实收(现金)</div>
        <div class="num">{{sum_list.receivedTodayCash}}(元)</div>
      </div>
      <div class="total">
        <div class="text">今日营业实收(微信/支付宝)</div>
        <div class="num">{{sum_list.resultsTodayWeChatAlipay}}(元)</div>
      </div>
    </div>
    <div class="content" v-if="is_show">
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
      time_interval: [],
      is_show: true,
      sum_list:{},
      booked:[],
      income:[],
      advance:[],
      owe:[],
      amount:[],
      xData:[],
      pay:[],
      xData_pay:[],
      recharge:[],
      xData_recharge: [],
      sum_url:'/its/operations/booked/amount',
      booked_url: '/its/operations/index/recordMoney',
      income_url: '/its/operations/index/incomeMoney',
      url_excel:'/its/operations/income/statementspda',
      recharge_url: '/its/operations/recharge/report'
    }
  },
  mounted() {
    this.get_time_interval(7)
    this.get_summary()
    this.get_booked()
    this.get_drowpay()
    this.get_recharge()
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
    get_booked () {
      let params = new URLSearchParams()
      params.append('daySum', 7)
      axios({
        method: 'post',
        url: this.booked_url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:params
      }).then(res => {
        console.log(res)
        this.xData = res.data.data.map(item => {
          return item.the_day
        })
        this.booked = res.data.data.map(item => {
          return item.booked_account
        })
        this.income = res.data.data.map(item => {
          return item.business_paid
        })
        this.advance = res.data.data.map(item => {
          return item.advance_account
        })
        this.drowbooked()
        axios({
          method: 'post',
          url: this.income_url,
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data:params
        }).then(res => {
          console.log(res)
          this.owe = res.data.data.map(item => {
            return item.owe_amount
          })
          this.amount = res.data.data.map(item => {
            return item.income_paid
          })
          this.drowincome()
        })
      })
    },
    //获取付费率
    get_drowpay () {
      console.log(this.time_interval)
      let params = new URLSearchParams()
      params.append('pageIndex', 1);
      params.append('sTime', this.time_interval[0])
      params.append('eTime', this.time_interval[1])
      this.get_my_list(params,this.url_excel,(res) => {
        console.log(res)
        let total = 0
        this.pay = res.data.data.map(item => {
          return (item.pay_rate * 100).toFixed(0)
        })
        this.pay.forEach(item => {
          total += (item * 1)
        })
        console.log(total)
        // this.pay.push((total/7).toFixed(2))
        this.xData_pay = res.data.data.map(item => {
          return item.the_day
        })
        console.log(this.pay)
        // this.xData_pay.push('7天付费率')
        this.drowpay()
      })
    },
    //获取充值金额
    get_recharge () {
      axios({
        method: 'post',
        url: this.recharge_url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:{}
      }).then(res => {
        console.log(res)
        let data = res.data.data.reverse()
        this.xData_recharge = data.map(item => {
          return item.click_date
        })
        this.recharge = data.map(item => {
          return item.sum
        })
        this.drowrecharge()
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
          'data': ['营业实收', '预收账款', '入账总额']
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
            name: '营业实收',
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
                  position: "inside",
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
            barMaxWidth: 35,
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
          'data': ['营业实收', '营收欠费', '营收总额']
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
            name: '营业实收',
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
                  position: "inside",
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
            barMaxWidth: 35,
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
                    // console.log(p)
                    // return p.value > 0 ? (p.value) : '';
                    return p.value + '%'
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
          data: that.xData_recharge
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
    background-color: #f5f5f5;
  }
  .header{
    width: 100%;
    height: 100px;
    /* border: 1px solid saddlebrown; */
    margin: 0 auto;
    background: #fff;
  }
  .total{
    width: 14%;
    height: 100px;
    /* border: 1px solid darkcyan; */
    float: left;
    text-align: center;
  }
  .text{
    font-size: 16px;
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

