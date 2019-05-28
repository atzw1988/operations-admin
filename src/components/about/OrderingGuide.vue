<template>
  <div class="row">
    <div class="region">
      <span class="regionText">区域</span>
      <select class="regionslt">
        <option value="">--请选择--</option>
        <option>嵊州市</option>
      </select>
    </div>
    <div class="select">
      <ul>
        <li>
          <input type="checkbox" checked>
          <label for="jack">正常车位</label>
        </li>
        <li>
          <input type="checkbox" checked>
          <label for="john">异常车位</label>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.region,.select{
  width: 80%;
  /* border: 1px solid black; */
  margin: 20px auto 0;
  height: 30px;
}
select{
  width: 80%;
  margin-left: 5%;
}
.select>ul>li{
  list-style: none;
}
.regionslt{
  width: 80%;
  height: 30px;
  border-radius: 5px;
}
</style>

