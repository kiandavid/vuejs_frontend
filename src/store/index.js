import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    auth: false
  },

  getters: {
  },

  // manipuliert den State
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_AUTH(state, auth) {
      state.auth = auth;
    }
  },

  // rufen Mutations auf
  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user);
    },
    setAuth({ commit }, auth) {
      commit('SET_AUTH', auth);
    }
  },

  modules: {
  }
})
