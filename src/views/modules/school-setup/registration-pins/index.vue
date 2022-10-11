<template>
  <b-card>
    <span class="pull-right">
      <b-button
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="gradient-primary"
        size="sm"
        @click="isCreatePinSidebarActive = true"
      >
        <feather-icon
          icon="FilePlusIcon"
          class="mr-50"
        />
        <span class="align-middle">Generate</span>
      </b-button>
    </span>
    <b-tabs>
      <!-- top position -->
      <b-tab
        title="Staff PINs"
        lazy
      >
        <staff-pins />
      </b-tab>
      <!-- left position -->
      <b-tab
        title="Student PINs"
        lazy
      >
        <student-pins />
      </b-tab>
    </b-tabs>
    <generate-pins
      v-if="isCreatePinSidebarActive"
      v-model="isCreatePinSidebarActive"
    />
  </b-card>
</template>

<script>
import {
  BTabs, BTab, BButton, BCard,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import StaffPins from './StaffPins.vue'
import StudentPins from './StudentPins.vue'
import GeneratePins from './GeneratePins.vue'

export default {
  components: {
    BCard,
    BTabs,
    BTab,
    BButton,
    StaffPins,
    StudentPins,
    GeneratePins,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      isCreatePinSidebarActive: false,
    }
  },
}
</script>
