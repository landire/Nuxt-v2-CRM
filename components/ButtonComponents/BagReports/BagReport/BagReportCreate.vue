<template>
  <div>
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="success" title="Создать" dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="justify-center">
            <span class="text-h5">Создание Заявки</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form ref="form">
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="title" label="Тема*" required></v-text-field>
                    <v-textarea required label="Описание*" v-model="content" outlined auto-grow></v-textarea>
                    <v-file-input class="mb-3" clearable flat solo @change="selectImage" accept="image/*"></v-file-input>
                    <KeepAlive v-if="image !== undefined">
                      <v-row>
                        <v-col cols="4">
                          <v-img class="d-inline-block" :src="image" width="100%" height="100%"
                            aspect-ratio="1.8"></v-img>
                        </v-col>
                      </v-row>
                    </KeepAlive>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
            <small>*обязательное поле</small>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn class="mb-2 mr-2 success" dark icon large title="Создать" @submit.prevent @click="send">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import script from './script'

export default {
  mixins: [script]
}
</script>