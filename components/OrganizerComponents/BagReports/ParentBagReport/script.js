export default {
  props: ['report', 'userList', 'loading'],
  data() {
    return {
      parentReport: this.report,
      users: this.userList,
      apolloParentLoading: this.loading,
      parentReportTitle: [
        { text: 'Статус', align: 'center', value: 'statusRu', sortable: false },
        { text: 'Тема', align: 'center', value: 'reportTema', sortable: false },
        { text: 'Ответственный админ', align: 'center', value: 'parentAdmin', sortable: false }
      ],
    }
  },

  computed: {
    compParentReport() {
      this.parentReport = this.parentReport.map(rep => {
        this.users.forEach(user => {
          if (user.id === rep.adminUserId) {
            rep.adminUserName = user.name
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

      return this.parentReport
    },
  }
}