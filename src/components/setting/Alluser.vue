<template>
  <div id="row">
    <div class="header">
      <div class="adduser">
        <router-link tag="a" :to="{name:'adduserLink'}">+添加管理员</router-link>
      </div>
      <div class="deluser">删除选择</div>
    </div>
    <div class="userlist">
      <table>
        <thead>
          <tr class="theadheader">
            <th style="width:3%"><input type="checkbox" id="box" @click="checkAll" v-model="checkall" /></th>
            <th style="width:10%">管理员账号</th>
            <th style="width:20%">有效期</th>
            <th style="width:15%">区域</th>
            <th style="width:40%">权限</th>
            <th style="width:10%">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user,index) in users" :key="index" class="tbodycont">
            <td><input type="checkbox" class="checkbox" v-model="checked"    @click="select(user.id,user.name,user.aere)" :value="user.id" /></td>
            <td>{{user.name}}</td>
            <td>{{user.timestart}}至{{user.timeend}}</td>
            <td>{{user.aere}}</td>
            <td style="color:blue;cursor: pointer">详情</td>
            <td><span style="color:blue;cursor: pointer">编辑</span>|<span style="color:blue;cursor: pointer">删除</span></td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="tfootcont">
            <td>总计</td>
            <td>{{userno}}人</td>
            <td></td>
            <td>{{pageindex}}/{{allpage}}页</td>
            <td>跳转至<input type="text" name="page" v-model="topage">页<button>上一页</button><button>下一页</button></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      checkall:false,
      checked:[],
      users:[
        {id:'0',name:'admin',timestart:'2019-04-27',timeend:'2020-10-10',aere:'深圳市宝安区'},
        {id:'1',name:'admin',timestart:'2019-04-27',timeend:'2020-10-10',aere:'深圳市宝安区'},
        {id:'2',name:'admin',timestart:'2019-04-27',timeend:'2020-10-10',aere:'深圳市宝安区'},
        {id:'3',name:'admin',timestart:'2019-04-27',timeend:'2020-10-10',aere:'深圳市宝安区'},
      ],
      arr:[],
      userno:100,
      pageindex:1,
      allpage:10,
      topage:''
    }
  },
  methods: {
    checkAll: function() {
        var that = this
        //true的时候是全选，false是不选
        if(this.checkall) {
            // 实现反选，按钮选中时 实现了反选，列表为空
            this.checked = []
        } else {
            // 实现全选
            this.checked = []
            this.users.forEach(function(dateil) {
                that.checked.push(dateil.id)
            })
        }
        if(this.checked.length === this.users.length) {
            this.checkall = true
        }
    },
    select(id,name,aere){
      console.log(id,name,aere)
      if(this.checked.includes(id)){
				//includes()方法判断是否包含某一元素,返回true或false表示是否包含元素，对NaN一样有效
				//filter()方法用于把Array的某些元素过滤掉，filter()把传入的函数依次作用于每个元素，然后根据返回值是true还是false决定保留还是丢弃该元素：生成新的数组
				this.checked=this.checked.filter(function (ele){return ele != id;});
				//this.arr=this.arr.filter((ele)=>ele!=i);
        //filter()为假时删除
        if(this.checked.length === this.users.length){
          this.checkall = true
        }else{
          this.checkall = false
        }
			}else{
        this.checked.push(id);
        if(this.checked.length === this.users.length){
          this.checkall = true
        }else{
          this.checkall = false
        }
      }
      console.log(this.checked)
    }
  },
}
</script>
<style scoped>
#row{
  width: 100%;
  height: 100%;
  background: rgb(219, 219, 219);
  color: #000;
}
.header{
  height: 50px;
  width: 100%;
  margin-bottom: 20px;
  /* border: 1px solid darkgoldenrod; */
}
.adduser,.deluser{
  height: 40px;
  width: 160px;
  border: 1px solid rgb(119, 119, 119);
  float: left;
  font-size: 20px;
  font-weight: 600;
  line-height: 40px;
  text-align: center;
  border-radius: 5px;
  margin: 5px 0 0 40px;
  cursor: pointer;
}
.adduser>a{
  font-size: 20px;
  font-weight: 600;
  line-height: 40px;
  color: #000;
  text-decoration: none;
}
.userlist{
  width: 100%;
}
.userlist>table{
  width: 100%;
}
.theadheader,.tfootcont{
  height: 40px;
  width: 100%;
  /* border: 1px solid gold; */
  font-size: 18px;
  line-height: 40px;
  text-align: center;
}
.theadheader>th,.tfootcont>td{
  font-weight: 600;
  /* border: 1px solid saddlebrown; */
}
.tbodycont{
  height: 40px;
  font-size: 16px;
  line-height: 40px;
  text-align: center;
  border-top: 1px solid rgb(119, 119, 119);
}
.tbodycont:hover{
  background: rgb(119, 119, 119);
}
.tbodycont>td{
  font-weight: 500;
}
.tfootcont>td>input{
  width: 40px;
  height: 30px;
  padding-left: 15px;
}
.tfootcont>td>button{
  width: 60px;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  border: 0;
  background: #0b3247;
  color: #fff;
  margin: 5px 0 0 10px;
}
</style>
