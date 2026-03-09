<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="titles"
        :items="qControl" class="elevation-1" hide-default-footer :page.sync="page" :items-per-page="itemsPerPage"
        @page-count="pageCount = $event">
        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-toolbar-title>Причины отказа</v-toolbar-title>
              <v-spacer></v-spacer>
              <RejectReasonCreate class="mr-3 mt-1" />
            </v-toolbar>
          </v-container>

          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Редактирование</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field v-model="editedQControl.name" label="Название"></v-text-field>
                      <v-select label="Тип" v-model="editedQControl.type" :items="typeList"></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-container>
                <v-card-actions class="justify-center">
                  <v-btn title="Подтвердить изменения" class="success" icon dark large @click="save">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.statusButton="{ item }">
          <v-simple-checkbox title="Вкл/Выкл" class="d-inline-block" color="primary darken-2" v-model="item.status"
            light @click="switchStatus(item)"></v-simple-checkbox>
        </template>
        <template v-slot:item.editQControl="{ item }">
          <v-btn title="Редактировать" icon dark class="primary"
            @click="editQControl(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        </template>

      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'
import RejectReasonCreate from '~/components/ButtonComponents/RejectReason/RejectReasonCreate.vue'
import { QualityControlEdit } from '~/apollo/mutation/QualityControl'
import QualityModel from '~/model/Quality/QualityModel'

export default {
  components: { RejectReasonCreate, RoutePanel },
  mixins: [QualityModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      apolloLoading: true,
      dialog: false,
      editedQControl: {},
      titles: [
        { text: '', align: 'center', value: 'statusButton', sortable: false },
        { text: 'Название', align: 'center', value: 'name' },
        { text: 'Тип', align: 'center', value: 'type' },
        { text: '', align: 'center', value: 'editQControl', sortable: false },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Причины отказа', path: '/rejectreasons' },
      ],
      qControl: [],
      typeList: ['Качество', 'Покрытие', 'Отказ'],
    }
  },

  async mounted() {
    const { data, subscription } = await this.getQuality()
    this.qControl = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
      const idList = this.qControl.map(control => control.id)

      if (!idList.includes(data.Subscription_QualityControl.id)) {
        this.qControl.push(data.Subscription_QualityControl)
      }
      if (idList.includes(data.Subscription_QualityControl.id)) {
        this.qControl = this.qControl.map(control => {
          if (control.id === data.Subscription_QualityControl.id) {
            control = data.Subscription_QualityControl
          }

          return control
        })
      }
    })
  },

  methods: {
    async switchStatus(item) {
      this.apolloMutation(QualityControlEdit, {
        param: {
          status: item.status
        },
        idList: [item.id]
      })
    },

    async editQControl(item) {
      this.editedQControl = item
      this.dialog = true
    },

    async save() {
      this.apolloMutation(QualityControlEdit, {
        param: {
          name: this.editedQControl.name,
          type: this.editedQControl.type
        },
        idList: [this.editedQControl.id]
      })

      this.dialog = false
    },

    async close() {
      this.dialog = false
    }
  }
}
</script>