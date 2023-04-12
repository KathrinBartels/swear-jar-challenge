<template>
  <main>
    <section>
      <h1>Swear Jar</h1>
      <p>
        This is a piggy bank for words. Every time you swear, you have to put money in it.
      </p>
      <p>
        You can add new items to the list, update the amount of money you have to pay for each item and delete items from the
        list.
      </p>
    </section>
    <section>
      <h2>Add new item</h2>
      <form @submit.prevent="addItem">
        <input type="text" v-model="itemName" placeholder="Enter name" />
        <input type="number" v-model="itemAmount" />
        <button :disabled="btnDisabled" type="submit" class="btn primary">Save</button>
      </form>
    </section>
    <section>
      <!-- if there is no items in the json file, show text -->
      <div v-if="items.length === 0">
        <p>No items yet!</p>
      </div>
      <!-- else show tables with items -->
      <div v-else>
        <table v-if="user === 'admin'">
          <thead>
            <tr>
              <th @click="sortTable('name')">
                <span>Name </span>
              </th>
              <th @click="sortTable('amount')">
                <span>Amount in € </span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>
                <input type="text" v-model="item.name" />
              </td>
              <td>
                <input type="number" v-model="item.amount" />
              </td>
              <td class="admin-actions">
                <button class="btn primary" @click="updateItem(item.id)">Save</button>
                <button class="btn delete" @click="deleteItem(item.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- else show table with only items -->
        <table v-else>
          <thead>
            <tr>
              <th @click="sortTable('name')">Name</th>
              <th @click="sortTable('amount')">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <section v-if="user !== 'admin'">
      Please <router-link to="/login">log in </router-link> as admin to modify the data.
    </section>
  </main>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import axios from 'axios'

export default {
  name: 'SwearJar',
  data() {
    return {
      items: [{ id: Number, name: '', amount: 0 }] as any,
      itemName: '',
      itemAmount: 10,
      user: useUserStore().user || localStorage.getItem('user'),
      btnDisabled: true,
      currentSort: 'name',
      currentSortDir: 'asc'
    }
  },
  // fetch items
  async created() {
    try {
      const res = await axios.get(`http://localhost:3000/items`)
      this.items = res.data
    } catch (error) {
      console.log(error)
    }
  },
  watch: {
    itemName() {
      this.checkInput()
    },
    itemAmount() {
      this.checkInput()
    }
  },
  methods: {
    // check fields and disable/enable button
    checkInput() {
      if (this.itemName.length > 0 && this.itemAmount > 0) {
        this.btnDisabled = false
      } else {
        this.btnDisabled = true
      }
    },

    // set key and direction for sorting
    sortTable(key: string) {
      this.currentSort = key
      this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
      this.sortItems()
    },

    // sort items according to key and direction
    sortItems() {
      const dirModifier = this.currentSortDir === 'asc' ? 1 : -1
      this.items.sort((a: any, b: any) => {
        if (a[this.currentSort] < b[this.currentSort]) {
          return -1 * dirModifier
        }
        if (a[this.currentSort] > b[this.currentSort]) {
          return 1 * dirModifier
        }
        return 0
      })
    },

    async updateItem(id: number) {
      // find item by id in json file
      const item = this.items.find((item: any) => item.id === id)

      if (item.name === '' || item.amount === null || item.amount === 0) {
        notify({
          type: 'error',
          title: 'Error',
          text: 'Please fill in all fields!'
        })
        return
      }

      // update item
      const newItem = {
        name: item.name,
        amount: item.amount
      }

      try {
        await axios.put(`http://localhost:3000/items/${id}`, newItem)
        notify({
          type: 'success',
          title: 'Success',
          text: 'Item has been updated!'
        })
      } catch (error) {
        console.log(error)
      }

      // fetch items
      try {
        const res = await axios.get(`http://localhost:3000/items`)
        this.items = res.data
      } catch (error) {
        console.log(error)
      }
    },

    async addItem() {
      // if this.item already exists in items, add amount to existing item, ignore case of letters
      const itemExists = this.items.find((item: any) => item.name.toLowerCase() === this.itemName.toLowerCase())

      if (itemExists) {
        const updatedItem = {
          name: itemExists.name,
          amount: (itemExists.amount += this.itemAmount)
        }
        try {
          await axios.put(`http://localhost:3000/items/${itemExists.id}`, updatedItem)
          notify({
            type: 'success',
            title: 'Success',
            text: 'Item has been updated!'
          })
        } catch (error) {
          console.log(error)
        }
      } else {
        // else create new item
        try {
          await axios.post(`http://localhost:3000/items`, {
            name: this.itemName,
            amount: this.itemAmount
          })
          notify({
            type: 'success',
            title: 'Success',
            text: 'Item has been added!'
          })
        } catch (error) {
          console.log(error)
        }
      }

      // reset fields
      this.itemName = ''
      this.itemAmount = 10
      this.btnDisabled = true

      // fetch items
      try {
        const res = await axios.get(`http://localhost:3000/items`)
        this.items = res.data
      } catch (error) {
        console.log(error)
      }
    },

    async deleteItem(id: number) {
      try {
        await axios.delete(`http://localhost:3000/items/${id}`)
        this.items = this.items.filter((item: any) => item.id !== id)
        notify({
          type: 'success',
          title: 'Success',
          text: 'Item has been deleted!'
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="scss">
form {
  display: flex;
}
table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
  text-align: left;
  tr {
    border-bottom: 1px solid var(--border-color);
  }

  tbody {
    tr {
      &:nth-child(even) {
        background-color: var(--bg-color);
      }
      &:hover {
        background-color: var(--border-color);
      }
    }
  }

  th {
    padding: 0.5rem;
    font-weight: 700;
    cursor: pointer;

    svg {
      margin-left: 0.5rem;
    }

    &:last-child {
      text-align: right;
    }
  }
  td {
    padding: 0.5rem;

    input {
      width: 100%;
    }

    &:last-child {
      text-align: right;
    }

    &.admin-actions {
      display: flex;
      justify-content: end;

      button {
        width: 100%;
        &:last-child {
          margin-left: 0.5rem;
        }
      }
    }
  }
}
</style>
