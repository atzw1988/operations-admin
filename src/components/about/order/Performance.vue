<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-26 15:05:16
 * @LastEditTime: 2019-09-02 18:50:04
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="row">
    <div class="select">
      <div class="data-interval">
        <span>姓名/工号：</span>
        <el-select style="float:left;width:100px;margin-right:10px" v-model="operator" clearable placeholder="请选择" @change="sel_search_kind">
          <el-option label="工号" value="operatorid"></el-option>
          <el-option label="姓名" value="operatorname"></el-option>
        </el-select>
        <el-select
          @visible-change="check_data_list"
          v-model="sel_list"
          multiple
          collapse-tags
          style="float:left;margin-right:10px"
          placeholder="请选择或者搜索">
          <el-option
            v-for="item in data_list"
            :key="item.operatorname || item.operatorid"
            :label="item.operatorname || item.operatorid"
            :value="item.operatorname || item.operatorid">
          </el-option>
        </el-select>&nbsp;&nbsp;
        <el-date-picker
          style="float:left;margin-right:10px"
          v-model="time_interval"
          type="datetimerange"
          range-separator="-"
          format='yyyy-MM-dd HH:mm:ss'
          value-format='yyyy/MM/dd HH:mm:ss'
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button class="selbtn" type="primary" @click="sel_uesr">搜索</el-button>
        <el-button style="float:right;margin-right:40px" class="selbtn" type="success" @click="export_uesr">导出</el-button>
      </div>
    </div>
    <div class="detail">
      <el-table
        :data="list_detail"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index">
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="结束时间">
        </el-table-column>
        <!-- <el-table-column
          prop="lastmoney"
          label="消费金额">
        </el-table-column> -->
        <el-table-column
          prop="operator"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="bank_type"
          label="工号">
        </el-table-column>
        <el-table-column
          prop="turnover"
          label="线上已支付金额">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import axios from 'axios';
