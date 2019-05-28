<template>
  <div id="row">
    <div class="total">
      <span style="margin-left:50px">月卡总数：<a href="javascript:void(0)">{{list_num}}</a>个</span>
      <el-divider direction="vertical"></el-divider>
      <span>筛选月卡数：<a href="javascript:void(0)">{{sel_num}}</a>个</span>
    </div>
    <div class="select">
      <el-select v-model="card_kind" placeholder="月卡类型" class="selconsumption">
        <el-option value="">全部类型</el-option>
        <el-option
          v-for="item in consumptions"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="card_status" placeholder="月卡状态" class="selconsumption">
        <el-option value="">全部状态</el-option>
        <el-option
          v-for="item in consumptions"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <div class="data-interval">
        <!-- <span>添加日期：</span>
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
        </div> -->
        <div class="username">
          <span style="float:left">车牌:</span>
          <el-input style="width:120px;float:left"
            placeholder="输入车牌号"
            v-model="car_no"
            clearable>
          </el-input>
          <span style="float:left">手机号:</span>
          <el-input style="width:120px;float:left"
            placeholder="输入手机号"
            v-model="mobile_no"
            clearable>
          </el-input>
          <span style="float:left">停车场:</span>
          <el-input style="width:120px;float:left"
            placeholder="输入停车场"
            v-model="park_name"
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
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index">
        </el-table-column>
        <el-table-column
          prop="car"
          label="车牌">
        </el-table-column>
        <el-table-column
          prop="card_kind"
          label="月卡类型">
        </el-table-column>
        <el-table-column
          prop="park_name"
          label="停车场">
        </el-table-column>
        <el-table-column
          prop="source"
          label="办理来源">
        </el-table-column>
        <el-table-column
          prop="start_time"
          label="开卡时间">
        </el-table-column>
        <el-table-column
          prop="end_time"
          label="到期时间">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号">
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
      add_header_text:'',
      consumptions: ['APP','微信小程序'],
      card_kind:['月卡','季卡','半年卡','年卡'],
      card_status:['生效中','已失效'],
      list_detail: [
        {car:'粤A123456',card_kind:'月卡',park_name:'龙胜路',source:'PDA',start_time:'2019-05-22 15:00:00',end_time:'2019-06-22 15:00:00',status:'生效中',mobile:'13432456678'},
        {car:'粤A123456',card_kind:'年卡',park_name:'龙胜路',source:'PDA',start_time:'2019-05-22 15:00:00',end_time:'2019-06-22 15:00:00',status:'生效中',mobile:'13432456678'},
        {car:'粤A123456',card_kind:'月卡',park_name:'龙胜路',source:'PDA',start_time:'2019-05-22 15:00:00',end_time:'2019-06-22 15:00:00',status:'生效中',mobile:'13432456678'},
        {car:'粤A123456',card_kind:'月卡',park_name:'龙胜路',source:'PDA',start_time:'2019-05-22 15:00:00',end_time:'2019-06-22 15:00:00',status:'生效中',mobile:'13432456678'},
        {car:'粤A123456',card_kind:'月卡',park_name:'龙胜路',source:'PDA',start_time:'2019-05-22 15:00:00',end_time:'2019-06-22 15:00:00',status:'生效中',mobile:'13432456678'},
        {car:'粤A123456',card_kind:'月卡',park_name:'龙胜路',source:'PDA',start_time:'2019-05-22 15:00:00',end_time:'2019-06-22 15:00:00',status:'生效中',mobile:'13432456678'}
      ],
      car_no:'',
      mobile_no:'',
      park_name:'',
      pageIndex: 1,
      ps:10,
      total_ps:40,
      allps:1,
      sel_user: '18318039639',
      sel_user_car_list:[],
      user_car_show:false,
      rule_editor:false,
      // url:'http://www.lcgxlm.com:13259/its/admin/query/useressage',
      url:'/its/admin/query/useressage',
      car_url:'http://www.lcgxlm.com:13259/its/admin/underthe/vehicle'
    }
  },
  mounted() {

  },
  methods: {
    //新建白名单车牌
    add_car(){
      console.log(1)
      this.rule_editor = true
      this.add_header_text = '新建白名单'
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
  cursor: none;
  text-decoration: none;
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
  width: 630px;
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
  width: 550px;
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
  padding: 8px 0
}
.detail>>>th{
  text-align: center;
  padding: 10px 0
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
