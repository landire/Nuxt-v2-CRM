<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-tabs style="border-radius: 5px;" centered align-with-title fixed-tabs>
        <v-tab>Список ролей</v-tab>
        <NuxtLink no-prefetch to="admin/users" tabindex="0" role="tab" class="v-tab">Пользователи</NuxtLink>
        <NuxtLink no-prefetch to="admin/requests" tabindex="0" role="tab" class="v-tab">Заявки</NuxtLink>
        <NuxtLink no-prefetch to="admin/telegram" tabindex="0" role="tab" class="v-tab">Телеграмм группы</NuxtLink>
        <v-tab-item class="app-light">
          <v-row>
            <v-col cols="12">
              <RolesList />
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
    </v-container>
  </div>
</template>

<script>
import RolesList from '~/components/OrganizerComponents/Admin/Roles/RolesList.vue'
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'

export default {
  middleware: 'Admin',
  components: { RolesList, RoutePanel },
  head: {
    title: 'Real Web - Кабинет администратора',
  },

  data() {
    return {
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Кабинет администратора', path: '/admin' },
      ],
    }
  }
}
</script>