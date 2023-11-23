<template>
  <div v-loading="loading">
    <el-card v-loading="loading_session">
      <div slot="header">
        <b-row>
          <b-col
            cols="12"
          >
            <h4>Activate Academic Session</h4>
          </b-col>
        </b-row>
      </div>
      <b-row>

        <!-- first name -->
        <b-col cols="8"><el-select
          v-model="current_session"
          style="width: 100%;"
          placeholder="Select Session"
          filterable
        >
          <el-option
            v-for="(session, index) in sessions"
            :key="index"
            :label="session.name"
            :value="session.id"
          />
        </el-select>
        </b-col>
        <!-- submit and reset -->
        <b-col cols="4">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="submit"
            variant="primary"
            class="mr-1"
            @click="activateSession()"
          >
            Activate
          </b-button>
        </b-col>
      </b-row>
      <div class="demo-spacing-0">
        <b-alert
          variant="success"
          show
        >
          <div class="alert-body">
            <span><strong>{{ saved_current_session.name }} Session</strong> is currently active</span>
          </div>
        </b-alert>
      </div>
    </el-card>
    <div class="row" />
    <div class="row" />
    <el-card v-loading="loading_term">
      <div slot="header">
        <b-row>
          <b-col
            cols="12"
          >
            <h4>Activate Term</h4>
          </b-col>
        </b-row>
      </div>
      <b-row>

        <!-- first name -->
        <b-col cols="8">
          <el-select
            v-model="current_term"
            style="width: 100%;"
            placeholder="Select Term"
            filterable
          >
            <el-option
              v-for="(term, index) in terms"
              :key="index"
              :label="term.name"
              :value="term.id"
            />
          </el-select>
        </b-col>
        <!-- submit and reset -->
        <b-col cols="4">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mr-1"
            @click="activateTerm()"
          >
            Activate
          </b-button>
        </b-col>
      </b-row>
      <div class="demo-spacing-0">
        <b-alert
          variant="success"
          show
        >
          <div class="alert-body">
            <span><strong>{{ saved_current_term.name }} Term</strong> is currently active</span>
          </div>
        </b-alert>
      </div>
    </el-card>
  </div>

</template>

<script>
import {
  BButton, BRow, BCol, BAlert,
} from 'bootstrap-vue'
// import vSelect from 'vue-select'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
    BAlert,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      sessions: [],
      terms: [],
      current_session: '',
      current_term: '',
      saved_current_session: {
        name: '',
      },
      saved_current_term: {
        name: '',
      },
      loading: false,
      loading_session: false,
      loading_term: false,
    }
  },
  created() {
    this.fetchSessionAndTerm()
  },
  methods: {
    fetchSessionAndTerm() {
      const app = this
      app.loading = true
      const fetchfetchSessionAndTermResource = new Resource('school-setup/fetch-session-and-term')
      fetchfetchSessionAndTermResource.list()
        .then(response => {
          app.sessions = response.sessions
          app.terms = response.terms
          app.saved_current_session = response.current_session
          app.current_session = response.current_session.id
          app.saved_current_term = response.current_term
          app.current_term = response.current_term.id
          app.loading = false
        })
    },
    activateSession() {
      const app = this
      app.loading_session = true
      const param = {
        current_session: app.current_session,
      }
      const activateSessionResource = new Resource('school-setup/session/activate')
      activateSessionResource.store(param)
        .then(response => {
          app.saved_current_session = response.current_session
          app.current_session = response.current_session.id
          app.loading_session = false
        })
    },
    activateTerm() {
      const app = this
      app.loading_term = true
      const param = {
        current_term: app.current_term,
      }
      const activateTermResource = new Resource('school-setup/term/activate')
      activateTermResource.store(param)
        .then(response => {
          app.saved_current_term = response.current_term
          app.current_term = response.current_term.id
          app.loading_term = false
        })
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
