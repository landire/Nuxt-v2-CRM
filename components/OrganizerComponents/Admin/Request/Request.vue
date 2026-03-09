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
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'
import IdRequestModel from '~/model/Request/IdRequestModel'
import RequestTarifModel from '~/model/Tarif/RequestTarifModel'

export default {
  mixins: [IdRequestModel, RequestTarifModel],
  components: { RoutePanel },
  data() {
    return {
      request: [],
      tarifs: [],
      tarifsName: [],
      links: [
        { name: "Органайзер", path: "/" },
        { name: "Кабинет администратора", path: "/admin" },
        { name: "Заявки", path: "/admin/requests" },
        { name: "Заявка", path: this.$route.path },
      ],
    };
  },
  async mounted() {
    const request = await this.getRequestFromId(this.$route.params.id)
    this.request = request.data

    request.subscription((data) => {
      this.request = this.request.map(req => {
        req = data.Subscription_Request

        return req
      })
    })

    const tarifs = await this.getReqTarifs()
    this.tarifs = tarifs.data
    this.tarifsName = tarifs.data.map(tarif => tarif.name)

    tarifs.subscription((data) => {
      const idList = this.tarifs.map(tarif => tarif.id)

      if (!idList.includes(data.Subscription_Tarif.id)) {
        this.tarifs.push(data.Subscription_Tarif)
        this.tarifsName.push(data.Subscription_Tarif.name)
      }

      this.tarifs = this.tarifs.map(tarif => {
        if (tarif.id === data.Subscription_Tarif.id) {
          if (tarif.name === 'ТАРИФ НЕДОСТУПЕН') {
            tarif = data.Subscription_Tarif
          } else {
            tarif = { name: 'ТАРИФ НЕДОСТУПЕН', id: data.Subscription_Tarif.id }
          }
        }

        return tarif
      })
    })
  },

  computed: {
    compRequest() {
      this.request = this.request.map(req => {
        req.tarifNameList = [];
        req.tarifIdList?.forEach(id => {
          this.tarifs.forEach(tarif => {
            if (id === tarif.id) {
              req.tarifNameList.push(tarif.name);
            }
          })
        })

        const statusNameList = req.status.map(stts => stts.namestatus);
        req.statusNames = statusNameList.join(", ");

        const correctDate = new Date(Date.parse(req.created) + 600000);
        const time = correctDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
        const date = correctDate.toLocaleDateString("ru-RU", { year: "numeric", month: "numeric", day: "numeric" });
        req.date = `${date} ${time}`;

        return req
      })


      return this.request
    }
  }
}
</script>