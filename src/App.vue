<script setup>
import Footer from '@/components/common/Footer.vue'
import Navbar from '@/components/common/Navbar.vue'
import useNotifications from '@/composables/useNotifications'
import { onMounted, ref } from 'vue'
import Alert from './components/common/Alert.vue'
const { notifications, removeNotification } = useNotifications()

const loader = ref(true)

onMounted(async () => {
  setTimeout(() => {
    loader.value = false
  }, 2500)    
})
</script>
<template>
  <template v-if="loader">
    <section class="fixed top-0 z-50 grid h-screen w-full place-content-center bg-black">
      <img src="@/assets/images/iso.png" class="w-28 animate-pulse invert" alt="" />
    </section>
  </template>
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
