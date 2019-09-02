import Home from './components/Home'
import Parks from './components/Parks'
import Admin from './components/Admin'
import About from './components/about/About'
import Login from './components/Login'
import Register from './components/Register'
import Analyze from './components/Analyze'
import Operations from './components/Operations'
import Setting from './components/Setting.vue'

// 二级路由
import Contact from './components/about/Contact'
import Delivery from './components/about/Delivery'
import History from './components/about/History'
import OrderingGuide from './components/about/OrderingGuide'
import Adduser from './components/setting/Adduser.vue'
import Possword from './components/setting/Possword.vue'
import Userlog from './components/setting/Userlog.vue'
import Username from './components/setting/Username.vue'
import Alluser from './components/setting/Alluser.vue'

// 三级路由
import Phone from './components/about/contact/Phone';
import PersonName from './components/about/contact/PersonName';
import Summary from './components/about/report/Summary.vue'
import Financial from './components/about/report/Financial.vue'
import Statistical from './components/about/report/Statistical.vue'
import Users from './components/about/report/Users.vue';
import Operating from './components/about/report/Operating.vue';
import Order from './components/about/report/Order.vue';
import Recharge from './components/about/report/Recharge.vue';
import Parkorder from './components/about/order/Parkorder.vue'
import Pdaorder from './components/about/order/Pdaorder.vue'
import Performance from './components/about/order/Performance.vue'
import Rechargeorder from './components/about/order/Rechargeorder.vue';
import Userslist from './components/about/users/Userslist.vue';
import Userblacklist from './components/about/users/Userblacklist.vue';
import Carwhitelist from './components/about/users/Carwhitelist.vue';
import Owequery from './components/about/users/Owequery.vue'
import Chargingrules from './components/about/configuration/Chargingrules.vue';
import Garagemana from './components/about/configuration/Garagemana.vue';
import Parkmana from './components/about/configuration/Parkmana.vue';
import Userpreferen from './components/about/preferential/Userpreferen.vue'
import Addpreferen from './components/about/preferential/Addpreferen.vue'
import Setpreferen from './components/about/preferential/Setpreferen.vue'
import Numpreferen from './components/about/preferential/Numpreferen.vue'

//四级路由
import Rules from './components/about/configuration/chargingrules/Rules.vue';
import Standard from './components/about/configuration/chargingrules/Standard.vue';
import Environmental from './components/about/configuration/chargingrules/Environmental.vue'




import VueRouter from 'vue-router';


export const routes = [
  {
    path: '/',
    name: "loginLink",
    components: {
    default: Login
  }},
  { path: '/parks', name: 'parksLink', component: Parks},
  {path: '/operations',name: 'operationsLink',component: Operations
  },
  {
    path: '/admin',
    name: 'adminLink',
    component: Admin,
    redirect: '/history',
    children: [{
        path: '/contact',
        name: "contactLink",
        component: Contact,

      },
      {
        path: '/history',
        name: "historyLink",
        component: History
      },
      {
        path: '/delivery',
        name: "deliveryLink",
        component: Delivery
      },
      {
        path: '/orderingGuide',
        name: "orderingGuideLink",
        component: OrderingGuide
      },
    ]
  },
  {
    path:'/about',
    name:'aboutLink',
    component:About,
    redirect: '/about/summary',
    children: [
      {
        path: '/about/summary',
        name: 'summaryLink',
        component: Summary
      },
      {
        path: '/about/financial',
        name: 'financialLink',
        component: Financial
      },
      {
        path: '/about/statistical',
        name: 'statisticalLink',
        component: Statistical
      },
      {
        path: '/about/users',
        name: 'usersLink',
        component: Users
      },
      {
        path: '/about/operating',
        name: 'operatingLink',
        component: Operating
      },
      {
        path: '/about/order',
        name: 'orderLink',
        component: Order
      },
      {
        path: '/about/recharge',
        name: 'rechargeLink',
        component: Recharge
      },
      {
        path: '/about/parkorder',
        name: 'parkorderLink',
        component: Parkorder
      },
      {
        path: '/about/pdaorder',
        name: 'pdaorderLink',
        component: Pdaorder
      },
      {
        path: '/about/performance',
        name: 'performanceLink',
        component: Performance
      },
      {
        path: '/about/rechargeorder',
        name: 'rechargeorderLink',
        component: Rechargeorder
      },
      {
        path: '/about/userslist',
        name: 'userslistLink',
        component: Userslist
      },
      {
        path: '/about/userblacklist',
        name: 'userblacklistLink',
        component: Userblacklist
      },
      {
        path: '/about/carwhitelist',
        name: 'carwhitelistLink',
        component: Carwhitelist
      },
      {
        path: '/about/owequery',
        name: 'owequeryLink',
        component: Owequery
      },
      {
        path: '/about/chargingrules',
        name: 'chargingrulesLink',
        component: Chargingrules,
        redirect:'/about/rules',
        children:[
          {
            path: '/about/rules',
            name: 'rulesLink',
            component: Rules
          },
          {
            path: '/about/standard',
            name: 'standardLink',
            component: Standard
          },
          {
            path: '/about/environmental',
            name: 'environmentalLink',
            component: Environmental
          }
        ]
      },
      {
        path: '/about/userpreferen',
        name: 'userpreferenLink',
        component: Userpreferen
      },
      {
        path: '/about/addpreferen',
        name: 'addpreferenLink',
        component: Addpreferen
      },
      {
        path: '/about/setpreferen',
        name: 'setpreferenLink',
        component: Setpreferen
      },
      {
        path: '/about/numpreferen',
        name: 'numpreferenLink',
        component: Numpreferen
      },
      {
        path: '/about/garagemana',
        name: 'garagemanaLink',
        component: Garagemana
      },
      {
        path: '/about/parkmana',
        name: 'parkmanaLink',
        component: Parkmana
      },
    ]
  },
  {
    path: '/home',
    name: 'homeLink',
    component: Home
  },
  {path:'/register',name:'registerLink',component:Register},
  { path: '/analyze', name: 'analyzeLink', component: Analyze},
  {
    path: '/setting',
    name: 'settingLink',
    component: Setting,
    redirect: '/setting/password',
    children: [
      {
        path: '/setting/password',
        name: 'passwordLink',
        component: Possword
      },
      {
        path: '/setting/adduser',
        name: 'adduserLink',
        component: Adduser
      },
      {
        path: '/setting/userlog',
        name: 'userlogLink',
        component: Userlog
      },
      {
        path: '/setting/username',
        name: 'usernameLink',
        component: Username
      },
      {
        path: '/setting/alluser',
        name: 'alluserLink',
        component: Alluser
      }
    ]
  },
  {
    path: '*',
    component: Home
  }
]




