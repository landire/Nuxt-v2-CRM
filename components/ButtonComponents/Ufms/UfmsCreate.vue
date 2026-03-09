<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn title="Добавить отделение" class="success" icon dark v-bind="attrs" v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="justify-center">
          <span class="text-h5">Создание отделения</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Кем выдан*" v-model="ufms.name" required></v-text-field>
                  <v-text-field label="Код подразделения*" v-model="ufms.structureCod" @input="getUfmsName"
                    required></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*обязательное поле</small>
        </v-card-text>
        <v-container>
          <v-card-actions class="justify-center">
            <v-btn title="Добавить отделение" class="success" icon large dark @click="saveUfms">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { UfmsCreate } from '~/apollo/mutation/Ufms'
import { UfmsSelectFromCode } from '~/apollo/query/Ufms'
import apollo from '~/mixins/apollo'

export default {
  mixins: [apollo],
  data() {
    return {
      dialog: false,
      ufms: {
        name: '',
        structureCod: ''
      },
    }
  },

  methods: {
    // Метод кнопки сохранения новой Роли
    async saveUfms() {
      this.apolloMutation(UfmsCreate, {
        param: {
          name: this.ufms.name,
          structureCod: this.ufms.structureCod
        }
      })

      this.dialog = false
      this.$refs.form.reset()
    },

    async getUfmsName() {
      if (this.ufms.structureCod?.length === 7) {
        console.log(this.ufms.structureCod)
        this.apolloQuery(UfmsSelectFromCode, {
          param: {
            name: true
          },
          structureCodList: [this.ufms.structureCod]
        }).then(({ data }) => {
          this.ufms.name = data.Ufms_SelectFromCode.res.map(ufms => ufms.name)
        })
      }
    }
  }
}
</script>