<template>
  <div id="row">
    <div class="header">
      <div class="addrule" @click="addrule">+新建</div>
      <div class="delrule" @click="del_rule">-批量删除</div>
      <input type="file" @change="importFile(this)" id="imFile" style="display: none"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
      <div class="import" @click="uploadFile">批量导入</div>
      <div class="export" @click="export_rule">导出</div>
      <div class="search">
        <span>停车场：</span>
        <input type="search" name="" id="" placeholder="请输入停车场名称" v-model="parkname">
        <div @click="rule_name_sec">搜索</div>
      </div>
    </div>
    <div class="content">
      <table>
        <thead>
          <tr>
            <th style="position: relative;width:50px;height:50px"><input type="checkbox" @click="rulechecked_all" v-model="checked_all"></th>
            <th>序号</th>
            <th>适用停车场</th>
            <th>收费标准</th>
            <th>免费时长</th>
            <th>收费时段</th>
            <th>封顶价格</th>
            <th>规则明细</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rule,index) in rules" :key="index">
            <td style="position: relative;width:50px;height:40px"><input type="checkbox" @click="checked_rule(rule.cr_id)" v-model="rulechecked" :value="rule.cr_id"></td>
            <td>{{index+1}}</td>
            <td>{{rule.parking_name}}</td>
            <td>{{rule.cs_name}}</td>
            <td>{{rule.cs_freetime}}</td>
            <td>{{rule.cs_ct_start}}-{{rule.cs_ct_end}}</td>
            <td>{{rule.cs_maxprice}}</td>
            <td style="cursor: pointer" @click="rule_detail_show(rule)"><i class="el-icon-view"></i>查看</td>
            <td>{{rule.crttime}}</td>
            <td>{{rule.uptime}}</td>
            <td>
              <span style="color:blue;cursor: pointer" @click="rule_editor_show(rule)">编辑</span>
              <el-divider direction="vertical"></el-divider>
              <span style="color:blue;cursor: pointer" @click="rule_del(rule)">删除</span>
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
            <td></td>
            <td></td>
            <td>{{pageIndex}}/{{allps}}页</td>
            <td>跳转至<input style="width:50px;height:30px;padding-left:20px" type="text" name="" id="" v-model="pageIndex">页</td>
            <td>
              <div @click="prepage">上一页</div>
              <div @click="nextpage">下一页</div>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="addcontent" v-if="addshow">
      <div class="myaddrl">
        <div class="add-header">新建收费规则
          <span @click="close">X</span>
        </div>
        <div class="selnorm">
          <div class="normleft">选择收费标准：</div>
          <div class="normright">
            <div class="selnorm-inp">
              <el-input style="height:40px;width:160px;margin-left:20px;border-radius:5px;float:left" type="text" placeholder="请输入标准名称" v-model="normname" clearable></el-input>
              <el-button type="primary" style="float:left;margin-left:10px" @click="search_norm">搜索</el-button>
            </div>
            <div class="normdetail">
              <table style="width:100%">
                <thead>
                  <tr style="height:45px;line-height:45px;background: rgb(126, 126, 126);width:100%;text-align:center">
                    <td></td>
                    <td>序号</td>
                    <td>收费标准名字</td>
                    <td>环保规则</td>
                    <td>免费时长</td>
                    <td>收费时段</td>
                    <td>封顶价格</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(norm,index) in norms" :key="index" style="height:35px;line-height:35px;border-bottom:1px solid #000;text-align:center">
                    <td><input type="radio" @click="mychecked(index)" name="norm" id="0"></td>
                    <td>{{index+1}}</td>
                    <td>{{norm.cs_name}}</td>
                    <td>{{norm.ep_Name}}</td>
                    <td>{{norm.cs_freetime}}</td>
                    <td>{{norm.cs_ct_start}}-{{norm.cs_ct_end}}</td>
                    <td>{{norm.cs_maxprice}}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr style="height:35px;line-height:35px;text-align:center">
                    <td>合计</td>
                    <td>共{{total_pa_norm}}条</td>
                    <td></td>
                    <td>{{pageIndex_norm}}/{{allps_norm}}页</td>
                    <td @click="first_page" style="cursor: pointer">首页</td>
                    <td @click="last_page" style="cursor: pointer">尾页</td>
                    <td>
                      <span style="margin-right:20px;cursor: pointer" @click="prepage_norm">上一页</span>
                      <span style="cursor: pointer" @click="nextpage_norm">下一页</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <div class="selpark">
          <div class="parkleft">选择停车场：</div>
          <div class="parkright">
            <el-transfer
              filterable
              :filter-method="filterMethod"
              :titles="['停车场列表', '已选择停车场列表']"
              filter-placeholder="请输入停车场名字"
              v-model="park_sel"
              :data="parklists">
            </el-transfer>
            <el-button type="warning" style="margin-top:15px;margin-left:30%" @click="create_reset">重置</el-button>
            <el-button type="primary" style="margin-top:15px;margin-left:10%;;" @click="create_confirm">确认</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="addcontent" v-if="rule_detail">
      <div class="rule_detail">
        <div class="add-header">规则明细
          <span @click="close">X</span>
        </div>
        <div class="content"  style="margin-top:0px">
          <table>
            <thead>
              <tr style="background:#fff;border-bottom:1px solid #000">
                <th>起始时间</th>
                <th>间隔时间</th>
                <th>单价(元)</th>
                <th>规则描述</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in desrules" :key="index">
                <td>{{item.detailed_start}}</td>
                <td>{{item.detailed_interval}}</td>
                <td>{{item.detailed_price}}</td>
                <td>{{item.detailed_commet}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="addcontent" v-if="rule_editor">
      <div class="rule_editor">
        <div class="add-header">收费规则编辑
          <span @click="close">X</span>
        </div>
        <div class="editor_cont">
          <div>
            <span>适用停车场：</span>
            <div style="width:400px;float:left;text-align:center">{{rule_editor_text.parking_name}}</div>
          </div>
          <div>
            <span>收费标准：</span>
            <el-select v-model="rule_editor_new" placeholder="请选择收费标准" style="width:300px;margin-left:50px">
              <el-option
                v-for="item in norms"
                :key="item.cs_name"
                :label="item.cs_name"
                :value="item.cs_id">
              </el-option>
            </el-select>
          </div>
          <div>
            <span>免费时长：</span>
            <el-input-number v-model="rule_editor_text.cs_freetime" :step="1" style="width:300px;margin-left:50px" disabled></el-input-number>
          </div>
          <div>
            <span>收费时段：</span>
            <el-time-picker
              is-range
              disabled
              v-model="paytime"
              value-format='HH:mm:ss'
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              style="width:300px;margin-left:50px">
            </el-time-picker>
          </div>
          <div>
            <span>封顶价格：</span>
            <el-input-number v-model="rule_editor_text.cs_maxprice" :precision="2" :step="1" style="width:300px;margin-left:50px" disabled></el-input-number>
          </div>
          <div>
            <div style="height:40px;width:100px;border:1px solid #999;float:left;border-radius:5px;text-align:center;line-height:40px;cursor: pointer" @click="rule_editor_reset">重置</div>
            <div style="height:40px;width:100px;border:1px solid #999;float:right;border-radius:5px;text-align:center;line-height:40px;cursor: pointer" @click="rule_editor_comf">保存</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
var XLSX = require('xlsx')
import axios from 'axios';
export default {
  data() {
    return {
      addshow:false,
      rule_detail:false,
      rule_editor:false,
      imFile:'',   //导入文件el
      fullscreenLoading: false, // 加载中
      nowday:'',    //时间
      nowtime:'',
      excelData:[],   //存放解析的数据
      paytime:['00:00:00','23:00:00'],
      rule_reset_text:{},
      rule_editor_text:{},
      file:'',
      rules:[],
      parkname:'',    //规则列表搜索停车场名称绑定
      norms:[],
      stand_list:[
        {name:'标准1',id:'0'},
        {name:'标准2',id:'0'},
        {name:'标准3',id:'0'},
        {name:'标准4',id:'0'},
        {name:'标准5',id:'0'}
      ],
      parklists: [],
      park_sel: [],
      rule_editor_new:{},
      normslist:'',   //选择的标准
      normname:'',     //搜索标准名称绑定值
      rulechecked:[],   //存放已选择的规则列表
      desrules:[],    //存放规则明细
      checked_all:false,
      pageIndex:1,   //当前页
      allps:0,     //总页数
      ps:15,       //每页条数
      total_ps:0,     //总条数
      pageIndex_norm:1,    //标准当前页数
      ps_norm:5,  //添加页面每页显示多少条标准
      allps_norm:1,     //标准总页数
      total_pa_norm:0,   //标准总条数
      url:'http://192.168.0.192:13259/its/parking/rule',  //查询规则借口
      url_park:'/its/operations/query/berth'  //停车场接口
    }
  },
  mounted() {
    this.imFile = document.getElementById('imFile')
    this.get_rule_list()
  },
  methods: {
    //获取停车场
    get_all_park(){
      axios({
        method: 'post',
        url:this.url_park,
        headers:{
          'content-type':'application/x-www-form-urlencoded'
        },
        data: {}
      }).then(res => {
        this.parklists = res.data.data.map(item => {
          return {
            'key':item.parking_weiyi_no,
            'label':item.parking_name,
            'name':item.parking_name
          }
        })
      })
    },
    //新增页面穿梭
    filterMethod(query, item) {
      return item.name.indexOf(query) > -1;
    },
    //封装获取规则列表
    get_rule_all(params){
      params = JSON.stringify(params)
      axios({
        method:'post',
        url: this.url + '/findCRInfo',
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        },
        data:params
      }).then(res => {
        console.log(res)
        if(res.data.data.list.length > 0){
          this.rules = res.data.data.list
          this.total_ps = res.data.data.total
          this.allps = res.data.data.pages
        }else{
          let text = '暂无符合条件的数据!'
          this.rules = []
          this.show_warning(text)
        }
      })
    },
    //获取规则列表
    get_rule_list(){
      let params = {
        'currentPage':this.pageIndex,
      }
      this.get_rule_all(params)
    },
    //规则跳转上一页
    prepage(){
      if(this.pageIndex > 1){
        this.pageIndex --
        let params = {
        'currentPage':this.pageIndex,
        }
        this.get_rule_all(params)
      }else{
        let text = '已经是第一页了!'
        this.show_warning(text)
      }
    },
    //规则跳转下一页
    nextpage(){
      if(this.pageIndex < this.allps){
        this.pageIndex ++
        let params = {
        'currentPage':this.pageIndex,
        }
        this.get_rule_all(params)
      }else{
        let text = '已经是最后一页了!'
        this.show_warning(text)
      }
    },
    //根据停车场名字搜索规则
    rule_name_sec(){
      if(this.parkname){
        let params = {
          'parking_name':this.parkname,
        }
        this.get_rule_all(params)
      }else{
        let text = '暂无符合条件的数据!'
        this.show_warning(text)
      }
    },
    //删除所选规则
    del_rule(){
      let data = this.rulechecked.join(',')
      console.log(data)
      let params = {
        'cr_id': data
      }
      let textone = '此操作将所选择的收费规则删除, 是否继续?'
      let texttwo = '规则删除成功！'
      let textthree = '规则删除失败！'
      let url = this.url + '/deleteCR'
      this.show_delete_warning(textone,texttwo,textthree,url,params)
    },
    //封装获取标准列表
    get_norm_list(params){
      params = JSON.stringify(params)
      axios({
        method:'post',
        url: this.url + '/findCSInfo',
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        },
        data:params
      }).then(res => {
        console.log(res)
        if(res.data.data.list.length > 0){
          this.norms = res.data.data.list
        }else{
          let text = '暂无符合条件的数据!'
          this.show_warning(text)
        }
      })
    },
    //获取标准列表
    get_all_norm(){
      let params = {
        'currentPage':this.pageIndex_norm,
        'pageSize': this.ps_norm
      }
      this.get_norm_list(params)
    },
    //添加页面标准搜索
    search_norm(){
      let params = {
        'cs_name': this.normname
      }
      this.get_norm_list(params)
    },
    //规则添加模块显示
    addrule(){
      this.get_all_norm()
      this.addshow = true;
    },
    //标准跳转首页
    first_page(){
      this.pageIndex_norm = 1
      let params = {
        'currentPage':this.pageIndex_norm,
        'pageSize': this.ps_norm
      }
      this.get_norm_list(params)
    },
    //标准跳转尾页
    last_page(){
      this.pageIndex_norm = this.allps_norm
      let params = {
        'currentPage':this.pageIndex_norm,
        'pageSize': this.ps_norm
      }
      this.get_norm_list(params)
    },
    //标准跳转上一页
    prepage_norm(){
      if(this.pageIndex_norm > 1){
        this.pageIndex_norm --
        let params = {
          'currentPage':this.pageIndex_norm,
          'pageSize': this.ps_norm
        }
        this.get_norm_list(params)
      }else{
        let text = '已经是第一页了!'
        this.show_warning(text)
      }
    },
    //标准跳转下一页
    nextpage_norm(){
      if(this.pageIndex_norm < this.allps_norm){
        this.pageIndex_norm ++
        let params = {
          'currentPage':this.pageIndex_norm,
          'pageSize': this.ps_norm
        }
        this.get_norm_list(params)
      }else{
        let text = '已经是最后一页了!'
        this.show_warning(text)
      }
    },
    //规则添加模块关闭
    close(){
      this.addshow = false;
      this.rule_detail = false
      this.rule_editor = false
      this.rule_editor_text = {}
      this.rule_reset_text = {}
      this.paytime = ['00:00:00','23:00:00']
    },
    //规则列表全选非全选
    rulechecked_all(){
      var that = this
      if(this.checked_all) {
          // 实现反选，按钮选中时 实现了反选，列表为空
          this.rulechecked = []
      } else {
          // 实现全选
          this.rulechecked = []
          this.rules.forEach(function(dateil) {
              that.rulechecked.push(dateil.cr_id)
          })
      }
      if(this.rulechecked.length === this.rules.length) {
          this.checked_all = true
      }
    },
    //规则列表选择
    checked_rule(id){
      console.log(this.rulechecked)
      if(this.rulechecked.includes(id)){
				this.rulechecked=this.rulechecked.filter(function (ele){return ele != id;});
        if(this.rulechecked.length === this.rules.length){
          this.checked_all = true
        }else{
          this.checked_all = false
        }
			}else{
        this.rulechecked.push(id);
        if(this.rulechecked.length === this.rules.length){
          this.checked_all = true
        }else{
          this.checked_all = false
        }
      }
    },
    //新建规则停车场选择
    checked(index){
      let arr = this.parklists.filter(function (park) {
        return park.id == index
      })
      this.selparklists.push(arr[0])
      this.parklists = this.parklists.filter(function (park) {
        return park.id != index
      })
    },
    //新建规则停车场反选
    unchecked(index){
      let arr = this.selparklists.filter(function (park) {
        return park.id == index
      })
      this.parklists.push(arr[0])
      this.selparklists = this.selparklists.filter(function (park) {
        return park.id != index
      })
    },
    //新建规则标准选择
    mychecked(index){
      this.normslist = this.norms[index]
      let params = {
        'cr_cs_id': this.normslist.cs_id
      }
      this.get_park_rule(params)
    },
    //新建规则确认
    create_confirm(){
      if(this.normslist && this.park_sel.length){
        let park = this.park_sel.join(',')
        console.log(park)
        let params = {
          'cr_parkid': park,
          'cr_cs_id': this.normslist.cs_id
        }
        params = JSON.stringify(params)
        axios({
          method:'post',
          url: this.url + '/saveCRInfo',
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          },
          data:params
        }).then(res => {
          if(res.data.success){
            this.$notify({
              title: '温馨提示',
              message: '收费规则添加成功！',
              type: 'success',
              offset: 100
            })
            this.get_rule_list()
            this.close()
          }else{
            this.$notify.error({
              title: '温馨提示',
              message: '收费规则添加失败！',
              offset: 100
            })
          }
        })
      }else{
        let text = '必须选择收费标准和停车场！'
        this.show_warning(text)
      }
    },
    //新建规则重置
    create_reset(){
      this.normslist = [],
      this.park_sel = []
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
    //规则导出
    export_rule(){
      require.ensure([], () => {　　　　　　　　
        const { export_json_to_excel } = require('../../../../excel/Export2Excel.js');　　//引入文件　　　　　　
        const tHeader = ['规则编号','适用停车场', '收费标准', '免费时长','收费时段开始时间','收费时段结束时间','封顶金额','创建时间','更新时间']; //将对应的属性名转换成中文
        //const tHeader = [];　
        const filterVal = ['id','name', 'norm', 'freetime','paytimestr','paytimeend','caps','crttime','uptime'];//table表格中对应的属性名　　　　　 　　　
        const list = this.rules;　　//想要导出的数据　　　　　　
        const data = this.formatJson(filterVal, list);
        this.get_nowtime()
        let title = '收费规则列表' + this.nowday
        export_json_to_excel(tHeader, data, title, this.nowtime);
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //规则明细查看
    rule_detail_show(rule){
      this.rule_detail = true
      console.log(rule)
      let params = {
        detailed_csid:rule.cr_cs_id
      }
      axios({
        method:'post',
        url: this.url + '/findInfo',
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        },
        data:params
      }).then(res => {
        console.log(res)
        this.desrules = res.data.data
      })
    },
    //编辑规则
    rule_editor_show(rule){
      this.rule_editor = true
      this.rule_editor_text = rule
      this.rule_reset_text = JSON.parse(JSON.stringify(rule))
      this.paytime = [rule.cs_ct_start,rule.cs_ct_end]
      console.log(this.rule_editor_text)
      this.rule_editor_new = this.rule_editor_text.cs_name
      this.get_all_norm()
    },
    //列表删除单个规则
    rule_del(rule){
      let params = {
        'cr_id': rule.cr_id,
      }
      let textone = '此操作将所选择的收费规则删除, 是否继续?'
      let texttwo = '规则删除成功！'
      let textthree = '规则删除失败！'
      let url = this.url + '/deleteCR'
      this.show_delete_warning(textone,texttwo,textthree,url,params)
    },
    //规则编辑重置
    rule_editor_reset(){
      let data = JSON.parse(JSON.stringify(this.rule_reset_text))
      this.rule_editor_text = data
      this.paytime = [data.paytimestr,data.paytimeend]
    },
    //规则编辑确认
    rule_editor_comf(){
      let params = {
        'cr_id': this.rule_editor_text.cr_id,
        'cr_cs_id': this.rule_editor_new
      }
      params = JSON.stringify(params)
      axios({
        method:'post',
        url: this.url + '/updateCR',
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        },
        data:params
      }).then(res => {
        if(res.data.success){
          this.$notify({
            title: '温馨提示',
            message: '该停车的规则更新成功！',
            type: 'success',
            offset: 100
          })
          this.get_rule_list()
          this.close()
        }else{
          this.$notify.error({
            title: '温馨提示',
            message: '该停车的规则更新失败！',
            offset: 100
          })
        }
      })
    },
    get_park_rule(params){
      this.get_all_park()
      params = JSON.stringify(params)
      axios({
        method:'post',
        url: this.url + '/findCRInfo',
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        },
        data:params
      }).then(res => {
        if(res.data.data.list.length > 0){
          let data = res.data.data.list.map(item => {
            return item.cr_parkid
          })
          this.parklists = this.parklists.filter(item => {
            return data.indexOf(item.key) == -1
          })
        }
      })
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
  line-height: 40px;
  float: left;
  margin-top: 5px;
  margin-right: 30px;
  border: 1px solid rgb(126, 126, 126);
  background: rgb(219, 219, 219);
  cursor: pointer;
  text-align: center;
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
  width: 90%;
  height: 800px;
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
  margin-top: 10px;
}
.selpark{
  height: 400px;
  margin-top: 40px;
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
  margin-top: 10px;
}
.parkright>div{
  float: left;
  height: 320px;
}
.el-transfer{
  width: 100%;
}
.parkright>>>.el-transfer-panel{
  width: 44%;
}
.rule_detail{
  width: 1200px;
  /* height: 240px; */
  background: #fff;
  margin: 150px auto 0;
}
.rule_editor{
  width: 800px;
  height: 600px;
  background: #fff;
  margin: 150px auto 0;
}
.editor_cont{
  width: 600px;
  height: 500px;
  /* border: 1px solid saddlebrown; */
  margin: 20px auto 0;
}
.editor_cont>div{
  width: 100%;
  height: 50px;
  font-size: 18px;
  /* border: 1px solid darkcyan; */
  margin-bottom: 30px;
  line-height: 50px;
}
.editor_cont>div>span{
  display: block;
  float: left;
  width: 150px;
  height: 50px;
  text-align: center;
  border-right: 1px solid #9999;
}
</style>

