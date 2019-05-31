<template>
  <div id="row">
    <div class="total">
      <span style="border-right:2px solid rgb(0, 162, 255)">总金额：<a href="javascript:void(0)">{{allmoney}}</a>元</span>
      <span style="border-right:4px solid rgb(0, 47, 255)">订单总数：<a href="javascript:void(0)">{{list_num}}</a>个</span>
      <span style="border-right:2px solid rgb(0, 162, 255)">筛选金额：<a href="javascript:void(0)">{{selmoney}}</a>元</span>
      <span>筛选订单数：<a href="#">{{sel_num}}</a>个</span>
    </div>
    <div class="select">
      <el-select v-model="rec_consumptions" class="selconsumption" placeholder="充值渠道">
        <el-option value="appType">APP</el-option>
        <el-option value="smallType">微信小程序</el-option>
      </el-select>
      <div class="data-interval">
        <div class="block">
          <el-date-picker
            v-model="time_interval"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="orderno">
          <span style="float:left">订单编号:</span>
          <el-input style="width:120px;float:left"
            placeholder="输入订单号"
            v-model="order_no"
            clearable>
          </el-input>
        </div>
        <div class="username">
          <span style="float:left">账户:</span>
          <el-input style="width:120px;float:left"
            placeholder="输入帐户名"
            v-model="user_name"
            clearable>
          </el-input>
        </div>
        <el-button class="selbtn" type="primary" @click="sel_regorder">搜索</el-button>
      </div>
    </div>
    <div class="detail">
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
          prop="pay_id"
          label="订单编号"
          width="200">
        </el-table-column>
        <el-table-column
          prop="app_user_id"
          label="帐户名"
          width="250">
        </el-table-column>
        <el-table-column
          sortable
          prop="jin_e"
          label="充值金额(元)">
        </el-table-column>
        <el-table-column
          label="支付方式">
          <template slot-scope="scope">
            <span v-if="scope.row.top_up == 1">微信</span>
            <span v-if="scope.row.top_up == 2">支付宝</span>
          </template>
        </el-table-column>
        <el-table-column
          label="充值渠道">
          <template slot-scope="scope">
            <span v-if="scope.row.app_user_id.length < 13">APP</span>
            <span v-if="scope.row.app_user_id.length >= 13">小程序</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pay_date"
          label="订单时间"
          width="150">
        </el-table-column>
        <el-table-column
          label="交易状态">
          <template slot-scope="scope">
            交易完成
          </template>
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
      allmoney: '',          //总金额
      list_num:0,            //总充值订单数
      selmoney: '',          //筛选总金额数
      sel_num:0,            //筛选总充值订单数
      ps_total:0,                //当前页总金额
      rec_consumptions:'',       //充值渠道绑定
      order_no: '',          //订单编号
      user_name:'',         //帐户名数据绑定
      list_detail: [],          //充值订单数据
      pageIndex: 1,        //当前页数
      ps:15,               //每页数据量
      allps:1,              //总页数
      url: '/its/admin/recharge/orders'
    }
  },
  mounted() {
    let params = new URLSearchParams();
    params.append('pageIndex', this.pageIndex);
    params.append('ps', this.ps);
    this.get_all_list(params,this.url)
  },
  methods: {
    //翻页
    page_change(val){
      console.log(val)
      let params = new URLSearchParams();
      params.append('pageIndex', val);
      params.append('ps', this.ps);
      params.append('order_No', this.order_no);
      params.append('sTime', this.msgstart);
      params.append('eTime', this.msgend);
      params.append('account', this.user_name);
      params.append(this.rec_consumptions, '123');
      this.get_list(params,this.url)
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
        if (index === 2) {
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
    //搜索
    sel_regorder(){
      this.ps_total = 0
      let params = new URLSearchParams();
      params.append('pageIndex', 1);
      params.append('ps', this.ps);
      params.append('order_No', this.order_no);
      params.append('sTime', this.msgstart);
      params.append('eTime', this.msgend);
      params.append('account', this.user_name);
      params.append(this.rec_consumptions, '123');
      this.get_list(params,this.url)
    }
  },
}
</script>
<style scoped>
#row{
  width: 100%;
  height: 100%;
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
  /* border: 1px solid firebrick; */
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
  width: 900px;
  height: 40px;
  float: left;
  line-height: 40px;
  font-size: 20px;
  margin-left: 20px;
  margin-top: 10px;
}
.orderno{
  width: 220px;
  height: 40px;
  float: left;
  margin-left: 10px;
}
.username{
  width: 180px;
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
  bottom: 7px;
  right: 10px;
}
.block{
  float: left;
  height: 40px;
  margin-top: -2px;
}
</style>

