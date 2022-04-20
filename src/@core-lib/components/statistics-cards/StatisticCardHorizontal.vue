<template>
  <b-card
    no-body
    :bg-variant="bg"
  >
    <b-card-body class="d-flex justify-content-between align-items-center">
      <div class="truncate">
        <h2
          class="mb-25 font-weight-bolder"
          :style="'color: ' + color"
        >
          {{ statistic }}
        </h2>
        <span :style="'color: ' + color">{{ statisticTitle }}</span>
      </div>
      <b-avatar
        :variant="`light-${color}`"
        size="45"
      >
        <feather-icon
          size="21"
          :icon="icon"
        />
      </b-avatar>
    </b-card-body>
  </b-card>
</template>

<script>
import { BCard, BCardBody, BAvatar } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardBody,
    BAvatar,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    statistic: {
      type: [Number, String],
      required: true,
    },
    statisticTitle: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'dark',
    },
    bg: {
      type: String,
      default: 'white',
    },
  },
}
</script>
