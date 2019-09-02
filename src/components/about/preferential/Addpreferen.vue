<template>
  <div id="row">
    <div class="select">
      <el-button style="float:right;margin-right:20px;margin-top:10px;" type="danger" @click="sel_del">删除</el-button>
      <el-button style="float:right;margin-right:20px;margin-top:10px;" type="success" @click="add_car">新建</el-button>
      <div class="data-interval">
        <div class="username">
          <span style="float:left">月卡类型:</span>
          <el-input style="width:140px;float:left"
            placeholder="输入月卡类型"
            v-model="card_kind"
            clearable>
          </el-input>
        </div>
        <el-button class="selbtn" type="primary" @click="sel_uesr">搜索</el-button>
      </div>
    </div>
    <div class="detail">
      <el-table
        :data="list_detail"
        v-loading='loading'
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
          prop="typeName"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="monthNum"
          sortable
          label="月数">
        </el-table-column>
        <el-table-column
          prop="money"
          sortable
          label="售价">
        </el-table-column>
        <el-table-column
          prop="info"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="新建时间">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间">
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
    <div class="addcontent" @click.stop="close" v-if="addshow">
      <div class="myaddrl" @click.stop>
        <div class="add-header">{{add_header_text}}
          <span @click.stop="close">X</span>
        </div>
        <div class="selnorm">
          <div class="normright">
            <div style="width:350px;margin:20px auto 0;font-size:18px;height:40px;line-height:40px">
              <span>类型：</span>
              <el-select @change='get_card_park(card_editor_new)' :disabled="card_kind_no" v-model="card_editor_new" placeholder="请选择月卡类型" style="width:250px" clearable>
                <el-option
                  v-for="item in card_kind_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div style="width:350px;margin:20px auto 0;font-size:18px;height:40px;line-height:40px">
              <span>月数：</span>
              <el-input-number disabled v-model="monthNum" :step="1" style="width:250px"></el-input-number>
            </div>
            <div style="width:350px;margin:20px auto 0;font-size:18px;height:40px;line-height:40px">
              <span>售价：</span>
              <el-input-number v-model="card_sel_editor.money" :step="1" style="width:250px"></el-input-number>
            </div>
            <div style="width:350px;margin:20px auto 0;font-size:18px;height:40px;line-height:40px">
              <span>备注：</span>
              <el-input style="width:250px" type="text" v-model="card_sel_editor.info" clearable></el-input>
            </div>
          </div>
        </div>
        <div class="selpark">
          <div class="parkright">
            <el-transfer
              filterable
              :filter-method="filterMethod"
              :titles="['停车场列表', '已选择停车场列表']"
              filter-placeholder="请输入停车场名字"
              v-model="park_sel"
              :data="parklists">
            </el-transfer>
            <el-button style="margin-top:15px;margin-left:33%" type="warning" @click="reset">重置</el-button>
            <el-button style="margin-top:15px;margin-left:15%" type="primary" @click.stop="confirm">确认</el-button>
          </div>
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
      loading:false,   //加载中
      list_num: 58046,
      sel_num: 58046,
      add_header_text:'',
      consumptions: ['APP','微信小程序'],
      user_kind:'',
      list_detail: [],
      card_kind:'',
      card_kind_list:[],
      card_sel_editor:{},
      card_sel_reset:{},
      multipleSelection:[],
      normname:'',
      parklists:[],
      park_sel: [],
      park_sel_reset:[],
      pageIndex: 1,
      ps:10,
      total_ps:40,
      allps:1,
      sel_user: '18318039639',
      sel_user_car_list:[],
      addshow:false,
      url:'/its/month-card/cards',
      url_cardkind:'/its/card-type/types',
      url_park:'/its/operations/query/berth',
      url_card_park:'/its/month-card/cards',
      url_card_park_all:'/its/month-card/parkInfo',
      params:{},
      card_editor_new:'',
      card_editor_new_id:'',
      method_kind:'',
      monthNum:'',
      card_kind_no: false
    }
  },
  mounted() {
    this.get_rule_list()
  },
  methods: {
    //获取后台月卡配置
    get_rule_list(){
      this.loading = true
      axios.get(this.url,{
        params:{
          pageNum: this.pageIndex,
          pageSize: this.ps
        }
      }).then(res => {
        this.list_detail = res.data.data.list
        this.total_ps = res.data.data.total
        this.list_detail.forEach(item => {
          item.money = (item.money/100).toFixed(2)
        })
        this.loading = false
      })
    },
    //获取月卡类型列表
    get_card_kind_all(){
      axios.get(this.url_cardkind,{
        params:{}
      }).then(res => {
        if(res.data.data.length > 0){
          this.card_kind_list = res.data.data
        }else{
          let text = '您还没有配置月卡类型'
          this.show_warning(text)
        }
      })
    },
     //获取停车场列表
    get_park_list(){
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
    //获取月卡类型名下的停车场
    get_card_park(ele){
      let mydata = this.card_kind_list.filter(item => {
        return item.id == ele
      })
      this.monthNum = mydata[0].monthNum
      this.card_editor_new_id = ele
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
        axios.get(this.url_card_park_all,{
          params:{
            typeId: ele
          }
        }).then(res => {
          if(res.data.data.length > 0){
            let data = res.data.data.map(item => {
              return item.parkNo
            })
            this.parklists = this.parklists.filter(item => {
              return data.indexOf(item.key) != -1
            })
          }
        })
      })
    },
    filterMethod(query, item) {
      return item.name.indexOf(query) > -1;
    },
    //表格选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //删除选择月卡
    sel_del(){
      let data = this.multipleSelection.map(item => {
        return item.id
      })
      let params = data
      let textone = '此操作将所选择的月卡配置删除, 是否继续?'
      let texttwo = '月卡配置删除成功！'
      let textthree = '月卡配置删除失败！'
      let url = this.url + '/del'
      this.show_delete_warning(textone,texttwo,textthree,url,params)
    },
    //新建月卡配置
    add_car(){
      this.addshow = true
      this.card_kind_no = false
      this.add_header_text = '新建月卡配置'
      this.text_one = '添加月卡配置成功！'
      this.text_two = '添加月卡配置失败！'
      this.get_card_kind_all()
      this.get_park_list()
    },
    confirm(){
      console.log()
      if(this.card_sel_editor.money && this.card_sel_editor.info && this.card_editor_new && this.park_sel.length){
        this.params.typeId = this.card_editor_new_id
        this.params.id = this.card_sel_editor.id
        this.params.monthNum = this.monthNum
        this.params.money = this.card_sel_editor.money * 100
        this.params.info = this.card_sel_editor.info
        this.params.parkNos = this.park_sel
        this.params = JSON.stringify(this.params)
        console.log(this.params)
        axios({
          method: 'post',
          url: this.url,
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          },
          data:this.params
        }).then(res => {
          if(res.data.success){
            this.$notify({
              title: '温馨提示',
              message: this.text_one,
              type: 'success',
              offset: 100
            })
            this.close()
            this.get_rule_list()
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
    reset(){
      this.card_sel_editor = JSON.parse(JSON.stringify(this.card_sel_reset))
      this.park_sel = JSON.parse(JSON.stringify(this.park_sel_reset))
    },
    //表格内编辑
    list_edit(item){
      this.card_kind_no = true
      this.addshow = true
      this.add_header_text = '编辑月卡配置'
      this.text_one = '修改月卡配置成功！'
      this.text_two = '修改月卡配置失败！'
      this.card_editor_new_id = item.typeId
      this.card_sel_editor = item
      this.card_editor_new = item.typeName
      this.monthNum = item.monthNum
      this.card_sel_reset = JSON.parse(JSON.stringify(item))
      this.get_park_list()
      axios.get(this.url + '/' + item.id + '/' + item.typeId,{
        params:{
          cardId: item.id,
          typeId: item.typeId
        }
      }).then(res => {
        let data = res.data.data.alreadyHandle
        this.park_sel = data.map(item => {
          return item.parkNo
        })
      })
    },
    //表格内删除
    list_del(item){
      let params = [item.id]
      let textone = '此操作将所选择的月卡配置删除, 是否继续?'
      let texttwo = '月卡配置删除成功！'
      let textthree = '月卡配置删除失败！'
      let url = this.url + '/del'
      this.show_delete_warning(textone,texttwo,textthree,url,params)
    },
    //分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    close(){
      this.addshow = false
      this.card_sel_editor = {}
      this.card_sel_reset = {}
      this.park_sel = []
      this.park_sel_reset = []
      this.params = {}
      this.card_editor_new = ''
      this.monthNum = ''
      this.get_rule_list()
    },
    //搜索
    sel_uesr(){
      let params = {
        pageNum: this.pageIndex,
        pageSize: this.ps,

      }
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
}
.selstate,.selplace,.selparkkind,.selconsumption{
  width: 110px;
  height: 40px;
  margin: 10px 0 0 20px;
  border-radius: 5px;
  float: left;
}
.data-interval{
  width: 320px;
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
  width: 240px;
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
  /* width: 580px; */
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
.myaddrl{
  width: 1000px;
  height: 740px;
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
  width: 80%;
}
.selnorm{
  height: 240px;
  margin: 10px auto 0;
}
.selpark{
  height: 400px;
  margin: 40px auto 0;
}
.normright,.parkright{
  width: 100%;
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
</style>
