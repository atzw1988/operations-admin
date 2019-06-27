<template>
  <div id="row">
    <div class="header">
      <div class="up">
        <template>
          <el-select v-model="erar_name" clearable placeholder="全部区域">
            <el-option
              v-for="item in erae"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
        <template>
          <el-select v-model="park_name" clearable placeholder="全部停车场">
            <el-option
              v-for="item in parks"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
        <template>
          <el-select v-model="kind_name" clearable placeholder="全部类别">
            <el-option
              v-for="item in kinds"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </div>
      <div class="down">
        <div class="datamain">
          <div class="dataradio-box" v-for="(item,index) in dataradios" :key="item.id">
            <span class="dataradio" :class="{'dataon':item.isChecked}"></span>
            <input v-model="radio" :value="item.value" class="input-dataradio" :checked='item.isChecked'  @click="datacheck(index)" type="radio">{{item.label}}
          </div>
        </div>
        <div class="time">
          <el-date-picker
            v-model="timeinterval"
            type="daterange"
            align="right"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-button type="primary">搜索</el-button>
        </div>
        <el-button type="success" class="from" @click="toform">{{fromtext}}</el-button>
      </div>
    </div>
    <div class="percent" v-if="table_show">
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
    </div>
    <div class="content" id="chart" v-if="table_show">
    </div>
    <div class="table" v-if="!table_show">
      <el-table
        :data="tableData"
        show-summary
        style="width: 100%">
        <el-table-column
          label="序号"
          width="70"
          type="index">
        </el-table-column>
        <el-table-column
          prop="date"
          label="日期">
        </el-table-column>
        <el-table-column label="入账金额">
          <el-table-column
            prop="income"
            label="营业实收">
          </el-table-column>
          <el-table-column
            prop="recharge"
            label="预收账款">
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="booked"
          label="入账总金额">
        </el-table-column>
        <el-table-column label="营业实收">
          <el-table-column
            prop="cash"
            label="现金">
          </el-table-column>
          <el-table-column
            prop="online"
            label="微信/支付宝">
          </el-table-column>
        </el-table-column>
      </el-table>
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
        {label: '近7天',value:'7',isChecked: false},
        {label: '近30天',value:'30',isChecked: false}
      ],
      timeinterval:'',
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
      xData:['6.1','6.2','6.3','6.4','6.5','6.6','6.7','6.8','6.9','6.10'],
      booked_list:[20000,25000,23000,28000,21000,26000,20000,22000,24000,29000],
      income_list:[18000,21000,20500,23000,19000,20000,15000,19000,17500,26000],
      recharge_list:[2000,4000,2500,5000,2000,6000,5000,3000,6500,3000],
      table_show:true,
      fromtext:'表格数据',
      tableData:[
        {date:'2019-06-10',income:20000,recharge:4000,booked:24000,cash:12000,online:12000},
        {date:'2019-06-09',income:20000,recharge:4000,booked:24000,cash:12000,online:12000},
        {date:'2019-06-08',income:20000,recharge:4000,booked:24000,cash:12000,online:12000},
        {date:'2019-06-07',income:20000,recharge:4000,booked:24000,cash:12000,online:12000},
        {date:'2019-06-06',income:20000,recharge:4000,booked:24000,cash:12000,online:12000},
        {date:'2019-06-05',income:20000,recharge:4000,booked:24000,cash:12000,online:12000},
        {date:'2019-06-04',income:20000,recharge:4000,booked:24000,cash:12000,online:12000},
        {date:'2019-06-03',income:20000,recharge:4000,booked:24000,cash:12000,online:12000},
        {date:'2019-06-02',income:20000,recharge:4000,booked:24000,cash:12000,online:12000},
        {date:'2019-06-01',income:20000,recharge:4000,booked:24000,cash:12000,online:12000},
      ]
    }
  },
  mounted() {
    this.drowchart()
  },
  methods: {
    //周期切换
    datacheck(index) {
      this.dataradios.forEach((item) => {
        item.isChecked = false;
      });
      this.dataradio = this.dataradios[index].value;
      this.dataradios[index].isChecked = true;
      this.get_time_interval(this.dataradio)
      console.log(this.time_interval)
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
      if(this.table_show){
        setTimeout(() => {
          this.drowchart()
        }, 1000);
        this.fromtext = '表格数据'
      }
      if(!this.table_show){
        this.fromtext = '可视化报表'
        // this.get_excel()
      }
    },
  },
}
</script>
<style scoped>
#row{
  width: 100%;
  height: 100%;
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
  height: 510px;
  margin-top: 20px;
  background: #fff;
}
/* 表格数据 */
.table{
  width: 100%;
  height: 710px;
  background: #fff;
  margin-top: 20px;
  text-align: center;
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
</style>
