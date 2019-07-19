<template>
  <div id="row">
    <div class="total">
      <span style="margin-left:50px">车位总数：<a href="javascript:void(0)">{{list_num}}</a>个</span>
    </div>
    <div class="select">
      <!-- <el-button style="float:right;margin-right:20px;margin-top:10px;" type="danger" @click="sel_del">删除</el-button> -->
      <el-button style="float:right;margin-right:20px;margin-top:10px;" type="success" @click="add_car">新建</el-button>
      <div class="data-interval">
        <div class="username">
          <span style="float:left">地磁编号:</span>
          <el-input style="width:120px;float:left"
            placeholder="输入车位编号"
            v-model="magneticNo"
            clearable>
          </el-input>
        </div>
        <div class="username">
          <span style="float:left">车位编号:</span>
          <el-input style="width:120px;float:left"
            placeholder="输入车位编号"
            v-model="parkingNo"
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
          prop="parking_no"
          label="车位编号">
        </el-table-column>
        <el-table-column
          prop="magnetic_no"
          label="地磁编号">
        </el-table-column>
        <el-table-column
          prop="parking_name"
          label="停车场名字">
        </el-table-column>
        <!-- <el-table-column
          prop="parking_id"
          label="停车场编号">
        </el-table-column> -->
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
          <el-form label-position=left :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="车位编号" prop="parkingNo">
              <el-input v-model.number="ruleForm.parkingNo"></el-input>
            </el-form-item>
            <el-form-item label="地磁编号" prop="magneticNo">
              <el-input v-model.number="ruleForm.magneticNo"></el-input>
            </el-form-item>
            <el-form-item label="归属停车场" prop="parkingId">
              <el-select v-model="ruleForm.parkingId" placeholder="请选择停车场">
                <el-option
                  v-for="item in park_list"
                  :key="item.parkingId"
                  :label="item.parkingName"
                  :value="item.parkingId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button style="margin-left:20px" type="primary" @click="submitForm('ruleForm')">确认</el-button>
              <el-button style="margin-left:200px" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
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
      list_num: 0,
      add_header_text:'',
      list_detail: [],
      parkingNo:'',
      magneticNo:'',
      multipleSelection:'',
      pageIndex: 1,
      ps:15,
      total_ps:0,
      allps:1,
      sel_user: '18318039639',
      sel_user_car_list:[],
      user_car_show:false,
      rule_editor:false,
      is_add:true,
      ruleForm:{
        parkingNo:'',
        magneticNo:'',
        parkingId:'',
        id:''
      },
      rules:{
        parkingNo: [
          { required: true, message: '请输入车位编号', trigger: 'blur' },
          { type: 'number', min: 100000, max: 999999, message: '车位编号必须为6位数字值'}
        ],
        magneticNo: [
          { required: true, message: '请输入地磁编号', trigger: 'blur' },
          { type: 'number', min: 100000000, max: 999999999, message: '地磁编号必须为9位数字值'}
        ],
        parkingId: [
          { required: true, message: '请选择停车场', trigger: 'change' }
        ],
      },
      park_list:[],
      url:'/its/operations/parkingNo/data',
      park_url:'/its/operations/query/parkingNo',
      add_park:'/its/operations/add/parkingNo',
      del_park:'/its/operations/delete/parkingNo',
      edit_url:'/its/operations/modify/parkingNo'
    }
  },
  mounted() {
    this.get_park_detail()
  },
  methods: {
    //封装获取列表
    get_park_list(params){
      this.get_my_list(params,this.url,(res) => {
        console.log(res)
        this.list_detail = res.data.data.data
        this.total_ps = res.data.data.tr
        if(!this.magneticNo && !this.parkingNo){
          this.list_num = this.total_ps
        }
      })
    },
    //封装获取停车场
    get_all_park(){
      axios({
        method: 'get',
        url:this.park_url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:{}
      }).then(res => {
        console.log(res)
        this.park_list = res.data.data
      })
    },
    //首次进入获取表格
    get_park_detail(){
      let params = new URLSearchParams();
      params.append('pageIndex', this.pageIndex);
      params.append('ps', this.ps)
      this.get_park_list(params)
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
    //新建车位
    add_car(){
      console.log(1)
      this.rule_editor = true
      this.is_add = true
      this.add_header_text = '新建车位'
      this.ruleForm = {
        parkingNo: '',
        magneticNo: '',
        parkingId: '',
        id:''
      }
      this.get_all_park()
    },
    //表格内编辑
    list_edit(data){
      console.log(data)
      this.get_all_park()
      this.rule_editor = true
      this.is_add = false
      this.add_header_text = '编辑车位'
      this.ruleForm = {
        parkingNo: data.parking_no,
        magneticNo: data.magnetic_no,
        parkingId: data.parking_id,
        id: data.id
      }
    },
    //表格内删除
    list_del(data){
      this.$confirm('此操作将该车位删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        console.log(data)
        axios.get(this.del_park,{
          params:{
            parkingNo: data.parking_no
          }
        }).then(res => {
          console.log(res)
          if(res.data.code == 0){
            this.$notify({
              title: '温馨提示',
              message: '删除车位成功!',
              type: 'success',
              offset: 100
            })
            this.parkingNo = ''
            this.magneticNo = ''
            this.get_park_detail()
          }else{
            this.show_warning(res.data.data)
          }
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
    //重置
    resetForm(data){
      this.$refs[data].resetFields()
    },
    //确认提交
    submitForm(data){
      this.$refs[data].validate((valid) => {
        if (valid) {
          let my_url = ''
          if(this.is_add){
            my_url = this.add_park
          }else{
            my_url = this.edit_url
          }
          console.log(this.ruleForm)
          axios.get(my_url,{
            params:{
              parkingNo: this.ruleForm.parkingNo,
              magneticNo: this.ruleForm.magneticNo,
              parkingId: this.ruleForm.parkingId,
              id: this.ruleForm.id
            }
          }).then(res => {
            console.log(res)
            if(res.data.code == 0){
              if(this.is_add){
                this.$notify({
                  title: '温馨提示',
                  message: '添加车位成功!',
                  type: 'success',
                  offset: 100
                })
              }else{
                this.$notify({
                  title: '温馨提示',
                  message: '修改车位成功!',
                  type: 'success',
                  offset: 100
                })
              }

              this.close()
              this.get_park_detail()
            }else{
              this.show_warning(res.data.data)
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    close(){
      this.rule_editor = false
    },
    //搜索
    sel_uesr(){
      let params = new URLSearchParams();
      params.append('pageIndex', this.pageIndex);
      params.append('ps', this.ps)
      params.append('magneticNo', this.magneticNo)
      params.append('parkingNo', this.parkingNo)
      this.get_park_list(params)
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
  width: 600px;
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
  height: 350px;
  background: #fff;
  margin: 100px auto 0;
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
.editor_cont{
  padding: 20px 20px 0;
}
</style>

