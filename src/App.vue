<template>
  <div class="top-nav">
    <span v-if="!user">
      <RouterLink to="/login" class="login">Login</RouterLink>
    </span>
    <span v-else>
      <a href="/dashboard" @click="logout">Logout</a>
    </span>
  </div>
  <header>
    <notifications />
    <img alt="Logo" class="logo" src="@/assets/images/logo.svg" width="80" height="90" />
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Swear jar</RouterLink>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()

let user = userStore.user

const logout = () => {
  useUserStore().logout()
  user = null
}
</script>

<style lang="scss">
.top-nav {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: var(--white);
  font-size: 1.2rem;
  a {
    color: var(--white);
    text-decoration: none;
    &:hover {
      color: var(--secondary);
    }
  }
}
header {
  margin: 2rem 0 0;
  text-align: center;
  nav {
    a {
      margin: 0.3rem;
      display: inline-block;
      font-size: 1.2rem;
      padding: 0.3rem 1rem;
      border-radius: 0.25rem;

      &:hover,
      &.router-link-active {
        color: var(--white);
        background-color: var(--secondary);
      }
    }
  }
}
</style>
