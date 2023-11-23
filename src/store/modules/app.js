import { $themeBreakpoints } from '@themeConfig'
import Resource from '@/api/resource'

export default {
  namespaced: true,
  state: {
    windowWidth: 0,
    shallShowOverlay: false,
    baseServerUrl: process.env.VUE_APP_MIX_BASE_SERVER_URL,
    params: {
      countries: [],
      selected_country: {},
    },
  },
  getters: {
    currentBreakPoint: state => {
      const { windowWidth } = state
      if (windowWidth >= $themeBreakpoints.xl) return 'xl'
      if (windowWidth >= $themeBreakpoints.lg) return 'lg'
      if (windowWidth >= $themeBreakpoints.md) return 'md'
      if (windowWidth >= $themeBreakpoints.sm) return 'sm'
      return 'xs'
    },
  },
  mutations: {
    UPDATE_WINDOW_WIDTH(state, val) {
      state.windowWidth = val
    },
    TOGGLE_OVERLAY(state, val) {
      state.shallShowOverlay = val !== undefined ? val : !state.shallShowOverlay
    },
    SET_NECESSARY_PARAMS(state, params) {
      state.params = params
    },
  },
  actions: {
    fetchNecessaryParams({ commit }) {
      const fetchParamsResource = new Resource('fetch-necessary-params')
      fetchParamsResource.list()
        .then(response => {
          commit('SET_NECESSARY_PARAMS', response)
        })
        .catch(error => {
          console.log(error)
        })
    },
  },
}
