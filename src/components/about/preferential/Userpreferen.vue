<template>
  <div id="row">
    <div class="total">
      <span style="margin-left:50px">月卡总数：<a href="javascript:void(0)">{{list_num}}</a>个</span>
      <el-divider direction="vertical"></el-divider>
      <span>筛选月卡数：<a href="javascript:void(0)">{{sel_num}}</a>个</span>
    </div>
    <div class="select">
      <el-select v-model="card_kind_sel" placeholder="月卡类型" class="selconsumption">
        <el-option value="">全部类型</el-option>
        <el-option
          v-for="item in card_kind"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="card_status_sel" placeholder="月卡状态" class="selconsumption">
        <el-option value="">全部状态</el-option>
        <el-option
          v-for="item in card_status"
          :key="item.stauts"
          :label="item.name"
          :value="item.stauts">
        </el-option>
      </el-select>
      <el-select v-model="card_source_sel" placeholder="办理来源" class="selconsumption">
        <el-option value="">全部状态</el-option>
        <el-option
          v-for="item in card_source"
          :key="item.source"
          :label="item.name"
          :value="item.source">
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
          prop="carNo"
          label="车牌">
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="月卡类型">
        </el-table-column>
        <el-table-column
          prop="parkName"
          label="停车场">
        </el-table-column>
        <el-table-column
          label="办理来源">
          <template slot-scope="scope">
            <span v-if="scope.row.source == 1">微信</span>
            <span v-if="scope.row.source == 0">APP</span>
            <span v-if="scope.row.source == 2">PDA</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="opendTime"
          label="开卡时间">
        </el-table-column>
        <el-table-column
          prop="expirationTime"
          label="到期时间">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1">生效中</span>
            <span v-if="scope.row.state == 0">已过期</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
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
      list_num: 0,
      sel_num: 0,
      add_header_text:'',
      card_kind:[],
      card_kind_sel:'',
      card_status:[
        {name:'生效中',stauts:1},
        {name:'已过期',stauts:0}
      ],
      card_status_sel:'',
      card_source:[
        {name:'APP',source:0},
        {name:'PDA',source:2},
        {name:'微信小程序',source:1},
      ],
      card_source_sel:'',
      list_detail: [],
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
      url:'/its/user-card/records',
      url_card:'/its/card-type/types'
    }
  },
  mounted() {
    this.get_rule_list()
    this.get_card_kind()
  },
  methods: {
    //封装获取月卡用户列表
    get_all_user(ele){
      axios.get(this.url,{
        params: ele
      }).then(res => {
        console.log(res)
        this.total_ps = res.data.data.total
        this.list_detail = res.data.data.list
        this.list_num = res.data.data.total
        this.sel_num = res.data.data.total
      })
    },
    //获取月卡用户列表
    get_rule_list(){
      let params = {
        pageNum: this.pageIndex,
        pageSize: this.ps
      }
      this.get_all_user(params)
    },
    //获取月卡类型
    get_card_kind(){
      axios.get(this.url_card,{
      }).then(res => {
        if(res.data.code == 0){
          this.card_kind = res.data.data
        }
      })
    },
    //分页
    handleCurrentChange(val) {
      this.pageIndex = val
      axios.get(this.url,{
        params:{
          pageNum: this.pageIndex,
          pageSize: this.ps,
          carNo:this.car_no,
          phone:this.mobile_no,
          parkName:this.park_name,
          typeId: this.card_kind_sel,
          state:this.card_status_sel,
          source:this.card_source_sel
        }
      }).then(res => {
        this.total_ps = res.data.data.total
        this.list_detail = res.data.data.list
        this.sel_num = res.data.data.total
      })
    },
    //搜索
    sel_uesr(){
      axios.get(this.url,{
        params:{
          pageNum: 1,
          pageSize: this.ps,
          carNo:this.car_no,
          phone:this.mobile_no,
          parkName:this.park_name,
          typeId: this.card_kind_sel,
          state:this.card_status_sel,
          source:this.card_source_sel
        }
      }).then(res => {
        this.total_ps = res.data.data.total
        this.list_detail = res.data.data.list
        this.sel_num = res.data.data.total
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
