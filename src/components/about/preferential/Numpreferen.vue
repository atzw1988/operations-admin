<template>
  <div id="row"  @click.stop="hidden_input">
    <div class="select">
      <div class="data-interval">
        <div class="username">
          <span style="float:left">停车场:</span>
          <el-input style="width:150px;float:left"
            placeholder="输入停车场名称"
            v-model="park_name"
            clearable>
          </el-input>
        </div>
        <el-button class="selbtn" type="primary" @click="sel_uesr">搜索</el-button>
      </div>
    </div>
    <div class="detail">
      <el-table
        class="tb-edit"
        :data="list_detail"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index">
        </el-table-column>
        <el-table-column
          prop="parkName"
          label="停车场">
        </el-table-column>
        <el-table-column
          prop="parkNum"
          sortable
          label="总车位数">
        </el-table-column>
        <el-table-column
          sortable
          label="开放月卡名额">
          <template slot-scope="scope">
              <el-input v-if="scope.row.edit" size="small" v-model="scope.row.cardNum" placeholder="请输入名额" @change="handleEdit(scope.$index, scope.row)"></el-input>
              <span class="num_text" v-if="!scope.row.edit" @click.stop="change_input(scope.$index,scope.row)">{{scope.row.cardNum}}<i v-if="!scope.row.edit" class="el-icon-edit"></i></span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          label="剩余月卡名额">
          <template slot-scope="scope">
            <span>{{scope.row.cardNum - scope.row.alreadyNum}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间">
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
      list_detail: [],
      park_name:'',
      reset_text:'',
      pageIndex: 1,
      ps:10,
      total_ps:40,
      allps:1,
      url:'/its/card-places/places'
    }
  },
  beforeMount() {
    this.get_park_list()
  },
  mounted() {
  },
  methods: {
    //封装获取月卡名额配置列表
    get_all_list(ele){
      axios.get(this.url,{
        params:ele
      }).then(res => {
        if(res.data.data.list.length > 0){
          let data = res.data.data.list
          this.total_ps = res.data.data.total
          data.forEach(item => {
            item.edit = false
          })
          this.list_detail = data
        }else{
          let text = '暂无数据'
          this.show_warning(text)
        }
      })
    },
    //获取月卡名额配置列表
    get_park_list(){
      let params = {
        pageNum:this.pageIndex,
        pageSize:this.ps
      }
      this.get_all_list(params)
    },
    change_input(index,row){
      this.reset_text = JSON.parse(JSON.stringify(row.cardNum))
      this.list_detail.forEach(item => {
        item.edit = false
      })
      this.list_detail[index].edit = true
    },
    hidden_input(){
      if(event.target.className !== 'el-input__inner'){
        this.list_detail.forEach(item => {
          item.edit = false
        })
      }
    },
    //表格编辑开放月卡名额
    handleEdit(index, row) {
      console.log(index, row);
      this.$confirm('此操作将所选择的停车场月卡名额修改为'+ row.cardNum +', 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let params = {
          cardNum:row.cardNum,
          parkingWeiyiNo:row.parkingWeiyiNo
        }
        params = JSON.stringify(params)
        axios({
          method: 'post',
          url: this.url,
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          },
          data:params
        }).then(res => {
          console.log(res)
          if(res.data.success){
            this.$notify({
              title: '温馨提示',
              message: '停车场月卡名额修改成功!',
              type: 'success',
              offset: 100
            })
            this.list_detail.forEach(item => {
              item.edit = false
            })
          }
        })
      }).catch(() => {
        this.list_detail[index].cardNum = JSON.parse(JSON.stringify(this.reset_text))
        this.list_detail.forEach(item => {
          item.edit = false
        })
        this.$notify({
          title: '温馨提示',
          message: '已取消操作!',
          type: 'info',
          offset: 100
        })
      })
    },
    //分页
    handleCurrentChange(val) {
      this.pageIndex = val
      let params = {
        pageNum:this.pageIndex,
        pageSize:this.ps
      }
      this.get_all_list(params)
    },
    //搜索
    sel_uesr(){
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
.select{
  width: 100%;
  height: 60px;
  background: #fff;
}
.data-interval{
  width: 1000px;
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
  padding: 0;
  height: 50px;
}
.detail>>>th{
  text-align: center;
  padding: 8px 0
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
.el-input{
  width: 80px;
}
.num_text{
  display: block;
  width: 100%;
  height: 100%;
}
</style>

