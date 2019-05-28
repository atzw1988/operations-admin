import Vue from 'vue'
import Vuex from 'vuex'

import menu from './module/menu';
import users from './module/users';
import status from './module/status';

Vue.use(Vuex)


export const store = new Vuex.Store({
  state:{
    currentUser:null,
    isLogin:false
  },
  getters:{
    currentUser: state => state.currentUser,
    isLogin: state => state.isLogin
  },
  mutations:{
    userStatus(state,user){
      if(user){
        state.currentUser = user
        state.isLogin = true
      }else{
        state.currentUser = null
        state.isLogin = false
      }
    }
  },
  actions:{
    setUser({commit},user){
      commit("userStatus",user)
    }
  }
})
