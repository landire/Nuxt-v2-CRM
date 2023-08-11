<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" class="elevation-1"
        hide-default-footer :search="search" :headers="titles" :items="updateRequest" :page.sync="page"
        :items-per-page="itemsPerPage" @page-count="pageCount = $event">
        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-text-field width="10px" class="mr-3 mt-10" prepend-inner-icon="mdi-magnify" label="Фамилия"
                v-model="search" outlined rounded clearable />
              <v-spacer></v-spacer>
            </v-toolbar>
          </v-container>

          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Заключение договора</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field disabled v-model="editedReq.familiya" label="Фамилия"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-row>
                        <v-col cols="10">
                          <v-text-field label="Лицевой счет" v-model="editedReq.abonAccountId"></v-text-field>
                        </v-col>
                        <v-col class="d-flex align-center" cols="2">
                          <v-btn :disabled="!editedReq.abonAccountId" title="Добавить лицевой счет" class="primary" icon
                            dark @click="takeAbon">
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field disabled v-model="editedReq.name" label="Имя"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field disabled v-model="abon.passport" label="Паспорт"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field disabled v-model="editedReq.otchestvo" label="Отчество"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field disabled v-model="abon.full_name" label="ФИО"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field disabled v-model="editedReq.adres" label="Адрес"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field disabled v-model="abon.actual_address" label="Адрес"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field disabled v-model="editedReq.fone" label="Телефон"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field disabled v-model="abon.mobile_telephone" label="Телефон"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6"></v-col>
                    <v-col cols="6">
                      <v-menu :disabled="abonError === undefined" v-model="menu" :close-on-content-click="false"
                        :nudge-width="200" offset-x open-on-hover>
                        <template v-slot:activator="{ on, attrs }">
                          <KeepAlive>
                            <v-btn v-if="abon.errorList !== undefined" class="mt-3 mb-5 error" icon dark v-bind="attrs"
                              v-on="on">
                              <v-icon>mdi-alert-circle-outline</v-icon>
                            </v-btn>
                          </KeepAlive>
                        </template>
                        <v-list>
                          <v-list-item v-for="(error, i) in abon.errorList" :key="i">
                            <v-list-item-title>{{ error }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-col>
                  </v-row>

                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-container>
                  <v-row>
                    <v-col class="text-center" cols="6">
                      <v-btn title="Подтвердить заявку" class="success" dark icon large @click="agreeReq">
                        <v-icon>mdi-check</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col class="text-center" cols="6">
                      <v-btn title="Отклонить заявку" class="red" icon large dark @click="checkDecline">
                        <v-icon>mdi-window-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="linkAbonDialog" max-width="320px">
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <span class="text-center">Хотите привязать абонента к заявке ?</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark class="primary" @click="acceptLinkAbon">Да</v-btn>
                <v-spacer></v-spacer>
                <v-btn dark class="red" @click="declineLinkAbon">Нет</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="deleteDialog" max-width="300px">
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <span>Вы уверены ?</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark class="red" @click="acceptDelete">Да</v-btn>
                <v-spacer></v-spacer>
                <v-btn dark class="primary" @click="declineDelete">Нет</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="declineReqDialog" max-width="600px">
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <span>Выберите причину отказа</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-actions>
                <v-container>
                  <v-row>
                    <v-col class="text-center" cols="12">
                      <v-combobox v-model="editedReq.qualityControlNameList" :items="qualityControlOtkazListName"
                        label="Причина" multiple chips outlined clearable></v-combobox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="text-center" cols="12">
                      <v-btn dark class="red" @click="acceptReqDecline">Отказать</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <template v-slot:item.checkReq="{ item }">
          <v-btn :disabled="item.isTexStatus === true" dark icon class="primary" @click="checkReq(item)">
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
        </template>
        <template v-slot:item.deleteStatus="{ item }">
          <v-btn title="Откатить статус" icon dark class="red"
            @click="deleteStatus(item)"><v-icon>mdi-arrow-u-left-bottom</v-icon></v-btn>
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
  components: { RoutePanel },
}
</script>