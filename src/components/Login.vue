<template>
  <div id="row">
    <div class="up">
      <div style="width:600px;font-size:40px;top:100px;margin-left:-300px;">嵊停车综合管理平台</div>
      <div style="width:600px;font-size:20px;top:180px;margin-left:-300px">让世界自由停泊</div>
    </div>
    <div class="down">
      <div class="downtext">技术支持:深圳市华腾物联科技有限公司</div>
    </div>
    <div class="content">
      <div class="left">
        <img src="../assets/log.png" alt="">
      </div>
      <div class="right">
        <div>
          <span style="font-size:35px;color:#57B85B;margin-left:50px">用户登录</span>
          <span style="font-size:20px;color:#999999;margin-left:50px">UserLogin</span>
        </div>
        <form @submit.prevent="onSubmit">
          <div class="inp-box">
            <label for="username">账号:</label>
            <input
              type="username"
              class="form-control"
              v-model="username"
              placeholder="请输入账号名"
              >
          </div>
          <div class="inp-box">
            <label for="password">密码:</label>
            <input
              type="password"
              class="form-control"
              v-model="password"
              placeholder="请输入密码"
              >
          </div>
          <button type="submit" class="gologin">登录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
  export default{
    data(){
      return {
        username:'',
        password:'',
        url:'/its/admin/user/login'
      }
    },
    // 组件内的守卫
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        vm.$store.dispatch("setUser",null)
      })
    },
    beforeCreate() {
      window.localStorage.removeItem('token')
    },
    created() {
      this.$emit('header', false);
    },
    mounted() {
      console.log(window.localStorage.getItem('token'))
    },
    methods:{
      onSubmit(){
        if(!this.username || !this.password){
          alert('请输入账号密码')
        }
        if(this.username && this.password){
          let that = this
          var params = new URLSearchParams();
          params.append('userName', this.username);
          params.append('userPassword', this.password);
          axios({
            method: 'post',
            url: this.url,
            header:{
              'content-type':'application/x-www-form-urlencoded'
            },
            data: params
          }).then(res => {
            console.log(res)
            if(res.data.success){
              let token = res.data.data
              window.localStorage.setItem('username', this.username)
              window.localStorage.setItem('token', token)
              this.$store.dispatch("setUser",this.username)
              this.$router.push({name:"homeLink"})
              this.$emit('header', true)
              this.$notify({
                title: '成功',
                message: '登录成功，欢迎回来！',
                type: 'success',
                offset: 100
              })
            }
            if(!res.data.success){
              this.$message.error(res.data.mesg)
              this.$store.dispatch('setUser', null)
            }
          })
        }
      }
    }
  }

</script>
<style scoped>
#row{
  width: 100%;
  height: 969px;
  position: relative;
}
.up{
  width: 100%;
  height: 50%;
  background: #1976D2;
}
.down{
  width: 100%;
  height: 50%;
  background: #999999;
  position: relative;
}
.content{
  position: absolute;
  width: 800px;
  height: 400px;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -400px;
  background: #fff;
}
.left,.right{
  width: 399px;
  height: 250px;
  float: left;
  margin-top: 75px;
}
.left{
  border-right: 2px solid #999999;
}
.left>img{
  display: block;
  width: 200px;
  height: 220px;
  margin: 15px auto 0;
}
.inp-box{
  height: 40px;
  width: 300px;
  margin: 30px auto 0;
}
.inp-box>label{
  display: block;
  width: 60px;
  height: 40px;
  float: left;
  font-size: 20px;
  line-height: 40px;
  text-align: center;
}
.inp-box>input{
  float: left;
  width: 240px;
  height: 40px;
}
.gologin{
  display: block;
  border: 0;
  width: 300px;
  height: 30px;
  margin: 30px auto 0;
  border-radius: 5px;
  color: #fff;
  background: #007DC0;
  font-weight: 600;
}
.up>div{
  position: absolute;
  text-align: center;
  left: 50%;
  letter-spacing:20px;
  color:#fff;
}
.downtext{
  position: absolute;
  text-align: center;
  left: 50%;
  color: #0097A7;
  font-size: 30px;
  top: 250px;
  width: 600px;
  margin-left: -300px;
}
</style>

