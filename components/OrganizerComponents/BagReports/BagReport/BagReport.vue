<template>
  <div>
    <RoutePanel :link-list="links" />
    <KeepAlive>
      <ParentBagReport v-if="parentReport.length !== 0" :report="parentReport" :userList="users"
        :loading="$apollo.loading" />
    </KeepAlive>

    <v-container class="box-container justify-center flex-column ma-3" v-for="report in compCurrentReport"
      :key="report.id">
      <span style="place-self: center;" class="text-h5">Текущая заявка</span>
      <strong class="mt-4 mb-4 text-center">
        <span style="color: rgba(0, 0, 0, 0.38);">Владелец заявки: </span>
        <span>{{ report.ownerName }}</span>
      </strong>
      <v-text-field label="Тема" v-model="report.tema" disabled outlined></v-text-field>
      <v-textarea label="Описание" v-model="report.text" disabled outlined></v-textarea>
      <div class="d-flex justify-center align-center">
        <v-select class="mr-1" label="Ответственный админ" style="max-width: 50%;" v-model="report.adminUserName"
          :items="reportAdmins" @change="linkBugReportAdmin(report)" outlined></v-select>
        <v-text-field disabled label="Статус" v-model="report.statusRu" outlined></v-text-field>
      </div>
      <div class="d-flex">
        <v-text-field style="max-width: 25%;" v-model="report.parentBagreportId" label="Родительская заявка"
          outlined></v-text-field>
        <v-btn title="Добавить родительскую заявку"
          :disabled="report.parentBagreportId === undefined || report.parentBagreportId === ''" class="success ml-5 mt-2"
          icon dark large @click="addParentReport(report)">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
      <KeepAlive v-if="report.img">
        <div class="text-center">
          <v-btn :disabled="report.img === undefined" class="v-btn-icon" max-width="250px" height="187"
            @click="openImageDialog = true">
            <v-img :src="report.img" max-width="250px"></v-img>
          </v-btn>
        </div>
      </KeepAlive>
      <v-dialog v-model="openImageDialog" max-width="1280" max-height="720">
        <v-img max-width="1280" max-height="720" :src="report.img"></v-img>
      </v-dialog>
      <div class="d-flex justify-end align-center">
        <div>
          <span class="ml-3" style="font-size: small;">Приоритет заявки</span>
          <v-rating class="mr-6" size="35" color="#FBB117" background-color="black" v-model="report.prioritet" hover
            @input="changePriority(report)"></v-rating>
        </div>
        <v-btn title="Выполнить заявку" :disabled="report.status !== 'InService'" class="green mr-6" icon large dark
          @click="doneReport(report)">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn title="Закрыть заявку" class="primary" :disabled="report.status !== 'Done'" icon large dark
          @click="closeReport(report)">
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </div>
    </v-container>

    <ChildBagReportsList />

    <ChildBagReportCreate />
  </div>
</template>

<script>
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'
import ChildBagReportsList from '~/components/OrganizerComponents/BagReports/ChildBagReports/ChildBagReportsList.vue'
import ChildBagReportCreate from '~/components/ButtonComponents/BagReports/ChildBagReport/ChildBagReportCreate.vue'
import ParentBagReport from '~/components/OrganizerComponents/BagReports/ParentBagReport/ParentBagReport.vue'
import script from './script'

export default {
  mixins: [script],
  components: { ParentBagReport, ChildBagReportsList, ChildBagReportCreate, RoutePanel },
}
</script>