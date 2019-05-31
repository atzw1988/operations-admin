<template>
  <div id="row">
    <div class="total">
      <span style="margin-left:50px">黑名单总数：<a href="javascript:void(0)">{{list_num}}</a>人</span>
      <el-divider direction="vertical"></el-divider>
      <span>筛选黑名单数：<a href="javascript:void(0)">{{sel_num}}</a>人</span>
    </div>
    <div class="select">
      <el-button style="float:right;margin-right:20px;margin-top:10px;" type="warning" @click="sel_remove">移出黑名单</el-button>
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
        :data="list_detail"
        tooltip-effect="dark"
        style="width: 100%"
        :summary-method="getSummaries"
        show-summary
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          type="index">
        </el-table-column>
        <el-table-column
          prop="name"
          label="账号"
          >
        </el-table-column>
        <el-table-column
          prop="car"
          label="下挂车辆">
        </el-table-column>
        <el-table-column
          sortable
          prop="nopay"
          label="待缴金额">
        </el-table-column>
        <el-table-column
          sortable
          prop="create_time"
          label="注册日期">
        </el-table-column>
        <el-table-column
          sortable
          prop="last_pay_time"
          label="最后一次付费日期">
        </el-table-column>
        <el-table-column
          sortable
          prop="last_login_time"
          label="最后一次登录日期">
        </el-table-column>
        <el-table-column
          prop="last_park"
          label="最后一次停车地点">
        </el-table-column>
        <el-table-column
          label="操作"
          width="80">
          <template slot-scope="scope">
            <el-button style="color:#E6A23C" @click="list_remove(scope.row)" type="text" size="small">移出黑名单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-size='ps'
        layout="total, prev, pager, next, jumper"
        :total="total_ps">
      </el-pagination>
    </div>
    <div v-if="user_car_show" class="usr_car">
      <div class="car_detail">
        <span class="close" @click="close">X</span>
        <ul>
          <li style="margin-top:60px">
            <span>用户名：</span>
            <span>{{sel_user}}</span>
          </li>
          <li>
            <span>所有车辆：</span>
            <li v-for="(car,index) in sel_user_car_list">
              <span>车牌号：{{car.car_no}}</span>
            </li>
          </li>
        </ul>
      </div>
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
      list_num: 58046,
      sel_num: 58046,
      consumptions: ['APP','微信小程序'],
      user_kind:'',
      list_detail: [
        {name:'13493938839',car:'粤A123456',nopay:'100.00',create_time:'2019-04-18 15:23:56',last_pay_time:'2019-04-18 15:23:56',last_login_time:'2019-04-18 15:23:56',last_park:'无名路401011'},
        {name:'13493938839',car:'粤A123456',nopay:'110.00',create_time:'2019-04-18 15:23:56',last_pay_time:'2019-04-18 15:23:56',last_login_time:'2019-04-18 15:23:56',last_park:'无名路401011'},
        {name:'13493938839',car:'粤A123456',nopay:'101.00',create_time:'2019-04-18 15:23:56',last_pay_time:'2019-04-18 15:23:56',last_login_time:'2019-04-18 15:23:56',last_park:'无名路401011'},
        {name:'13493938839',car:'粤A123456',nopay:'200.00',create_time:'2019-04-18 15:23:56',last_pay_time:'2019-04-18 15:23:56',last_login_time:'2019-04-18 15:23:56',last_park:'无名路401011'},
        {name:'13493938839',car:'粤A123456',nopay:'150.00',create_time:'2019-04-18 15:23:56',last_pay_time:'2019-04-18 15:23:56',last_login_time:'2019-04-18 15:23:56',last_park:'无名路401011'},
        {name:'13493938839',car:'粤A123456',nopay:'150.00',create_time:'2019-04-18 15:23:56',last_pay_time:'2019-04-18 15:23:56',last_login_time:'2019-04-18 15:23:56',last_park:'无名路401011'},
        {name:'13493938839',car:'粤A123456',nopay:'150.00',create_time:'2019-04-18 15:23:56',last_pay_time:'2019-04-18 15:23:56',last_login_time:'2019-04-18 15:23:56',last_park:'无名路401011'},
        {name:'13493938839',car:'粤A123456',nopay:'150.00',create_time:'2019-04-18 15:23:56',last_pay_time:'2019-04-18 15:23:56',last_login_time:'2019-04-18 15:23:56',last_park:'无名路401011'}
      ],
      user_name:'',
      multipleSelection:'',
      pageIndex: 1,
      ps:10,
      total_ps:40,
      allps:1,
      sel_user: '18318039639',
      sel_user_car_list:[],
      user_car_show:false,
      // url:'http://www.lcgxlm.com:13259/its/admin/query/useressage',
      url:'/its/admin/query/useressage',
      car_url:'/its/admin/underthe/vehicle'
    }
  },
  mounted() {

  },
  methods: {
    //表格选中
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;
    },
    //移出所选择用户
    sel_remove(){
      this.$confirm('此操作将选择的用户移出黑名单, 是否继续?', '提示', {
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
    //表格内删除
    list_remove(params){
      this.$confirm('此操作将该用户移出黑名单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$notify({
          title: '温馨提示',
          message: '移出黑名单成功!',
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
      console.log(`当前页: ${val}`);
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
  right: 80px;
}
.block{
  float: left;
  height: 40px;
  margin-top: -2px;
}
</style>
