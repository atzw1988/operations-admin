<template>
  <div id="row">
    <div class="total">
      <span style="margin-left:50px">车位总数：<a href="javascript:void(0)">{{list_num}}</a>个</span>
    </div>
    <div class="select">
      <el-button style="float:right;margin-right:20px;margin-top:10px;" type="danger" @click="sel_del">删除</el-button>
      <el-button style="float:right;margin-right:20px;margin-top:10px;" type="success" @click="add_car">新建</el-button>
      <div class="data-interval">
        <div class="username">
          <span style="float:left">车位编号:</span>
          <el-input style="width:120px;float:left"
            placeholder="输入车位编号"
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
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          width="50"
          type="index">
        </el-table-column>
        <el-table-column
          prop="park_name"
          width="200"
          label="车库名称">
        </el-table-column>
        <el-table-column
          prop="park_no"
          width="100"
          label="车库编号">
        </el-table-column>
        <el-table-column
          prop="chewei_no"
          width="100"
          label="车位编号">
        </el-table-column>
        <el-table-column
          prop="area_no"
          width="100"
          label="地址编号">
        </el-table-column>
        <el-table-column
          prop="address"
          label="详细地址">
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
    <div class="addcontent" v-if="rule_editor">
      <div class="rule_editor">
        <div class="add-header">{{add_header_text}}
          <span @click="close">X</span>
        </div>
        <div class="editor_cont">
          <div style="width:350px;margin:20px auto 0;font-size:18px;height:40px;line-height:40px">
            <span>车牌：</span>
            <el-input style="height:30px;width:250px;background:#eee;border-radius:5px" type="text" clearable></el-input>
          </div>
          <div style="width:350px;margin:20px auto 0;font-size:18px;height:40px;line-height:40px">
            <span>备注：</span>
            <el-input style="height:30px;width:250px;background:#eee;border-radius:5px" type="text" clearable></el-input>
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
        {park_no:'A123456',park_name:'深业U中心',chewei_no:'401012',area_no:'123456',equip_no:'123456',address:'浙江省嵊州市XX路XX街道XX号XX停车场'},
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
      rule_editor:false,
      // url:'http://www.lcgxlm.com:13259/its/operations/query/useressage',
      url:'/its/operations/query/useressage',
      car_url:'/its/operations/underthe/vehicle'
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
    //新建白名单车牌
    add_car(){
      console.log(1)
      this.rule_editor = true
      this.add_header_text = '新建车位'
    },
    //表格内编辑
    list_edit(){

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
          message: '移出白名单成功!',
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
  width: 300px;
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
  width: 220px;
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
.rule_editor{
  width: 600px;
  height: 400px;
  background: #fff;
  margin: 30px auto 0;
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
</style>
