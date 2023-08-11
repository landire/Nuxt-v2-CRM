<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn title="Создать подчиненную заявку" class="mb-10 fixed" fab small color="success" v-bind="attrs" v-on="on">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
          <path fill="#FFFFFF" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="justify-center">
        <span>Создание дочерней заявки</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="report.title" label="Тема" required></v-text-field>
                <v-textarea required label="Описание" v-model="report.content" outlined auto-grow></v-textarea>
                <v-file-input class="mb-3" clearable flat solo @change="selectImage" accept="image/*"
                  ></v-file-input>
                <KeepAlive v-if="report.image !== undefined">
                  <v-row>
                    <v-col cols="4">
                      <v-img class="d-inline-block" :src="report.image" width="100%" height="100%" aspect-ratio="1.8"></v-img>
                    </v-col>
                  </v-row>
                </KeepAlive>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-container>
        <v-card-actions class="justify-center">
          <v-btn title="Создать" class="mb-2 mr-2 success" icon large dark @click="send">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style scoped>

.fixed {
  position: fixed;
  bottom: -25px;
  right: 10px;
}
</style>

<script>
import script from './script'

export default {
  mixins: [script]
}
</script>