<template>
  <div id="row">
    <!-- 区域和时间维度 -->
    <div class="dimension">
      <!-- <div class="datadimension">
        <div class="radio-box" v-for="(item,index) in radios" :key="item.id">
          <span class="radio" :class="{'on':item.isChecked}"></span>
          <input v-model="radio" :value="item.value" class="input-radio" :checked='item.isChecked'  @click="check(index)" type="radio">{{item.label}}
        </div>
      </div> -->
      <div class="select">
        <el-select v-model="sel_qudao" class="aereselect" placeholder="--全部渠道--">
          <el-option value="appType" >APP</el-option>
          <el-option value="smallType" >微信小程序</el-option>
        </el-select>
      </div>
      <button class="export" @click="export_recharge">导出</button>
    </div>
    <!-- 事件区间选择 -->
    <div class="datesearch">
      <div class="dataradiocont">
        <div class="datamain">
          <div class="dataradio-box" v-for="(item,index) in dataradios" :key="item.id">
            <span class="dataradio" :class="{'dataon':item.isChecked}"></span>
            <input v-model="radio" :value="item.value" class="input-dataradio" :checked='item.isChecked'  @click="datacheck(index)" type="radio">{{item.label}}
          </div>
        </div>
      </div>
      <div class="data-interval">
        <div class="block">
          <el-date-picker
            v-model="time_interval"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <button class="data_btn" @click="selectorder">搜索</button>
      </div>
      <button class="form" @click="toform">{{fromtext}}</button>
    </div>
    <!-- 环比图 -->
    <div v-if="isShow" class="sequential">
      <div class="revenue">
        <div class="revenue-header">
          <span class="headertext">充值金额</span>
          <span class="sequen">环比</span>
        </div>
        <div class="revenue-cont">
          <ul>
            <li v-for="item in revenues" :key="item.id">
              <span class="num_all">{{item.name}}：{{item.num}}</span>
              <span class="sequen">{{item.sequen}}</span>
              <img v-show="item.sequen > 0" src="../../../assets/tubiao03.png" alt="">
              <img v-show="item.sequen < 0" src="../../../assets/tubiao04.png" alt="">
            </li>
          </ul>
        </div>
      </div>
      <div class="owe">
        <div class="owe-header">
          <span class="headertext">余额</span>
          <span class="sequen">环比</span>
        </div>
        <div class="owe-cont">
          <ul>
            <li v-for="item in owes" :key="item.id">
              <span class="num_all">{{item.name}}：{{item.num}}</span>
              <span class="sequen">{{item.sequen}}</span>
              <img v-show="item.sequen > 0" src="../../../assets/tubiao03.png" alt="">
              <img v-show="item.sequen < 0" src="../../../assets/tubiao04.png" alt="">
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 图表 -->
    <div v-if="isShow" id="chart" class="chart">
      <div class="switch_cont">
        <div class="switch_btn" @click="switch_btn">{{switch_text}}</div>
      </div>
      <div id="recharge"></div>
    </div>
    <div v-if="!isShow" class="table">
      <el-table
        :summary-method="getSummaries"
        show-summary
        :data="list_detail"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index">
        </el-table-column>
        <el-table-column
          prop="time"
          label="时间">
        </el-table-column>
        <el-table-column
          sortable
          prop="money"
          label="充值金额(元)">
        </el-table-column>
        <el-table-column
          sortable
          prop="nomoney"
          label="余额(元)">
        </el-table-column>
        <el-table-column
          prop="sequena"
          label="充值金额环比(%)">
        </el-table-column>
        <el-table-column
          prop="sequenb"
          label="余额环比(%)">
        </el-table-column>
        <el-table-column
          prop="sequenc"
          label="充值金额同比(%)">
        </el-table-column>
        <el-table-column
          prop="sequend"
          label="余额同比(%)">
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="page_change"
        :current-page="pageIndex"
        :page-size='ps'
        layout="total, prev, pager, next, jumper"
        :total="list_num">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import axios from 'axios';
