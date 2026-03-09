<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn title="Добавить район" class="success" icon dark v-bind="attrs" v-on="on">
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
                  <v-text-field label="Название*" v-model="name" required></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*обязательное поле</small>
        </v-card-text>
        <v-container>
          <v-card-actions class="justify-center">
            <v-btn title="Создать" class="success" icon large dark @click="saveDistrict">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { DistrictsCreate } from '~/apollo/mutation/Districts'
import apollo from '~/mixins/apollo'

export default {
  mixins: [apollo],
  data() {
    return {
      dialog: false,
      name: '',
    }
  },

  methods: {
    async saveDistrict() {
      this.apolloMutation(DistrictsCreate, {
        param: {
          name: this.name
        }
      })

      this.$refs.form.reset()
      this.dialog = false
    }
  }
}
</script>