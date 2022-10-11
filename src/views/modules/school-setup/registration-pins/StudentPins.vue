<template>
  <b-tabs
    v-loading="load"
    vertical
    nav-wrapper-class="nav-vertical"
  >
    <b-tab
      active
      title="General PIN"
    >
      <b-row>
        <b-col :lg="12">
          <strong>Give this PIN to your Returning Students for registration (if they have not been registered)</strong>
        </b-col>
        <b-col
          v-for="(generalPin, av_index) in generalPins"
          :key="av_index"
          :lg="3"
          :md="4"
          :sm="6"
          :xs="12"
        >
          <b-card
            border-variant="primary"
          >
            <b-card-text>
              <strong>{{ generalPin.pin }}</strong>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>

    </b-tab>
    <b-tab
      title="Available Personal PINs"
    >
      <h3>List of Available PINs</h3>
      <b-row>
        <b-col
          v-for="(available_pin, av_index) in available_pins"
          :key="av_index"
          :lg="3"
          :md="4"
          :sm="6"
          :xs="12"
        >
          <b-card
            border-variant="primary"
          >
            <b-card-text>
              <strong>{{ available_pin.pin }}</strong>
              <b-button
                variant="success"
                size="sm"
                @click="givePin(available_pin)"
              >
                Issue PIN
              </b-button>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>

    </b-tab>
    <b-tab title="Issued Personal PINs">
      <h3>List of Issued PINs</h3>
      <b-row>
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
    </b-tab>
    <b-tab title="Used Personal PINs">
      <h3>List of Used PINs</h3>
      <small>Pick the PINs you wish to delete and then click on </small>
      <b-button
        variant="danger"
        size="sm"
        :disabled="delete_pins.length < 1"
        @click="deletePins()"
      >
        Delete PINs
      </b-button>
      <br>
      <br>
      <b-row>
        <b-col
          v-for="(used_pin, av_index) in used_pins"
          :key="av_index"
          :lg="3"
          :md="4"
          :sm="6"
          :xs="12"
        >
          <b-card
            border-variant="danger"
          >
            <b-card-text>
              <!-- <strong>{{ used_pin.pin }}</strong> -->
              <b-form-checkbox-group
                v-model="delete_pins"
                :options="[used_pin]"
                value-field="id"
                text-field="pin"
              />
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-tab>
  </b-tabs>
</template>

<script>
import {
  BTabs, BTab, BCardText, BButton, BRow, BCol, BCard, BFormCheckboxGroup,
} from 'bootstrap-vue'
import Resource from '@/api/resource'

export default {
  components: {
    BCardText,
    BTabs,
    BTab,
    BButton,
    BRow,
    BCol,
    BCard,
    BFormCheckboxGroup,
  },
  data() {
    return {
      available_pins: [],
      given_pins: [],
      used_pins: [],
      generalPins: [],
      load: false,
      delete_pins: [],
    }
  },
  created() {
    this.fetchStudentPins()
  },
  methods: {
    fetchStudentPins() {
      const app = this
      app.load = true
      const fetchStstudentPinsResource = new Resource('school-setup/students-pins')
      fetchStstudentPinsResource.list()
        .then(response => {
          app.sortPins(response.student_reg_pins)
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
            app.fetchStudentPins()
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
            app.fetchStudentPins()
          })
      }
    },
    sortPins(pins) {
      const app = this
      const availablePins = []
      const givenPins = []
      const usedPins = []
      const generalPins = []

      pins.forEach(pin => {
        if (pin.is_general === 1) {
          generalPins.push(pin)
        }
        if (pin.status === 'unused') {
          availablePins.push(pin)
        }
        if (pin.status === 'used') {
          usedPins.push(pin)
        }
        if (pin.status === 'given' && pin.is_general === 0) {
          givenPins.push(pin)
        }
      })
      app.available_pins = availablePins
      app.given_pins = givenPins
      app.used_pins = usedPins
      app.generalPins = generalPins
    },
  },
}
</script>
