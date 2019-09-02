<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-28 11:03:07
 * @LastEditTime: 2019-09-02 18:49:51
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="row">
    <div class="total">
      <span style="margin-left:50px">总金额：<a href="javascript:void(0)">{{allmoney}}</a>元</span>
      <el-divider direction="vertical"></el-divider>
      <span>订单总数：<a href="javascript:void(0)">{{list_num}}</a>个</span>
      <el-divider direction="vertical"></el-divider>
      <span>筛选金额：<a href="javascript:void(0)">{{selmoney}}</a>元</span>
      <el-divider direction="vertical"></el-divider>
      <span>筛选订单数：<a href="#">{{sel_num}}</a>个</span>
    </div>
    <div class="select">
      <div style="width:100%;height:50px">
        <el-select v-model="statues" class="selstate" placeholder="全部状态">
          <el-option value="" label="全部状态">全部状态</el-option>
          <el-option value="0" label="未支付">未支付</el-option>
          <el-option value="1" label="已支付">已支付</el-option>
          <el-option value="2" label="无需支付">无需支付</el-option>
        </el-select>
        <el-select v-model="pay_channel" class="selstate" placeholder="全部渠道">
          <el-option value="" label="全部渠道">全部渠道</el-option>
          <el-option value="0" label="PDA">PDA</el-option>
          <el-option value="1" label="小程序">小程序</el-option>
          <el-option value="2" label="APP">APP</el-option>
        </el-select>
        <el-select v-model="pay_way" class="selstate" placeholder="全部方式">
          <el-option value="" label="全部方式">全部方式</el-option>
          <el-option value="0" label="现金">现金</el-option>
          <el-option value="1" label="微信">微信</el-option>
          <el-option value="2" label="支付宝">支付宝</el-option>
          <el-option value="3" label="余额">余额</el-option>
        </el-select>
        <el-input class="selstate" style="width:120px;float:left"
          placeholder="请输入车牌"
          v-model="username"
          clearable>
        </el-input>
        <el-input class="selstate" style="width:120px;float:left"
          placeholder="请输入车位"
          v-model="parkNo"
          clearable>
        </el-input>
      </div>
      <div style="width:100%">
        <span style="float:left;margin-top:16px;margin-left:20px">出场时间：</span>
        <el-date-picker
          class="selstate_time"
          v-model="time_interval"
          type="datetimerange"
          range-separator="-"
          format='yyyy-MM-dd HH:mm:ss'
          value-format='yyyy/MM/dd HH:mm:ss'
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <span style="float:left;margin-top:16px">支付时间：</span>
        <el-date-picker
          class="selstate_time"
          v-model="time_interval_new"
          type="datetimerange"
          range-separator="-"
          format='yyyy-MM-dd HH:mm:ss'
          value-format='yyyy/MM/dd HH:mm:ss'
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <el-button class="selbtn" type="primary" @click="selbtn">搜索</el-button>
    </div>
    <div class="detail">
      <el-table
        v-loading='loading'
        :summary-method="getSummaries"
        :data="list_detail"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index">
        </el-table-column>
        <el-table-column
          prop="car_no"
          label="车牌">
        </el-table-column>
        <el-table-column
          prop="account_type"
          label="帐户类型">
        </el-table-column>
        <el-table-column
          prop="parking_name"
          label="停车场"
          width="180">
        </el-table-column>
        <el-table-column
          prop="park_no"
          label="车位号">
        </el-table-column>
        <el-table-column
          prop="parkstart_time"
          label="入场时间"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="parkend_time"
          label="出场时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="buy_time"
          label="停车时长(分)"
          width="110">
        </el-table-column>
        <!-- <el-table-column
          prop="pledgemoney"
          sortable
          label="预缴押金">
        </el-table-column> -->
        <el-table-column
          prop="charge_money"
          label="订单金额">
        </el-table-column>
        <el-table-column
          label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_type == 0">未支付</span>
            <span v-if="scope.row.pay_type == 1">已支付</span>
            <span v-if="scope.row.pay_type == 2">无需支付</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="realmoney"
          sortable
          label="出场补交">
        </el-table-column> -->
        <!-- <el-table-column
          prop="afterbalance"
          sortable
          label="欠费金额">
        </el-table-column> -->
        <el-table-column
          label="支付渠道">
          <template slot-scope="scope" v-if="scope.row.pay_type == 1">
            <span v-if="scope.row.pay_channel == 0 && scope.row.pay_cost == 0">PDA</span>
            <span v-if="scope.row.pay_channel == 1 && scope.row.pay_cost == 0">小程序</span>
            <span v-if="scope.row.pay_channel == 2 && scope.row.pay_cost == 0">APP</span>
            <span v-if="scope.row.pay_channel == 1 && scope.row.pay_cost != 0">PDA:{{scope.row.pay_cost}},小程序:{{scope.row.charge_money - scope.row.pay_cost}}</span>
            <span v-if="scope.row.pay_channel == 2 && scope.row.pay_cost != 0">PDA:{{scope.row.pay_cost}},APP:{{scope.row.charge_money - scope.row.pay_cost}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="支付方式">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_way == 0 && scope.row.pay_type == 1">现金支付</span>
            <span v-if="scope.row.pay_way == 1 && scope.row.pay_type == 1">微信支付</span>
            <span v-if="scope.row.pay_way == 2 && scope.row.pay_type == 1">支付宝支付</span>
            <span v-if="scope.row.pay_way == 3 && scope.row.pay_type == 1">余额支付</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payed_time"
          label="支付时间"
          width="180">
        </el-table-column>
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
      time_interval_new: '',
      loading:true,   //加载中
      allmoney: 0,   //总金额
      list_num:0,     //总订单数
      selmoney: 0,   //筛选总金额
      sel_num:0,     //筛选总订单数
      statues:'',           //关键字订单状态绑定
      pay_channel:'',
      pay_way:'',
      parkareas: [],  //区域分类
      selpark: '',    //关键字区域分类绑定
      parkkinds: ['泊位停车','车库停车'],   //停车种类
      selparkkind: '',    //关键字停车种类绑定
      selconsumptions: '',  //关键字消费渠道绑定
      username:'',      //关键字帐户名绑定
      parkNo: '',
      pageIndex: 1,     //页数
      ps:10,            //每页数量
      allps:1,          //总页数
      list_detail:[],    //订单数组
      url:'/its/operations/query/pdaOrder',
      url_park:'/its/operations/query/berth'
    }
  },
  mounted() {
    this.get_order_list()
    axios({
      method: 'post',
      url:this.url_park,
      headers:{
        'content-type':'application/x-www-form-urlencoded'
      },
      data: {}
    }).then(res => {
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
        if (index === 2 || index === 3 || index === 4 || index === 7 || index === 12) {
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
    //封装获取
    get_my_order(params){
      axios({
        method:'post',
        url: this.url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:params
      }).then(res => {
        console.log(res)
        if(res.data.mesg == '暂无数据'){
          this.$notify({
            title: '温馨提示',
            message: '暂无符合搜索条件的数据',
            type: 'warning',
            offset: 100
          })
        }else{
          this.allmoney = res.data.data.data[0].totalMoney
          this.selmoney = res.data.data.data[0].screenMoney
          this.list_detail = res.data.data.data
          this.sel_num = res.data.data.tr
          this.loading = false
          this.list_detail.map(element => {
            element.parkstart_time = this.formatDate(element.parkstart_time)
            element.parkend_time = this.formatDate(element.parkend_time)
            if (element.payed_time) {
              element.payed_time = this.formatDate(element.payed_time * 1000)
            }
          })
        }
      })
    },
    get_order_list(){
      this.loading = true
      let params = new URLSearchParams()
      params.append('pageIndex', this.pageIndex)
      params.append('ps', this.ps)
      // this.get_my_order(params)
      axios({
        method:'post',
        url: this.url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:params
      }).then(res => {
        console.log(res)
        if(res.data.mesg == '暂无数据'){
          this.$notify({
            title: '温馨提示',
            message: '暂无符合搜索条件的数据',
            type: 'warning',
            offset: 100
          })
        }else{
          this.allmoney = res.data.data.data[0].totalMoney
          this.selmoney = res.data.data.data[0].screenMoney
          this.list_detail = res.data.data.data
          this.list_num = res.data.data.tr
          this.sel_num = res.data.data.tr
          this.loading = false
          this.list_detail.map(element => {
            element.parkstart_time = this.formatDate(element.parkstart_time)
            element.parkend_time = this.formatDate(element.parkend_time)
            if (element.payed_time) {
              element.payed_time = this.formatDate(element.payed_time * 1000)
            }
          })
        }
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
      let params = new URLSearchParams()
      params.append('pageIndex', this.pageIndex)
      params.append('ps', this.ps)
      if (this.time_interval) {
        params.append('sTime', this.time_interval[0])
        params.append('eTime', this.time_interval[1])
      }
      if (this.time_interval_new) {
        params.append('sPayTime', this.time_interval_new[0])
        params.append('ePayTime', this.time_interval_new[1])
      }
      if (this.parkNo) {
        params.append('parkingNo', this.parkNo)
      }
      if (this.pay_way) {
        params.append('payWay', this.pay_way)
      }
      if (this.username) {
        params.append('carNo', this.username)
      }
      if (this.selpark) {
        params.append('parkingName', this.selpark)
      }
      if (this.statues) {
        params.append('orderStatus', this.statues)
      }
      if (this.pay_channel) {
        params.append('payChannel', this.pay_channel)
      }
      this.get_my_order(params)
    },
    selbtn(){
      this.pageIndex = 1
      let params = new URLSearchParams()
      params.append('pageIndex', this.pageIndex)
      params.append('ps', this.ps)
      if (this.time_interval) {
        params.append('sTime', this.time_interval[0])
        params.append('eTime', this.time_interval[1])
      }
      if (this.time_interval_new) {
        params.append('sPayTime', this.time_interval_new[0])
        params.append('ePayTime', this.time_interval_new[1])
      }
      if (this.parkNo) {
        params.append('parkingNo', this.parkNo)
      }
      if (this.pay_way) {
        params.append('payWay', this.pay_way)
      }
      if (this.username) {
        params.append('carNo', this.username)
      }
      if (this.selpark) {
        params.append('parkingName', this.selpark)
      }
      if (this.statues) {
        params.append('orderStatus', this.statues)
      }
      if (this.pay_channel) {
        params.append('payChannel', this.pay_channel)
      }
      this.get_my_order(params)
    }
  },
}
</script>
<style scoped>
#row{
  width: 100%;
  height: 100%;
  /* background: rgb(219, 219, 219); */
  background-color: #f5f5f5 !important;
  color: #000;
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
  height: 120px;
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
.selstate_time{
  width: 300px;
  height: 40px;
  margin: 10px 10px 0 0px;
  border-radius: 5px;
  float: left;
}
.selbtn{
  float: left;
  margin: 10px 0 0 20px;
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
  /* width: 580px; */
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
