<template>
  <div>
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn title="Добавить абонента" icon dark class="success" v-bind="attrs" v-on="on">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="justify-center">
            <span class="text-h5">Создание Заявки</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form ref="form">
                <v-row>
                  <v-col cols="12">
                    <v-text-field label="Фамилия*" v-model="request.familiya" required></v-text-field>
                    <v-text-field label="Имя*" v-model="request.name" required></v-text-field>
                    <v-text-field label="Отчество" v-model="request.otchestvo"></v-text-field>
                    <v-text-field label="Адрес*" v-model="request.adres" required></v-text-field>
                    <v-text-field label="Телефон*" v-model="request.fone" required></v-text-field>
                    <v-combobox v-model="request.tarifsNameList" :items="tarifsName" label="Тарифы" multiple
                      chips></v-combobox>
                  </v-col>
                </v-row>
              </v-form>

            </v-container>
            <small>*обязательное поле</small>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="primary darken-1" @submit.prevent @click="saveReq">
              Создать
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { delay } from 'q'
import { RequestCreate, RequestStatus } from '~/apollo/mutation/Request'
import RequestTarifModel from '~/model/Tarif/RequestTarifModel'

export default {
  mixins: [RequestTarifModel],
  data() {
    return {
      request: {
        familiya: '',
        name: null,
        otchestvo: '',
        adres: '',
        fone: '',
        tarifsNameList: [],
        tarifsIdList: [],
      },
      dialog: false,
      tarifs: [],
      tarifsName: [],
    }
  },

  async mounted() {
    const { data, subscription } = await this.getReqTarifs()
    this.tarifs = data
    this.tarifsName = data.map(tarif => tarif.name)

    subscription((data) => {
      if (data.Subscription_Tarif.flagWatchUser === true) {
        this.tarifs.push(data.Subscription_Tarif)
      }

      if (data.Subscription_Tarif.flagWatchUser === false) {
        this.tarifs = this.tarifs.filter(tarif => {
          if (tarif.id !== data.Subscription_Tarif.id) {
            return tarif
          }
        })
      }

      this.tarifsName = this.tarifs.map(tarif => tarif.name)
    })
  },


  methods: {
    // Метод кнопки сохранения нового Абонента
    async saveReq() {
      if (this.request.name !== null) {
        this.tarifs.forEach(tarif => {
          if (this.request.tarifsNameList.includes(tarif.name)) {
            this.request.tarifsIdList.push(tarif.id)
          }
        })

        this.apolloMutation(RequestCreate, {
          param: {
            familiya: this.request.familiya,
            name: this.request.name,
            otchestvo: this.request.otchestvo,
            adres: this.request.adres,
            fone: this.request.fone,
            tarifIdList: this.request.tarifsIdList,
          }
        }).then(({ data }) => {
          if (this.request.tarifsIdList.length > 0) {
            delay(1000).then(() => {
              this.apolloMutation(RequestStatus, {
                id: data.Request_RequestCreate.res._id,
                type: 'Проверка тех возможности',
              }).then(() => {
                this.request.tarifsIdList = []
              })
            })
          }
        })
      }

      this.$refs.form.reset()
      this.dialog = false
    }
  }
}
</script>