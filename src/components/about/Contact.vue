<template>
  <div id="row">
    <div id="app" class="tree">
      <treeselect v-model="value"  :options="options" placeholder="请输入搜索的内容"/>
    </div>
    <div class="detail">
      <ul>
        <li v-for="(psl,index) in personnels" :key="index">
          <span style="display:block">姓名：{{psl.name}}</span>
          <span style="display:block">状态：{{psl.status}}</span>
          <span style="display:block">PDA编号：{{psl.pda}}</span>
          <span style="display:block">所在停车场：{{psl.park}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  data() {
    return {
      value: null,
      options: [ {
        id: 'a',
        label: '绍兴市',
        children: [
          {
            id: 'aa',
            label: '嵊州市（应到3人，实到3人）',
            children: [
              {
                id: 'aaa',
                label: '无名路(龙盛路-双塔大桥)',
                children: [
                  {
                    id:'aaaa',
                    label: '李宝'
                  }
                ]
              },
              {
                id: 'aab',
                label: '长宁路（长广路-长泰中路）'
              },
              {
                id: 'aac',
                label: '龙盛路（嵊州大道-无名路）',
                children: [
                  {
                    id:'aaca',
                    label: '张炎'
                  }
                ]
              },
              {
                id: 'aad',
                label: '相公殿路(嵊州大道-官河横路)',
                children: [
                  {
                    id:'aada',
                    label: '赵军'
                  }
                ]
              },
              {
                id: 'aae',
                label: '长广路（东南路-长泰西路）'
              },
              {
                id: 'aaf',
                label: '经环西路（双塔大桥-达成路）'
              },
              {
                id: 'aag',
                label: '信杨路（一景路-环城南路）'
              },
              {
                id: 'aah',
                label: '商业城（北直街-官河路）'
              },
              {
                id: 'aai',
                label: '三江南街（剡兴路-四海路）'
              },
            ]
          },
          {
            id: 'ab',
            label: '新昌县（应到77人，实到77人）',
          },
          {
            id: 'ac',
            label: '诸暨市（应到77人，实到77人）',
          },
          {
            id: 'ad',
            label: '上虞区（应到77人，实到77人）',
          },
          {
            id: 'ae',
            label: '柯桥区（应到77人，实到77人）',
          },
          {
            id: 'af',
            label: '越城区（应到77人，实到77人）',
          }
        ],
      }],
      personnels:[
        {name:'张炎',pda:'76837',status:'在场',park:'龙盛路（嵊州大道-无名路）'},
        {name:'李宝',pda:'76838',status:'离场',park:'无名路(龙盛路-双塔大桥)'},
        {name:'赵军',pda:'76839',status:'下班',park:'相公殿路(嵊州大道-官河横路)'}
      ]
    }
  },
}
</script>
<style scoped>
  .tree{
    width: 90%;
    margin: 40px auto 0;
    color: #000;
  }
  .detail{
    width: 90%;
    margin: 40px auto 0;
  }
  .detail>ul>li{
    width: 100%;
    height: 150px;
  }
  .detail>ul>li>span{
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
</style>
