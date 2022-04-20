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

    <!-- Left Col -->
    <div
      v-if="school"
      class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex"
    >

      <h3>
        <div class="demo-inline-spacing">
          <b-badge
            variant="dark"
          >{{ school.current_session.name + ' Session' }}
          </b-badge>
          <b-badge
            variant="dark"
          >{{ school.current_term.name + ' Term' }}
          </b-badge>
        </div>
      </h3>
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
      <b-nav-item
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
      </b-nav-item>
      <user-dropdown />
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav, BNavItem, BBadge,
} from 'bootstrap-vue'
// import Bookmarks from './components/Bookmarks.vue'
// import Locale from './components/Locale.vue'
// import SearchBar from './components/SearchBar.vue'
// import DarkToggler from './components/DarkToggler.vue'
// import CartDropdown from './components/CartDropdown.vue'
import NotificationDropdown from './components/NotificationDropdown.vue'
import UserDropdown from './components/UserDropdown.vue'

export default {
  components: {
    BLink,
    BBadge,

    // Navbar Components
    BNavbarNav,
    BNavItem,
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
    }
  },
  computed: {
    school() {
      return this.$store.getters.userData.school
    },
    roles() {
      return this.$store.getters.userData.roles
    },
    whatsAppNo() {
      return this.$store.getters.userData.whatsapp_no
    },
  },
}
</script>
