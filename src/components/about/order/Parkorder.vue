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
      <el-select v-model="statues" class="selstate" placeholder="订单状态" clearable>
        <el-option value="" label="全部状态"></el-option>
        <el-option value="0" label="未支付"></el-option>
        <el-option value="1" label="交易完成"></el-option>
        <el-option value="2" label="无需支付"></el-option>
      </el-select>
      <el-select v-model="selpark" placeholder="停车区域" class="selplace" filterable clearable>
        <el-option value="">全部区域</el-option>
        <el-option
          v-for="item in parkareas"
          :key="item.parking_name"
          :label="item.parking_name"
          :value="item.parking_name">
        </el-option>
      </el-select>
      <!-- <el-select v-model="selparkkind" placeholder="停车类别" class="selparkkind" clearable>
        <el-option value="">全部类别</el-option>
        <el-option
          v-for="item in parkkinds"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select> -->
      <el-select v-model="selconsumptions" class="selconsumption" placeholder="消费渠道" clearable>
        <el-option label="全部渠道" value=""></el-option>
        <el-option label="APP" value="appType"></el-option>
        <el-option label="微信小程序" value="smallType"></el-option>
      </el-select>
      <div class="data-interval">
        <div class="block">
          <el-date-picker
            v-model="time_interval"
            type="datetimerange"
            range-separator="-"
            format='yyyy-MM-dd HH:mm:ss'
            value-format='yyyy/MM/dd HH:mm:ss'
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="username">
          <span style="float:left">账户:</span>
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
          prop="order_no"
          label="订单编号">
        </el-table-column>
        <el-table-column
          label="帐户名">
          <template slot-scope="scope">
            <span v-if="scope.row.mobile">{{scope.row.mobile}}</span>
            <span v-if="!scope.row.mobile">小程序用户</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="car_no"
          width="100"
          label="停泊车辆">
        </el-table-column>
        <el-table-column
          sortable
          prop="charge_money"
          width="130"
          label="消费金额(元)">
        </el-table-column>
        <el-table-column
          prop=""
          width="80"
          label="支付方式">
          <template slot-scope="scope">
            ***
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop=""
          label="停车类别">
          <template slot-scope="scope">
            泊位停车
          </template>
        </el-table-column> -->
        <el-table-column
          prop="money"
          width="80"
          label="消费渠道">
          <template slot-scope="scope">
            <span v-if="scope.row.user_id == 2">APP</span>
            <span v-if="scope.row.user_id == 1">小程序</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="parking_name"
          label="停车地点">
        </el-table-column>
        <el-table-column
          prop="parkstart_time"
          label="入场时间">
        </el-table-column>
        <el-table-column
          prop="parkend_time"
          label="出场时间">
        </el-table-column>
        <el-table-column
          width="80"
          label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_type == 1">交易完成</span>
            <span v-if="scope.row.pay_type == 0">未支付</span>
            <span v-if="scope.row.pay_type == 2">免费时段</span>
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
      time_interval: [],    //时间区间
      allmoney: '',   //总金额
      list_num:0,     //总订单数
      selmoney: '',   //筛选总金额
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
      url:'/its/operations/all/orders',
      url_park:'/its/operations/query/berth'
    }
  },
  mounted() {
    let params = new URLSearchParams();
    params.append('pageIndex', this.pageIndex);
    params.append('ps', this.ps);
    this.get_all_list(params,this.url)
    axios({
      method: 'post',
      url:this.url_park,
      headers:{
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
        if (index === 2) {
          sums[index] = '';
          return;
        }
        if (index === 3) {
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
      params.append('state', this.statues)
      params.append('area', this.selpark)
      params.append('sTime', this.time_interval[0])
      params.append('eTime', this.time_interval[1])
      params.append('account', this.username)
      params.append(this.selconsumptions, '123')
      this.get_list(params,this.url)
    },
    selbtn(){
      this.ps_total = 0
      let params = new URLSearchParams()
      params.append('pageIndex', this.pageIndex)
      params.append('ps', this.ps)
      params.append('state', this.statues)
      params.append('area', this.selpark)
      params.append('sTime', this.time_interval[0])
      params.append('eTime', this.time_interval[1])
      params.append('account', this.username)
      params.append(this.selconsumptions, '123')
      this.get_list(params,this.url)
      console.log(this.list_detail)
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
@media screen and (min-width: 1313px) {
  .select{
    width: 100%;
    height: 60px;
    background: #fff;
    margin-top: 20px;
  }
}
@media screen and (max-width: 1312px) {
  .select{
    width: 100%;
    height: 120px;
    background: #fff;
    margin-top: 20px;
  }
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
  bottom: 7px;
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

