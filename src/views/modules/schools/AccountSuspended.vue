<template>
  <!-- Error page-->
  <div class="misc-wrapper">
    <div class="misc-inner p-2 p-sm-3">
      <div class="w-100 text-center">
        <!-- image -->
        <img
          fluid
          src="@/assets/images/suspended.png"
          alt="Error page"
          width="250"
        >
        <div
          v-if="checkRole(['admin'])"
          class="mb-1"
        >
          <h3>Dear {{ userData.school.name }}, </h3>
          <p>Your account has been suspended due to subscription issue. <br> Kindly contact the Account Department at School-Point. <br> We regret any inconveniences this might cause you.</p>

        </div>
        <div
          v-else
          class="mb-1"
        >
          <h3>Dear {{ userData.first_name }}, </h3>
          <p>Account Suspended Temporarily.<br> Kindly contact the Administrator.</p>
        </div>
      </div>
    </div>
  </div>
<!-- / Error page-->
</template>

<script>
/* eslint-disable global-require */
import checkRole from '@/utils/role'

export default {
  data() {
    return {
    }
  },
  computed: {
    userData() {
      return this.$store.getters.userData
    },
  },
  methods: {
    checkRole,
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
