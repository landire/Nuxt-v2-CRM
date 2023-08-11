import { UfmsCheckUFMSError } from '~/apollo/mutation/Ufms'
import { AbonErrorEdit } from '~/apollo/mutation/AbonError'
import { delay } from 'q'
import AbonErrorModel from '~/model/AbonError/AbonErrorModel'

export default {
  mixins: [AbonErrorModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 25,
      apolloLoading: true,
      editAbonDialog: false,
      errorsDialog: false,
      passDataDialog: false,
      loader: false,
      search: "",
      titles: [
        { text: "Биллинг ID", align: "center", value: "billingAbonId" },
        { text: "ФИО", align: "center", value: "full_name" },
        { text: "Комментарий", align: "center", value: "coment" },
        { text: "Пасспортные данные", align: "center", value: "passData", sortable: false },
        { text: "Ошибки", align: "center", value: "errorsList", sortable: false },
        { text: "", align: "center", value: "editAbon", sortable: false },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'МФИ Файлы', path: '/mfi' },
      ],
      errors: [
        "Необходимо заполнить день рождения",
        "Необходимо заполнить не структурированные паспортные данные",
        "Длина неструктурированных паспортных данных не может привышать 1024 символа",
        "Не верно заполнена серия пасспорта - должна быть 4 цифры",
        "Серия документа не должна привышать 16 символов",
        "Не верно заполнена Номер пасспорта - должна быть 6 цифры",
        "Номер документа не должна привышать 16 символов",
        "Дата выдачи документа указанна не верно от 8 до 10 символов",
        "Не верно указан код УФМС России выдавший документ пример 900-003",
        "Когда и кем выдан документ не должен привышать 512 символов",
        "Указанного кода УФМС нет в справочнике",
        "Необходимо Правильно заполнить ФИО",
        "Необходимо заполнить Прописку или адрес оборудования",
        "Необходимо заполнить ИНН",
        "Не верно указан банковский счет от 1 - 30 символов"
      ],
      error: "",
      abons: [],
      editedAbon: {},
    };
  },
  async mounted() {
    const { data, subscription } = await this.getAbonError()
    this.abons = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
      this.context.loader = false

      const billingIdArray = this.context.abons.map(abon => abon.billingAbonId)
      if (!billingIdArray.includes(data.Subscription_AbonError.billingAbonId)) {
        this.context.abons.push(data.Subscription_AbonError)
      }

      if (billingIdArray.includes(data.Subscription_AbonError.billingAbonId)) {
        this.context.abons = this.context.abons.map(abon => {
          if (abon.billingAbonId === data.Subscription_AbonError.billingAbonId) {
            abon = data.Subscription_AbonError
          }

          return abon
        })
      }
    })
  },
  computed: {
    filteredAbons() {
      return this.abons.filter(abon => {
        return !this.error || (abon.abonErrors.includes(this.error));
      });
    }
  },
  methods: {
    filterAbons(value, search, item) {
      return search === Array.prototype.slice.call(item.full_name, 0, search.length).join("")
        || search === Array.prototype.slice.call(item.billingAbonId, 0, search.length).join("");
    },
    update() {
      delay(this.loader = true, 5000).then(() => this.loader = false);
      this.apolloMutation(UfmsCheckUFMSError);
    },
    async editAbon(item) {
      this.editedAbon = item;
      this.editAbonDialog = true;
    },
    async acceptEditAbon() {
      this.apolloMutation(AbonErrorEdit, {
        param: {
          coment: this.editedAbon.coment
        },
        idList: [this.editedAbon.billingAbonId]
      });
      this.editAbonDialog = false;
    },
    async passData(item) {
      this.editedAbon = item;
      this.passDataDialog = true;
    },
    async errorList(item) {
      this.editedAbon = item;
      this.errorsDialog = true;
    },
  },
}