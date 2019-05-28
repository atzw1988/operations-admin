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
      <button class="export" @click="export_user">导出</button>
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
        <button class="data-btn">搜索</button>
      </div>
      <button class="form" @click="toform">{{fromtext}}</button>
    </div>
    <div v-if="isShow" class="sequential">
      <div class="revenue">
        <div class="revenue-header">
          <span class="headertext">新增总用户</span>
          <span class="sequen">环比</span>
        </div>
        <div class="revenue-cont">
          <ul>
            <li v-for="item in revenues" :key="item.id">
              <span>{{item.name}}:{{item.num}}</span>
              <span class="sequen">{{item.sequen}}</span>
              <img v-show="item.state" src="../../../assets/tubiao03.png" alt="">
              <img v-show="!item.state" src="../../../assets/tubiao04.png" alt="">
            </li>
          </ul>
        </div>
      </div>
      <div class="appuser">
        <div class="appuser-header">
          <span class="headertext">新增APP用户</span>
          <span class="sequen">环比</span>
        </div>
        <div class="appuser-cont">
          <ul>
            <li v-for="item in revenues" :key="item.id">
              <span>{{item.name}}:{{item.num}}</span>
              <span class="sequen">{{item.sequen}}</span>
              <img v-show="item.state" src="../../../assets/tubiao03.png" alt="">
              <img v-show="!item.state" src="../../../assets/tubiao04.png" alt="">
            </li>
          </ul>
        </div>
      </div>
      <div class="wxuser">
        <div class="wxuser-header">
          <span class="headertext">新增微信用户</span>
          <span class="sequen">环比</span>
        </div>
        <div class="wxuser-cont">
          <ul>
            <li v-for="item in revenues" :key="item.id">
              <span>{{item.name}}:{{item.num}}</span>
              <span class="sequen">{{item.sequen}}</span>
              <img v-show="item.state" src="../../../assets/tubiao03.png" alt="">
              <img v-show="!item.state" src="../../../assets/tubiao04.png" alt="">
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="isShow" id="chart" class="chart">
      <div class="switch_cont">
        <div class="switch_btn" @click="switch_btn">{{switch_text}}</div>
      </div>
      <div id="usernum"></div>
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
          label="新增用户量">
        </el-table-column>
        <el-table-column
          sortable
          prop="app_no"
          label="新增APP用户量">
        </el-table-column>
        <el-table-column
          sortable
          prop="wx_no"
          label="新增微信用户量">
        </el-table-column>
        <el-table-column
          prop="sequen_a"
          label="新增用户数环比">
        </el-table-column>
        <el-table-column
          prop="sequen_b"
          label="新增APP用户数环比">
        </el-table-column>
        <el-table-column
          prop="sequen_c"
          label="新增微信用户数环比">
        </el-table-column>
        <el-table-column
          prop="sequen_d"
          label="新增用户数同比">
        </el-table-column>
        <el-table-column
          prop="sequen_e"
          label="新增APP用户数同比">
        </el-table-column>
        <el-table-column
          prop="sequen_f"
          label="新增微信用户数同比">
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
export default {
  data() {
    return {
      time_interval: '',    //时间区间
      total: 5000,
      switch_text:'环比',
      num:0,
      aeres: ['区域1','区域2','区域3','区域4','区域5','区域6'],
      parks: ['停车场1','停车场1','停车场1','停车场1','停车场1','停车场1','停车场1','停车场1','停车场1','停车场1','停车场1'],
      kinds: ['泊位停车','车库停车'],
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
      revenues: [
        {name:'今日',num:50000,sequen:'5.6',id:'1',state:true},
        {name:'昨日',num:50000,sequen:'5.6',id:'2',state:true},
        {name:'近一周',num:50000,sequen:'-5.6',id:'3',state:false},
        {name:'近一月',num:50000,sequen:'-5.6',id:'4',state:false}
      ],
      alluser: [7090,19170,24550,26100,17190,14330,15440,32805,52080,33720,24840,40780],
      appuser: [5000,12006,21000,19000,13000,9000,10000,26000,40000,20000,22000],
      wxuser: [2090,7164,3550,7100,4190,5330,5440,6805,12080,13720,2840],
      allusersequen: [103,169,196,181,251,-91,104,-67,120,-32,-86,129],
      appusersequen: [10,26,29,28,25,19,17,26,12,23,28,12],
      wxusersequen: [100,26,-29,58,75,-19,17,86,12,123,-28,102],
      xData: ['4.1','4.2','4.3','4.4','4.5','4.6','4.7','4.8','4.9','4.10','4.11','4.12'],
      list_detail:[
        {id:0,time:'2019-04-26',num:'1000',app_no:500,wx_no:500,sequen_a:5.6,sequen_b:6.5,sequen_c:5.6,sequen_d:5.6,sequen_e:5.6,sequen_f:5.6},
        {id:1,time:'2019-04-26',num:'1000',app_no:500,wx_no:500,sequen_a:5.6,sequen_b:6.5,sequen_c:5.6,sequen_d:5.6,sequen_e:5.6,sequen_f:5.6},
        {id:2,time:'2019-04-26',num:'1000',app_no:500,wx_no:500,sequen_a:5.6,sequen_b:6.5,sequen_c:5.6,sequen_d:5.6,sequen_e:5.6,sequen_f:5.6},
        {id:3,time:'2019-04-26',num:'1000',app_no:500,wx_no:500,sequen_a:5.6,sequen_b:6.5,sequen_c:5.6,sequen_d:5.6,sequen_e:5.6,sequen_f:5.6},
        {id:4,time:'2019-04-26',num:'1000',app_no:500,wx_no:500,sequen_a:5.6,sequen_b:6.5,sequen_c:5.6,sequen_d:5.6,sequen_e:5.6,sequen_f:5.6}
      ],
      pageIndex:1,
      ps:10,
      list_num:5
    }
  },
  mounted() {
    this.drowordernum()
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
        if(index != 2 && index != 3 && index != 4){
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
          sums[index] += '人';
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
    //订单统计表格导出
    export_user(){
      require.ensure([], () => {　　　　　　　　
        const { export_json_to_excel } = require('../../../excel/Export2Excel.js');　　//引入文件　　　　　　
        const tHeader = ['时间', '新增用户量(人)', '新增APP用户量(人)','新增微信用户量(%)','新增用户环比','新增APP用户环比','新增微信用户环比','新增用户同比','新增APP用户同比','新增微信用户同比']; //将对应的属性名转换成中文
        //const tHeader = [];　
        const filterVal = ['time', 'num','app_no','wx_no', 'sequen_a','sequen_b','sequen_c','sequen_d','sequen_e','sequen_f']　　　　 　　　
        const list = this.orderdata;　　//想要导出的数据　　　　　　
        const data = this.formatJson(filterVal, list);
        this.get_nowtime()
        let title = '用户统计列表' + this.nowday　　　　　　　　　
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
      // 设置值，以供传递
      this.dataradios[index].isChecked = true;
      console.log(this.dataradio);
      this.get_time_interval(this.dataradio)
    },
    //报表视图表格视图切换
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
    //绘制图表
    drowordernum(){
      let that = this
      let myusernum = this.$echarts.init(document.getElementById('usernum'))
      myusernum.setOption({
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
          'data': ['总注册用户', 'APP注册用户','微信注册用户','总注册环比','APP注册环比','微信注册环比']
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
            name: '总注册用户',
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
            data: that.alluser
          },
          {
            name: '微信注册用户',
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
            data: that.wxuser
          },
          {
            name: 'APP注册用户',
            type: 'bar',
            // stack: '总量',
            color: 'rgba(255,144,128,1)',
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
            data: that.appuser
          },
          {
            name: 'APP注册环比',
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
            data: that.appusersequen
          },
          {
            name: '总注册环比',
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
            data: that.allusersequen
          },
          {
            name: '微信注册环比',
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
            data: that.wxusersequen
          }
        ]
      })
      window.addEventListener("resize",function(){
        myusernum.resize();
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
.data-btn{
  width: 80px;
  height: 40px;
  border: 0;
  background: #01fbfe;
  font-size: 18px;
  margin-left: 10px;
  border-radius: 10px;
  font-weight: 600;
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
.revenue,.appuser,.wxuser{
  width: 25%;
  height: 180px;
  /* border: 1px solid blueviolet; */
  float: left;
  margin: 10px 0 0 5%;;
}
.revenue-header,.appuser-header,.wxuser-header{
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
.revenue-cont>ul>li,.appuser-cont>ul>li,.wxuser-cont>ul>li{
  width: 100%;
  height: 35px;
  line-height: 35px;
  position: relative;
  border-bottom: 1px
}
.revenue-cont>ul>li>span,.appuser-cont>ul>li>span,.wxuser-cont>ul>li>span{
  display: inline-block;
  width: 100px;
}
.sequen{
  text-align: center;
  margin-left: 20%;
}
.revenue-cont>ul>li>img,.appuser-cont>ul>li>img,.wxuser-cont>ul>li>img{
  width: 35px;
  height: 35px;
  position: absolute;
  right: 0;
  top: 0;
}
.chart{
  width: 100%;
  height: 455px;
  margin-top: 10px;
  position: relative;
  background: #fff;
}
#usernum{
  width: 90%;
  height: 100%;
  margin: 0 auto 0;
  z-index: 2000;
}
.table{
  width: 100%;
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


