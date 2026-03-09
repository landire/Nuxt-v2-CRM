<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn title="Добавить причину" class="success" icon dark v-bind="attrs" v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="justify-center">
          <span class="text-h5">Создание</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Название*" v-model="quality.name" required></v-text-field>
                  <v-select label="Тип*" v-model="quality.type" :items="typeList" required></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*обязательное поле</small>
        </v-card-text>
        <v-container>
          <v-card-actions class="justify-center">
            <v-btn title="Подтвердить" class="success" icon dark large @click="saveQControl">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { QualityControlCreate } from '~/apollo/mutation/QualityControl'
import apollo from '~/mixins/apollo'

export default {
  mixins: [apollo],
  data() {
    return {
      dialog: false,
      quality: {
        name: '',
        type: '',
      },
      typeList: ['Качество', 'Покрытие', 'Отказ'],
    }
  },

  methods: {
    async saveQControl() {
      this.apolloMutation(QualityControlCreate, {
        param: {
          name: this.quality.name,
          type: this.quality.type
        }
      })
      this.dialog = false
      this.$refs.form.reset()
    }
  }
}
</script>