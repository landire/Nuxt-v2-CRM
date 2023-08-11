<template>
  <div>
    <RoutePanel :link-list="links" />
    <div class="d-flex justify-center flex-column ma-3" v-for="req in compRequest" :key="req.id">
      <fieldset class="box-container text-center">
        <span class="text-h5 pa-5">Данные абонента</span>

        <div class="mr-3 ml-3 mt-5">
          <v-row justify="center">
            <v-col cols="4">
              <v-text-field v-model="req.familiya" label="Фамилия" outlined disabled></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field v-model="req.name" label="Имя" outlined disabled></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field v-model="req.otchestvo" label="Отчество" outlined disabled></v-text-field>
            </v-col>
          </v-row>
        </div>

        <v-row justify="center">
          <v-col cols="8">
            <v-text-field class="mr-3 ml-3 mt-5" v-model="req.adres" label="Адрес" outlined disabled></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field class="mr-3 ml-3 mt-5" v-model="req.fone" label="Номер телефона" outlined
              disabled></v-text-field>
          </v-col>
        </v-row>
        <v-combobox class="mr-3 ml-3 mt-5" v-model="req.tarifNameList" :items="tarifsName" label="Тарифы" multiple chips
          outlined disabled></v-combobox>
        <v-text-field class="mr-3 ml-3 mt-5" v-model="req.statusNames" label="Статусы" outlined disabled></v-text-field>

        <div class="d-flex justify-space-between">
          <div style="color: rgba(0, 0, 0, 0.38); font-size: 14px;" class="mr-3 ml-3 mt-5 mb-3">
            Дата создания: {{ req.date }}
          </div>

          <v-rating class="mr-3" color="#FBB117" background-color="black" v-model="req.grade" size="30" hover readonly
            medium></v-rating>
        </div>

      </fieldset>
    </div>
  </div>
</template>

<script>
import script from './script'

export default {
  mixins: [script]
}
</script>