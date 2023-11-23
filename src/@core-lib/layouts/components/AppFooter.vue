<template>
  <p class="clearfix mb-0 no-print">
    <span
      v-if="school"
      class="float-md-left d-block d-md-inline-block mt-25"
    >
      Licensed to
      <b-link
        class="ml-25"
        href="#"
      >{{ school.name }}</b-link>
    </span>

    <span class="float-md-right d-none d-md-block">
      Powered By: <b-link
        class="ml-25"
        :href="companyUrl"
        target="_blank"
      >{{ appName }}</b-link> | © 2018 - {{ new Date().getFullYear() }}
      <!-- <feather-icon
        icon="HeartIcon"
        size="21"
        class="text-danger stroke-current"
      /> -->
    </span>
  </p>
</template>

<script>
import { BLink } from 'bootstrap-vue'
import { $themeConfig } from '@themeConfig'

export default {
  components: {
    BLink,
  },
  setup() {
    // App Name
    const { appName, appLogoImage, companyUrl } = $themeConfig.app

    return {
      // App Name
      appName,
      appLogoImage,
      companyUrl,
    }
  },
  computed: {
    school() {
      return this.$store.getters.userData.school
    },
  },
  methods: {
  },
}
</script>
