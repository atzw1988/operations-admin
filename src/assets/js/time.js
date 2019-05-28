export default{
  install(Vue, options) {
    Vue.prototype.formatDate = function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
    },
    Vue.prototype.get_nowtime = function (value) {
      let data = new Date()
      let year = data.getFullYear();
      let month = data.getMonth() + 1 < 10 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1;
      let date = data.getDate() < 10 ? "0" + data.getDate() : data.getDate();
      let hh = data.getHours() < 10 ? "0" + data.getHours() : data.getHours();
      let mm = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
      let ss = data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
      this.nowday = year + '-' + month + '-' + date;
      this.nowtime = hh + '时' + mm + '分' + ss + '秒导出';
    }
  }
}
