<template>
  <div id="row">
    <div class="total">
      <span style="border-right:2px solid rgb(0, 162, 255)">总金额：<a href="javascript:void(0)">{{allmoney}}</a>元</span>
      <span style="border-right:4px solid rgb(0, 47, 255)">订单总数：<a href="javascript:void(0)">{{list_num}}</a>个</span>
      <span style="border-right:2px solid rgb(0, 162, 255)">筛选金额：<a href="javascript:void(0)">{{selmoney}}</a>元</span>
      <span>筛选订单数：<a href="#">{{sel_num}}</a>个</span>
    </div>
    <div class="select">
      <!-- <el-select v-model="statues" class="selstate" placeholder="订单状态">
        <el-option value="" label="全部状态">全部状态</el-option>
        <el-option value="0" label="未支付">未支付</el-option>
        <el-option value="1" label="交易完成">交易完成</el-option>
        <el-option value="2" label="无需支付">无需支付</el-option>
      </el-select> -->
      <!-- <el-select v-model="selpark" placeholder="停车区域" class="selplace" clearable>
        <el-option value="">全部区域</el-option>
        <el-option
          v-for="item in parkareas"
          :key="item.parking_name"
          :label="item.parking_name"
          :value="item.parking_name">
        </el-option>
      </el-select> -->
      <div class="data-interval">
        <div class="block">
          <el-date-picker
            v-model="time_interval"
            type="datetimerange"
            range-separator="-"
            format='yyyy-MM-dd HH:mm:ss'
            value-format='yyyy-MM-dd HH:mm:ss'
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="username">
          <span style="float:left">车牌:</span>
          <el-input style="width:120px;float:left"
            placeholder="请输入帐户"
            v-model="username"
            clearable>
          </el-input>
        </div>
        <el-button class="selbtn" type="primary" @click="selbtn">搜索</el-button>
      </div>
    </div>
    <div class="detail">
      <el-table
        v-loading='loading'
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
          prop="carnumber"
          label="车牌">
        </el-table-column>
        <el-table-column
          prop="typename"
          label="帐户类型">
        </el-table-column>
        <el-table-column
          prop="zonename"
          label="停车场"
          width="180">
        </el-table-column>
        <el-table-column
          prop="parkingspace"
          label="车位号">
        </el-table-column>
        <el-table-column
          prop="starttime"
          label="入场时间"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="endtime"
          sortable
          label="出场时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="sumMins"
          sortable
          width="180"
          label="停车时长(分)">
        </el-table-column>
        <el-table-column
          prop="pledgemoney"
          sortable
          label="预缴押金">
        </el-table-column>
        <el-table-column
          prop="shouldmoney"
          sortable
          label="应缴金额">
        </el-table-column>
        <el-table-column
          prop="realmoney"
          sortable
          label="出场补交">
        </el-table-column>
        <el-table-column
          prop="afterbalance"
          sortable
          label="扣款后余额">
        </el-table-column>
        <el-table-column
          label="支付方式">
          <template slot-scope="scope">
            <span v-if="scope.row.afterPayType == 0">现金支付</span>
            <span v-if="scope.row.afterPayType == 1">微信支付</span>
            <span v-if="scope.row.afterPayType == 2">支付宝支付</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="stauts"
          label="订单状态">
        </el-table-column> -->
      </el-table>
      <el-pagination
        @current-change="page_change"
        :current-page="pageIndex"
        :page-size='ps'
        layout="total, prev, pager, next, jumper"
        :total="sel_num">
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
      loading:true,   //加载中
      allmoney: 0,   //总金额
      list_num:0,     //总订单数
      selmoney: 0,   //筛选总金额
      sel_num:0,     //筛选总订单数
      statues:'',           //关键字订单状态绑定
      parkareas: [],  //区域分类
      selpark: '',    //关键字区域分类绑定
      parkkinds: ['泊位停车','车库停车'],   //停车种类
      selparkkind: '',    //关键字停车种类绑定
      selconsumptions: '',  //关键字消费渠道绑定
      username:'',      //关键字帐户名绑定
      pageIndex: 1,     //页数
      ps:15,            //每页数量
      allps:1,          //总页数
      list_detail:[],    //订单数组
      // url:'http://192.168.0.192:13259/its/parking/findPage',
      url:'/its/parking/findPage',
      url_park:'/its/admin/query/berth'
    }
  },
  mounted() {
    this.get_order_list()
    axios({
      method: 'post',
      url:this.url_park,
      headers:{
        'Authorization':'Web 123213213',
        'content-type':'application/x-www-form-urlencoded'
      },
      data: {}
    }).then(res => {
      console.log(res)
      this.parkareas = res.data.data
    })
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
        if (index === 2 || index === 3 || index === 4 || index === 7) {
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
    get_order_list(){
      this.loading = true
      axios({
        method:'post',
        url: this.url,
        headers: {
          'Authorization': 'Web 123213213',
          'content-type': 'application/json;charset=UTF-8'
        },
        data:{}
      }).then(res => {
        console.log(res.data.data.pageInfo.list)
        this.allmoney = res.data.data.sumMoney
        this.selmoney = res.data.data.currentMoney
        this.list_detail = res.data.data.pageInfo.list
        this.list_num = res.data.data.pageInfo.total
        this.sel_num = res.data.data.pageInfo.total
        this.loading = false
      })
    },
    //时间格式转换
    renderTime(date) {
      let new_data = new Date(date).toJSON();
      return new Date(+new Date(new_data) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    //换页
    page_change(val){
      this.pageIndex = val
      let params = {}
      if(this.time_interval){
        params = {
          'currentPage': this.pageIndex,
          'starttime': this.time_interval[0],
          'endtime': this.time_interval[1],
          'carnumber': this.username
        }
      }else{
        params = {
          'currentPage': this.pageIndex,
          'carnumber': this.username
        }
      }
      params = JSON.stringify(params)
      axios({
        method:'post',
        url: this.url,
        headers: {
          'Authorization': 'Web 123213213',
          'content-type': 'application/json;charset=UTF-8'
        },
        data:params
      }).then(res => {
        this.allmoney = res.data.data.sumMoney
        this.selmoney = res.data.data.currentMoney
        this.list_detail = res.data.data.pageInfo.list
        this.sel_num = res.data.data.pageInfo.total
        this.list_detail.forEach(item => {
          item.starttime = this.renderTime(item.starttime)
          item.endtime = this.renderTime(item.endtime)
        })
      })
    },
    selbtn(){
      let params = {}
      if(this.username){
        this.pageIndex =1
      }
      if(this.time_interval){
        params = {
          'currentPage': this.pageIndex,
          'starttime': this.time_interval[0],
          'endtime': this.time_interval[1],
          'carnumber': this.username
        }
      }else{
        params = {
          'currentPage': this.pageIndex,
          'carnumber': this.username
        }
      }
      params = JSON.stringify(params)
      axios({
        method:'post',
        url: this.url,
        headers: {
          'Authorization': 'Web 123213213',
          'content-type': 'application/json;charset=UTF-8'
        },
        data:params
      }).then(res => {
        if(res.data.data.pageInfo.list.length > 0){
          this.allmoney = res.data.data.sumMoney
          this.selmoney = res.data.data.currentMoney
          this.list_detail = res.data.data.pageInfo.list
          this.sel_num = res.data.data.pageInfo.total
          this.list_detail.forEach(item => {
            item.starttime = this.renderTime(item.starttime)
            item.endtime = this.renderTime(item.endtime)
          })
        }else{
          this.$notify({
            title: '温馨提示',
            message: '暂时无符合条件的数据!',
            type: 'warning',
            offset: 100
          })
          return
        }
      })
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
.total{
  width: 100%;
  height: 50px;
  background: #fff;
}
.total>span{
  display: inline-block;
  font-size: 20px;
  width: 200px;
  height: 50px;
  line-height: 50px;
  font-weight: 600;
  text-align: center;
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
  margin-top: 20px;
}
.selstate,.selplace,.selparkkind,.selconsumption{
  width: 110px;
  height: 40px;
  margin: 10px 0 0 20px;
  border-radius: 5px;
  float: left;
}
.data-interval{
  width: 700px;
  height: 40px;
  float: left;
  line-height: 40px;
  font-size: 20px;
  margin-left: 20px;
  margin-top: 10px;
  background: #fff;
}
.username{
  width: 180px;
  height: 40px;
  float: left;
  margin-left: 10px;
  /* border: 1px solid violet; */
}
.username>input{
  width: 100px;
  height: 35px;
  border-radius: 5px;
}
.selbtn{
  float: left;
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
.detail>>>th{
  text-align: center;
  padding: 8px 0
}
.detail>>>td{
  text-align: center;
  padding: 8px 0
}
/* 分页控制 */
.el-pagination{
  width: 580px;
  height: 30px;
  position: absolute;
  bottom: -30px;
  right: 80px;
}
.detail>table{
  width: 100%;
}
.tablelist:hover{
  background: rgb(134, 134, 134);
}
.block{
  float: left;
  height: 40px;
  margin-top: -2px;
}
</style>
