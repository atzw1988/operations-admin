<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-28 11:03:07
 * @LastEditTime: 2019-09-07 17:18:02
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="row">
    <el-card v-if="!is_add_show && !is_detail_show">
      <div class="select">
        <el-button style="float:right;margin-right:20px;margin-top:10px;" type="success" @click="addUser">新建</el-button>
        <div class="data-interval">
          <div class="username">
            <el-input style="width:150px;float:left"
              placeholder="输入账号名称"
              v-model="quaryParams.userName"
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
            prop="user_name"
            label="账号名称">
          </el-table-column>
          <el-table-column
            label="姓名">
            <template slot-scope="scope">
              <span v-if="scope.row.user_nickname">{{scope.row.user_nickname}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="电话">
            <template slot-scope="scope">
              <span v-if="scope.row.phone">{{scope.row.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否启用">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_enable"
                @change="accChange(scope.row)"
                active-value="0"
                inactive-value="1"
                active-text="启用"
                inactive-text="停用">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间">
          </el-table-column>
          <el-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" @click="list_detail_show(scope.row)" type="text" size="small">查看</el-button>
              <el-button style="color:red" icon="el-icon-delete" @click="list_del(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card v-if="is_add_show" class="addUser">
      <p>{{add_header_text}}</p>
      <i class="el-icon-error close" @click="close"></i>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm" style="margin-right:200px">
        <el-form-item label="账号名称" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="账号密码" prop="userPassword">
          <el-input v-model="ruleForm.userPassword"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userNickName">
          <el-input v-model="ruleForm.userNickName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="账号权限">
          <!-- <el-checkbox-group v-model="ruleForm.accountAccess">
            <el-checkbox v-for="(item, index) in rule_list" :key="index" :label="item" :value="item" name="type"></el-checkbox>
          </el-checkbox-group> -->
          <el-tree
            :data="data"
            show-checkbox
            :checkable="true"
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree>
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnable">
          <el-radio-group v-model="ruleForm.isEnable">
            <el-radio :value="0" label="0">是</el-radio>
            <el-radio :value="1" label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-if="is_detail_show">
      <p>账户详情</p>
      <i class="el-icon-error close" @click="close"></i>
      <el-button @click="EditAcc" class="edit" type="primary">编辑</el-button>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="18">
          <el-col :span="4">账号名称：</el-col>
          <el-col :span="20">{{sel.user_name}}</el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="18">
          <el-col :span="4">账号密码：</el-col>
          <el-col :span="20">{{sel.user_password}}</el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="18">
          <el-col :span="4">姓名：</el-col>
          <el-col :span="20">{{sel.user_nickname}}</el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="18">
          <el-col :span="4">电话：</el-col>
          <el-col :span="20">{{sel.phone}}</el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="18">
          <el-col :span="4">是否启用：</el-col>
          <el-col v-if="sel.is_enable == 0" :span="20">是</el-col>
          <el-col v-if="sel.is_enable == 1" :span="20">否</el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="18">
          <el-col :span="4">账号权限：</el-col>
          <el-col :span="20">
            <el-col :span="24">
              <el-tag
                style="margin: 0 10px;color:#fff"
                v-for="item in sel.page_views.split(',')"
                :key="item"
                color="#409EFF"
                v-if="item != '全部'"
                effect="dark">
                {{ item }}
              </el-tag>
            </el-col>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import $ from 'jquery';
import axios from 'axios';
export default {
  data() {
    return {
      add_header_text:'',
      list_detail: [],
      quaryParams:{},
      sel_user: '18318039639',
      sel_user_car_list:[],
      user_car_show:false,
      rule_editor:false,
      is_add:true,
      is_add_show: false,
      is_detail_show: false,
      is_edit: false,
      ruleForm:{

      },
      data: [
        {
          id: '全部',
          label: '全部权限',
          children: [
            {
              id: '大屏',
              label: '大屏'
            },
            {
              id: '分析',
              label: '分析'
            },
            {
              id: '监管',
              label: '监管'
            },
            {
              id: '报表',
              label: '报表',
              children: [
                {
                  id: '运营报表',
                  label: '运营报表',
                  children: [
                    {
                      id: '财务报表',
                      label: '财务报表'
                    },
                    {
                      id: '收入报表',
                      label: '收入报表'
                    }
                  ]
                },
                {
                  id: '订单管理',
                  label: '订单管理',
                  children: [
                    {
                      id: '停车订单',
                      label: '停车订单',
                      children: [
                        {
                          id: 'PDA订单',
                          label: 'PDA订单'
                        },
                        {
                          id: 'PDA个人业绩',
                          label: 'PDA个人业绩'
                        }
                      ]
                    },
                    {
                      id: '充值订单',
                      label: '充值订单'
                    }
                  ]
                },
                {
                  id: '用户管理',
                  label: '用户管理',
                  children: [
                    {
                      id: '用户信息',
                      label: '用户信息'
                    },
                    {
                      id: '欠费查询',
                      label: '欠费查询'
                    }
                  ]
                },
                {
                  id: '配置管理',
                  label: '配置管理',
                  children: [
                    {
                      id: '车位管理',
                      label: '车位管理'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules:{
        userName: [
          { required: true, message: '请输入账号名称', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入账号密码', trigger: 'blur' }
        ],
        accountAccess: [
          { type: 'array', required: true, message: '请至少选择一个账号权限', trigger: 'change' }
        ],
        isEnable: [
          { required: true, message: '请选择账号是否启用', trigger: 'change' }
        ]
      },
      rule_list:[],
      url:'/its/admin/list/webUser',
      rule_url:'/its/admin/list/rolePage',
      add_url:'/its/admin/add/user',
      del_url:'/its/admin/delete/webUser',
      edit_url:'/its/admin/update/webUser',
      change_url: '/its/admin/are/disabled'
    }
  },
  mounted() {
    this.get_user_list()
    this.get_all_rule()
    console.log(this.role_type())
  },
  methods: {
    //封装获取列表
    get_user_list(){
      axios({
        method: 'get',
        url: this.url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        params: this.quaryParams
      }).then(res => {
        console.log(res)
        this.list_detail = res.data.data
        this.list_detail.forEach(item => {
          item.is_enable += ''
        })
      })
      // axios.get(this.url,{
      //   params: this.quaryParams
      // }).then(res => {
      //   console.log(res)
      //   this.list_detail = res.data.data
      //   this.list_detail.forEach(item => {
      //     item.is_enable += ''
      //   })
      // })
    },
    changeAcc(params){
      axios({
        method: 'post',
        url: this.change_url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        console.log(res)
        if(res.data.code == 0){
          this.$notify({
            message: res.data.data,
            type: 'success',
            offset: 100
          })
          this.get_user_list()
        }else{
          this.show_warning(res.data.data)
        }
      })
    },
    accChange (val) {
      console.log(val.is_enable)
      let params = new URLSearchParams()
      params.append('id', val.id)
      if(val.is_enable == 1){
        params.append('status', 1)
        this.changeAcc(params)
      } else {
        params.append('status', 0)
        this.changeAcc(params)
      }
    },
    //封装获取停车场
    get_all_rule(){
      axios({
        method: 'get',
        url:this.rule_url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:{}
      }).then(res => {
        console.log(res)
        this.rule_list = res.data.data
      })
    },
    //新建账号
    addUser(){
      console.log(1)
      this.rule_editor = true
      this.is_add_show = true
      this.add_header_text = '新建账号'
      this.ruleForm = {
        accountAccess: []
      }
      this.get_all_rule()
    },
    //表格内查看
    list_detail_show(data){
      console.log(data)
      this.is_detail_show = true
      this.sel = data
    },
    //表格内删除
    list_del(data){
      this.$confirm('此操作将该账号删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        console.log(data)
        axios.delete(this.del_url,{
          params:{
            id: data.id,
            roleType: this.role_type()
          }
        }).then(res => {
          console.log(res)
          if(res.data.code == 0){
            this.$notify({
              message: '删除账号成功!',
              type: 'success',
              offset: 100
            })
            this.get_user_list()
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
        console.log(this.ruleForm)
        console.log(this.$refs.tree.getCheckedKeys())
        if (valid) {
          let params = new URLSearchParams()
          params.append('userName', this.ruleForm.userName)
          params.append('userPassword', this.ruleForm.userPassword)
          if (this.ruleForm.userNickName) {
            params.append('userNickName', this.ruleForm.userNickName)
          }
          if (this.ruleForm.mobile) {
            params.append('mobile', this.ruleForm.mobile)
          }
          params.append('accountAccess', this.$refs.tree.getCheckedKeys().join(','))
          params.append('isEnable', this.ruleForm.isEnable)
          params.append('roleType', this.role_type())
          if (this.is_edit) {
            params.append('id', this.sel.id)
            axios({
              method: 'post',
              url: this.edit_url,
              data: params
            }).then(res => {
              console.log(res)
              if(res.data.code == 0){
                this.$notify({
                  message: res.data.data,
                  type: 'success',
                  offset: 100
                })
                this.is_add_show = false
                this.get_user_list()
              } else {
                this.show_warning(res.data.data)
              }
            })
          } else {
            axios({
              method: 'put',
              url: this.add_url,
              headers: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: params
            }).then(res => {
              console.log(res)
              if(res.data.code == 0){
                this.$notify({
                  message: res.data.data,
                  type: 'success',
                  offset: 100
                })
                this.is_add_show = false
                this.get_user_list()
              } else {
                this.show_warning(res.data.data)
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    close(){
      this.is_add_show = false
      this.is_detail_show = false
    },
    //搜索
    sel_uesr(){
      // let params = new URLSearchParams()
      // params.append('userName', this.quaryParams.user_name)
      // console.log(this.quaryParams)
      this.get_user_list()
    },
    EditAcc(){
      this.is_add_show = true
      this.is_detail_show = false
      this.is_edit = true
      this.add_header_text = '编辑账号'
      this.ruleForm = {
        userName: this.sel.user_name,
        userPassword: this.sel.user_password,
        userNickName: this.sel.user_nickname,
        mobile: this.sel.phone,
        accountAccess: this.sel.page_views.split(','),
        isEnable: this.sel.is_enable,
      }
      // this.ruleForm.accountAccess = this.ruleForm.accountAccess.spilt(',')
      console.log(this.ruleForm)
    }
  },
}
</script>
<style scoped>
#row{
  width: 100%;
  /* height: 100%; */
  color: #000;
  position: relative;
  background-color: #f5f5f5 !important;
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
  /* width: 600px; */
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
  width: 150px;
  height: 40px;
  float: left;
  margin-left: 10px;
}
.selbtn{
  float: left;
  margin-left: 10px;
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
.addUser{
  position: relative;
}
.close{
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 30px;
}
.row-bg{
  margin: 20px 0;
}
.edit{
  position: absolute;
  top: 80px;
  right: 20px;
}
</style>

