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
import script from './script'

export default {
  mixins: [script]
}
</script>