import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    // set initial state from local storage
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  }),
  actions: {
    // save user data to state variable and local storage
    login(username: string, password: string) {
      if (username !== 'admin' || password !== 'admin') {
        throw new Error('Invalid username or password')
      }

      this.user = username
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
    }
  }
})
