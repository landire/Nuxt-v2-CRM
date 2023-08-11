<template>
  <v-container>
    <v-data-table class="elevation-1" hide-default-footer :search="search" :headers="titles" :items="abon"
      :page.sync="page" :items-per-page="itemsPerPage" @page-count="pageCount = $event">
      <template v-slot:top>
        <v-toolbar flat>
          <v-col>
            <v-text-field width="10px" class="mr-3 mt-10" prepend-inner-icon="mdi-magnify" label="Фамилия"
              v-model="search" outlined />
          </v-col>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.nodeAbon="{ item }">
        <v-btn dark class="blue" @click="nodeAbon(item)">Узел</v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </v-container>
</template>

<script>

export default {
  middleware: 'notAuthenticated',
  head: {
    title: 'Real Web - Редактирование узла'
  },

  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: '',
      titles: [
        { text: 'Фамилия', value: 'secondName' },
        { text: 'Адрес', value: 'address' },
        { text: 'Тариф', value: 'tarif' },
        { text: 'Прошло времени', value: 'passTime' },
        { text: '', value: 'nodeAbon' },
      ],
      abon: [],
    }
  },

  methods: {
    nodeAbon(item) {

    }
  },

}
</script>