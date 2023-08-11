<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn title="Добавить роль" class="success" icon large dark v-bind="attrs" v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="justify-center">
          <span class="text-h5">Создание Роли</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Название Роли*" v-model="role.name" required></v-text-field>
                  <v-text-field label="Комментарий*" v-model="role.comment" required></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*обязательное поле</small>
        </v-card-text>
        <v-container>
          <v-card-actions class="justify-center">
            <v-btn title="Создать" class="success" icon large dark @click="saveRole">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import script from './script'

export default {
  mixins: [script]
}
</script>