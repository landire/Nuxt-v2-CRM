<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" class="elevation-1"
        hide-default-footer :search="search" :headers="titles" :items="updateReq" :page.sync="page"
        :items-per-page="itemsPerPage" @page-count="pageCount = $event">
        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-text-field class="mr-3 mt-10" prepend-inner-icon="mdi-magnify" label="Поиск" v-model="search" outlined
                rounded clearable />
              <v-spacer></v-spacer>
            </v-toolbar>
          </v-container>

          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Проверка заявки</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field disabled label="Фамилия" v-model="editedReq.familiya"></v-text-field>
                      <v-text-field disabled label="Имя" v-model="editedReq.name"></v-text-field>
                      <v-text-field disabled label="Отчество" v-model="editedReq.otchestvo"></v-text-field>
                      <v-text-field disabled label="Адрес" v-model="editedReq.adres"></v-text-field>
                      <v-text-field disabled label="Телефон" v-model="editedReq.fone"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-combobox v-model="editedReq.tarif" :items="tarifsName" label="Тарифы" multiple
                        chips></v-combobox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-container>
                  <v-row justify="center">
                    <v-col cols="8">
                      <v-select :menu-props="{ offsetY: true }" label="Статус" :items="typeList" v-model="editedReq.type"
                        outlined @change="selectType(editedReq.type)" clearable></v-select>
                      <KeepAlive v-if="isPokritie">
                        <v-combobox v-model="editedReq.qualityControlNameList" :items="qualityControlPokritieListName"
                          label="Причина" multiple chips outlined clearable></v-combobox>
                      </KeepAlive>
                      <KeepAlive v-if="isOtkaz">
                        <v-combobox v-model="editedReq.qualityControlNameList" :items="qualityControlOtkazListName"
                          label="Причина" multiple chips outlined clearable></v-combobox>
                      </KeepAlive>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col class="text-center">
                      <v-btn title="Подтвердить статус" class="success" icon dark large @click="accept">
                        <v-icon>mdi-check</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="editDialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Редактирование заявки</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field label="Фамилия" v-model="editedReq.familiya"></v-text-field>
                      <v-text-field label="Имя" v-model="editedReq.name"></v-text-field>
                      <v-text-field label="Отчество" v-model="editedReq.otchestvo"></v-text-field>
                      <v-text-field label="Адрес" v-model="editedReq.adres"></v-text-field>
                      <v-text-field label="Телефон" v-model="editedReq.fone"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-container>
                  <v-row justify="center">
                    <v-col class="text-center">
                      <v-btn color="primary darken-1" dark @click="saveReq">Сохранить</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.editReq="{ item }">
          <v-btn title="Редактировать заявку" :disabled="item.isTexStatus === true" icon dark class="primary"
            @click="editReq(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <template v-slot:item.callReq="{ item }">
          <v-btn title="Проверить заявку" :disabled="item.isTexStatus === true" class="primary" dark
            @click="callReq(item)" icon>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
import script from './script'
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'

export default {
  mixins: [script],
  components: { RoutePanel }
}
</script>