<template>
  <div id="row">
    <div class="cont">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="oldpass">
          <el-input type="password" v-model="ruleForm.oldpass" autocomplete="off" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="请输入6-18位字母、数字、下划线组成的密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" placeholder="请重复输入新密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import axios from 'axios';
export default {
  data(){
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
        callback(new Error('请输入原密码'));
      }else {
        callback();
      }
    };
    return{
      ruleForm: {
        oldpass:'',
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
      password:'',        //原始密码
      newpasswordone:'',      //新密码
      newpasswordtwo:'',       //新密码确认
      url_password:'/its/operations/chang/password',
    }
  },
  mounted() {
  },
  methods: {
    //重置密码输入
    resetForm(formName){
      this.$refs[formName].resetFields()
    },
    //确认修改密码
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let username = window.localStorage.getItem('username')
          let params = new URLSearchParams()
          params.append('userName', username)
          params.append('userPassword', this.ruleForm.oldpass)
          params.append('newPassword', this.ruleForm.pass)
          axios({
            method: 'post',
            url: this.url_password,
            headers:{
              'content-type':'application/x-www-form-urlencoded'
            },
            data: params
          }).then(res => {
            console.log(res)
            if(res.data.code == 10014){
              this.$notify.error({
                title: '错误',
                message: '账号不存在',
                offset: 100
              });
            }else if(res.data.code == 10015){
              this.$notify.error({
                title: '错误',
                message: '原始密码错误',
                offset: 100
              });
            }else if(res.data.code == 0){
              this.$notify({
                title: '成功',
                message: '修改密码成功',
                type: 'success',
                offset: 100
              })
              this.reset()
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
      // let regNull=/(\W)/g
      // if(this.password == ''){
      //   alert('请输入原始密码')
      // }else if(this.newpasswordone == ''){
      //   alert('请输入新密码')
      // }else if(this.newpasswordtwo == ''){
      //   alert('请再次输入新密码')
      // }else if(this.newpasswordone !== this.newpasswordtwo){
      //   alert('两次输入的密码不同')
      // }else if(regNull.test(this.newpasswordone)){
      //   alert('密码只能使用字母、数字、下划线')
      // }else{
      //   let username = window.localStorage.getItem('username')
      //   let params = new URLSearchParams()
      //   params.append('userName', username)
      //   params.append('userPassword', this.password)
      //   params.append('newPassword', this.newpasswordone)
      //   axios({
      //     method: 'post',
      //     url: this.url_password,
      //     headers:{
      //       'content-type':'application/x-www-form-urlencoded'
      //     },
      //     data: params
      //   }).then(res => {
      //     console.log(res)
      //     if(res.data.code == 10014){
      //       this.$notify.error({
      //         title: '错误',
      //         message: '账号不存在',
      //         offset: 100
      //       });
      //     }else if(res.data.code == 10015){
      //       // alert('原始密码错误')
      //       this.$notify.error({
      //         title: '错误',
      //         message: '原始密码错误',
      //         offset: 100
      //       });
      //     }else if(res.data.code == 0){
      //       // alert('修改密码成功')
      //       this.$notify({
      //         title: '成功',
      //         message: '修改密码成功',
      //         type: 'success',
      //         offset: 100
      //       })
      //       this.reset()
      //     }
      //   })
      // }
    }
  },
}
</script>
<style scoped>
#row{
  width: 100%;
  height: 100%;
  position: relative;
}
.cont{
  width: 600px;
  height: 240px;
  border: 1px solid rgb(151, 151, 151);
  position: absolute;
  top: 150px;
  left: 50%;
  margin-left: -300px;
}
.el-form{
  width: 500px;
  margin-top: 30px;
}
.cont>>>.el-form-item__label{
  text-align: center;
}
::-webkit-input-placeholder { /* WebKit, Blink, Edge */
  color:rgb(151, 151, 151);
  font-size: 16px;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color:rgb(151, 151, 151);
  font-size: 16px;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
  color:rgb(151, 151, 151);
  font-size: 16px;
}
:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color:rgb(151, 151, 151);
  font-size: 16px;
}
.el-button{
  width: 120px;
  margin: 40px 35px 0;
}
.btn{
  width: 400px;
  height: 40px;
  position: absolute;
  top: 420px;
  left: 50%;
  margin-left: -200px;
  padding: 0
}
.btn>div{
  width: 120px;
  height: 40px;
  float: left;
  border: 1px solid  rgb(151, 151, 151);
  border-radius: 5px;
  line-height: 40px;
  text-align: center;
  margin-left: 55px;
}
</style>
