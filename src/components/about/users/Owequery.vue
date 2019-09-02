<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-27 10:14:19
 * @LastEditTime: 2019-09-02 18:50:56
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="row">
    <!-- <div class="total">
      <span style="margin-left:50px">欠费总额：<a href="javascript:void(0)">{{money}}</a>元</span>
    </div> -->
    <div class="select">
      <div class="data-interval">
        <div class="username">
          <el-input style="width:120px;float:left"
            placeholder="输入车牌号"
            v-model="query_car"
            clearable>
          </el-input>
        </div>
        <div class="username">
          <el-input style="width:130px;float:left"
            placeholder="输入手机号"
            v-model="phone_num"
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
          label="序号"
          type="index">
        </el-table-column>
        <el-table-column
          prop="carnumber"
          label="车牌">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号">
        </el-table-column>
        <!-- <el-table-column
          prop="lastmoney"
          label="消费金额">
        </el-table-column> -->
        <el-table-column
          prop="balance"
          label="欠费金额">
        </el-table-column>
        <el-table-column
          prop="lastbuytime"
          label="最后一次停车时间">
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
  </div>
</template>
<script>
import $ from 'jquery';
import axios from 'axios';
export default {
  data() {
    return {
      phone_num:'',
      list_detail: [],
      query_car:'',
      pageIndex: 1,
      ps:20,
      total_ps:0,
      money: 0,
      url:'/its/operations/oweThe/query',
      url_money: '/its/operations/countOwe/money'
    }
  },
  mounted() {
    this.get_all_money()
    this.get_rule_list()
  },
  methods: {
    //获取欠费总额
    get_all_money(){
      axios({
        method: 'post',
        url: this.url_money,
        headers: {
          'content-type':'application/x-www-form-urlencoded'
        },
        data: {}
      }).then(res => {
        console.log(res)
        this.money = -res.data.data
      })
    },
    //封装获取白名单列表
    get_query_list(params,url){
      axios({
        method: 'post',
        url: url,
        header:{
          'content-type':'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        this.list_detail = res.data.data.data
        this.total_ps = res.data.data.tr
      })
    },
    get_rule_list(){
      let params = new URLSearchParams();
      params.append('pageIndex', this.pageIndex);
      params.append('ps', this.ps);
      this.get_query_list(params,this.url)
    },
    //分页
    handleCurrentChange(val) {
      this.pageIndex = val
      let params = new URLSearchParams()
      params.append('pageIndex', this.pageIndex)
      params.append('ps', this.ps)
      params.append('carNo',this.query_car)
      params.append('mobile',this.phone_num)
      this.get_query_list(params,this.url)
    },
    //搜索
    sel_uesr(){
      let params = new URLSearchParams()
      params.append('pageIndex', this.pageIndex)
      params.append('ps', this.ps)
      params.append('carNo',this.query_car)
      params.append('mobile',this.phone_num)
      axios({
        method: 'post',
        url: this.url,
        header:{
          'content-type':'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        console.log(res)
        if(res.data.code == 0){
          if(res.data.data.tr){
            this.list_detail = res.data.data.data
            this.total_ps = res.data.data.tr
          }else{
            this.list_detail = res.data.data
            this.total_ps = res.data.data.length
          }
        }else{
          this.$notify({
            title: '温馨提示',
            message: res.data.mesg,
            type: 'warning',
            offset: 100
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
  color: #000;
  position: relative;
  background-color: #f5f5f5 !important;
}
.total{
  width: 100%;
  height: 50px;
  background: #fff;
  margin-bottom: 20px;
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
  /* margin-top: 20px; */
}
.selstate,.selplace,.selparkkind,.selconsumption{
  width: 110px;
  height: 40px;
  margin: 10px 0 0 20px;
  border-radius: 5px;
  float: left;
}
.data-interval{
  /* width: 800px; */
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
.orderno{
  width: 200px;
  height: 40px;
  float: left;
  margin-left: 10px;
}
.username{
  width: 120px;
  height: 40px;
  float: left;
  margin-left: 10px;
  /* border: 1px solid violet; */
}
.username>input,.orderno>input{
  width: 100px;
  height: 35px;
  border-radius: 5px;
}
.selbtn{
  float: left;
  margin-left: 20px;
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

</style>
