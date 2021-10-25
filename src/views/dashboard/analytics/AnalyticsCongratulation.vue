<template>
  <b-card
    v-if="data"
    text-variant="center"
    class="card card-congratulations"
  >
    <!-- images -->
    <b-img
      :src="require('@/assets/images/elements/decore-left.png')"
      class="congratulations-img-left"
    />
    <b-img
      :src="require('@/assets/images/elements/decore-right.png')"
      class="congratulations-img-right"
    />
    <!--/ images -->

    <!-- <b-avatar
      variant="primary"
      size="50"
      class="shadow mb-2"
    >
      <feather-icon
        size="28"
        icon="AwardIcon"
      />
    </b-avatar> -->
    <b-avatar
      size="75"
      variant="dark"
      :src="baseServerUrl +'storage/'+data.photo"
    />
    <h3 class="mb-1 mt-10 text-white">
      Welcome {{ data.first_name }}<br>
      {{ data.username }}
    </h3>
    <b-card-text
      v-if="currentClass !== ''"
      class="m-auto w-75"
    >
      <h4 class="mb-1 mt-10 text-white">
        Your current class is: <strong>{{ currentClass }}</strong>
      </h4>
      <router-link
        to="/profile"
        class="text-white"
      >
        Click Here to see your profile
      </router-link>
    </b-card-text>
  </b-card>
</template>

<script>
import {
  BCard, BImg, BAvatar, BCardText,
} from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BAvatar,
    BImg,
    BCardText,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    currentClass: {
      type: String,
      default: () => '',
    },
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
}
</script>
