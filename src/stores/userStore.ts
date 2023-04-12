import { notify } from '@kyvg/vue3-notification'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    // set initial state from local storage if available
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  }),
  actions: {
    // save user data to state variable and local storage
    login(username: string, password: string) {
      // check if username and password are correct
      if (username !== 'admin' || password !== 'admin') {
        return
      } else {
        this.user = username
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
    }
  }
})
