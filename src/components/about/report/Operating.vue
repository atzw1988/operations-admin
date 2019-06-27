<template>
  <div id="row">
    <!-- 区域和时间维度 -->
    <div class="dimension">
      <div class="select">
        <el-select v-model="sel_aere" placeholder="--全部区域--" class="aereselect" clearable>
          <el-option
            v-for="item in aeres"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="sel_park" placeholder="--全部停车场--" class="parkselect" clearable>
          <el-option
            v-for="item in parks_list"
            :key="item.parking_name"
            :label="item.parking_name"
            :value="item.parking_name">
          </el-option>
        </el-select>
      </div>
      <!-- <div class="datadimension">
        <div class="radio-box" v-for="(item,index) in radios" :key="item.id">
          <span class="radio" :class="{'on':item.isChecked}"></span>
          <input v-model="radio" :value="item.value" class="input-radio" :checked='item.isChecked'  @click="check(index)" type="radio">{{item.label}}
        </div>
      </div> -->
      <button class="export" @click="export_op">导出</button>
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
            @change='use_mytime'
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button type="primary" @click="sel_btn">搜索</el-button>
        </div>
      </div>
      <el-button type="success" class="form" @click="toform">{{fromtext}}</el-button>
    </div>
    <!-- 环比图 -->
    <div v-if="isShow" class="sequential">
      <div class="total">
        <div class="header_text">
          <div class="text">营业收入(元)</div>
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
          <div class="text">欠费金额(元)</div>
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
          <div class="text">付费率</div>
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
      <!-- <div class="revenue">
        <div class="revenue-header">
          <span class="headertext">营收总额(元)</span>
          <span class="sequen">环比(%)</span>
        </div>
        <div class="revenue-cont">
          <ul>
            <li v-for="item in revenues">
              <span>{{item.name}}：{{item.num}}</span>
              <span class="sequen">{{item.sequen}}</span>
              <img v-show="item.sequen>0" src="../../../assets/tubiao03.png" alt="">
              <img v-show="item.sequen<0" src="../../../assets/tubiao04.png" alt="">
            </li>
          </ul>
        </div>
      </div>
      <div class="owe">
        <div class="owe-header">
          <span class="headertext">待缴总额(元)</span>
          <span class="sequen">环比(%)</span>
        </div>
        <div class="owe-cont">
          <ul>
            <li v-for="item in owes" :key="item.id">
              <span>{{item.name}}：{{item.num}}</span>
              <span class="sequen">{{item.sequen}}</span>
              <img v-show="item.sequen>0" src="../../../assets/tubiao03.png" alt="">
              <img v-show="item.sequen<0" src="../../../assets/tubiao04.png" alt="">
            </li>
          </ul>
        </div>
      </div> -->
    </div>
    <!-- 图表 -->
    <div v-if="isShow" id="chart" class="chart">
      <!-- <div class="switch_cont">
        <div class="switch_btn" @click="switch_btn">{{switch_text}}</div>
      </div> -->
      <div id="income"></div>
    </div>
    <div v-if="!isShow" class="table">
      <el-table
        :data="list_detail"
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
        <el-table-column
          prop="a"
          label="营业收入">
        </el-table-column>
        <el-table-column
          prop="b"
          label="营业实收">
        </el-table-column>
        <el-table-column
          prop="c"
          label="欠费金额">
        </el-table-column>
        <el-table-column
          prop="d"
          label="付费率">
        </el-table-column>
        <el-table-column label="PDA">
          <el-table-column
            prop="e"
            label="营业收入">
          </el-table-column>
          <el-table-column
            prop="f"
            label="营业实收">
          </el-table-column>
          <el-table-column
            prop="g"
            label="欠费金额">
          </el-table-column>
        </el-table-column>
        <el-table-column label="APP">
          <el-table-column
            prop="h"
            label="营业收入">
          </el-table-column>
          <el-table-column
            prop="i"
            label="营业实收">
          </el-table-column>
          <el-table-column
            prop="g"
            label="欠费金额">
          </el-table-column>
        </el-table-column>
        <el-table-column label="小程序">
          <el-table-column
            prop="k"
            label="营业收入">
          </el-table-column>
          <el-table-column
            prop="l"
            label="营业实收">
          </el-table-column>
          <el-table-column
            prop="m"
            label="欠费金额">
          </el-table-column>
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
      time_interval: '',
      aeres: [
        {id:0,name:'嵊州市'},
        {id:1,name:'新昌县'},
        {id:2,name:'诸暨市'},
        {id:3,name:'上虞区'},
        {id:4,name:'柯桥区'},
        {id:5,name:'越城区'}
      ],
      parks_list:[],
      parks: [],
      sel_aere:'',
      sel_park:'',
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
        {label: '近12月',value:'6',isChecked: false,},
      ],
      revenues: [],
      owes: [],
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
      recovered: [7090,19170,24550,26100,17190,14330,15440,32805,52080,33720,24840,40780],
      norecovered: [327,1776,507,1200,800,482,204,1390,1001,951,381,220],
      recoveredsequen: [6000,18000,23000,25300,16500,10330,14400,32000,50800,31000,24000,39000],
      norecoveredsequen: [90,85,79,92,99,85,65,93,86,92,75,96],
      xData: ['4.1','4.2','4.3','4.4','4.5','4.6','4.7','4.8','4.9','4.10','4.11','4.12'],
      list_detail:[
        {date:'2019-06-10',a:30000,b:24000,c:6000,d:'80%',e:10000,f:8000,g:2000,h:10000,i:8000,g:2000,k:10000,l:8000,m:2000},
        {date:'2019-06-09',a:30000,b:24000,c:6000,d:'80%',e:10000,f:8000,g:2000,h:10000,i:8000,g:2000,k:10000,l:8000,m:2000},
        {date:'2019-06-08',a:30000,b:24000,c:6000,d:'80%',e:10000,f:8000,g:2000,h:10000,i:8000,g:2000,k:10000,l:8000,m:2000},
        {date:'2019-06-07',a:30000,b:24000,c:6000,d:'80%',e:10000,f:8000,g:2000,h:10000,i:8000,g:2000,k:10000,l:8000,m:2000},
        {date:'2019-06-06',a:30000,b:24000,c:6000,d:'80%',e:10000,f:8000,g:2000,h:10000,i:8000,g:2000,k:10000,l:8000,m:2000},
        {date:'2019-06-05',a:30000,b:24000,c:6000,d:'80%',e:10000,f:8000,g:2000,h:10000,i:8000,g:2000,k:10000,l:8000,m:2000},
        {date:'2019-06-04',a:30000,b:24000,c:6000,d:'80%',e:10000,f:8000,g:2000,h:10000,i:8000,g:2000,k:10000,l:8000,m:2000},
        {date:'2019-06-03',a:30000,b:24000,c:6000,d:'80%',e:10000,f:8000,g:2000,h:10000,i:8000,g:2000,k:10000,l:8000,m:2000},
        {date:'2019-06-02',a:30000,b:24000,c:6000,d:'80%',e:10000,f:8000,g:2000,h:10000,i:8000,g:2000,k:10000,l:8000,m:2000},
        {date:'2019-06-01',a:30000,b:24000,c:6000,d:'80%',e:10000,f:8000,g:2000,h:10000,i:8000,g:2000,k:10000,l:8000,m:2000},
      ],
      export_list:[],    //存放要导出的表格数据
      list_num: 0,
      total: 0,
      nototal: 0,
      pageIndex: 1,
      ps: 10,
      allps: 0,
      url_income:'/its/operations/income/statements',
      url_excel:'/its/operations/income/tableData',
      url_park:'/its/operations/query/berth'
    }
  },
  watch: {
    sel_aere:'get_sel_park'
  },
  mounted() {
    this.get_park()
    this.get_income()
    this.drowincome()
  },
  methods: {
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
    //根据选择区域显示停车场
    get_sel_park(){
      console.log(this.sel_aere)
      this.parks_list = this.parks.filter((item) => {
        if(this.sel_aere === ''){
          return item.pid
        }else{
          return item.pid == this.sel_aere
        }
      })
    },
    //获取停车场列表
    get_park(){
      axios({
        method: 'post',
        url:this.url_park,
        headers:{
          'content-type':'application/x-www-form-urlencoded'
        },
        data: {}
      }).then(res => {
        res.data.data.forEach(item => {
          item.pid = 0
        })
        this.parks = res.data.data
      })
    },
    //获取环比数据
    get_income(){
      axios({
      method: 'post',
      url:this.url_income,
      headers:{
        'content-type':'application/x-www-form-urlencoded'
      },
      data: {}
      }).then(res => {
        let data = res.data.data
        if(!data.todayAmountRing){
          data.todayAmountRing = 0
        }
        if(!data.yesterdayAmountRing){
          data.yesterdayAmountRing = 0
        }
        if(!data.stayTodayAmountRing){
          data.stayTodayAmountRing = 0
        }
        if(!data.stayYesterdayAmountRing){
          data.stayYesterdayAmountRing = 0
        }
        this.revenues = [
          {name:'今日',sequen:(data.todayAmountRing*100).toFixed(2),num:data.todayAmount},
          {name:'昨日',sequen:(data.yesterdayAmountRing*100).toFixed(2),num:data.yesterdayAmount},
          {name:'近一周',sequen:(0.00).toFixed(2),num:data.weeksAmount},
          {name:'近一月',sequen:(0.00).toFixed(2),num:data.monthAmount}
        ]
        this.owes = [
          {name:'今日',sequen:(data.stayTodayAmountRing*100).toFixed(2),num:data.stayTodayAmount},
          {name:'昨日',sequen:(data.stayYesterdayAmountRing*100).toFixed(2),num:data.stayYesterdayAmount},
          {name:'近一周',sequen:(0.00).toFixed(2),num:data.stayWeeksAmount},
          {name:'近一月',sequen:(0.00).toFixed(2),num:data.stayMonthAmount}
        ]
      })
    },
    //获取表格数据
    get_excel(){
      this.total = 0
      this.nototal = 0
      let params = new URLSearchParams();
      params.append('pageIndex', this.pageIndex);
      params.append('ps', this.ps);
      this.get_report_list(params,this.url_excel)
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
    //表格和图表切换
    toform(){
      this.isShow = !this.isShow
      if(this.isShow){
        setTimeout(() => {
          this.drowincome()
        }, 1000);
        this.fromtext = '表格数据'
      }
      if(!this.isShow){
        this.fromtext = '可视化报表'
        this.get_excel()
      }
    },
    //图表绘制
    drowincome(){
      let that = this
      let myincome = this.$echarts.init(document.getElementById('income'))
      myincome.setOption({
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
          "top": 40,
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
          'data': ['营收收入', '营业实收', '营业欠费','付费率']
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
            min: 0,
            max: 100,
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
            name: '营收收入',
            type: 'bar',
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
            name: '营业实收',
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
            data: that.recoveredsequen
          },
          {
            name: '营业欠费',
            type: 'bar',
            barMaxWidth: 35,
            itemStyle: {
              normal: {
                color: "rgba(255,144,128,1)",
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
            data: that.norecovered
          },
          {
            name: '付费率',
            type: 'line',
            // stack: '总量',
            symbolSize: 5,
            symbol:'circle',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: "#FFD700",
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
        myincome.resize();
      });
    },
    //同比环比切换
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
    //收入统计表格导出
    export_op(){
      let params = {}
      this.export_report_list(params,this.url_excel)
      require.ensure([], () => {　　　　　　　　
        const { export_json_to_excel } = require('../../../excel/Export2Excel.js');　　//引入文件　　　　　　
        const tHeader = ['时间', '营收总额(元)', '待缴总额(元)','营收环比(%)','待缴环比(%)','营收同比(%)','待缴同比(%)']; //将对应的属性名转换成中文
        //const tHeader = [];　
        const filterVal = ['name', 'norm', 'freetime','paytimestr','paytimeend','caps','crttime','uptime'];//table表格中对应的属性名　　　　　 　　　
        const list = this.export_list;　　//想要导出的数据　　　　　　
        const data = this.formatJson(filterVal, list);
        this.get_nowtime()
        let title = '收入统计列表' + this.nowday　　　　　　　　　
        export_json_to_excel(tHeader, data, title, this.nowtime);
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
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
  },
}
</script>
<style scoped>
#row{
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  color: #000;
}
.dimension{
  width: 100%;
  height: 120px;
  position: relative;
  background: #fff;
}
.select{
  width: 500px;
  height: 40px;
  margin-left: 5%;
  position: absolute;
  top: 20px;
}
.aereselect,.parkselect{
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
  position: absolute;
  right: 50px;
  top: 20px;
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
  width: 120px;
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
  height: 415px;
  margin-top: 30px;
  position: relative;
  background: #fff;
}
#income{
  width: 90%;
  height: 100%;
  margin: 0 auto 0;
  background: #fff;
  z-index: 2000;
}
.table{
  width: 100%;
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
.table>>>.is-group>tr>th{
  background: #fff;
}
/* 分页控制 */
.el-pagination{
  width: 580px;
  height: 30px;
  position: absolute;
  bottom: -35px;
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
/* 环比 */
.total{
  width: 30%;
  height: 200px;
  float: left;
  border-radius: 10px;
  overflow: hidden;
  margin-left: 2.5%;
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
</style>


