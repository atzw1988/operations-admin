<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 14:55:23
 * @LastEditTime: 2019-09-02 18:45:31
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="row">
    <div class="header">
      <div class="up">
        <template>
          <el-select  style="margin-left:30px" v-model="erar_name" clearable placeholder="全部区域">
            <el-option
              v-for="item in erae"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
        <!-- <template>
          <el-select v-model="park_name" clearable placeholder="全部停车场">
            <el-option
              v-for="item in parks"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template> -->
        <!-- <template>
          <el-select v-model="kind_name" clearable placeholder="全部类别">
            <el-option
              v-for="item in kinds"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template> -->
      </div>
      <div class="down">
        <div class="datamain" style="margin-left:30px">
          <div class="dataradio-box" v-for="(item,index) in dataradios" :key="item.id">
            <span class="dataradio" :class="{'dataon':item.isChecked}"></span>
            <input v-model="radio" :value="item.value" class="input-dataradio" :checked='item.isChecked'  @click="datacheck(index)" type="radio">{{item.label}}
          </div>
        </div>
        <div class="time">
          <el-date-picker
            v-model="time_interval"
            type="daterange"
            align="right"
            unlink-panels
            format='yyyy-MM-dd'
            value-format='yyyy/MM/dd'
            @change='use_mytime'
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-button type="primary" @click="sel_btn">搜索</el-button>
        </div>
        <el-button type="success" class="from" @click="toform">{{fromtext}}</el-button>
      </div>
    </div>
    <!-- <div class="percent" v-if="table_show">
      <div class="total">
        <div class="header_text">
          <div class="text">入账金额(元)</div>
          <div class="text_one">环比(%)</div>
        </div>
        <div class="per_data">
          <div v-for="item in booked" class="line">
            <div class="left">{{item.name}}:{{item.num}}</div>
            <div class="right">{{item.sequen}}</div>
            <div class="data_img">
              <img v-show="item.sequen>0" src="../../../assets/tubiao03.png" alt="">
              <img v-show="item.sequen<0" src="../../../assets/tubiao04.png" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="total">
        <div class="header_text">
          <div class="text">营业实收(元)</div>
          <div class="text_one">环比(%)</div>
        </div>
        <div class="per_data">
          <div v-for="item in income" class="line">
            <div class="left">{{item.name}}:{{item.num}}</div>
            <div class="right">{{item.sequen}}</div>
            <div class="data_img">
              <img v-show="item.sequen>0" src="../../../assets/tubiao03.png" alt="">
              <img v-show="item.sequen<0" src="../../../assets/tubiao04.png" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="total">
        <div class="header_text">
          <div class="text">预收账款(元)</div>
          <div class="text_one">环比(%)</div>
        </div>
        <div class="per_data">
          <div v-for="item in recharge" class="line">
            <div class="left">{{item.name}}:{{item.num}}</div>
            <div class="right">{{item.sequen}}</div>
            <div class="data_img">
              <img v-show="item.sequen>0" src="../../../assets/tubiao03.png" alt="">
              <img v-show="item.sequen<0" src="../../../assets/tubiao04.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="content" v-if="table_show">
      <div id="chart"></div>
    </div>
    <div class="table" v-if="!table_show">
      <el-table
        :data="tableData"
        show-summary
        :summary-method="getSummaries"
        style="width: 100%">
        <el-table-column
          label="序号"
          width="70"
          type="index">
        </el-table-column>
        <el-table-column
          prop="the_day"
          label="日期">
        </el-table-column>
        <el-table-column label="入账金额">
          <el-table-column
            prop="business_paid"
            label="营业实收">
          </el-table-column>
          <el-table-column
            prop="advance_account"
            label="预收账款">
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="booked_account"
          label="入账总金额">
        </el-table-column>
        <el-table-column label="营业实收">
          <el-table-column
            prop="business_paid_cash"
            label="现金">
          </el-table-column>
          <el-table-column
            prop="business_paid_online"
            label="微信/支付宝">
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="page_change"
        @size-change="handleSizeChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size='ps'
        layout="total, sizes, prev, pager, next, jumper"
        :total="list_num">
      </el-pagination>
      <div class="notice">
        <p>费用结算说明:</p>
        <p class="n_detail">入账金额：当日收到金额，由营业实收+预收账款构成</p>
        <p class="n_detail">营业实收：当天已付款的订单总额 (包含当天产生已付款、之前欠费今天付款的订单)，支付方式含现金支付、微信/支付宝支付</p>
        <p class="n_detail">预收账款：用户预充值但还未用于停车的金额</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      erar_name:'',
      park_name:'',
      kind_name:'',
      erae:[
        {label:'嵊州市',value:0},
        {label:'诸暨市',value:1},
        {label:'新昌县',value:2},
        {label:'越城区',value:3},
        {label:'柯桥区',value:4},
        {label:'上虞区',value:5}
      ],
      parks:[
        {label:'龙盛路',value:0},
        {label:'龙盛路1',value:1},
        {label:'龙盛路2',value:2},
        {label:'龙盛路3',value:3}
      ],
      kinds:[
        {label:'路边停车',value:0},
        {label:'路边停车1',value:1},
        {label:'路边停车2',value:2}
      ],
      radio:'1',
      dataradios: [
        {label: '近7天',value:'7',isChecked: true},
        {label: '近30天',value:'30',isChecked: false}
      ],
      time_interval:'',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      booked:[
        {name:'今日',num:10000,sequen:10.00},
        {name:'昨日',num:10000,sequen:10.00},
        {name:'近一周',num:10000,sequen:10.00},
        {name:'近一月',num:10000,sequen:-10.00},
      ],
      income:[
        {name:'今日',num:10000,sequen:10.00},
        {name:'昨日',num:10000,sequen:10.00},
        {name:'近一周',num:10000,sequen:10.00},
        {name:'近一月',num:10000,sequen:-10.00},
      ],
      recharge:[
        {name:'今日',num:10000,sequen:10.00},
        {name:'昨日',num:10000,sequen:10.00},
        {name:'近一周',num:10000,sequen:10.00},
        {name:'近一月',num:10000,sequen:-10.00},
      ],
      xData:[],
      booked_list:[],
      income_list:[],
      recharge_list:[],
      table_show: true,
      fromtext:'表格数据',
      tableData:[],
      url_excel:'/its/operations/financial/statements',
      pageIndex:1,
      ps:10,
      list_num:0,
      start:0,
      end:100,
    }
  },
  mounted() {
    this.get_time_interval(7)
    this.get_my_excel()
    this.get_my_echart()
  },
  methods: {
    //封装获取表格数据
    get_excel_list(params){
      this.get_my_list(params,this.url_excel,(res) => {
        console.log(res)
        let list = res.data.data.data
        this.list_num = res.data.data.tr
        this.tableData = res.data.data.data
      })
    },
    //封装获取图表数据
    get_echart_list(params){
      this.get_my_list(params,this.url_excel,(res) => {
        console.log(res)
        let list = res.data.data
        list.forEach(item => {
          this.xData.push(item.the_day)
          this.booked_list.push(item.booked_account)
          this.income_list.push(item.business_paid)
          this.recharge_list.push(item.advance_account)
        })
        if(list.length <= 10){
          this.end = 100
        }else if(list.length > 10 && list.length <= 20){
          this.end = 70
        }else if(list.length > 20 && list.length <= 30){
          this.end = 50
        }else{
          this.end = 30
        }
        if(this.table_show){
          this.drowchart()
        }
      })
    },
    //获取默认表格数据
    get_my_excel(){
      let params = new URLSearchParams();
      params.append('pageIndex', this.pageIndex);
      params.append('ps', this.ps)
      params.append('sTime', this.time_interval[0])
      params.append('eTime', this.time_interval[1])
      this.get_excel_list(params)
    },
    //获取默认图表数据
    get_my_echart(){
      let params = new URLSearchParams();
      params.append('pageIndex', this.pageIndex);
      params.append('sTime', this.time_interval[0])
      params.append('eTime', this.time_interval[1])
      this.get_echart_list(params)
    },
    //周期切换
    datacheck(index) {
      this.xData = []
      this.booked_list = []
      this.income_list = []
      this.recharge_list = []
      this.dataradios.forEach((item) => {
        item.isChecked = false;
      });
      this.dataradio = this.dataradios[index].value;
      this.dataradios[index].isChecked = true;
      this.get_time_interval(this.dataradio)
      let params = new URLSearchParams();
      params.append('pageIndex', this.pageIndex);
      params.append('sTime', this.time_interval[0])
      params.append('eTime', this.time_interval[1])
      params.append('ps', this.ps)
      this.get_excel_list(params)
      let paramsdata = new URLSearchParams();
      paramsdata.append('pageIndex', this.pageIndex);
      paramsdata.append('sTime', this.time_interval[0])
      paramsdata.append('eTime', this.time_interval[1])
      this.get_echart_list(paramsdata)
    },
    //绘制图表
    drowchart(){
      let that = this
      let mychart = this.$echarts.init(document.getElementById('chart'))
      mychart.setOption({
        title: {
          "text": "财务报表",
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
          "bottom": 40,
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
          'data': ['入账总额', '营业实收', '预收账款']
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
        dataZoom: [{
          show: true,
          height: 20,
          xAxisIndex: [0],
          bottom: 10,
          start: this.start,
          end: this.end,
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
            name: '入账总额',
            type: 'bar',
            barMaxWidth: 35,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: "rgba(0,191,183,1)",
                label: {
                  show: true,
                  position: "insideTop",
                  formatter: function (p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            data: that.booked_list
          },
          {
            name: '营业实收',
            type: 'bar',
            barMaxWidth: 35,
            itemStyle: {
              normal: {
                color: "#DC143C",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "insideTop",
                  formatter: function (p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            data: that.income_list
          },
          {
            name: '预收账款',
            type: 'bar',
            barMaxWidth: 35,
            itemStyle: {
              normal: {
                color: "#00BFFF",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "insideTop",
                  formatter: function (p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            data: that.recharge_list
          }
        ]
      })
      window.addEventListener("resize",function(){
        mychart.resize();
      });
    },
    //表格和图表切换
    toform(){
      this.table_show = !this.table_show
      console.log(this.table_show)
      if(this.table_show){
        setTimeout(() => {
          this.drowchart()
        }, 1000);
        this.fromtext = '表格数据'
      }
      if(!this.table_show){
        this.table_show = false
        this.fromtext = '可视化报表'
      }
    },

    //换页
    page_change(val){
      this.pageIndex = val
      let params = new URLSearchParams();
      params.append('pageIndex', this.pageIndex);
      params.append('ps', this.ps)
      params.append('sTime', this.time_interval[0])
      params.append('eTime', this.time_interval[1])
      this.get_my_list(params,this.url_excel,(res) => {
        console.log(res)
        this.list_num = res.data.data.tr
        this.tableData = res.data.data.data
      })
    },
    //切换每页条数
    handleSizeChange(val){
      this.pageIndex = 1
      this.ps = val
      let params = new URLSearchParams();
      params.append('pageIndex', this.pageIndex);
      params.append('ps', this.ps)
      params.append('sTime', this.time_interval[0])
      params.append('eTime', this.time_interval[1])
      this.get_my_list(params,this.url_excel,(res) => {
        console.log(res)
        this.list_num = res.data.data.tr
        this.tableData = res.data.data.data
      })
    },
    //搜索
    sel_btn(){
      if (this.erar_name != 0) {
        this.$notify({
          title: '温馨提示',
          message: '所选区域无数据',
          type: 'warning',
          offset: 100
        })
        return
      }
      this.xData = []
      this.booked_list = []
      this.income_list = []
      this.recharge_list = []
      if(!this.time_interval){
        this.$notify({
          title: '温馨提示',
          message: '必须选择时间范围',
          type: 'warning',
          offset: 100
        })
        return false
      }
      let params = new URLSearchParams();
      params.append('pageIndex', this.pageIndex);
      params.append('sTime', this.time_interval[0])
      params.append('eTime', this.time_interval[1])
      params.append('ps', this.ps)
      this.get_excel_list(params)
      let paramsdata = new URLSearchParams();
      paramsdata.append('pageIndex', this.pageIndex);
      paramsdata.append('sTime', this.time_interval[0])
      paramsdata.append('eTime', this.time_interval[1])
      this.get_echart_list(paramsdata)
    },
    //自定义时间范围清除时间范围选择
    use_mytime(){
      this.dataradios.forEach((item) => {
        item.isChecked = false
      })
    },
    getSummaries(param){
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '当页合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' 元';
        } else {
          sums[index] = '';
        }
      })
      return sums
    }
  },
}
</script>
<style scoped>
#row{
  width: 100%;
  /* height: 100%; */
  background-color: #f5f5f5 !important;
}
/* 头部区间选择 */
.header{
  width: 100%;
  height: 150px;
  background: #fff;
  padding-top: 20px;
}
.datamain{
  height: 25px;
  width: 200px;
  /* position: absolute; */
  float: left;
  margin-top: 30px;
}
.time{
  float: left;
  margin-top: 25px;
}
.from{
  float: right;
  margin-top: 25px;
  margin-right: 20px;
}
.dataradio-box{
  display: inline-block;
  position: relative;
  height: 25px;
  line-height: 25px;
  width:90px;
}
.dataradio{
  display: inline-block;
  width: 25px;
  height: 25px;
  vertical-align: middle;
  cursor: pointer;
  background: #eee;
  border-radius: 50%;
}
.dataon{
  background-image: url('../../../assets/xuanze.png');
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
}
.input-dataradio{
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
/* 环比 */
.percent{
  width: 100%;
  height: 200px;
  background: #fff;
  margin-top: 20px;
}
.total{
  width: 30%;
  height: 200px;
  float: left;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 1.5%;
  border: 1px solid #9999;
}
.header_text{
  height: 40px;
  background: #1296db;
}
.text{
  font-size: 20px;
  font-weight: 500;
  float: left;
  line-height: 40px;
  margin-left: 20px;
}
.text_one{
  float: right;
  margin-right: 80px;
  line-height: 40px;
}
.line{
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: relative;
}
.left{
  float: left;
  margin-left: 20px;
}
.data_img,.right{
  position: absolute;
}
.data_img{
  right: 0;
}
.right{
  right: 100px;
}
.data_img>img{
  width: 40px;
  height: 40px;
}
/* 图表 */
.content{
  width: 100%;
  height: 710px;
  margin-top: 20px;
  background: #fff;
}
#chart{
  width: 100%;
  height: 100%;
}
/* 表格数据 */
.table{
  width: 100%;
  /* height: 710px; */
  background: #fff;
  margin-top: 20px;
  text-align: center;
  position: relative;
}
.table>>>.cell{
  text-align: center;
}
.table>>>.is-group>tr>th{
  background: #fff;
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
  /* width: 580px; */
  height: 30px;
  position: absolute;
  bottom: 60px;
  right: 80px;
}
.notice{
  /* position: absolute; */
  margin-top: 20px;
  font-size: 12px;
  line-height: 15px;
  text-align: left;
  margin-left: 50px;
}
.n_detail{
  margin-bottom: 0;
}
</style>
