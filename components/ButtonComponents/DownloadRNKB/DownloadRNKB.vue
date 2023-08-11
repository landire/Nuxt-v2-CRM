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
import script from './script'

export default {
  mixins: [script]
}
</script>