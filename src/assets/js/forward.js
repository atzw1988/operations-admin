import axios from 'axios';
export default {
  install(Vue, options) {
    Vue.prototype.get_list = function (params,url) {
      axios({
        method:'post',
        url: url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:params
      }).then(res => {
        console.log(res)
        if (res.data.mesg == "暂无数据"){
          this.$notify({
            title: '温馨提示',
            message: '暂无符合搜索条件的数据',
            type: 'warning',
            offset: 100
          })
        }else{
          this.selmoney = res.data.data.data[0].screenMoney
          this.sel_num = res.data.data.tr
          this.allps = res.data.data.tp
          this.list_detail = res.data.data.data
          this.list_detail.map(element => {
            if (element.parkstart_time){
              element.parkstart_time = this.formatDate(element.parkstart_time)
              element.parkend_time = this.formatDate(element.parkend_time)
            } else if (element.pay_date){
              element.pay_date = this.formatDate(element.pay_date)
            }
          });
          this.list_detail.forEach((val) => {
            if (val.charge_money) {
              this.ps_total += val.charge_money
            } else if (val.jin_e) {
              this.ps_total += (val.jin_e * 1)
            }
          })
        }
      })
    },
    Vue.prototype.get_all_list = function (params, url) {
      axios({
        method: 'post',
        url: url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        console.log(res)
        if (res.data.mesg == "暂无数据") {
          this.$notify({
            title: '温馨提示',
            message: '暂无符合搜索条件的数据',
            type: 'warning',
            offset: 100
          })
        } else {
          this.allmoney = res.data.data.data[0].totalMoney.toFixed(2)
          this.selmoney = res.data.data.data[0].screenMoney.toFixed(2)
          this.list_num = res.data.data.tr
          this.sel_num = res.data.data.tr
          this.allps = res.data.data.tp
          this.list_detail = res.data.data.data
          this.list_detail.map(element => {
            if (element.parkstart_time) {
              element.parkstart_time = this.formatDate(element.parkstart_time)
              element.parkend_time = this.formatDate(element.parkend_time)
            } else if (element.pay_date) {
              element.pay_date = this.formatDate(element.pay_date)
            }
          });
          // this.list_detail.forEach((val) => {
          //   if (val.charge_money) {
          //     this.ps_total += val.charge_money
          //   } else if (val.jin_e) {
          //     this.ps_total += (val.jin_e * 1)
          //   }
          // })
        }
      })
    },
    Vue.prototype.get_report_list = function (params, url) {
      axios({
        method: 'post',
        url: url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        if (res.data.mesg == "暂无数据") {
          this.$notify({
            title: '温馨提示',
            message: '暂无符合搜索条件的数据',
            type: 'warning',
            offset: 100
          })
        } else {
          this.list_num = res.data.data.tr
          this.allps = res.data.data.tp
          this.list_detail = res.data.data.data
          this.list_detail.map(element => {
            if (element.parkstart_time) {
              element.parkstart_time = this.formatDate(element.parkstart_time)
            } else if (element.pay_date) {
              element.pay_date = this.formatDate(element.pay_date)
            }
          });
          this.list_detail.forEach((val) => {
            if (val.charge_money) {
              this.ps_total += val.charge_money
            } else if (val.jin_e) {
              this.ps_total += (val.jin_e * 1)
            }
          })
        }
      })
    },
    Vue.prototype.get_all_user_list = function (params, url) {
      axios({
        method: 'post',
        url: url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        console.log(res)
        if (res.data.mesg == "暂无数据") {
          this.$notify({
            title: '温馨提示',
            message: '暂无符合搜索条件的数据',
            type: 'warning',
            offset: 100
          })
        } else {
          this.list_num = res.data.data.tr
          this.sel_num = res.data.data.tr
          this.list_detail = res.data.data.data
          this.allps = res.data.data.tp
          this.loading = false
        }
      })
    },
    Vue.prototype.get_user_list = function (params, url) {
      axios({
        method: 'post',
        url: url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        console.log(res)
        if (res.data.mesg == "暂无数据") {
          this.$notify({
            title: '温馨提示',
            message: '暂无符合搜索条件的数据',
            type: 'warning',
            offset: 100
          })
        } else {
          // this.list_num = res.data.data.tr
          this.sel_num = res.data.data.tr
          this.list_detail = res.data.data.data
          this.allps = res.data.data.tp
        }
      })
    },
    Vue.prototype.get_time_interval = function (num) {
      let end = new Date()
      let start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * num)
      let year_end = end.getFullYear();
      let month_end = end.getMonth() + 1 < 10 ? "0" + (end.getMonth() + 1) : data.getMonth() + 1;
      let date_end = end.getDate() < 10 ? "0" + end.getDate() : end.getDate();
      let year_start = start.getFullYear();
      let month_start = start.getMonth() + 1 < 10 ? "0" + (start.getMonth() + 1) : data.getMonth() + 1;
      let date_start = start.getDate() < 10 ? "0" + start.getDate() : start.getDate();
      this.time_interval = [year_start + month_start + date_start, year_end + month_end + date_end]
    },
    Vue.prototype.get_report_list = function (params, url) {
      axios({
        method: 'post',
        url: url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        console.log(res)
        if (res.data.mesg == "暂无数据") {
          this.$notify({
            title: '温馨提示',
            message: '暂无符合搜索条件的数据',
            type: 'warning',
            offset: 100
          })
        } else {
          this.list_num = res.data.data.tr
          this.list_detail = res.data.data.data
          this.allps = res.data.data.tp
          this.list_detail.forEach((params) => {
            if (params.Total_amount) {
              this.total += params.Total_amount
            }
            if (params.stay_amount) {
              this.nototal += params.stay_amount
            }
          })
        }
      })
    },
    Vue.prototype.export_report_list = function (params, url) {
      axios({
        method: 'post',
        url: url,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: params
      }).then(res => {
        if (res.data.mesg == "暂无数据") {
          this.$notify({
            title: '温馨提示',
            message: '暂无符合搜索条件的数据',
            type: 'warning',
            offset: 100
          })
        } else {
          this.export_list = res.data.data.data
        }
      })
    },
    Vue.prototype.show_warning = function (text) {
      this.$notify({
        title: '温馨提示',
        message: text,
        type: 'warning',
        offset: 100
      })
    },
    Vue.prototype.show_delete_warning = function (textone,texttwo,textthree,url,params) {
      this.$confirm(textone, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        params = JSON.stringify(params)
        console.log(params)
        axios({
          method: 'post',
          url: url,
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          },
          data: params
        }).then(res => {
          console.log(res)
          if (res.data.success) {
            this.$notify({
              title: '温馨提示',
              message: texttwo,
              type: 'success',
              offset: 100
            })
            this.get_rule_list()
          }else{
            this.$notify.error({
              title: '温馨提示',
              message: textthree,
              offset: 100
            })
          }
        })
      }).catch(() => {
        this.$notify({
          title: '温馨提示',
          message: '已取消操作!',
          type: 'info',
          offset: 100
        })
      })
    }
  }
}
