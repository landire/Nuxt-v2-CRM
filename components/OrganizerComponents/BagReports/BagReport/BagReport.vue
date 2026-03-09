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
          :disabled="report.parentBagreportId === undefined || report.parentBagreportId === ''"
          class="success ml-5 mt-2" icon dark large @click="addParentReport(report)">
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
import { BagReportEdit } from '~/apollo/mutation/BagReport'
import IdBagReportModel from '~/model/BagReport/IdBagReportModel'
import UserRoleModel from '~/model/UserRole/UserRoleModel'
import UsersModel from '~/model/User/UsersModel'
import NameRoleModel from '~/model/Role/NameRoleModel'


export default {
  components: { ParentBagReport, ChildBagReportsList, ChildBagReportCreate, RoutePanel },
  mixins: [IdBagReportModel, UserRoleModel, UsersModel, NameRoleModel],
  data() {
    return {
      parentReport: [],
      users: [],
      roles: [],
      userRoles: [],
      links: [
        { name: "Органайзер", path: "/" },
        { name: "Отчеты об ошибках", path: "/bagreports" },
        { name: "Отчет об ошибке", path: this.$route.path },
      ],
      reportAdmins: [],
      currentReport: [],
      openImageDialog: false,
    }
  },

  async mounted() {
    const users = await this.getUsers()
    this.users = users.data

    const userRoles = await this.getUserRole(this.users.map(user => user.id))
    this.userRoles = userRoles.data

    const roles = await this.getRoleFromName('BagReportWorker')
    this.roles = roles.data

    const currentBugReport = await this.getBagReportFromId([this.$route.params.id])
    this.currentReport = currentBugReport.data

    currentBugReport.subscription(async (data) => {
      if (data.Subscription_BagReport.status !== 'Удален') {
        const subParentReport = await this.getBagReportFromId([data.Subscription_BagReport.parentBagreportId], false)
        this.parentReport = subParentReport.data

        this.currentReport = this.currentReport.map(rep => {
          rep = data.Subscription_BagReport
          this.users.forEach(user => {
            if (user.id === rep.userId) {
              rep.ownerName = user.name
            }
          })

          return rep
        })
      } else {
        this.currentReport = this.currentReport.map(rep => {
          rep = data.Subscription_BagReport

          return rep
        })

        this.currentReport = this.currentReport.filter(rep => rep.id !== data.Subscription_BagReport.id)
      }
    })


    const parentBugReport = await this.getBagReportFromId(this.currentReport.map(rep => rep.parentBagreportId))
    this.parentReport = parentBugReport.data
  },

  computed: {
    compCurrentReport() {
      this.currentReport = this.currentReport.map(rep => {
        this.users.forEach(user => {
          if (user.id === rep.adminUserId) {
            rep.adminUserName = user.name
          }

          if (rep.userId === user.id) {
            rep.ownerName = user.name
          }
        })

        if (rep.status === 'Created') {
          rep.statusRu = 'Создан'
        }
        if (rep.status === 'InService') {
          rep.statusRu = 'Обрабатывается'
        }
        if (rep.status === 'Done') {
          rep.statusRu = 'Выполнена'
        }
        if (rep.status === 'Finish') {
          rep.statusRu = 'Закрыт'
        }

        return rep
      })

      this.users.forEach(user => {
        this.userRoles.forEach(userRole => {
          if (user.id === userRole.userId && userRole.RoleList.includes(this.roles.find(role => role.id)?.id)) {
            this.reportAdmins.push(user.name)
          }
        })
      })

      return this.currentReport
    }
  },

  methods: {
    async addParentReport(item) {
      this.apolloMutation(BagReportEdit, {
        param: {
          parentBagreportId: item.parentBagreportId,
        },
        idList: [item.id]
      })
    },

    async changePriority(item) {
      this.apolloMutation(BagReportEdit, {
        param: {
          prioritet: item.prioritet
        },
        idList: [item.id]
      })
    },

    async linkBugReportAdmin(item) {
      this.users.forEach(user => {
        if (user.name === item.adminUserName) {
          this.apolloMutation(BagReportEdit, {
            param: {
              status: 'InService',
              adminUserId: user.id
            },
            idList: [item.id]
          })
        }
      })
    },

    async closeReport(item) {
      this.apolloMutation(BagReportEdit, {
        param: {
          status: 'Finish'
        },
        idList: [item.id]
      })
    },

    async doneReport(item) {
      this.apolloMutation(BagReportEdit, {
        param: {
          status: 'Done'
        },
        idList: [item.id]
      })
    }
  }
}
</script>