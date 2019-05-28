<template>
  <div id="row">
    <div class="select">
      <el-button style="float:right;margin-right:20px;margin-top:10px;" type="danger" @click="sel_del">删除</el-button>
      <el-button style="float:right;margin-right:20px;margin-top:10px;" type="success" @click="add_car">新建</el-button>
      <div class="data-interval">
        <div class="username">
          <span style="float:left">月卡类型:</span>
          <el-input style="width:140px;float:left"
            placeholder="输入月卡类型"
            v-model="card_kind"
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
          prop="card_kind"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="month_no"
          sortable
          label="月数">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="新建时间">
        </el-table-column>
        <el-table-column
          prop="updata_time"
          label="更新时间">
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" @click="list_edit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button style="color:red" icon="el-icon-delete" @click="list_del(scope.row)" type="text" size="small">删除</el-button>
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
    <div class="addcontent" @click.stop="close" v-if="addshow">
      <div class="myaddrl" @click.stop>
        <div class="add-header">{{add_header_text}}
          <span @click.stop="close">X</span>
        </div>
        <div class="selnorm">
          <div class="normright">
            <div style="width:350px;margin:20px auto 0;font-size:18px;height:40px;line-height:40px">
              <span>名称：</span>
              <el-input style="width:250px" type="text" v-model="card_sel_editor.card_kind" clearable></el-input>
            </div>
            <div style="width:350px;margin:20px auto 0;font-size:18px;height:40px;line-height:40px">
              <span>月数：</span>
              <el-input-number v-model="card_sel_editor.month_no" :step="1" style="width:250px"></el-input-number>
            </div>
            <el-button style="margin-top:35px;margin-left:25%" type="warning" @click="reset">重置</el-button>
            <el-button style="margin-top:35px;margin-left:15%" type="primary" @click.stop="confirm">确认</el-button>
          </div>
        </div>
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
      add_header_text:'',
      consumptions: ['APP','微信小程序'],
      user_kind:'',
      list_detail: [
        {card_kind:'月卡',month_no:1,create_time:'2019-05-21 18:00:00',updata_time:'2019-06-21 18:00:00'},
        {card_kind:'月卡',month_no:1,create_time:'2019-05-21 18:00:00',updata_time:'2019-06-21 18:00:00'},
        {card_kind:'月卡',month_no:1,create_time:'2019-05-21 18:00:00',updata_time:'2019-06-21 18:00:00'},
        {card_kind:'月卡',month_no:1,create_time:'2019-05-21 18:00:00',updata_time:'2019-06-21 18:00:00'}
      ],
      card_kind:'',
      card_sel_editor:{},
      card_sel_reset:{},
      multipleSelection:'',
      pageIndex: 1,
      ps:10,
      total_ps:40,
      allps:1,
      addshow:false,
      url_park:'http://www.lcgxlm.com:13259/its/admin/query/berth'
    }
  },
  mounted() {
    this.get_park_list()
  },
  methods: {
    //获取停车场列表
    get_park_list(){
      axios({
        method: 'post',
        url:this.url_park,
        headers:{
          'Authorization':'Web 123213213',
          'content-type':'application/x-www-form-urlencoded'
        },
        data: {}
      }).then(res => {
        this.parklists = res.data.data.map(item => {
          return {
            'key':item.parking_weiyi_no,
            'label':item.parking_name,
            'name':item.parking_name
          }
        })
      })
    },
    filterMethod(query, item) {
      return item.name.indexOf(query) > -1;
    },
    //表格选中
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;
    },
    //删除选择车牌
    sel_del(){
      this.$confirm('此操作将所选择的车位删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$notify({
          title: '温馨提示',
          message: '删除车位成功!',
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
    //新建月卡类型
    add_car(){
      this.addshow = true
      this.add_header_text = '新建月卡类型'
    },
    confirm(){
      this.close()
    },
    reset(){
      let data = JSON.parse(JSON.stringify(this.card_sel_reset))
      this.card_sel_editor = data
    },
    //表格内编辑
    list_edit(item){
      this.addshow = true
      this.add_header_text = '编辑月卡类型'
      this.card_sel_reset = JSON.parse(JSON.stringify(item))
      this.card_sel_editor = item
    },
    //表格内删除
    list_del(params){
      this.$confirm('此操作将该车位删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$notify({
          title: '温馨提示',
          message: '删除车位成功!',
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
    //分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    close(){
      this.addshow = false
      this.card_sel_editor = {}
      this.card_sel_reset = {}
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
}
.selstate,.selplace,.selparkkind,.selconsumption{
  width: 110px;
  height: 40px;
  margin: 10px 0 0 20px;
  border-radius: 5px;
  float: left;
}
.data-interval{
  width: 350px;
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
.username{
  width: 240px;
  height: 40px;
  float: left;
  margin-left: 10px;
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
.addcontent{
  width: 100%;
  height: 100%;
  background: rgb(126, 126, 126,0.7);
  z-index: 2000;
  position: absolute;
  top: 0;
  left: 0;
}
.myaddrl{
  width: 500px;
  height: 300px;
  background: #fff;
  margin: 200px auto 0;
}
.add-header{
  width: 100%;
  height: 40px;
  background: rgb(126, 126, 126);
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  position: relative;
}
.add-header>span{
  position: absolute;
  font-size: 20px;
  font-weight: 600;
  right: 20px;
  top: 0;
  cursor: pointer;
}
.selnorm,.selpark{
  width: 80%;
}
.selnorm{
  height: 180px;
  margin: 10px auto 0;
}
.normright{
  width: 100%;
  height: 100%;
  float: left;
  /* border: 1px solid saddlebrown; */
}
</style>
