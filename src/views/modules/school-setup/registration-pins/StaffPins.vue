<template>
  <b-row>
    <b-col :lg="12">
      <strong>Give this PIN to your staff for registration (if they have not been registered)</strong>
    </b-col>
    <b-col
      v-for="(given_pin, av_index) in given_pins"
      :key="av_index"
      :lg="3"
      :md="4"
      :sm="6"
      :xs="12"
    >
      <b-card
        border-variant="warning"
      >
        <b-card-text>
          <strong>{{ given_pin.pin }}</strong>
        </b-card-text>
      </b-card>
    </b-col>
  </b-row>
</template>
<script>
import {
  BCardText, BRow, BCol, BCard,
} from 'bootstrap-vue'
import Resource from '@/api/resource'

export default {
  components: {
    BCardText,
    // BTabs,
    // BTab,
    // BButton,
    BRow,
    BCol,
    BCard,
    // BFormCheckboxGroup,
  },
  data() {
    return {
      available_pins: [],
      given_pins: [],
      used_pins: [],
      load: false,
      delete_pins: [],
    }
  },
  created() {
    this.fetchStaffPins()
  },
  methods: {
    fetchStaffPins() {
      const app = this
      app.load = true
      const fetchStaffPinsResource = new Resource('school-setup/staff-pins')
      fetchStaffPinsResource.list()
        .then(response => {
          app.sortPins(response.staff_reg_pins)
          app.load = false
        })
    },
    givePin(pin) {
      const app = this
      const message = 'Click OK to confirm that you are giving out this PIN'
      // eslint-disable-next-line no-restricted-globals, no-alert
      if (window.confirm(message)) {
        app.load = true
        const givePinResource = new Resource('school-setup/change-status')
        givePinResource.update(pin.id, { status: 'given' })
          .then(() => {
            app.$message('PIN Issued Successfully')
            app.fetchStaffPins()
          })
      }
    },
    deletePins() {
      const app = this
      const message = 'Click OK to confirm that you are deleting these PINs'
      // eslint-disable-next-line no-restricted-globals, no-alert
      if (window.confirm(message)) {
        app.load = true
        const givePinResource = new Resource('school-setup/delete-pins')
        givePinResource.store({ pins: app.delete_pins })
          .then(() => {
            app.$message('PINs Deleted Successfully')
            app.fetchStaffPins()
          })
      }
    },
    sortPins(pins) {
      const app = this
      const availablePins = []
      const givenPins = []
      const usedPins = []

      pins.forEach(pin => {
        if (pin.status === 'unused') {
          availablePins.push(pin)
        }
        if (pin.status === 'used') {
          usedPins.push(pin)
        }
        if (pin.status === 'given') {
          givenPins.push(pin)
        }
      })
      app.available_pins = availablePins
      app.given_pins = givenPins
      app.used_pins = usedPins
    },
  },
}
</script>
