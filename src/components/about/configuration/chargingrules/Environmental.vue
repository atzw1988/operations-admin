<template>
  <div id="row">
    <div class="header">
      <div class="addrule" @click="addrule">+新建</div>
      <div class="delrule" @click="del_sel_env">-批量删除</div>
      <input type="file" @change="importFile(this)" id="imFile" style="display: none"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
      <div class="import" @click="uploadFile">批量导入</div>
      <div class="export" @click="export_env">导出</div>
      <div class="search">
        <span>规则名称：</span>
        <input type="search" name="" id="" placeholder="请输入环保规则名称" v-model="env_name">
        <div @click="env_name_sec">搜索</div>
      </div>
    </div>
    <div class="content">
      <table>
        <thead>
          <tr>
            <th style="position: relative;width:50px;height:50px"><input type="checkbox" @click="env_checked_all" v-model="checked_all"></th>
            <th>序号</th>
            <th>环保规则名称</th>
            <th>免费时长</th>
            <th>适用车辆</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rule,index) in rules" :key="index">
            <td style="position: relative;width:50px;height:40px"><input type="checkbox" @click="checked_env(rule.rule_id)" v-model="env_checked" :value="rule.rule_id"></td>
            <td>{{index+1}}</td>
            <td>{{rule.rule_name}}</td>
            <td>{{rule.rule_freetime}}</td>
            <td>{{rule.ruleApplyName}}</td>
            <td>
              <span style="color:blue;cursor: pointer" @click="env_editor(rule)">编辑</span>
              <el-divider direction="vertical"></el-divider>
              <span style="color:blue;cursor: pointer" @click="env_del(rule)">删除</span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>总计：</td>
            <td>共{{total_ps}}条</td>
            <td>{{pageIndex}}/{{allps}}页</td>
            <td>跳转至<input style="width:50px;height:30px;padding-left:20px" type="text" name="" id="" v-model="pageIndex">页</td>
            <td>
              <div @click="goback">上一页</div>
              <div @click="forward">下一页</div>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="addcontent" v-if="addshow">
      <div class="myaddrl">
        <div class="add-header">{{add_header_text}}
          <span @click.stop="close">X</span>
        </div>
        <div class="rlname">
          <span>标准名称:</span>
          <el-input style="width:250px" type="text" v-model="env_sel_editor.rule_name" clearable placeholder="请输入环保规则名称"></el-input>
        </div>
        <div class="freetime">
          <span style="line-height: 50px;">免费时长:</span>
          <el-input-number v-model="env_sel_editor.rule_freetime" :step="1" style="width:250px"></el-input-number>
          <span style="display:block">（本处免费时长与收费标准中免费时长共存时，适用环保规则的车辆将在两者间取较大值执行）</span>
        </div>
        <div class="carkind">
          <span style="float:left">适用车辆:</span>
          <div style="float:left;margin-left:5px;">
            <!-- <input style="width:20px;height:20px" type="checkbox" name="carkind" id="2"><span>蓝牌</span>
            <br>
            <input style="width:20px;height:20px;margin-top:10px" type="checkbox" name="carkind" id="2"><span>黄牌</span>
            <br>
            <input style="width:20px;height:20px;margin-top:10px" type="checkbox" name="carkind" id="2"><span>新能源车牌</span> -->
            <el-radio v-model="radio" label="1">蓝牌</el-radio>
            <el-radio v-model="radio" label="2">黄牌</el-radio>
            <el-radio v-model="radio" label="3">新能源车牌</el-radio>
          </div>
        </div>
        <div class="mybtn">
          <div style="float:left" @click.stop="env_add_reset">重置</div>
          <div style="float:right" @click.stop="env_add_confirm">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      addshow:false,      //新建环保规则显示
      nowday:'',    //时间
      radio:'',
      nowtime:'',
      env_name:'',        //规则名称搜索绑定
      checked_all: false,   //规则全选与否
      env_checked:[],      //存放已选择的环保规则
      add_header_text:'',   //新建或者编辑
      rules:[],
      parkname:'',
      env_sel_editor:{},    //存放要编辑的环保规则
      env_reset_text:{},    //存放要重置的环保规则
      pageIndex:1,   //当前页
      allps:5,     //总页数
      ps:15,       //每页条数
      total_ps:15,     //总条数
      params:{},
      text_one:'',
      text_two:'',
      url:'http://192.168.0.192:13259/its/parking/rule',
      url_kind:''
    }
  },
  mounted() {
    this.imFile = document.getElementById('imFile')
    this.get_rule_list()
  },
  methods: {
    //封装获取环保规则列表
    get_env_list(){
      let params = JSON.stringify(this.params)
      axios({
        method:'post',
        url: this.url + '/findEPInfo',
        headers: {
          'Authorization': 'Web 123213213',
          'content-type': 'application/json;charset=UTF-8'
        },
        data:params
      }).then(res => {
        console.log(res)
        if(res.data.data.length > 0){
          this.rules = res.data.data
          this.total_ps = res.data.data.length
        }else{
          let text = '暂无符合条件的数据!'
          this.show_warning(text)
        }
      })
    },
    //获取首页环保规则裂变
    get_rule_list(){
      this.params = {}
      this.get_env_list()
    },
    //显示新建环保规则
    addrule(){
      this.add_header_text = '新建环保规则'
      this.addshow = true
      this.text_one = '添加新的环保规则成功！'
      this.text_two = '添加新的环保规则失败！'
      this.url_kind = '/insertInfo'
    },
    //关闭新建环保规则
    close(){
      this.addshow = false;
      this.env_sel_editor = {}
      this.params = {}
    },
    //删除所选择环保规则
    del_sel_env(){
      let data = this.env_checked.join(',')
      let params = {
        'rule_id':data
      }
      let textone = '此操作将所选择的环保规则删除, 是否继续?'
      let texttwo = '环保规则删除成功！'
      let textthree = '环保规则删除失败！'
      let url = this.url + '/delInfo'
      this.show_delete_warning(textone,texttwo,textthree,url,params)
    },
    //点击导入按钮
    uploadFile: function () { // 点击导入按钮
      this.imFile.click()
    },
    //导入规则excel
    importFile: function () { // 导入excel
      this.fullscreenLoading = true
      let obj = this.imFile
      if (!obj.files) {
        this.fullscreenLoading = false
        return
      }
      var f = obj.files[0]
      var reader = new FileReader()
      let that = this
      reader.onload = function (e) {
        var data = e.target.result
        if (that.rABS) {
          that.wb = XLSX.read(btoa(this.fixdata(data)), { // 手动转化
            type: 'base64'
          })
        } else {
          that.wb = XLSX.read(data, {
            type: 'binary'
          })
        }
        let json = XLSX.utils.sheet_to_json(that.wb.Sheets[that.wb.SheetNames[0]])
        console.log(typeof json)
        that.dealFile(that.analyzeData(json)) // analyzeData: 解析导入数据
      }
      if (this.rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },
    // 此处可以解析导入数据
    analyzeData: function (data) {
      return data
    },
    // 处理导入的数据
    dealFile: function (data) {
      let val = data
      this.imFile.value = ''
      this.fullscreenLoading = false
      if (data.length <= 0) {
        this.errorDialog = true
        this.errorMsg = '请导入正确信息'
      } else {
        let data = val.map((item) => {
          return {
            'id':item.规则编号,
            'name':item.适用停车场,
            'norm':item.收费标准,
            'freetime':item.免费时长,
            'paytimestr':item.收费时段开始时间,
            'paytimeend':item.收费时段结束时间,
            'caps':item.封顶金额
          }
        })
        console.log(data)
        console.log(JSON.stringify(data))
        this.excelData = data
      }
    },
    // 字符串转字符流
    s2ab: function (s) {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF
      }
      return buf
    },
    // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]
    getCharCol: function (n) {
      let s = ''
      let m = 0
      while (n > 0) {
        m = n % 26 + 1
        s = String.fromCharCode(m + 64) + s
        n = (n - m) / 26
      }
      return s
    },
    // 文件流转BinaryString
    fixdata: function (data) {
      var o = ''
      var l = 0
      var w = 10240
      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    },
    //导出规则
    export_env(){
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../../../excel/Export2Excel.js')
        const tHeader = ['规则编号','规则名称', '免费时长', '适用车辆']; //将对应的属性名转换成中文
        //const tHeader = [];　
        const filterVal = ['id','name', 'freetime','carkind'];//table表格中对应的属性名　　　　　 　　　
        const list = this.rules;　　//想要导出的数据　　　　　　
        const data = this.formatJson(filterVal, list);　　
        this.timeday()
        let title = '环保规则列表' + this.nowday　　　　　　
        export_json_to_excel(tHeader, data, title, this.nowtime);
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //获取导出表格时的时间
    timeday(){
      let data = new Date()
      let year = data.getFullYear();
      let month =data.getMonth() + 1 < 10? "0" + (data.getMonth() + 1): data.getMonth() + 1;
      let date =data.getDate() < 10? "0" + data.getDate(): data.getDate();
      let hh =data.getHours() < 10? "0" + data.getHours(): data.getHours();
      let mm =data.getMinutes() < 10? "0" + data.getMinutes(): data.getMinutes();
      let ss =data.getSeconds() < 10? "0" + data.getSeconds(): data.getSeconds();
      this.nowday = year + '-' + month + '-' + date;
      this.nowtime = hh + '时' + mm + '分' + ss + '秒导出';
    },
    //环保规则名称搜索
    env_name_sec(){
      this.params.rule_name = this.env_name
      this.get_env_list()
    },
    //环保规则全选或反选
    env_checked_all(){
      if(this.checked_all) {
          // 实现反选，按钮选中时 实现了反选，列表为空
          this.env_checked = []
      } else {
          // 实现全选
          this.env_checked = []
          this.rules.forEach((dateil) => {
              this.env_checked.push(dateil.rule_id)
          })
      }
      if(this.env_checked.length === this.rules.length) {
          this.checked_all = true
      }
    },
    //环保规则列表选择
    checked_env(id){
      if(this.env_checked.includes(id)){
				this.env_checked=this.env_checked.filter(function (ele){return ele != id;});
        if(this.env_checked.length === this.rules.length){
          this.checked_all = true
        }else{
          this.checked_all = false
        }
			}else{
        this.env_checked.push(id);
        if(this.env_checked.length === this.rules.length){
          this.checked_all = true
        }else{
          this.checked_all = false
        }
      }
    },
    //环保规则编辑
    env_editor(rule){
      this.add_header_text = '编辑环保规则'
      this.env_reset_text = JSON.parse(JSON.stringify(rule))
      this.env_sel_editor = rule
      this.addshow = true
      this.radio = ''
      this.url_kind = '/updateEP'
      console.log(rule)
      this.params.rule_id = rule.rule_id
      this.text_one = '环保规则修改成功！'
      this.text_two = '环保规则修改失败！'
    },
    //环保规则列表删除
    env_del(rule){
      let params = {
        'rule_id':rule.rule_id
      }
      let textone = '此操作将所选择的环保规则删除, 是否继续?'
      let texttwo = '环保规则删除成功！'
      let textthree = '环保规则删除失败！'
      let url = this.url + '/delInfo'
      this.show_delete_warning(textone,texttwo,textthree,url,params)
    },
    //上一页
    goback(){

    },
    //下一页
    forward(){

    },
    //新建环保规则重置
    env_add_reset(){
      let data = JSON.parse(JSON.stringify(this.env_reset_text))
      this.env_sel_editor = data
    },
    //新建环保规则确认
    env_add_confirm(){
      console.log(this.env_sel_editor)
      console.log(this.radio)
      // this.close()
      if(this.env_sel_editor.rule_name && this.env_sel_editor.rule_freetime && this.radio){
        this.params.rule_name = this.env_sel_editor.rule_name
        this.params.rule_freetime = this.env_sel_editor.rule_freetime
        this.params.rule_apply = this.env_sel_editor.rule_apply
        this.params = JSON.stringify(this.params)
        axios({
          method:'post',
          url: this.url + this.url_kind,
          headers: {
            'Authorization': 'Web 123213213',
            'content-type': 'application/json;charset=UTF-8'
          },
          data:this.params
        }).then(res => {
          console.log(res)
          if(res.data.success){
            this.get_all_list()
            this.$notify({
              title: '温馨提示',
              message: this.text_one,
              type: 'success',
              offset: 100
            })
            this.close()
          }else{
            this.$notify.error({
              title: '温馨提示',
              message: this.text_two,
              offset: 100
            })
          }
        })
      }else{
        this.$notify.error({
          title: '温馨提示',
          message: '必选字段没有填写！',
          offset: 100
        })
      }
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
.header{
  width: 100%;
  height: 50px;
  background: #fff;
}
.addrule,.delrule,.import,.export{
  width: 100px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  float: left;
  margin-top: 5px;
  margin-right: 30px;
  border: 1px solid rgb(126, 126, 126);
  background: rgb(219, 219, 219);
  cursor: pointer;
}
.search{
  width: 350px;
  height: 40px;
  float: left;
  /* border: 1px solid rgb(126, 126, 126); */
  margin-top: 5px;
  margin-left: 30px;
}
.search>span,.search>input,.search>div{
  float: left;
  height: 30px;
  margin-top: 5px;
  display: block;
  line-height: 30px;
}
.search>input,.search>div{
  border: 1px solid rgb(126, 126, 126);
}
.search>input{
  padding-left: 10px;
  width: 150px;
}
.search>div{
  margin-left: 20px;
  width: 60px;
  text-align: center;
  background: rgb(219, 219, 219);
  cursor: pointer;
}
.content{
  width: 100%;
  z-index: 1000;
}
.content>table{
  width: 100%;
  text-align: center;
}
.content>table>thead>tr{
  width: 100%;
  height: 50px;
  background: rgb(126, 126, 126);
  line-height: 50px;
  font-size: 18px;
}
.content>table>thead>tr>th{
    font-weight: 600;
}
.content>table>thead>tr>th>input{
  width: 20px;
  height: 20px;
  position: absolute;
  top: 15px;
  left: 15px;
}
.content>table>tbody>tr{
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  border-bottom: 1px solid #000;
}
.content>table>tfoot>tr{
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}
.content>table>tfoot>tr>td>div{
  width: 70px;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  border: 1px solid rgb(126, 126, 126);
  display: inline-block;
  margin-top: 5px;
  cursor: pointer;
  background: #025b9b;
}
.content>table>tbody>tr>td>input{
  width: 20px;
  height: 20px;
  position: absolute;
  top: 10px;
  left: 15px;
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
  width: 600px;
  height: 500px;
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
.rlname,.freetime,.carkind,.mybtn{
  width: 450px;
  /* border: 1px solid saddlebrown; */
  margin: 30px auto 0;
  font-size: 18px;
}
.rlname,.mybtn{
  height: 50px;
  line-height: 50px;
}
.freetime{
  height: 100px;
}
.carkind{
  height: 100px;
}
.mybtn>div{
  height: 40px;
  width: 100px;
  border: 1px solid rgb(126, 126, 126);
  border-radius: 5px;
  text-align: center;
  line-height: 40px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}
</style>

