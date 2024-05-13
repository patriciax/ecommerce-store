<script setup>
import Footer from '@/components/common/Footer.vue'
import Navbar from '@/components/common/Navbar.vue'
import useNotifications from '@/composables/useNotifications'
import Alert from './components/common/Alert.vue'

const { notifications, removeNotification } = useNotifications()


</script>
<template>
  <div class="fixed bottom-0 right-0 z-50 m-5">
    <Alert
      v-for="(notification, index) in notifications"
      :key="index"
      :title="notification.title"
      :isLink="notification.isLink"
      :description="notification.description"
      :typeAlert="notification.type"
      class="mt-5"
      @close="removeNotification(notification.id)"
    />
  </div>
  <Navbar />
  <section class="mt-20 min-h-[60vh]">
    <RouterView />
  </section>
  <Footer />
</template>
