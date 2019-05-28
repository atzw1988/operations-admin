<template>
  <div id="row">
    <div class="total">
      <span style="margin-left:50px">车辆白名单数：<a href="javascript:void(0)">{{list_num}}</a>辆</span>
      <el-divider direction="vertical"></el-divider>
      <span>筛选白名单数：<a href="javascript:void(0)">{{sel_num}}</a>辆</span>
    </div>
    <div class="select">
      <el-button style="float:right;margin-right:20px;margin-top:10px;" type="danger" @click="sel_del">删除</el-button>
      <el-button style="float:right;margin-right:20px;margin-top:10px;" type="success" @click="add_car">新建</el-button>
      <div class="data-interval">
        <span>添加日期：</span>
        <div class="block">
          <el-date-picker
            v-model="time_interval"
            type="datetimerange"
            value-format='yyyy-MM-dd HH:mm:ss'
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="username">
          <span style="float:left">车牌:</span>
          <el-input style="width:120px;float:left"
            placeholder="输入车牌号"
            v-model="white_car"
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
          prop="carNo"
          label="车牌">
        </el-table-column>
        <el-table-column
          sortable
          prop="createTime"
          label="加入白名单日期">
        </el-table-column>
        <el-table-column
          sortable
          prop="info"
          label="备注">
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
            <el-input style="height:30px;width:250px;background:#eee;border-radius:5px" type="text" clearable v-model="editor_car.carNo"></el-input>
          </div>
          <div style="width:350px;margin:20px auto 0;font-size:18px;height:40px;line-height:40px">
            <span>备注：</span>
            <el-input style="height:30px;width:250px;background:#eee;border-radius:5px" type="text" clearable v-model="editor_car.info"></el-input>
          </div>
          <el-button style="margin-left:28%;margin-top:30px;" type="info" @click="reset_car">重置</el-button>
          <el-button style="margin-left:20%;margin-top:30px;" type="success" @click="confirm_car">确认</el-button>
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
      list_detail: [],
      white_car:'',
      editor_car:{},
      multipleSelection:'',
      pageIndex: 1,
      ps:10,
      total_ps:40,
      allps:1,
      sel_user: '18318039639',
      sel_user_car_list:[],
      user_car_show:false,
      rule_editor:false,
      car_reset_editor:{},
      // url:'http://www.lcgxlm.com:13259/its/admin/query/useressage',
      textone:'',
      texttwo:'',
      url:'http://192.168.0.121:13259/its/white-list/list',
      url_del:'http://192.168.0.121:13259/its/white-list/del',
      car_url:'http://www.lcgxlm.com:13259/its/admin/underthe/vehicle',
    }
  },
  mounted() {
    this.get_rule_list()
  },
  methods: {
    //封装获取白名单列表
    get_car_list(params){
      axios.get(this.url,{
        params:params
      }).then(res => {
        console.log(res)
        if(res.data.data.pageInfo.list.length > 0){
          this.list_detail = res.data.data.pageInfo.list
          this.total_ps = res.data.data.pageInfo.total
          this.list_num = res.data.data.pageInfo.total
          this.sel_num = res.data.data.pageInfo.total
        }else{
          let text = '没有符合条件的数据'
          this.show_warning(text)
        }
      })
    },
    get_rule_list(){
      let params = {
        pageNum:this.pageIndex,
        pageSize:this.ps
      }
      this.get_car_list(params)
    },
    //表格选中
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;
    },
    //删除选择车牌
    sel_del(){
      let data = this.multipleSelection.map(item => {
        return item.id
      })
      let params = data
      let textone = '此操作将所选择的车辆白名单删除, 是否继续?'
      let texttwo = '车辆白名单删除成功！'
      let textthree = '车辆白名单删除失败！'
      let url = this.url_del
      this.show_delete_warning(textone,texttwo,textthree,url,params)
    },
    //新建白名单车牌
    add_car(){
      this.rule_editor = true
      this.add_header_text = '新建白名单'
      this.textone = '添加车牌白名单成功！'
      this.texttwo = '添加车牌白名单失败！'
      this.url = 'http://192.168.0.121:13259/its/white-list/list'
    },
    //表格内编辑
    list_edit(rule){
      console.log(rule)
      this.rule_editor = true
      this.add_header_text = '编辑白名单'
      this.textone = '更新车牌白名单成功！'
      this.texttwo = '更新车牌白名单失败！'
      this.url = 'http://192.168.0.121:13259/its/white-list/update'
      this.editor_car = rule
      this.car_reset_editor = JSON.parse(JSON.stringify(rule))
    },
    confirm_car(){
      console.log(this.url)
      if(this.editor_car.carNo && this.editor_car.info){
        console.log(this.editor_car.carNo.length)
        if(this.editor_car.carNo.length != 7 && this.editor_car.carNo.length != 8){
          this.$notify.error({
            title: '温馨提示',
            message: '车牌输入有误!',
            offset: 100
          })
        }else{
          let params = {
            carNo:this.editor_car.carNo,
            info:this.editor_car.info
          }
          if(this.editor_car.id){
            params.id = this.editor_car.id
          }
          params = JSON.stringify(params)
          axios({
            method:'post',
            url:this.url,
            headers: {
              'Authorization': 'Web 123213213',
              'content-type': 'application/json;charset=UTF-8'
            },
            data:params
          }).then(res => {
            console.log(res)
            if(res.data.mesg == 'OK'){
              this.$notify({
                title: '温馨提示',
                message: this.textone,
                type: 'success',
                offset: 100
              })
              this.close()
              this.get_rule_list()
            }else if(res.data.code == 13001){
              this.$notify.error({
                title: '温馨提示',
                message: '该车牌白名单已经存在！',
                offset: 100
              })
            }else(
              this.$notify.error({
                title: '温馨提示',
                message: this.texttwo,
                offset: 100
              })
            )
          })
        }
      }
    },
    reset_car(){
      let data = JSON.parse(JSON.stringify(this.car_reset_editor))
      this.editor_car = data
    },
    //表格内删除
    list_del(item){
      let params = [item.id]
      let textone = '此操作将所选择的月卡配置删除, 是否继续?'
      let texttwo = '月卡配置删除成功！'
      let textthree = '月卡配置删除失败！'
      let url = this.url_del
      this.show_delete_warning(textone,texttwo,textthree,url,params)
    },
    //分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    close(){
      this.rule_editor = false
      this.editor_car = {}
      this.url = 'http://192.168.0.121:13259/its/white-list/list'
      this.get_rule_list()
    },
    //搜索
    sel_uesr(){
      console.log(this.white_car)
      console.log(this.time_interval)
      let params = {
        pageNum:this.pageIndex,
        pageSize:this.ps,
        startTime:this.time_interval[0],
        endTime:this.time_interval[1],
        carNo:this.white_car
      }
      this.get_car_list(params)
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
  width: 800px;
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
</style>
