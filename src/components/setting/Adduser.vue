<template>
  <div id="row">
    <!-- 账号密码设置 -->
    <div class="header">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号名" prop="oldpass">
          <el-input type="text" v-model="ruleForm.username" autocomplete="off" placeholder="请输入帐户名"></el-input>
        </el-form-item>
        <el-form-item label="账户密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="请输入6-18位字母、数字、下划线组成的密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" placeholder="请重复输入新密码" show-password></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 权限设置 -->
    <div class="content">
      <span @click="set_detail">权限设置<i v-if="detail_show" class="el-icon-remove"></i><i class="el-icon-circle-plus" v-if="!detail_show"></i></span>
      <div class="detail">
        <table>
          <thead>
            <tr style="height:40px;border-bottom:1px solid rgb(119, 119, 119);font-size:18px;background:rgb(119, 119, 119)">
              <th style="font-weight:550">模块名称</th>
              <th style="font-weight:550">权限明细
                <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">权限设置</el-checkbox> -->
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style="height:40px;border-bottom:1px solid rgb(119, 119, 119);font-size:18px" v-for="(item,index) in permissions" :key="index">
              <td>{{item.name}}</td>
              <td style="position: relative">
                <el-checkbox :label="item.name1" :key="item.name1" @change="select(item.id)">{{item.name1}}</el-checkbox>
                <el-checkbox v-if="item.name2" :label="item.name2" :key="item.name2" @change="select(item.id1)">{{item.name2}}</el-checkbox>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 有效期设置 -->
    <div class="footer">
      <span>有效期至</span>
      <el-date-picker
        v-model="time_limit"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
      <span>权限区域</span>
      <el-select v-model="selectedProv" placeholder="请选择省份" class="sel_city">
        <el-option
          v-for="item in provinces"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="selectedCity" placeholder="请选择城市" class="sel_city">
        <el-option
          v-for="item in listCity"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <!-- 确认重置按钮 -->
    <div class="mybtn">
      <div class="reset">重置</div>
      <div class="confirm">确认</div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import axios from 'axios';
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        let regNull=/(\W)/g
        if(regNull.test(this.ruleForm.pass)){
          callback(new Error('密码只能使用字母、数字、下划线'))
        }
        if(this.ruleForm.pass.length < 6 || this.ruleForm.pass.length > 18){
          callback(new Error('密码长度只能为6-18位'))
        }
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入帐户名'));
      }else {
        callback();
      }
    };
    return {
      ruleForm: {
        username:'',
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        oldpass: [
          { validator: validatePass3, trigger: 'blur' }
        ]
      },
      detail_show:false,
      ischeck:false,
      checked:[],
      permissions:[
        {name:'实况',name1:'查询权限',id:'1'},
        {name:'大屏',name1:'查询权限',id:'2'},
        {name:'分析',name1:'查询权限',id:'3'},
        {name:'监管',name1:'查询权限',id:'4'},
        {name:'报表-首页',name1:'查询权限',id:'5'},
        {name:'报表-收入报表',name1:'查询权限',id:'6'},
        {name:'报表-订单报表',name1:'查询权限',id:'7'},
        {name:'报表-充值报表',name1:'查询权限',id:'8'},
        {name:'报表-用户报表',name1:'查询权限',id:'9'},
        {name:'报表-泊位管理',name1:'查询权限',id:'10',name2:'修改权限',id1:'12'},
        {name:'报表-收费管理',name1:'查询权限',id:'11',name2:'修改权限',id1:'13'}
      ],
      selectedProv:null,
      selectedCity:null,
      time_limit:'',
      listCity:[],
      listProv:[],
      provinces:[
        {id:0,name:'全国'},
        {id:1,name:'广东省'},
        {id:2,name:'浙江省'},
        {id:3,name:'福建省'}
      ],
      cityAll:[
        {pid:0,id:0,name:'全部城市'},
        {pid:1,id:1,name:'广州市'},
        {pid:1,id:2,name:'深圳市'},
        {pid:2,id:3,name:'杭州市'},
        {pid:2,id:4,name:'宁波市'},
        {pid:3,id:5,name:'福州市'},
        {pid:3,id:6,name:'厦门市'},
      ]
    }
  },

  created() {
  },
  watch: {
    selectedProv: 'getCityList'
  },
  methods: {
    set_detail(){
      this.detail_show = !this.detail_show
      if(this.detail_show){
        $('.detail').animate({height:'553px'})
      }else{
        $('.detail').animate({height:'10px'})
      }
    },
    select(id){
      if(this.checked.includes(id)){
        this.checked = this.checked.filter(function (ele) {
          return ele != id
        })
      }else{
        this.checked.push(id)
      }
      console.log(this.checked)
    },
    getCityList: function () {
      this.listCity = this.cityAll.filter((city) => {
        console.log(this.selectedProv)
        console.log(city)
        if(this.selectedProv == 0){
          return city.pid || city.pid == 0
        }else{
          return city.pid == this.selectedProv || city.pid == 0
        }
      })
      console.log(this.listCity)
    }
  },
}
</script>
<style scoped>
#row{
  width: 100%;
  height: 100%;
}
.header{
  width: 80%;
  height: 200px;
  margin: 0 auto;
}
.el-form{
  margin: 20px auto 0;
  width: 60%;
}
.header>>>.el-form-item__label{
  text-align: center;
}
.el-form-item{
  margin-bottom: 10px;
}
.header>>>.el-form-item__error{
  top: 80%;
}
.content{
  width: 80%;
  /* height: 550px; */
  border: 1px solid rgb(119, 119, 119);
  margin: 0px auto;
}
.content>span{
  display: block;
  font-size: 18px;
  font-weight: 600;
  margin-top: 5px;
  margin-left: 2%;
  height: 20px;
  cursor: pointer;
}
.detail{
  width: 90%;
  /* height: 553px; */
  height: 10px;
  margin: 0 auto;
  overflow: hidden;
  /* border: 1px solid rgb(119, 119, 119); */
}
.detail>table{
  width: 90%;
  margin: 10px auto 0;
  text-align: center;
  line-height: 40px;
}
.mycheck{
  width: 20px;
  height: 20px;
}
.footer{
  width: 80%;
  height: 40px;
  border: 1px solid rgb(119, 119, 119);
  margin: 10px auto 0;
}
.footer>span{
  display: block;
  height: 30px;
  line-height: 30px;
  margin-top: 5px;
  margin-left: 40px;
  float: left;
}
.footer>.el-date-editor{
  width: 150px;
  float: left;
  height: 30px;
  margin-top: 5px;
}
.footer>>>.el-input__inner{
  height: 30px
}
.footer>>>.el-input__icon{
  line-height: 30px;
}
.sel_city{
  margin-top: 5px;
  width: 120px;
}
.all_city{
  font-size: 14px;
  padding: 0 20px;
  height: 34px;
  line-height: 34px;
  color: #606266;
  cursor: pointer;
  white-space:nowrap;
}
.all_city:hover{
  background-color: #F5F7FA;
}
.mybtn{
  width: 500px;
  height: 60px;
  margin: 0 auto;
}
.reset,.confirm{
  width: 120px;
  height: 40px;
  border: 1px solid rgb(119, 119, 119);
  border-radius: 5px;
  float: left;
  margin-top: 10px;
  line-height: 40px;
  text-align: center;
  font-weight: 600;
  cursor: pointer;
}
.confirm{
  margin-left: 258px;
}
.el-checkbox{
  margin-bottom: 0;
}
</style>

