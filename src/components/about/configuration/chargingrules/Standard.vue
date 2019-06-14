<template>
  <div id="row">
    <!-- 收费标准头部功能 -->
    <div class="header" v-if="standshow">
      <div class="addrule" @click="addrule">+新建</div>
      <div class="delrule" @click="del_stand">-批量删除</div>
      <input type="file" @change="importFile(this)" id="imFile" style="display: none"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
      <div class="import" @click="uploadFile">批量导入</div>
      <div class="export" @click="export_stand">导出</div>
      <div class="search">
        <span>标准名称：</span>
        <input type="search" name="" id="" placeholder="请输入标准名称" v-model="shand_name">
        <div @click="shand_name_sec">搜索</div>
      </div>
    </div>
    <!-- 收费标准列表 -->
    <div class="content" v-if="standshow">
      <table>
        <thead>
          <tr>
            <th style="position: relative;width:50px;height:50px"><input type="checkbox" @click="stand_checked_all" v-model="checked_all"></th>
            <th>序号</th>
            <th>标准名称</th>
            <th>环保规则</th>
            <th>免费时长</th>
            <th>收费时段</th>
            <th>封顶价格</th>
            <th>规则明细</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rule,index) in rules" :key="index">
            <td style="position: relative;width:50px;height:40px"><input type="checkbox" @click="checked_stand(rule.cs_id)" v-model="stand_checked" :value="rule.cs_id"></td>
            <td>{{index+1}}</td>
            <td>{{rule.cs_name}}</td>
            <td>{{rule.ep_Name}}</td>
            <td>{{rule.cs_freetime}}</td>
            <td>{{rule.cs_ct_start}}-{{rule.cs_ct_end}}</td>
            <td>{{rule.cs_maxprice}}</td>
            <td style="color:blue;cursor: pointer" @click="stand_show(rule)">配置查看</td>
            <td>
              <span style="color:blue;cursor: pointer" @click="stand_editor(rule)">编辑</span>
              <el-divider direction="vertical"></el-divider>
              <span style="color:blue;cursor: pointer" @click="stand_del_sel(rule)">删除</span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>总计：</td>
            <td>共{{total_ps}}条</td>
            <td></td>
            <td></td>
            <td></td>
            <td>{{pageIndex}}/{{allps}}页</td>
            <td>跳转至<input style="width:50px;height:30px;padding-left:20px" type="text" name="" id="" v-model="pageIndex">页</td>
            <td>
              <div @click="go_back">上一页</div>
              <div @click="forward">下一页</div>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <!-- 新建收费标准 -->
    <div class="addcontent" v-if="addshow">
      <div class="myaddrl">
        <div class="add-header">{{add_header_text}}
          <span @click="close">X</span>
        </div>
        <div style="width:350px;margin:20px auto 0;font-size:18px;height:40px;line-height:40px">
          <span>标准名称：</span>
          <el-input style="height:30px;width:250px;background:#eee;border-radius:5px" type="text" v-model="rule_sel_editor.cs_name" clearable></el-input>
        </div>
        <div style="width:350px;margin:20px auto 0;font-size:18px;height:40px;line-height:40px">
          <span>环保规则：</span>
          <el-select v-model="rule_editor_new" placeholder="请选择环保规则" style="width:250px">
            <el-option
              v-for="item in add_rule_list"
              :key="item.rule_id"
              :label="item.rule_name"
              :value="item.rule_id">
            </el-option>
          </el-select>
        </div>
        <div style="width:350px;margin:20px auto 0;font-size:18px;height:40px;line-height:40px">
          <span>免费时长：</span>
          <el-input-number v-model="rule_sel_editor.cs_freetime" :step="1" style="width:250px"></el-input-number>
        </div>
        <div style="width:350px;margin:20px auto 0;font-size:18px;height:40px;line-height:40px">
          <span>免费时长适用情况：</span>
          <el-radio v-model="radio_free" label="0">每一次</el-radio>
          <el-radio v-model="radio_free" label="1">仅第一次</el-radio>
        </div>
        <div style="width:350px;margin:20px auto 0;font-size:18px;height:40px;line-height:40px">
          <span>封顶价格：</span>
          <el-input-number v-model="rule_sel_editor.cs_maxprice" :precision="2" :step="1" style="width:250px"></el-input-number>
        </div>
        <div style="width:350px;margin:20px auto 0;font-size:18px;line-height:40px">
          <span>收费时段：</span>
            <el-radio v-model="radio_time" label="1">全天</el-radio>
            <el-radio v-model="radio_time" label="2">自定义</el-radio>
            <div>
              <el-time-picker
                v-if="radio_time == 2"
                is-range
                v-model="paytime"
                value-format='HH:mm:ss'
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
            </div>
        </div>
        <div style="width:400px;margin:20px auto 0;font-size:18px;text-align:center;line-height:40px">
          <div style="height:40px;width:100px;border:1px solid rgb(126, 126, 126);border-radius:5px;float:left;cursor: pointer" @click="stand_add_reset">重置</div>
          <div style="height:40px;width:100px;border:1px solid rgb(126, 126, 126);border-radius:5px;float:right;cursor: pointer" @click="stand_add_confirm

