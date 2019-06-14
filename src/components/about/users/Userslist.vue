<template>
  <div id="row">
    <div class="total">
      <span style="border-right:2px solid rgb(0, 162, 255)">会员总数：<a href="javascript:void(0)">{{list_num}}</a>人</span>
      <span style="border-right:2px solid rgb(0, 162, 255)">筛选会员数：<a href="javascript:void(0)">{{sel_num}}</a>人</span>
    </div>
    <div class="select">
      <el-button style="float:right;margin-right:20px;margin-top:10px;" type="danger" @click="sel_del">删除</el-button>
      <!-- <el-button style="float:right;margin-right:20px;margin-top:10px;" type="warning" @click="sel_to_black">加入黑名单</el-button> -->
      <!-- <el-select v-model="user_kind" placeholder="用户类型" class="selconsumption">
        <el-option value="">全部用户</el-option>
        <el-option
          v-for="item in consumptions"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select> -->
      <div class="data-interval">
        <span>注册日期：</span>
        <div class="block">
          <el-date-picker
            v-model="time_interval"
            type="datetimerange"
            range-separator="-"
            format='yyyy-MM-dd HH:mm:ss'
            value-format='yyyyMMdd HH:mm:ss'
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="username">
          <span style="float:left">账户:</span>
          <el-input style="width:120px;float:left"
            placeholder="输入用户名"
            v-model="user_name"
            clearable>
          </el-input>
        </div>
        <el-button class="selbtn" type="primary" @click="sel_uesr">搜索</el-button>
      </div>
    </div>
    <div class="detail">
      <el-table
        v-loading="loading"
        :summary-method="getSummaries"
        show-summary
        :data="list_detail"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="sel_change">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          type="index">
        </el-table-column>
        <el-table-column
          label="账号"
          width="280">
          <template slot-scope="scope">
            <span v-if="scope.row.mobile">{{scope.row.mobile}}</span>
            <span v-if="!scope.row.mobile">{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="下挂车辆"
          width="100">
          <template slot-scope="scope">
            <span @click="get_user_car(scope.row)" class="carshow">点击查看</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="pay"
          label="消费金额"
          width="100">
          <template slot-scope="scope">
            ***
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="money"
          label="充值金额"
          width="100">
          <template slot-scope="scope">
            ***
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="user_money"
          label="余额"
          width="100">
        </el-table-column>
        <el-table-column
          sortable
          prop="create_time"
          label="注册日期">
        </el-table-column>
        <!-- <el-table-column
          label="操作"
          width="80">
          <template slot-scope="scope">
            <el-button style="color:#E6A23C" @click="to_black_list(scope.row)" type="text" size="small">移至黑名单</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-size='ps'
        layout="total, prev, pager, next, jumper"
        :total="sel_num">
      </el-pagination>
    </div>
    <el-dialog :title="user_mobile" :visible.sync="user_car_show">
      <el-table :data="user_car_list">
        <el-table-column property="car_no" label="车牌号"></el-table-column>
        <el-table-column property="addTime" label="添加日期"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'jquery';
import axios from 'axios';
export default {
  data() {
    return {
      loading: true,
      time_interval: ['',''],    //时间区间
      list_num: '',
      sel_num: 0,
      consumptions: ['APP','微信小程序'],
      user_kind:'',
      list_detail: [],
      user_name:'',
      user_mobile:'',
      user_car_list:[],
      pageIndex: 1,
      ps:15,
      allps:1,
      sel_user: '18318039639',
      sel_user_car_list:[],
      user_car_show:false,
      url:'/its/operations/query/useressage',
      car_url:'/its/operations/underthe/vehicle'
    }
  },
  mounted() {
    this.get_user()
  },
  methods: {
    //表格选中
    sel_change(val) {
      console.log(val)
      this.multipleSelection = val;
    },
    //获取用户列表
    get_user(){
      this.loading = true
      let params = new URLSearchParams()
      params.append('pageIndex', this.pageIndex)
      params.append('ps', this.ps)
      this.get_all_user_list(params,this.url)
    },
    //获取用户下挂车辆
    get_user_car(e){
      console.log(e)
      this.user_mobile = '账号：' + e.mobile
      let params = new URLSearchParams();
      params.append('accountNo', e.mobile);
      axios({
        method: 'post',
        url: this.car_url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        console.log(res)
        if (res.data.mesg == "暂无数据") {
          this.$notify({
          title: '温馨提示',
            message: '暂无符合搜索条件的数据',
            type: 'warning',
            offset: 100
          })
        } else {
          let cars = res.data.data.forEach(item => {
            item.addTime = this.formatDate(item.addTime)
          })
          this.user_car_list = res.data.data
          this.user_car_show = true
        }
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
    //分页
    handleCurrentChange(val) {
      this.pageIndex = val
      console.log(this.pageIndex)
      let params = new URLSearchParams()
      params.append('pageIndex', this.pageIndex)
      params.append('ps', this.ps);
      if(this.user_kind == 'APP'){
        params.append('appType','app')
      }else if(this.user_kind == '微信小程序'){
        params.append('smallType','微信小程序')
      }
      params.append('sTime', this.time_interval[0])
      params.append('eTime', this.time_interval[1])
      params.append('account', this.user_name)
      this.get_user_list(params,this.url)
    },
    close(){
      this.user_car_show = false
    },
    //搜索
    sel_uesr(){
      console.log(this.time_interval[0])
      console.log(this.time_interval[1])
      let params = new URLSearchParams()
      params.append('pageIndex', this.pageIndex)
      params.append('ps', this.ps)
      if(this.user_kind == 'APP'){
        params.append('appType','app')
      }else if(this.user_kind == '微信小程序'){
        params.append('smallType','微信小程序')
      }
      params.append('sTime', this.time_interval[0])
      params.append('eTime', this.time_interval[1])
      params.append('account', this.user_name)
      this.get_user_list(params,this.url)
    },
    //删除所选择用户
    sel_del(){
      this.$confirm('此操作将选择的用户永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        center: true
      }).then(() => {
        this.$notify({
          title: '温馨提示',
          message: '删除用户成功!',
          type: 'success',
          offset: 100
        })
      }).catch(() => {
        this.$notify({
          title: '温馨提示',
          message: '已取消操作!',
          type: 'info',
          offset: 100
        })
      })
    },
    //所选用户加黑名单
    sel_to_black(){
      this.$confirm('此操作将选择的用户设为黑名单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$notify({
          title: '温馨提示',
          message: '添加黑名单成功!',
          type: 'success',
          offset: 100
        })
      }).catch(() => {
        this.$notify({
          title: '温馨提示',
          message: '已取消操作!',
          type: 'info',
          offset: 100
        })
      })
    },
    //列表内添加黑名单
    to_black_list(){
      this.$confirm('此操作将该用户设为黑名单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$notify({
          title: '温馨提示',
          message: '添加黑名单成功!',
          type: 'success',
          offset: 100
        })
      }).catch(() => {
        this.$notify({
          title: '温馨提示',
          message: '已取消操作!',
          type: 'info',
          offset: 100
        })
      })
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
}
.total{
  width: 100%;
  height: 50px;
  background: #fff;
}
.total>span{
  float: left;
  font-size: 20px;
  width: 250px;
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
  width: 780px;
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
.carshow{
  cursor: pointer;
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
  bottom: 10px;
  right: 10px;
}
.usr_car{
  width: 100%;
  height: 100%;
  background: rgb(126, 126, 126,0.7);
  z-index: 2000;
  position: absolute;
  top: 0;
  left: 0;
}
.car_detail{
  width: 500px;
  height: 400px;
  background: #fff;
  margin: 100px auto;
  position: relative
}
.close{
  position: absolute;
  right: 10px;
  top: 5px;
}
.car_detail>ul>li{
  width: 80%;
  height: 40px;
  margin: 20px auto 0;
  line-height: 40px;
}
.block{
  float: left;
  height: 40px;
  margin-top: -2px;
}
#row>>>.el-dialog{
  position: absolute;
  left: 30%;
  top: 20%;
  border-radius: 5px;
}
#row>>>.el-dialog__body{
  padding-top: 0;
}
#row>>>.el-dialog__header{
  padding-left: 30px;
}
</style>

