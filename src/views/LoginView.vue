<template>
  <main>
    <section>
      <h1>Admin Login</h1>
      <p>Enter your name and password (admin / admin)</p>
    </section>
    <section>
      <form @submit.prevent="login">
        <input type="text" v-model="username" placeholder="Name" required />
        <input type="text" v-model="password" placeholder="Password" required />
        <button :disabled="btnDisabled" class="btn primary" type="submit">Login</button>
      </form>
    </section>
    <section>
      <p>Back to <RouterLink to="/">home</RouterLink></p>
    </section>
  </main>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'

const userStore = useUserStore()

export default {
  data() {
    return {
      username: '',
      password: '',
      user: '',
      btnDisabled: true
    }
  },
  watch: {
    username() {
      this.checkInput()
    },
    password() {
      this.checkInput()
    }
  },
  methods: {
    // check if input is not empty and enable/disable button accordingly
    checkInput() {
      if (this.username.length > 0 && this.password.length > 0) {
        this.btnDisabled = false
      } else {
        this.btnDisabled = true
      }
    },
    login() {
      if (this.username !== 'admin' || this.password !== 'admin') {
        notify({
          type: 'error',
          title: 'Error!',
          text: 'Wrong username or password!'
        })
        return
      }

      // save user data in local storage and store and set user
      localStorage.setItem('username', this.username)

      userStore.login(this.username, this.password)
      this.username = ''
      this.password = ''
      this.user = userStore.user

      // redirect to home
      location.href = '/'
    }
  }
}
</script>