">确认</div>
        </div>
      </div>
    </div>
    <!-- 规则明细查看及新建 -->
    <div class="describe" v-if="!standshow">
      <div class="des-header" style="width:100%;height:50px;">
        <div style="width:150px" class="addrule" @click="des_addrule">+添加收费时段</div>
        <div class="delrule" @click="del_des">-批量删除</div>
        <div class="goback" @click="goback">返回收费列表标准</div>
        <span style="line-height:50px;font-size:18px">归属：{{cs_name}}<span style="color:blue">|</span><span style="color:red">提示：修改后将会更改所有应用{{cs_name}}的停车场</span></span>
      </div>
      <div class="content"  style="margin-top:0px">
        <table>
          <thead>
            <tr>
              <th style="position: relative;width:50px;height:50px">
                <input type="checkbox" @click="des_checked_all" v-model="checked_all_des">
              </th>
              <th>起始时间</th>
              <th>间隔时间</th>
              <th>单价(元)</th>
              <th>规则描述</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in desrules" :key="index">
              <td style="position: relative;width:50px;height:40px">
                <input type="checkbox" @click="checked_des(item.detailed_id)" v-model="des_checked" :value="item.detailed_id">
              </td>
              <td>{{item.detailed_start}}</td>
              <td>{{item.detailed_interval}}</td>
              <td>{{item.detailed_price}}</td>
              <td>{{item.detailed_commet}}</td>
              <td>
                <span style="color:blue;cursor:pointer" @click="des_editor(item)">编辑</span>|
                <span style="color:blue;cursor:pointer" @click="des_del_sel(item)">删除</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 新建规则明细 -->
    <div class="addcontent" v-if="desaddshow">
      <div class="desaddrl">
        <div class="add-header">{{des_add_header_text}}
          <span @click="des_close">X</span>
        </div>
        <div style="height:50px;width:400px;font-size:18px;text-align:center;margin:30px auto 0;line-height:50px">
          <span style="display:inline-block;width:150px">起始时间：</span>
          <!-- <el-input style="width:200px" type="text" placeholder="00:00" v-model="des_sel_editor.starttime" clearable></el-input> -->
          <el-time-picker
            clearable
            tyle="width:200px"
            format="HH:mm"
            value-format="HH:mm"
            v-model="des_sel_editor.detailed_start"
            placeholder="选择起始时间">
          </el-time-picker>
        </div>
        <div style="height:50px;width:400px;font-size:18px;text-align:center;margin:30px auto 0;line-height:50px">
          <span style="display:inline-block;width:150px">间隔时段(分钟)：</span>
          <el-input-number v-model="des_sel_editor.detailed_interval" style="width:220px" placeholder="请输入间隔时间"></el-input-number>
        </div>
        <div style="height:50px;width:400px;font-size:18px;text-align:center;margin:30px auto 0;line-height:50px">
          <span style="display:inline-block;width:150px">单价(元)：</span>
          <el-input-number v-model="des_sel_editor.detailed_price" style="width:220px" placeholder="请输入单价"></el-input-number>
        </div>
        <div style="height:50px;width:400px;font-size:18px;text-align:center;margin:30px auto 0;line-height:40px">
          <div style="height:40px;width:100px;border:1px solid rgb(126, 126, 126);border-radius:5px;float:left;cursor: pointer" @click="des_add_reset">重置</div>
          <div style="height:40px;width:100px;border:1px solid rgb(126, 126, 126);border-radius:5px;float:right;cursor: pointer" @click="des_add_confirm">确认</div>
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
      shand_name:'',
      add_header_text:'',    //标准新建或者编辑头部文字
      des_add_header_text:'',   //规则新建或者编辑头部文字
      standshow:true,     //新建规则显示
      addshow:false,     //新建标准显示
      desaddshow:false,   //规则列表显示
      nowday:'',    //时间
      nowtime:'',
      rule_editor_new:'',
      radio_free:'',    //免费时段适用情况选择
      radio_time:'2',    //收费时段情况选择
      rules:[],
      add_rule_list:[],         //添加标准页面规则列表
      parkname:'',
      selparklists:[],
      desrules:[],
      paytime:['00:00:00','23:00:00'],
      rule_sel_editor:{},   //存放要编辑的标准
      rule_reset_text:{},   //存放要重置的标准
      des_sel_editor:{},    //存放要编辑的规则
      des_reset_text:{},     //存放要重置的规则
      stand_checked:[],      //存放选择的标准
      checked_all:false,     //标准全选与否
      des_checked:[],        //存放选择的规则
      checked_all_des:false,     //规则全选与否
      pageIndex:1,   //当前页
      allps:1,     //总页数
      ps:15,       //每页条数
      total_ps:0,     //总条数
      url:'http://192.168.0.192:13259/its/parking/rule',
      url_kind:'',
      params:{},
      text_one:'',
      text_two:'',
      cs_name:'',
      detailed_csid:'',
      rule_choose:{}
    }
  },
  mounted() {
    this.imFile = document.getElementById('imFile')
    this.get_rule_list()
  },
  beforeDestroy() {
    this.standshow = true
    this.rule_choose = {}
  },
  methods: {
    //获取收费列表封装
    get_stand_list(params){
      params = JSON.stringify(params)
      axios({
        method:'post',
        url: this.url + '/findCSInfo',
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        },
        data:params
      }).then(res => {
        if(res.data.data.list.length > 0){
          this.rules = res.data.data.list
          this.total_ps = res.data.data.total
        }else{
          let text = '暂无符合条件的数据!'
          this.show_warning(text)
        }
      })
    },
    //初次进入获取标准列表
    get_rule_list(){
      let params = {
      }
      this.get_stand_list(params)
      if(this.rule_choose.detailed_csid){
        this.stand_show(this.rule_choose)
      }
    },
    //获取环保规则列表
    get_env_list(){
      let params = {}
      params = JSON.stringify(params)
      axios({
        method:'post',
        url: this.url + '/findEPInfo',
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        },
        data:params
      }).then(res => {
        console.log(res)
        if(res.data.data.length > 0){
          this.add_rule_list = res.data.data
        }else{
          let text = '暂无符合条件的数据!'
          this.show_warning(text)
        }
      })
    },
    //显示新建标准
    addrule(){
      this.add_header_text = '新建收费标准'
      this.addshow = true;
      this.url_kind = '/saveCSInfo'
      this.text_one = '成功添加新的收费标准!'
      this.text_two = '添加新的收费标准失败!'
      this.get_env_list()
    },
    //关闭新建标准
    close(){
      this.addshow = false;
      this.rule_sel_editor = {}
      this.rule_reset_text = {}
      this.rule_editor_new = ''
      this.paytime = ['00:00:00','23:00:00']
      this.params = {}
    },
    // 删除选择的标准
    del_stand(){
      let data = this.stand_checked.join(',')
      let params = {
        'cs_id':data
      }
      let textone = '此操作将所选择的收费标准删除, 是否继续?'
      let texttwo = '标准删除成功！'
      let textthree = '标准删除失败！'
      let url = this.url + '/deleteCS'
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
        // let data = val.map((item) => {
        //   return {
        //     'id':item.规则编号,
        //     'name':item.适用停车场,
        //     'norm':item.收费标准,
        //     'freetime':item.免费时长,
        //     'paytimestr':item.收费时段开始时间,
        //     'paytimeend':item.收费时段结束时间,
        //     'caps':item.封顶金额
        //   }
        // })
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
    // 导出标准
    export_stand(){
      console.log('导出')
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../../../excel/Export2Excel.js')
        const tHeader = ['标准编号','标准名称', '环保规则', '免费时长','收费时段开始时间','收费时段结束时间']; //将对应的属性名转换成中文
        //const tHeader = [];　
        const filterVal = ['id','name', 'rules', 'freetime','paytimestr','paytimeend','caps'];//table表格中对应的属性名　　　　　 　　　
        const list = this.rules;　　//想要导出的数据　　　　　　
        const data = this.formatJson(filterVal, list);　　　
        this.timeday()
        let title = '收费标准列表' + this.nowday　　　　　
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
    // 标准搜索
    shand_name_sec(){
      let params = {
        cs_name:this.shand_name
      }
      this.get_stand_list(params)
    },
    //收费标准编辑
    stand_editor(rule){
      this.text_one = '修改收费标准成功!'
      this.text_two = '修改收费标准失败!'
      this.add_header_text = '编辑收费标准'
      this.url_kind = '/updateCS'
      this.rule_sel_editor = rule
      this.rule_reset_text = JSON.parse(JSON.stringify(rule))
      this.paytime = [rule.cs_ct_start,rule.cs_ct_end]
      this.addshow = true
      this.rule_editor_new = this.rule_sel_editor.ep_Name
      this.radio_free = this.rule_sel_editor.cs_freetype
      this.get_env_list()
      if(this.radio_time == 1){
        this.paytime = ['00:00:00','23:59:59']
      }
      this.params = {
        'cs_id': this.rule_sel_editor.cs_id
      }
    },
    //收费标准删除
    stand_del_sel(rule){
      let params = {
        'cs_id':rule.cs_id
      }
      let textone = '此操作将所选择的收费标准删除, 是否继续?'
      let texttwo = '标准删除成功！'
      let textthree = '标准删除失败！'
      let url = this.url + '/deleteCS'
      this.show_delete_warning(textone,texttwo,textthree,url,params)
    },
    //添加收费标准重置
    stand_add_reset(){
      if(this.rule_reset_text){
        let data = JSON.parse(JSON.stringify(this.rule_reset_text))
        this.rule_sel_editor = data
        this.paytime = [data.paytimestr,data.paytimeend]
      }else{
        this.rule_sel_editor = {}
        this.rule_reset_text = {}
        this.paytime = ['00:00:00','23:00:00']
      }
    },
    //确认添加收费标准
    stand_add_confirm(){
      if(this.radio_time == 1){
        this.paytime = ['00:00:00','23:59:59']
      }
      if(this.rule_editor_new && this.rule_sel_editor.cs_maxprice && this.radio_free && this.rule_sel_editor.cs_freetime && this.rule_sel_editor.cs_name){
        this.params.cs_ep_ruleid = this.rule_editor_new
        this.params.cs_freetype = this.radio_free
        this.params.cs_maxprice = this.rule_sel_editor.cs_maxprice
        this.params.cs_freetime = this.rule_sel_editor.cs_freetime
        this.params.cs_ct_start = this.paytime[0]
        this.params.cs_ct_end = this.paytime[1]
        this.params.cs_name = this.rule_sel_editor.cs_name
        this.params = JSON.stringify(this.params)
        axios({
          method:'post',
          url: this.url + this.url_kind,
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          },
          data:this.params
        }).then(res => {
          console.log(res)
          if(res.data.success){
            this.$notify({
              title: '温馨提示',
              message: this.text_one,
              type: 'success',
              offset: 100
            })
            this.get_all_list()
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
        let text = '关键选项没有值'
        this.show_warning(text)
      }
    },
    // 显示收费规则
    stand_show(rule){
      this.standshow = false
      this.rule_choose = rule
      if(rule){
        this.cs_name = rule.cs_name
        this.detailed_csid = rule.cs_id
      }
      let params = {
        detailed_csid:this.detailed_csid
      }
      axios({
        method:'post',
        url: this.url + '/findInfo',
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        },
        data:params
      }).then(res => {
        this.desrules = res.data.data
      })
    },
    //返回收费标准列表
    goback(){
      this.rule_choose = {}
      this.standshow = true
    },
    //显示新建规则
    des_addrule(){
      this.des_add_header_text = '新建规则明细'
      this.desaddshow = true
      this.text_one = '新规则添加成功！'
      this.text_two = '新规则添加失败！'
      this.url_kind = '/saveInfo'
      this.params.detailed_start= this.des_sel_editor.detailed_start + ':00'
    },
    //显示编辑规则
    des_editor(item){
      this.des_add_header_text = '编辑规则明细'
      this.des_sel_editor = item
      console.log(item)
      this.des_reset_text = JSON.parse(JSON.stringify(item))
      this.desaddshow = true
      this.params.detailed_id = item.detailed_id
      this.params.detailed_start= item.detailed_start,
      this.url_kind = '/updateInfo'
    },
    //重置编辑规则
    des_add_reset(){
      this.des_sel_editor = this.des_reset_text
    },
    //确认添加收费标准
    des_add_confirm(){
      // this.des_close()
      console.log(this.des_sel_editor)
      let time = this.des_sel_editor.detailed_start.split(':')
      let text = '车辆入场后，从第' + time[0] + '小时' + time[1] + '分钟开始计算,每间隔' + this.des_sel_editor.detailed_interval + '分钟收取' + this.des_sel_editor.detailed_price + '元'
      if(this.des_sel_editor.detailed_start && this.des_sel_editor.detailed_interval && this.des_sel_editor.detailed_price){
        this.params.detailed_csid=this.detailed_csid,
        this.params.detailed_interval=this.des_sel_editor.detailed_interval,
        this.params.detailed_price=this.des_sel_editor.detailed_price,
        this.params.detailed_commet=text
        console.log(this.params)
        this.params = JSON.stringify(this.params)
        axios({
          method:'post',
          url: this.url + this.url_kind,
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          },
          data:this.params
        }).then(res => {
          console.log(res)
          if(res.data.success){
            this.stand_show()
            this.$notify({
              title: '温馨提示',
              message: this.text_one,
              type: 'success',
              offset: 100
            })
            this.des_close()
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
    },
    //删除单个规则
    des_del_sel(item){
      console.log(item)
      let params = {
        'detailed_id':item.detailed_id
      }
      let textone = '此操作将所选择的收费标准删除, 是否继续?'
      let texttwo = '标准删除成功！'
      let textthree = '标准删除失败！'
      let url = this.url + '/deleteInfo'
      this.show_delete_warning(textone,texttwo,textthree,url,params)
      this.stand_show(this.rule_choose)
    },
    //批量删除规则
    del_des(){
      let data = this.des_checked.join(',')
      console.log(data)
      let params = {
        'detailed_id':data
      }
      let textone = '此操作将所选择的收费标准删除, 是否继续?'
      let texttwo = '标准删除成功！'
      let textthree = '标准删除失败！'
      let url = this.url + '/deleteInfo'
      this.show_delete_warning(textone,texttwo,textthree,url,params)
    },
    //关闭新建规则
    des_close(){
      this.desaddshow = false
      this.des_sel_editor = {}
      this.params = {}
    },
    //标准列表选择
    checked_stand(id){
      if(this.stand_checked.includes(id)){
				this.stand_checked=this.stand_checked.filter(function (ele){return ele != id;});
        if(this.stand_checked.length === this.rules.length){
          this.checked_all = true
        }else{
          this.checked_all = false
        }
			}else{
        this.stand_checked.push(id);
        if(this.stand_checked.length === this.rules.length){
          this.checked_all = true
        }else{
          this.checked_all = false
        }
      }
    },
    //标准列表全选或反选
    stand_checked_all(){
      if(this.checked_all) {
          // 实现反选，按钮选中时 实现了反选，列表为空
          this.stand_checked = []
      } else {
          // 实现全选
          this.stand_checked = []
          this.rules.forEach((dateil) => {
              this.stand_checked.push(dateil.cs_id)
          })
      }
      if(this.stand_checked.length === this.rules.length) {
          this.checked_all = true
      }
    },
    //规则列表全选或反选
    des_checked_all(){
      if(this.checked_all_des) {
          // 实现反选，按钮选中时 实现了反选，列表为空
          this.des_checked = []
      } else {
          // 实现全选
          this.des_checked = []
          this.desrules.forEach((dateil) => {
              this.des_checked.push(dateil.detailed_id)
          })
      }
      if(this.des_checked.length === this.desrules.length) {
          this.checked_all_des = true
      }
    },
    //规则列表选择
    checked_des(id){
      if(this.des_checked.includes(id)){
				this.des_checked=this.des_checked.filter(function (ele){return ele != id;});
        if(this.des_checked.length === this.desrules.length){
          this.checked_all_des = true
        }else{
          this.checked_all_des = false
        }
			}else{
        this.des_checked.push(id);
        if(this.des_checked.length === this.desrules.length){
          this.checked_all_des = true
        }else{
          this.checked_all_des = false
        }
      }
    },
    //上一页
    go_back(){

    },
    //下一页
    forward(){

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
.goback{
  width: 150px;
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
  height: 600px;
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
.selnorm,.selpark{
  width: 100%;
}
.selnorm{
  height: 300px;
}
.selpark{
  height: 460px;
}
.normleft,.parkleft{
  width: 15%;
  height: 100%;
  float: left;
  font-size: 18px;
  text-align: center;
  line-height: 40px;
}
.normright,.parkright{
  width: 85%;
  height: 100%;
  float: left;
  /* border: 1px solid saddlebrown; */
}
.selnorm-inp{
  height: 40px;
  width: 100%;
}
.normdetail{
  width: 100%;
  height: 260px;
}
.parkright>div{
  float: left;
  height: 400px;
}
.park-l,.park-r{
  width: 47%;
  /* border: 1px solid rgb(126, 126, 126); */
}
.park-m{
  width: 6%;
  font-size: 20px;
  line-height: 230px;
  text-align: center;
  padding-left: 20px;
}
.park-l-h,.park-r-h{
  height: 40px;
  width: 100%;
}
.park-l-c,.park-r-c{
  width: calc(100% - 20px);
  height: 340px;
  border: 1px solid rgb(126, 126, 126);
  margin-left: 20px;
  margin-top: 20px;
  overflow: hidden;
  overflow-y: auto;
}
.describe{
  height: 100%;
  width: 100%;
  /* border: 1px solid seagreen; */
}
.desaddrl{
  width: 600px;
  height: 400px;
  background: #fff;
  margin: 30px auto 0;
}
</style>

