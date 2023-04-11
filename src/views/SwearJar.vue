<template>
  <main>
    <form @submit.prevent="addItem">
      <input type="text" v-model="itemName" placeholder="Enter name" />
      <input type="number" v-model="itemAmount" />
      <button :disabled="btnDisabled" type="submit" class="btn primary">Save</button>
    </form>
  </main>
</template>

<script lang="ts">
import axios from 'axios'
import { notify } from '@kyvg/vue3-notification'

export default {
  name: 'SwearJar',
  data() {
    return {
      itemName: '',
      itemAmount: 10,
      btnDisabled: true
    }
  },
  watch: {
    // watch for changes in itemName and itemAmount
    itemName() {
      this.checkInput()
    },
    itemAmount() {
      this.checkInput()
    }
  },
  methods: {
    // add item to json file
    async addItem() {
      try {
        await axios.post(`http://localhost:3000/items`, {
          name: this.itemName,
          amount: this.itemAmount
        })
        this.itemName = ''
        this.itemAmount = 10
        this.btnDisabled = true

        // show notification
        notify({
          type: 'success',
          title: 'Coink!',
          text: 'Entry has been saved!'
        })
      } catch (error) {
        console.log(error)
      }
    },
    // check if name is filled, itemAmount is > 0 and disable/enable button accordingly
    checkInput() {
      if (this.itemName.length > 0 && this.itemAmount > 0) {
        this.btnDisabled = false
      } else {
        this.btnDisabled = true
      }
    }
  }
}
</script>
