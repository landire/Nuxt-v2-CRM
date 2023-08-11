import cookie from 'cookie'
import Cookies from 'js-cookie'
import { UserLogin, UserSelectId } from '~/apollo/query/User'
import jwt from 'jsonwebtoken'

export const state = () => ({
  token: null,
  userData: {},
  userId: '',
  decodedToken: null,
  permissionList: [],
  roleList: []
})

export const mutations = {
  SET_ROLELIST(state, data) {
    state.roleList = data
  },
  SET_PERMISSIONLIST(state, data) {
    state.permissionList = data
  },
  SET_TOKEN(state, data) {
    state.token = data
  },
  SET_USERDATA(state, data) {
    state.userData = data
  },
  SET_USERID(state, data) {
    state.userId = data
  },
  SET_DECODED_TOKEN(state, data) {
    state.decodedToken = data
  },
  NULIFIER_TOKEN(state, data) {
    Cookies.remove('token')
  }
}

export const actions = {
  async nuxtServerInit(store, context) {
    const client = this.app.apolloProvider.defaultClient
    let headerCookie = context.req.headers.cookie
    if (typeof headerCookie !== 'string') {
      headerCookie = ''
    }
    let { token } = cookie.parse(headerCookie)
    store.commit('SET_TOKEN', token)
    let decodedToken = jwt.decode(token)
    if (decodedToken && decodedToken.id && decodedToken.exp > Date.parse(new Date()) / 1000) {
      // console.log(decodedToken)
      // console.log(token)
      store.commit('SET_ROLELIST', decodedToken.roleList)
      store.commit('SET_PERMISSIONLIST', decodedToken.permissionList)
      store.commit('SET_USERID', decodedToken.id)
      store.commit('SET_DECODED_TOKEN', decodedToken)
      const { data: val } = await client.mutate({
        mutation: UserSelectId,
        variables: {
          userIdList: [decodedToken.id],
          param: {
            id: true, name: true, email: true, avatar: true
          }
        }
      })
      if (val.User_SelectFromUserId.res && val.User_SelectFromUserId.res[0]) {
        store.commit('SET_USERDATA', val.User_SelectFromUserId.res[0])
      }
    } else {
      store.commit('SET_USERID', '')
      store.commit('SET_ROLELIST', [])
      store.commit('SET_PERMISSIONLIST', [])
      store.commit('SET_TOKEN', null)
      store.commit('SET_DECODED_TOKEN', null)
      store.commit('NULIFIER_TOKEN')
    }
  },

  async login({ commit, dispatch }, data) {
    const client = this.app.apolloProvider.defaultClient
    const { data: val } = await client.mutate({
      mutation: UserLogin,
      variables: data
    })
    const token = val.User_LoginEmail.res ? val.User_LoginEmail.res.JWT.token : console.log(val.User_LoginEmail.err)
    commit('SET_USERDATA', val.User_LoginEmail.res)
    Cookies.set('token', token)
    commit('SET_TOKEN', token)
    commit('SET_USERID', val.User_LoginEmail.res.id)
    let decodedToken = jwt.decode(token)
    if (decodedToken) {
      commit('SET_ROLELIST', decodedToken.roleList)
      commit('SET_PERMISSIONLIST', decodedToken.permissionList)
    }
    commit('SET_DECODED_TOKEN', decodedToken)
    // console.log(token)
  },

  async logout({ commit }) {
    Cookies.remove('token')
    commit('SET_TOKEN', null)
    commit('SET_USERDATA', null)
    commit('SET_USERID', null)
    commit('SET_DECODED_TOKEN', null)
    commit('SET_ROLELIST', [])
    commit('SET_PERMISSIONLIST', [])
  },

  setTokenManually: (context, payload) => {
    Cookies.set('token', payload.JWT.token)
    context.commit('SET_TOKEN', payload.JWT.token)
    context.commit('SET_USERDATA', payload)
    context.commit('SET_USERID', payload.id)
    let decodedToken = jwt.decode(payload.JWT.token)
    context.commit('SET_DECODED_TOKEN', decodedToken)
    // console.log(decodedToken)
  },

  tokenSubscription: (context, payload) => {
    Cookies.set('token', payload)
    context.commit('SET_TOKEN', payload)
    let decodedToken = jwt.decode(payload)
    if (decodedToken) {
      context.commit('SET_ROLELIST', decodedToken.roleList)
      context.commit('SET_PERMISSIONLIST', decodedToken.permissionList)
    }
    context.commit('SET_DECODED_TOKEN', decodedToken)
    // console.log(decodedToken)
  },

  setUserData: (context, payload) => {
    context.commit('SET_USERDATA', payload)
  }
}

export const getters = {
  token: state => state.token,
  userData: state => state.userData,
  userId: state => state.userId,
  decodedToken: state => state.decodedToken,
  roleList: state => state.roleList,
  permissionList: state => state.permissionList,
  hasToken: state => !!state.token
}