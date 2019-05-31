<template>
  <div id="row">
    <!-- 区域和时间维度 -->
    <div class="dimension">
      <div class="select">
        <el-select v-model="sel_aere" placeholder="--全部区域--" class="aereselect">
          <el-option
            v-for="item in aeres"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="sel_park" placeholder="--全部停车场--" class="parkselect">
          <el-option
            v-for="item in parks"
            :key="item.parking_name"
            :label="item.parking_name"
            :value="item.parking_name">
          </el-option>
        </el-select>
        <el-select v-model="sel_kind" placeholder="--全部类别--" class="kindselect">
          <el-option
            v-for="item in kinds"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <!-- <div class="datadimension">
        <div class="radio-box" v-for="(item,index) in radios" :key="item.id">
          <span class="radio" :class="{'on':item.isChecked}"></span>
          <input v-model="radio" :value="item.value" class="input-radio" :checked='item.isChecked'  @click="check(index)" type="radio">{{item.label}}
        </div>
      </div> -->
      <button class="export" @click="export_order">导出</button>
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
            @change="use_mytime"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <button class="data_btn" @click="sel_btn">搜索</button>
      </div>
      <button class="form" @click="toform">{{fromtext}}</button>
    </div>
    <div v-if="isShow" class="sequential">
      <div class="revenue">
        <div class="revenue-header">
          <span class="headertext">订单量(个)</span>
          <span class="sequen">环比(%)</span>
        </div>
        <div class="revenue-cont">
          <ul>
            <li v-for="item in revenues" :key="item.id">
              <span>{{item.name}}:{{item.num}}</span>
              <span class="sequen">{{item.sequen}}</span>
              <img v-show="item.sequen>0" src="../../../assets/tubiao03.png" alt="">
              <img v-show="item.sequen<0" src="../../../assets/tubiao04.png" alt="">
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="isShow" id="chart" class="chart">
      <div class="switch_cont">
        <div class="switch_btn" @click="switch_btn">{{switch_text}}</div>
      </div>
      <div id="ordernum"></div>
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
          prop="num"
          label="订单量(个)">
        </el-table-column>
        <el-table-column
          prop="sequena"
          label="订单量环比(%)">
        </el-table-column>
        <el-table-column
          prop="sequenb"
          label="订单量同比(%)">
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
      total: 5000,
      switch_text:'环比',
      num:0,
      aeres: ['嵊州市','新昌县','诸暨市','上虞区','柯桥区','越城区'],
      parks: [],
      kinds: ['泊位停车','车库停车'],
      sel_aere:'',
      sel_park:'',
      sel_kind:'',
      radio: '1',
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
      recovered: [7090,19170,24550,26100,17190,14330,15440,32805,52080,33720,24840,40780],
      recoveredsequen: [103,269,296,281,251,191,174,267,120,232,286,129],
      norecoveredsequen: [10,26,29,28,25,19,17,26,12,23,28,12],
      xData: ['4.1','4.2','4.3','4.4','4.5','4.6','4.7','4.8','4.9','4.10','4.11','4.12'],
      list_detail:[
        {id:0,time:'2019-04-26',num:'1000',sequena:5.6,sequenb:6.5},
        {id:1,time:'2019-04-26',num:'1000',sequena:5.6,sequenb:6.5},
        {id:2,time:'2019-04-26',num:'1000',sequena:5.6,sequenb:6.5},
        {id:3,time:'2019-04-26',num:'1000',sequena:5.6,sequenb:6.5},
        {id:4,time:'2019-04-26',num:'1000',sequena:5.6,sequenb:6.5}
      ],
      list_num:5,
      pageIndex:1,
      ps:10,
      nowday:'',
      nowtime:'',
      url_order:'/its/admin/order/report',
      url_park:'/its/admin/query/berth'
    }
  },
  mounted() {
    this.get_park()
    this.get_order()
    this.drowordernum()
  },
  methods: {
    //获取停车场列表
    get_park(){
      axios({
        method: 'post',
        url:this.url_park,
        headers:{
          'Authorization':'Web 123213213',
          'content-type':'application/x-www-form-urlencoded'
        },
        data: {}
      }).then(res => {
        this.parks = res.data.data
      })
    },
    //获取订单环比
    get_order(){
      axios({
      method: 'post',
      url:this.url_order,
      headers:{
        'Authorization':'Web 123213213',
        'content-type':'application/x-www-form-urlencoded'
      },
      data: {}
      }).then(res => {
        let data = res.data.data
        if(!data.ordersRing){
          data.ordersRing = 0
        }
        if(!data.yesterdayOrdersRing){
          data.yesterdayOrdersRing = 0
        }
        this.revenues = [
          {name:'今日',sequen:(data.ordersRing*100).toFixed(2),num:data.orders},
          {name:'昨日',sequen:(data.yesterdayOrdersRing*100).toFixed(2),num:data.yesterdayOrders},
          {name:'近一周',sequen:(0).toFixed(2),num:data.weeksOrders},
          {name:'近一月',sequen:(0).toFixed(2),num:data.monthOrders}
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
        if(index != 2){
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
    },
    //订单统计表格导出
    export_order(){
      require.ensure([], () => {　　　　　　　　
        const { export_json_to_excel } = require('../../../excel/Export2Excel.js');　　//引入文件　　　　　　
        const tHeader = ['时间', '订单量(个)', '订单量环比(元)','订单量同比(%)']; //将对应的属性名转换成中文
        //const tHeader = [];　
        const filterVal = ['time', 'num', 'sequena','sequenb'];//table表格中对应的属性名　　　　　 　　　
        const list = this.orderdata;　　//想要导出的数据　　　　　　
        const data = this.formatJson(filterVal, list);
        this.get_nowtime()
        let title = '订单统计列表' + this.nowday　　　　　　　　　
        export_json_to_excel(tHeader, data, title, this.nowtime);
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //维度切换
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
      this.dataradios.forEach((item) => {
        item.isChecked = false;
      });
      this.dataradio = this.dataradios[index].value;
      this.dataradios[index].isChecked = true;
      this.get_time_interval(this.dataradio)
    },
    //表格和图表切换
    toform(){
      this.isShow = !this.isShow
      if(this.isShow){
        setTimeout(() => {
          this.drowordernum()
        }, 1000);
        this.fromtext = '表格数据'
      }
      if(!this.isShow){
        this.fromtext = '可视化报表'
      }
    },
    //图表绘制
    drowordernum(){
      let that = this
      let myordernum = this.$echarts.init(document.getElementById('ordernum'))
      myordernum.setOption({
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
          x: '50%',
          top: '0',
          textStyle: {
            color: '#90979c',
          },
          'data': ['订单总量', '订单量环比','订单量同比']
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
          },
          {
            name: '环比(%)',
            splitLine: {                // 网格线 y轴对应的是否显示
              show: false
            },
            min: -200,
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
          bottom: 10,
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
            name: '订单总量',
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
            data: that.recovered
          },
          {
            name: '订单量环比',
            type: 'line',
            // stack: '总量',
            symbolSize: 5,
            symbol:'circle',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: "rgba(0,191,13,1)",
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
            data: that.recoveredsequen
          },
          {
            name: '订单量同比',
            type: 'line',
            // stack: '总量',
            symbolSize: 5,
            symbol:'circle',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: "rgba(255,144,128,1)",
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
            data: that.norecoveredsequen
          }
        ]
      })
      window.addEventListener("resize",function(){
        myordernum.resize();
      });
    },
    //自定义时间范围清除时间范围选择
    use_mytime(){
      this.dataradios.forEach((item) => {
        item.isChecked = false
      })
    },
    //搜索
    sel_btn(){

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
    }
  },
}
</script>
<style scoped>
#row{
  width: 100%;
  height: 100%;
  /* background: rgb(15, 24, 48); */
  color: #000;
}
.dimension{
  width: 100%;
  height: 120px;
  position: relative;
  background: #fff;
}
.select{
  width: 750px;
  height: 40px;
  margin-left: 5%;
  position: absolute;
  top: 20px;
}
.aereselect,.parkselect,.kindselect{
  width: 200px;
  height: 30px;
  margin-left: 20px;
}
.datadimension{
  width: 350px;
  height: 40px;
  margin-left: 12%;
  background: #fff;
  position: absolute;
  top: 70px;
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
  margin-top: 10px;
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
  border-bottom: 1px
}
.revenue-cont>ul>li>span,.owe-cont>ul>li>span,.owe-header>span,.revenue-header>span{
  display: inline-block;
  width: 100px;
}
.sequen{
  text-align: center;
  margin-left: 20%;
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
  height: 435px;
  margin-top: 20px;
  position: relative;
  background: #fff;
}
#ordernum{
  width: 90%;
  height: 100%;
  margin: 0 auto 0;
  z-index: 2000;
}
.table{
  width: 100%;
  /* height: 680px; */
  /* border: 1px solid hotpink; */
  margin-top: 20px;
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
.block{
  float: left;
  height: 40px;
  margin-top: -2px;
}
</style>

