import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    auth: false,
    student: null,
    dozent: null,
    kurs: null,
    loesung: null
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
    },
    SET_STUDENT(state, student) {
      state.student = student;
    },
    SET_DOZENT(state, dozent) {
      state.dozent = dozent;
    },
    SET_KURS(state, kurs) {
      state.kurs = kurs;
    },
    SET_LOESUNG(state, loesung) {
      state.loesung = loesung;
    }
  },

  // rufen Mutations auf
  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user);
    },
    setAuth({ commit }, auth) {
      commit('SET_AUTH', auth);
    },
    setStudent({ commit }, student) {
      commit('SET_STUDENT', student);
    },
    setDozent({ commit }, dozent) {
      commit('SET_DOZENT', dozent);
    },
    setKurs({ commit }, kurs) {
      commit('SET_KURS', kurs);
    },
    setLoesung({ commit }, loesung) {
      commit('SET_LOESUNG', loesung);
    }
  },

  modules: {
  }
})
