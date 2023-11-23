<template>
  <div
    class="navbar-container d-flex content align-items-center"
    :style="'background: ' + school.navbar_bg"
  >
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>
    <div
      v-if="school"
      class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex"
    >
      <div v-if="roles.includes('admin')">
        <div class="demo-inline-spacing">
          <el-tag
            v-if="systemSetSession.id === school.current_session.id"
          >{{ school.current_session.name + ' Session' }}
          </el-tag>
          <el-tag
            v-else
            id="popover-session"
          >{{ school.current_session.name + ' Session' }}
          </el-tag>
          <el-tag
            v-if="systemSetTerm.id === school.current_term.id"
          >{{ school.current_term.name + ' Term' }}
          </el-tag>
          <el-tag
            v-else
            id="popover-term"
          >{{ school.current_term.name + ' Term' }}
          </el-tag>
        </div>

        <b-popover
          ref="popover"
          v-loading="loading_session"
          target="popover-session"
          triggers="click"
          :show.sync="sessionPopoverShow"
          placement="bottom"
          container="my-container"
          variant="primary"
        >
          <template v-slot:title>
            <div class="d-flex justify-content-between align-items-center">
              <span>{{ 'Update to ' + systemSetSession.name + ' session' }}</span>
              <!-- <b-button
                class="close"
                variant="transparent"
                aria-label="Close"
              >
                <span
                  class="d-inline-block text-white"
                  aria-hidden="true"
                >&times;</span>
              </b-button> -->
            </div>
          </template>

          <div>
            <b-button
              size="sm"
              variant="primary"
              @click="activateSession()"
            >
              Update Now
            </b-button>
          </div>
        </b-popover>
        <b-popover
          ref="popover"
          v-loading="loading_term"
          target="popover-term"
          triggers="click"
          :show.sync="termPopoverShow"
          placement="right"
          container="my-container"
          variant="primary"
        >
          <template v-slot:title>
            <div class="d-flex justify-content-between align-items-center">
              <span>{{ 'Update to ' + systemSetTerm.name + ' Term' }}</span>
            </div>
          </template>

          <div>
            <b-button
              size="sm"
              variant="primary"
              @click="activateTerm()"
            >
              Update Now
            </b-button>
          </div>
        </b-popover>

      </div>
      <div v-else>
        <div class="demo-inline-spacing">
          <el-tag>{{ school.current_session.name + ' Session' }}
          </el-tag>
          <el-tag>{{ school.current_term.name + ' Term' }}
          </el-tag>
        </div>
      </div>

      <!-- Bookmarks Container -->
      <!-- <bookmarks /> -->
    </div>
    <b-navbar-nav class="nav align-items-center ml-auto">
      <b-nav-item to="/apps/email">
        <el-tooltip
          class="item"
          effect="dark"
          content="In-App Messaging"
          placement="top-start"
        >
          <feather-icon
            icon="MailIcon"
            size="21"
          />
        </el-tooltip>
      </b-nav-item>
      <el-tooltip
        class="item"
        effect="dark"
        content="Notification"
        placement="top-start"
      >
        <notification-dropdown />
      </el-tooltip>
      <!-- <b-nav-item
        v-if="roles.includes('admin')"
        :href="'https://web.whatsapp.com/send?phone=' + whatsAppNo"
        target="_blank"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="WhatsApp Support Chat"
          placement="top-start"
        >
          <img src="@/assets/images/whatsapp-logo.png">
        </el-tooltip>
      </b-nav-item> -->
      <user-dropdown />
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav, BNavItem, BButton, BPopover,
} from 'bootstrap-vue'
// import Bookmarks from './components/Bookmarks.vue'
// import Locale from './components/Locale.vue'
// import SearchBar from './components/SearchBar.vue'
// import DarkToggler from './components/DarkToggler.vue'
// import CartDropdown from './components/CartDropdown.vue'
import NotificationDropdown from './components/NotificationDropdown.vue'
import UserDropdown from './components/UserDropdown.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BLink,

    // Navbar Components
    BNavbarNav,
    BNavItem,
    BButton,
    BPopover,
    // Bookmarks,
    // Locale,
    // SearchBar,
    // DarkToggler,
    // CartDropdown,
    NotificationDropdown,
    UserDropdown,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      background: 'linear-gradient(118deg, #064ee9, rgba(6, 78, 233, 0.7))',
      termPopoverShow: true,
      sessionPopoverShow: true,
      loading_session: false,
      loading_term: false,

    }
  },
  computed: {
    school() {
      return this.$store.getters.userData.school
    },
    roles() {
      return this.$store.getters.userData.roles
    },
    systemSetSession() {
      return this.$store.getters.userData.system_set_session
    },
    systemSetTerm() {
      return this.$store.getters.userData.system_set_term
    },
    whatsAppNo() {
      return this.$store.getters.userData.whatsapp_no
    },
  },
  methods: {
    activateSession() {
      const app = this
      app.loading_session = true
      const param = {
        current_session: app.systemSetSession.id,
      }
      const activateSessionResource = new Resource('school-setup/session/activate')
      activateSessionResource.store(param)
        .then(() => {
          app.loading_session = true
          app.$store.dispatch('user/getInfo')
          app.sessionPopoverShow = false
        })
    },
    activateTerm() {
      const app = this
      app.loading_term = true
      const param = {
        current_term: app.systemSetTerm.id,
      }
      const activateTermResource = new Resource('school-setup/term/activate')
      activateTermResource.store(param)
        .then(() => {
          app.$store.dispatch('user/getInfo')
          app.loading_term = false
          app.termPopoverShow = false
        })
    },
  },
}
</script>
<style scoped>
.el-tag {
  background: rgb(255, 255, 255, 0.9);
  color: #000000;
  border-radius: 30px !important;
  border: 2px solid #333333;
  font-weight: 600;
}
</style>
