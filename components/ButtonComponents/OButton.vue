<template>
  <div class="ma-5 button-container elevation-6">
    <div class="pa-1 button-container-title">
      <strong>
        {{ buttonTitle }}
      </strong>
    </div>
    <div v-for="button in buttons" :key="button.name">
      <KeepAlive>
        <div v-if="buttons.indexOf(button) <= 2">
          <div class="d-flex" style="overflow: hidden;">
            <KeepAlive>
              <div v-if="button.counterData" class="red organizer-counter">{{ button.counterData }}</div>
            </KeepAlive>
            <v-divider style="margin-right: 1px;" vertical></v-divider>
            <NuxtLink no-prefetch class="button-container-item v-btn v-btn--has-bg theme--light v-size--default"
              :to="button.link">
              {{ button.name }}</NuxtLink>
          </div>
          <v-divider></v-divider>
        </div>
      </KeepAlive>
    </div>

    <KeepAlive>
      <v-menu v-if="buttons.length >= 4" :offset-x="true">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-if="buttons.length >= 4" block v-bind="attrs" v-on="on" class="button-container-item">
            <v-icon>mdi-chevron-double-right</v-icon>
          </v-btn>
        </template>

        <div v-for="button in buttons" :key="button.name">
          <KeepAlive>
            <div v-if="buttons.indexOf(button) >= 3">
              <NuxtLink no-prefetch class="button-container-item v-btn v-btn--block v-btn--has-bg theme--light v-size--default"
                :to="button.link">
                {{ button.name }}</NuxtLink>
              <v-divider></v-divider>
            </div>
          </KeepAlive>
        </div>
      </v-menu>
    </KeepAlive>
  </div>
</template>

<script>

export default {
  props: ['buttons', 'buttonTitle']
}
</script>