export default {
  data() {
    return {
      time_interval: '',    //时间区间
      sel_qudao:'',
      radio: '1',
      switch_text:'环比',
      num:0,
      radios:[
        {
          label: '天维度',
          value:'1',
          isChecked: true,
        },
        {
          label: '周维度',
          value:'2',
          isChecked: false,
        },
        {
          label: '月维度',
          value:'3',
          isChecked: false,
        }
      ],
      isShow: true,
      fromtext:'表格数据',
      dataradio: '',
      dataradios: [
        {label: '近7天',value:'7',isChecked: false,},
        {label: '近30天',value:'30',isChecked: false,},
        {label: '近4周',value:'3',isChecked: false,},
        {label: '近12周',value:'4',isChecked: false,},
        {label: '近6月',value:'5',isChecked: false,},
        {label: '近12月',value:'6',isChecked: false,}
      ],
      revenues: [],
      owes: [],
      allmoney: [7090,19170,24550,26100,17190,14330,15440,32805,52080,33720,24840,40780],
      balance: [5000,12006,21000,19000,13000,9000,10000,26000,40000,20000,22000],
      allmoneysequen: [103,169,196,181,251,-91,104,-67,120,-32,-86,129],
      balancesequen: [10,26,29,28,25,19,17,26,12,23,28,12],
      xData: ['4.1','4.2','4.3','4.4','4.5','4.6','4.7','4.8','4.9','4.10','4.11','4.12'],
      list_detail:[
        {id:0,time:'2019-04-01',money:50000,nomoney:1000,sequena:4.1,sequenb:4.2,sequenc:4.3,sequend:4.4},
        {id:1,time:'2019-04-01',money:50000,nomoney:1000,sequena:4.1,sequenb:4.2,sequenc:4.3,sequend:4.4},
        {id:2,time:'2019-04-01',money:50000,nomoney:1000,sequena:4.1,sequenb:4.2,sequenc:4.3,sequend:4.4},
        {id:3,time:'2019-04-01',money:50000,nomoney:1000,sequena:4.1,sequenb:4.2,sequenc:4.3,sequend:4.4},
        {id:4,time:'2019-04-01',money:50000,nomoney:1000,sequena:4.1,sequenb:4.2,sequenc:4.3,sequend:4.4},
        {id:5,time:'2019-04-01',money:50000,nomoney:1000,sequena:4.1,sequenb:4.2,sequenc:4.3,sequend:4.4},
        {id:6,time:'2019-04-01',money:50000,nomoney:1000,sequena:4.1,sequenb:4.2,sequenc:4.3,sequend:4.4},
        {id:7,time:'2019-04-01',money:50000,nomoney:1000,sequena:4.1,sequenb:4.2,sequenc:4.3,sequend:4.4}
      ],
      nowday:'',
      nowtime:'',
      pageindex: 1,
      ps:10,
      list_num:8,
      total:40000,
      nototal:8000,
      url: 'http://www.lcgxlm.com:13259/its/admin/topup/statements',
      url1: 'http://www.lcgxlm.com:13259/its/admin/user/balance'
    }
  },
  mounted() {
    this.get_rech()
    this.get_balance()
    this.drowrecharge()
  },
  methods: {
    //获取充值环比
    get_rech(){
       axios({
        method: 'post',
        url: this.url,
        headers:{
        'Authorization':'Web 123213213',
        'content-type':'application/x-www-form-urlencoded'
        },
        data:{}
      }).then(res => {
        console.log(res)
        let data = res.data.data
        console.log(data)
        if(!data.todayAmountRing){
          data.todayAmountRing = 0
        }
        if(!data.yesterdayAmountRing){
          data.yesterdayAmountRing = 0
        }
        if(!data.todayAmount){
          data.todayAmount = 0
        }
        if(!data.yesterdayAmount){
          data.yesterdayAmount = 0
        }
        this.revenues = [
          {name:'今日',sequen:(data.todayAmountRing*100).toFixed(2),num:data.todayAmount},
          {name:'昨日',sequen:(data.yesterdayAmountRing*100).toFixed(2),num:(data.yesterdayAmount).toFixed(2)},
          {name:'近一周',sequen:(0).toFixed(2),num:data.weeksAmount},
          {name:'近一月',sequen:(0).toFixed(2),num:(data.monthAmount).toFixed(2)}
        ]
      })
    },
    //获取余额环比
    get_balance(){
      axios({
        method: 'post',
        url: this.url1,
        headers:{
        'Authorization':'Web 123213213',
        'content-type':'application/x-www-form-urlencoded'
        },
        data:{}
      }).then(res => {
        let data = res.data.data
        if(!data.todayBalanceRing){
          data.todayBalanceRing = 0
        }
        if(!data.yesterdayBalanceRing){
          data.yesterdayBalanceRing = 0
        }
        this.owes = [
          {name:'今日',sequen:(data.todayBalanceRing*100).toFixed(2),num:data.todayBalance},
          {name:'昨日',sequen:(data.yesterdayBalanceRing*100).toFixed(2),num:data.yesterdayBalance},
          {name:'上一周',sequen:(0).toFixed(2),num:data.weeksBalance},
          {name:'上一月',sequen:(0).toFixed(2),num:data.monthBalance}
        ]
      })
    },
    //表格合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计';
          return;
        }
        if(index != 2 && index != 3){
          sums[index] = '';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(2)
          sums[index] += ' 元';
        } else {
          sums[index] = '';
        }
      });
      return sums;
    },
    page_change(val){
      this.pageIndex = val
      let params = new URLSearchParams()
      params.append('pageIndex', this.pageIndex)
      params.append('ps', this.ps)
      this.get_report_list(params,this.url_excel)
    },
    //充值统计表格导出
    export_recharge(){
      require.ensure([], () => {　　　　　　　　
        const { export_json_to_excel } = require('../../../excel/Export2Excel.js');　　//引入文件　　　　　　
        const tHeader = ['时间', '充值金额(个)', '余额(元)','充值金额环比(%)','余额环比','充值金额同比(%)','余额同比']; //将对应的属性名转换成中文
        //const tHeader = [];　
        const filterVal = ['time', 'money', 'nomoney','sequena','sequenb','sequenc','sequend'];//table表格中对应的属性名　　　　　 　　　
        const list = this.recdata;　　//想要导出的数据　　　　　　
        const data = this.formatJson(filterVal, list);
        this.get_nowtime()
        let title = '充值统计列表' + this.nowday
        export_json_to_excel(tHeader, data, title, this.nowtime);
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //时间维度切换
    check(index) {
      // 先取消所有选中项
      this.radios.forEach((item) => {
        item.isChecked = false;
      });
      //再设置当前点击项选中
      this.radio = this.radios[index].value;
      // 设置值，以供传递
      this.radios[index].isChecked = true;
      console.log(this.radio);
      $('.datamain').animate({left:-(this.radio-1)*180 + 'px'})
    },
    //时间范围切换
    datacheck(index) {
      // 先取消所有选中项
      this.dataradios.forEach((item) => {
        item.isChecked = false;
      });
      //再设置当前点击项选中
      this.dataradio = this.dataradios[index].value;
      this.dataradios[index].isChecked = true;
      this.get_time_interval(this.dataradio)
    },
    //表格和图表切换
    toform(){
      this.isShow = !this.isShow
      if(this.isShow){
        setTimeout(() => {
          this.drowrecharge()
        }, 1000);
        this.fromtext = '表格数据'
      }
      if(!this.isShow){
        this.fromtext = '可视化报表'
      }
    },
    //绘制图表
    drowrecharge(){
      let that = this
      let myrecharge = this.$echarts.init(document.getElementById('recharge'))
      myrecharge.setOption({
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
          "top": 10,
          "bottom": 45,
          containLabel: true,
          textStyle: {
            color: "#000"
          }
        },
        legend: {
          x: '30%',
          top: '0',
          textStyle: {
            color: '#90979c',
          },
          'data': ['充值总金额', '余额','充值总金额环比','余额环比']
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
              formatter: '{value}人'
            },
            axisLine: {
              lineStyle:{
                color: '#000'
              }
            },
          },
          {
            name: '环比(%)',
            splitLine: {                // 网格线 y轴对应的是否显示
              show: false
            },
            min: -100,
            max: 300,
            type: 'value',
            inverse: false,
            axisLine: {
              lineStyle:{
                color: '#000'
              }
            },
            axisLabel: {
              formatter: '{value}%'
            },
          }
        ],
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
            color:"#000"
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
            name: '充值总金额',
            type: 'bar',
            // stack: '总量',
            color: '#00BFFF',
            barMaxWidth: 25,
            markPoint : {
              data : [
                {type : 'max', name : '最大值'},
                {type : 'min', name : '最小值'}
              ]
            },
            markLine : {
              data : [
                {type : 'average', name : '平均值'}
              ]
            },
            itemStyle: {
              normal: {
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
            data: that.allmoney
          },
          {
            name: '余额',
            type: 'bar',
            // stack: '总量',
            color: '#DC143C',
            barMaxWidth: 25,
            markPoint : {
              data : [
                {type : 'max', name : '最大值'},
                {type : 'min', name : '最小值'}
              ]
            },
            markLine : {
              data : [
                {type : 'average', name : '平均值'}
              ]
            },
            itemStyle: {
              normal: {
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
            data: that.balance
          },
          {
            name: '余额环比',
            type: 'line',
            // stack: '总量',
            symbolSize: 5,
            symbol:'circle',
            yAxisIndex: 1,
            markPoint : {
                data : [
                    {type : 'max', name : '最大值'},
                    {type : 'min', name : '最小值'}
                ]
            },
            itemStyle: {
              normal: {
                color: "#DC143C",
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
            data: that.balancesequen
          },
          {
            name: '充值总金额环比',
            type: 'line',
            // stack: '总量',
            symbolSize: 5,
            symbol:'circle',
            yAxisIndex: 1,
            markPoint : {
                data : [
                    {type : 'max', name : '最大值'},
                    {type : 'min', name : '最小值'}
                ]
            },
            itemStyle: {
              normal: {
                color: "#00BFFF",
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
            data: that.allmoneysequen
          }
        ]
      })
      window.addEventListener("resize",function(){
        myrecharge.resize();
      });
    },
    //环比同比切换
    switch_btn(){
      if(this.num == 0){
        this.switch_text = '同比';
        $('.switch_btn').animate({left: 30 + 'px'})
        this.num ++
      }else{
        this.switch_text = '环比';
        $('.switch_btn').animate({left: 0 + 'px'})
        this.num = 0
      }
    },
    //搜索
    selectorder(){

    }
  },
}
</script>
<style scoped>
#row{
  width: 100%;
  height: 100%;
  /* background: rgb(219, 219, 219); */
  color: #000;
}
.dimension{
  width: 100%;
  height: 120px;
  position: relative;
  background: #fff;
}
.datadimension{
  width: 350px;
  height: 40px;
  position: absolute;
  left: 10%;
  top: 40px;
}
.radio-box{
  display: inline-block;
  position: relative;
  height: 25px;
  line-height: 25px;
  margin-right: 5px;
}
.radio,.dataradio{
  display: inline-block;
  width: 25px;
  height: 25px;
  vertical-align: middle;
  cursor: pointer;
  background: #eee;
  border-radius: 50%;
}
.input-radio,.input-dataradio{
  display: inline-block;
  position: absolute;
  opacity: 0;
  width: 25px;
  height: 25px;
  cursor: pointer;
  left: 0px;
  outline: none;
  -webkit-appearance: none;
}
.on,.dataon{
  background-image: url('../../../assets/xuanze.png');
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
}
.export{
  position: absolute;
  right: 50px;
  top: 45px;
  width: 100px;
  height: 30px;
  font-size: 18px;
  font-weight: 600;
  background: #0ab088;
  border: 0;
  border-radius: 5px;
  box-shadow: 2px 2px 2px #0ab088;
}
.dataradiocont{
  width: 180px;
  height: 30px;
  /* border: 1px solid gold; */
  margin: 25px 0 0 3%;
  overflow: hidden;
  position: absolute;
}
.datamain{
  height: 25px;
  width: 720px;
  position: absolute;
  top: 0;
  left: 0;
}
.dataradio-box{
  display: inline-block;
  position: relative;
  height: 25px;
  line-height: 25px;
  /* margin-right: 5px; */
  /* border: 1px solid red; */
  width:90px;
}
.datesearch{
  width: 100%;
  height: 80px;
  margin-top: 10px;
  position: relative;
  background: #fff;
}
.data-interval{
  width: 620px;
  height: 40px;
  /* border: 1px solid greenyellow; */
  position: absolute;
  top: 20px;
  left: 300px;
  line-height: 40px;
  font-size: 20px;
}
.data_btn{
  width: 80px;
  height: 40px;
  border: 0;
  background: #01fbfe;
  font-size: 18px;
  margin-left: 10px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
.form{
  width: 100px;
  height: 40px;
  position: absolute;
  background: #0ab088;
  border: 0;
  right: 50px;
  top: 20px;
  border-radius: 5px;
}
.sequential{
  width: 100%;
  height: 200px;
  margin-top: 20px;
  position: relative;
  background: #fff;
}
.revenue,.owe{
  width: 30%;
  height: 180px;
  /* border: 1px solid blueviolet; */
  float: left;
  margin: 10px 0 0 13%;;
}
.revenue-header,.owe-header{
  width: 100%;
  height: 40px;
  /* line-height: 40px; */
  /* border-bottom: 1px solid navajowhite; */
}
.headertext{
  width: 150px;
  font-size: 20px;
  font-weight: 600;
}
.revenue-cont,.owe-cont{
  width: 100%;
  height: 140px;
}
.revenue-cont>ul>li,.owe-cont>ul>li{
  width: 100%;
  height: 35px;
  line-height: 35px;
  position: relative;
}
.revenue-cont>ul>li>span,.owe-cont>ul>li>span,.owe-header>span,.revenue-header>span{
  display: inline-block;
}
.num_all{
  width: 150px;
}
.sequen{
  text-align: center;
  margin-left: 20%;
  width: 50px;
}
.revenue-cont>ul>li>img,.owe-cont>ul>li>img{
  width: 35px;
  height: 35px;
  position: absolute;
  right: 0;
  top: 0;
}
.chart{
  width: 100%;
  height: 415px;
  margin-top: 30px;
  position: relative;
  background: #fff;
}
#recharge{
  width: 90%;
  height: 100%;
  margin: 0 auto 0;
  background: #fff;
  z-index: 2000;
}
.table{
  width: 100%;
  /* height: 675px; */
  /* border: 1px solid hotpink; */
  margin-top: 20px;
  background: #fff;
  position: relative;
}
.table>>>.is-leaf{
  text-align: center;
}
.table>>>th{
  text-align: center;
  padding: 8px 0;
  vertical-align: middle;
}
.table>>>td{
  text-align: center;
}
/* 分页控制 */
.el-pagination{
  width: 580px;
  height: 30px;
  position: absolute;
  bottom: 10px;
  right: 80px;
}
.switch_cont{
  position: absolute;
  right: 40px;
  top: 20px;
  width: 80px;
  height: 30px;
  background: #01fbfe;
  z-index: 8001;
}
.switch_btn{
  position: absolute;
  left: 0;
  line-height: 30px;
  width: 50px;
  height: 30px;
  text-align: center;
  background: #025b9b;
  cursor: pointer;
}
.select{
  position: absolute;
  width: 200px;
  height: 30px;
  /* border: 1px solid navy; */
  top: 30px;
  left: 50px;
}
.aereselect{
  width: 100%;
  height: 100%;
}
.block{
  float: left;
  height: 40px;
  margin-top: -2px;
}
</style>

