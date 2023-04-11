<template>
  <main>
    <!-- if user is admin show table with items as inputs -->
    <table v-if="user === 'admin'">
      <thead>
        <tr>
          <th @click="sortTable('name')">
            <span>Name </span>
            <!-- show arrow according to currentSortDir -->
            <span v-if="currentSort === 'name'">
              <span v-if="currentSortDir === 'asc'">
                <font-awesome-icon :icon="['fas', 'sort-up']" />
              </span>
              <span v-else>
                <font-awesome-icon :icon="['fas', 'sort-down']" />
              </span>
            </span>
          </th>
          <th @click="sortTable('amount')">
            <span>Amount </span>
            <!-- show arrow according to currentSortDir -->
            <span v-if="currentSort === 'amount'">
              <span v-if="currentSortDir === 'asc'">
                <font-awesome-icon :icon="['fas', 'sort-up']" />
              </span>
              <span v-else>
                <font-awesome-icon :icon="['fas', 'sort-down']" />
              </span>
            </span>
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
  </main>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { notify } from '@kyvg/vue3-notification'
import axios from 'axios'

// add icons to library
library.add(faSortUp, faSortDown)

export default {
  name: 'DashboardView',
  data() {
    return {
      items: [{ id: Number, name: '', amount: 0 }] as any,
      user: useUserStore().user,
      btnDisabled: true,
      currentSort: 'name',
      currentSortDir: 'asc'
    }
  },
  // fetch items from json file
  async created() {
    try {
      const res = await axios.get(`http://localhost:3000/items`)
      this.items = res.data
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    // sort table items according to key
    sortTable(key: string) {
      this.currentSort = key
      this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
      this.sortItems()
    },

    // sort items according to currentSort and currentSortDir
    sortItems() {
      let items = this.items
      if (this.currentSort === 'name') {
        items = items.sort((a: any, b: any) => {
          let modifier = 1
          if (this.currentSortDir === 'desc') modifier = -1
          if (a.name < b.name) return -1 * modifier
          if (a.name > b.name) return 1 * modifier
          return 0
        })
      } else if (this.currentSort === 'amount') {
        items = items.sort((a: any, b: any) => {
          let modifier = 1
          if (this.currentSortDir === 'desc') modifier = -1
          if (a.amount < b.amount) return -1 * modifier
          if (a.amount > b.amount) return 1 * modifier
          return 0
        })
      }
      return items
    },
    // update item in json file
    async updateItem(id: number) {
      const item = this.items.find((item: any) => item.id === id)
      if (item.name !== '' && item.amount > 0) {
        try {
          await axios.put(`http://localhost:3000/items/${id}`, item)
          notify({
            type: 'success',
            title: 'Success',
            text: 'Entry has been updated!'
          })
        } catch (error) {
          console.log(error)
        }
      } else {
        notify({
          type: 'error',
          title: 'Error',
          text: 'Please fill out all fields!'
        })
      }
    },
    // delete item from json file
    async deleteItem(id: number) {
      // show notification and wait for user input
      notify({
        type: 'warning',
        text: 'Are you sure you want to delete this item?'
      })
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
table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
  text-align: left;
  tr {
    border-bottom: 1px solid var(--border-color);
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
