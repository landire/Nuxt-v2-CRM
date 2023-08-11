<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn title="Создать пользователя" class="success" icon dark v-bind="attrs" v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="justify-center">
          <span class="text-h5">Создание пользователя</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Имя*" v-model="user.name" required></v-text-field>
                  <v-text-field label="Почта*" v-model="user.email" type="email" required></v-text-field>
                  <v-text-field label="Пароль*" v-model="user.password" required></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*обязательное поле</small>
        </v-card-text>
        <v-container>
          <v-card-actions class="justify-center">
            <v-btn title="Создать пользователя" class="success" icon large dark @click="saveUser">
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