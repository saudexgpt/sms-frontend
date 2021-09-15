/* eslint-disable no-shadow */
import {
  login, logout, register, getInfo,
} from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
// import store from '@/store'

const state = {
  id: null,
  token: getToken(),
  userData: {
    id: null,
    name: '',
    first_name: '',
    last_name: '',
    avatar: '',
    introduction: '',
    roles: [],
    permissions: [],
    p_status: '',
    notifications: [],
  },
}

const mutations = {
  SET_USER_DATA(state, objValue) {
    Object.assign(state.userData, objValue)
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
}

const actions = {
  // user login
  register(userInfo) {
    // const { name, email, password, c_password } = userInfo;
    return new Promise((resolve, reject) => {
      register(userInfo)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password })
        .then(response => {
          commit('SET_USER_DATA', response)
          commit('SET_TOKEN', response.tk)
          setToken(response.tk)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response
          if (!data) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('Verification failed, please Login again.')
          }
          const { roles } = data
          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('getInfo: roles must be a non-null array!')
          }
          // console.log(data)
          commit('SET_USER_DATA', data)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_USER_DATA', null)
          removeToken()
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
