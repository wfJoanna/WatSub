import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'
import state from '@/store/state'
import actions from '@/store/actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions
})