export default {
  data() {
    return {
      operator:'',
      data_list:[],
      time_interval: '',
      sel_list: [],
      sel_kind: '',
      list_detail: [],
      query_car:'',
      pageIndex: 1,
      ps:20,
      total_ps:0,
      exprot_data: '',
      url:'/its/operations/individual/performance',
      operator_url:'/its/operations/query/operatoCodeName'
    }
  },
  mounted() {
    // this.get_rule_list()
  },
  methods: {
    //封装获取个人业绩
    get_query_list(params,url){
      axios({
        method: 'post',
        url: url,
        header:{
          'content-type':'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        this.list_detail = res.data.data.data
        this.total_ps = res.data.data.tr
      })
    },
    //封装获取工号或者姓名列表
    get_operator_list(params){
      axios({
        method: 'post',
        url: this.operator_url,
        header:{
          'content-type':'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        console.log(res)
        this.data_list = res.data.data
      })
    },
    get_rule_list(){
      let params = new URLSearchParams();
      params.append('pageIndex', this.pageIndex);
      params.append('ps', this.ps);
      this.get_query_list(params,this.url)
    },
    //监听筛选对象
    sel_search_kind(val){
      console.log(val)
      this.sel_list = []
      if(val == 'operatorid'){
        this.sel_kind = 'operatorid'
        let params = new URLSearchParams()
        params.append('codeName', '工号')
        this.get_operator_list(params)
      }else if(val == 'operatorname'){
        this.sel_kind = 'operatorname'
        let params = new URLSearchParams()
        this.get_operator_list(params)
      }else{
        this.sel_kind = ''
        this.data_list = []
      }
    },
    check_data_list(val){
      console.log(val)
      if(val){
        console.log(this.sel_kind)
        if(this.sel_kind){
          return
        }else{
          this.$notify({
            title: '温馨提示',
            message: '请先选择以姓名/工号查询',
            type: 'warning',
            offset: 100
          })
        }
      }
    },
    //导出
    export_uesr(){
      if(this.time_interval && this.list_detail.length > 0){
        // require.ensure([], () => {　　　　　　　　
        //   const { export_json_to_excel } = require('../../../excel/Export2Excel.js');　　//引入文件　　　　　　
        //   const tHeader = ['开始时间','结束时间', '姓名', '工号','线上已支付金额']; //将对应的属性名转换成中文
        //   //const tHeader = [];　
        //   const filterVal = ['startTime','endTime', 'operator', 'bank_type','turnover'];//table表格中对应的属性名　　　　　 　　　
        //   const list = this.list_detail;　　//想要导出的数据　　　　　　
        //   const data = this.formatJson(filterVal, list);
        //   this.get_nowtime()
        //   let title = '个人业绩统计' + this.nowday
        //   export_json_to_excel(tHeader, data, title, this.nowtime);
        // })
        this.exprot_data.append('formDownload', 1)
        axios({
          method: 'post',
          url: this.url,
          header:{
            'content-type':'application/json'
          },
          responseType: 'arraybuffer',
          data: this.exprot_data
        }).then(res => {
          console.log(res)
          const blob = new Blob([res.data]);
          this.get_nowtime()
          const fileName = '个人业绩统计' + this.nowday + '.xls';
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        })
        // axios.get(this.url,{
        //   params:this.exprot_data
        // }).then(res => {
        //   console.log(res)
        //   const aLink = document.createElement("a");
        //   let blob = new Blob([res.data], {type: "application/vnd.ms-excel"})
        //   aLink.href = URL.createObjectURL(blob)
        //   aLink.download = title
        //   aLink.click()
        //   document.body.appendChild(aLink)
        // })
      }else{
        this.$notify({
          title: '温馨提示',
          message: '请先搜索出结果后再导出',
          type: 'warning',
          offset: 100
        })
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //搜索
    sel_uesr(){
      if(!this.time_interval){
        this.$notify({
          title: '温馨提示',
          message: '必须选择时间范围',
          type: 'warning',
          offset: 100
        })
        return
      }else{
        let params = new URLSearchParams()
        console.log(this.sel_list)
        if(this.sel_kind == 'operatorid'){
          params.append('operatorid', this.sel_list)
          params.append('type', 0)
        }else if(this.sel_kind == 'operatorname'){
          params.append('operatorname', this.sel_list)
          params.append('type', 1)
        }
        params.append('sTime',this.time_interval[0])
        params.append('eTime',this.time_interval[1])
        this.exprot_data = params
        axios({
          method: 'post',
          url: this.url,
          header:{
            'content-type':'application/x-www-form-urlencoded'
          },
          data: params
        }).then(res => {
          console.log(res)
          if(res.data.code == 0){
            this.list_detail = res.data.data
            console.log(this.list_detail)
          }else{
            this.$notify({
              title: '温馨提示',
              message: res.data.mesg,
              type: 'warning',
              offset: 100
            })
          }
        })
      }
    }
  },
}
</script>
<style scoped>
#row{
  width: 100%;
  height: 100%;
  color: #000;
  position: relative;
  background-color: #f5f5f5 !important;
}
.total{
  width: 100%;
  height: 50px;
  background: #fff;
}
.total>span{
  font-size: 20px;
  line-height: 50px;
  font-weight: 600;
  text-align: center;
}
.el-divider{
  height: 30px;
  width: 2px;
  line-height: 50px;
  background: rgb(0, 162, 255);
  margin-top: -8px;
}
.total>span>a{
  font-size: 20px;
  font-weight: 600;
  color: rgb(0, 162, 255);
}
.select{
  width: 100%;
  height: 60px;
  background: #fff;
}
.selstate,.selplace,.selparkkind,.selconsumption{
  width: 110px;
  height: 40px;
  margin: 10px 0 0 20px;
  border-radius: 5px;
  float: left;
}
.data-interval{
  width: 100%;
  height: 40px;
  float: left;
  line-height: 40px;
  font-size: 20px;
  margin-left: 20px;
  margin-top: 10px;
}
.data-interval>span{
  float: left;
}
.orderno{
  width: 200px;
  height: 40px;
  float: left;
  margin-left: 10px;
}
.username{
  width: 200px;
  height: 40px;
  float: left;
  margin-left: 10px;
  /* border: 1px solid violet; */
}
.username>input,.orderno>input{
  width: 100px;
  height: 35px;
  border-radius: 5px;
}
.selbtn{
  float: left;
}
.selbtn>img{
  width: 40px;
  height: 40px;
}
.detail{
  width: 100%;
  margin-top: 20px;
  background: #fff;
  position: relative;
}
.detail>>>.is-leaf{
  text-align: center;
}
.detail>>>td{
  text-align: center;
  padding: 4px 0
}
.detail>>>th{
  text-align: center;
  padding: 8px 0
}
.detail>>>.el-checkbox{
  margin-bottom: 3px;
}
.detail>>>.el-table__footer{
  height: 50px;
}
/* 分页控制 */
.el-pagination{
  width: 580px;
  height: 30px;
  position: absolute;
  bottom: -35px;
  right: 80px;
}

.block{
  float: left;
  height: 40px;
  margin-top: -2px;
}

</style>
