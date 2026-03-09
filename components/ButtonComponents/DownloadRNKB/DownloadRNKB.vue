<template>
  <div class="ma-5 button-container elevation-6">
    <div class="pa-1 button-container-title">
      <strong>
        РНКБ
      </strong>
    </div>
    <div>
      <div class="d-flex" style="overflow: hidden;">
        <v-btn class="button-container-item" @click="dialog = true">
          Сформировать файл
        </v-btn>
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title class="justify-center">
              <span class="text-h5">Формирование файла</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="form">
                  <v-row>
                    <v-col cols="4">
                      <v-text-field placeholder="Год*" prefix="20" v-model="payment.year" :maxlength="2"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-select label="Месяц*" v-model="payment.month" :items="monthList"></v-select>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field label="День*" v-model="payment.day"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field label="Номер файла*" v-model="payment.npp" required></v-text-field>
                      <v-text-field label="ИНН*" v-model="payment.inn" required></v-text-field>
                      <v-text-field label="Кассир*" v-model="payment.kassir" type="text" required></v-text-field>
                      <v-text-field label="Ключ API*" autocomplete="new-password" v-model="payment.apiKey"
                        :type="show ? 'text' : 'password'" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="show = !show" required></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
              <small>*обязательное поле</small>
            </v-card-text>
            <v-container>
              <v-card-actions class="justify-center">
                <v-btn color="primary darken-1" @click="getFile">
                  Скачать файл
                </v-btn>
              </v-card-actions>
            </v-container>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogLoader" max-width="100px" persistent>
          <v-card>
            <v-container>
              <v-card-text class="text-center">
                <KeepAlive>
                  <v-icon v-if="loadingSuccess === undefined" class="loader" color="primary" large>mdi-loading</v-icon>
                  <v-icon v-if="loadingSuccess === true" color="success" large>mdi-check</v-icon>
                  <v-icon v-if="loadingSuccess === false" color="error" large>mdi-close</v-icon>
                </KeepAlive>
              </v-card-text>
            </v-container>
          </v-card>
        </v-dialog>
      </div>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
import apollo from '~/mixins/apollo'
import download from '~/mixins/download'
import { GetReestrPayments, GetReestrPaymentsFile } from '~/apollo/query/ReestrPayments'

export default {
  mixins: [apollo, download],
  data() {
    return {
      dialog: false,
      dialogLoader: false,
      loadingSuccess: undefined,
      show: false,
      payment: {
        year: '',
        month: '',
        day: '',
        npp: '',
        inn: '',
        kassir: '',
        apiKey: ''
      },
      fileName: '',
      fileData: undefined,
      monthList: []
    }
  },

  mounted() {
    for (let i = 0; i < 12; i++) {
      this.monthList[i] = i + 1
    }
  },

  methods: {
    getFile() {
      this.apolloQuery(GetReestrPayments, {
        Year: Number(`20${this.payment.year}`),
        Month: Number(this.payment.month),
        Day: Number(this.payment.day),
        npp: Number(this.payment.npp),
        inn: this.payment.inn,
        kassir: this.payment.kassir,
        apiKey: this.payment.apiKey
      }).then(({ data }) => {
        this.fileName = data.GetReestrPayments.res.FileName
        this.dialogLoader = true
      })

      setTimeout(() => {
        this.apolloQuery(GetReestrPaymentsFile, {
          FileName: this.fileName
        }).then((res) => {
          this.fileData = res.data.GetReestrPaymentsFile

          if (this.fileData !== undefined) {
            this.download(this.fileData, this.fileName)
            this.loadingSuccess = true
            setTimeout(() => {
              this.dialogLoader = false
              this.loadingSuccess = undefined
            }, 1000)
          }
        }).catch(err => {
          if (err) {
            this.loadingSuccess = false
            setTimeout(() => {
              this.dialogLoader = false
              this.loadingSuccess = undefined
            }, 1000)
          }
        })

        setTimeout(() => {
          this.dialog = false
          this.$refs.form.reset()
        }, 1000)
      }, 5000)
    }
  }
}
</script>