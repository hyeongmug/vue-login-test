import Vue from "vue"
import Vuex from "vuex"
import router from "./router"
import axios from "axios"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null,
    isLogin: false,
    isLoginError: false
  },
  mutations: {
    // 로그인이 성공했을 때,
    loginSuccess(state, payload) {
      state.isLogin = true
      state.isLoginError = false
      state.userInfo = payload
    },
    // 로그인이 실패했을 때
    loginError(state) {
      state.isLogin = false
      state.isLoginError = true
    },
    logout(state) {
      state.isLogin = false
      state.isLoginError = false
      state.userInfo = null
    }
  },
  actions: {
    // 로그인 시도
    login({ dispatch }, loginObj) {
      // 로그인 -> 토큰 반환
      axios
        .post("https://reqres.in/api/login", loginObj) // 파라메터(body)
        .then(res => {
          // 성공 시 token: 블라블라
          // 토큰을 헤더에 포함시켜서 유저 정보를 요청
          let token = res.data.token
          // 토큰을 로컬스토리지에 저장
          localStorage.setItem("assess_token", token)
          dispatch("getMemberInfo")
          // router.push({ name: "home" })
        })
        .catch(() => {
          alert("이메일과 비밀번호를 확인하세요.")
        })
    },
    logout({ commit }) {
      //  로그아웃 -> 토큰 삭제
      localStorage.removeItem("assess_token")
      commit("logout")
      router.push({ name: "home" })
    },
    getMemberInfo({ commit }) {
      // 로컬 스토리지에 저장되어 있는 토큰을 불러온다.
      let token = localStorage.getItem("assess_token")
      let config = {
        headers: {
          "access-token": token
        }
      }
      // 토큰 -> 멤버 정보를 반환
      // 새로 고침 -> 토큰만 가지고 멤버정보를 요청
      if (token) {
        axios
          .get("https://reqres.in/api/users/2", config)
          .then(response => {
            let userInfo = {
              id: response.data.data.id,
              first_name: response.data.data.first_name,
              last_name: response.data.data.last_name,
              avatar: response.data.data.avatar
            }
            commit("loginSuccess", userInfo)
          })
          .catch(() => {
            alert("이메일과 비밀번호를 확인하세요.")
          })
      }
    }
  }
})
