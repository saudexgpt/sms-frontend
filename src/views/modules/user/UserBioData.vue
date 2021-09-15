<template>
  <b-card v-if="user !== null">

    <b-row>

      <!-- User Info: Left col -->
      <b-col
        cols="24"
        xl="7"
        class="d-flex justify-content-between flex-column"
      >
        <!-- User Avatar & Action Buttons -->
        <div class="d-flex justify-content-start">
          <b-avatar
            :src="baseServerUrl +'storage/'+user.photo"
            variant="light-primary"
            :text="avatarText(user.last_name +' ' + user.first_name)"
            size="120px"
            rounded
          />
          <div class="d-flex flex-column ml-1">
            <div class="mb-1">
              <h2 class="mb-0">
                {{ user.last_name +', ' + user.first_name }}
              </h2>
              <small class="font-weight-bold">{{ user.email }}</small><br>
              <span class="font-weight-bold">{{ user.phone1 }} | {{ user.phone2 }}</span>
            </div>
            <!-- <div class="d-flex flex-wrap">
              <b-button
                :to="{ name: 'apps-users-edit', params: { id: user.id } }"
                variant="primary"
              >
                Edit
              </b-button>
              <b-button
                variant="outline-danger"
                class="ml-1"
              >
                Delete
              </b-button>
            </div> -->
          </div>
        </div>
      </b-col>
      <b-col
        cols="24"
        xl="5"
      >
        <table class="mt-2 mt-xl-0 w-100">
          <tr>
            <th class="pb-50">
              <feather-icon
                icon="UserIcon"
                class="mr-75"
              />
              <span>ID: </span>
              <span class="font-weight-bold">{{ user.username }}</span>
            </th>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon
                icon="UserIcon"
                class="mr-75"
              />
              <span>Gender: </span>
              <span class="font-weight-bold">{{ user.gender }}</span>
            </th>
          </tr>
          <tr v-if="user.dob">
            <th class="pb-50">
              <feather-icon
                icon="UserIcon"
                class="mr-75"
              />
              <span>DOB: </span>
              <span class="font-weight-bold">{{ user.dob }}</span>
            </th>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon
                icon="MapPinIcon"
                class="mr-75"
              />
              <span>Address: </span>
              <span class="font-weight-bold">{{ user.address }}</span>
            </th>
          </tr>
          <tr v-if="user.state">
            <th class="pb-50">
              <feather-icon
                icon="MapPinIcon"
                class="mr-75"
              />
              <span>State Of Origin: </span>
              <span class="font-weight-bold">{{ (user.state) ? user.state.name : 'Not Set' }}</span>
            </th>
          </tr>
          <tr v-if="user.lga">
            <th class="pb-50">
              <feather-icon
                icon="MapPinIcon"
                class="mr-75"
              />
              <span>LGA of Origin: </span>
              <span class="font-weight-bold">{{ (user.lga) ? user.lga.name : 'Not Set' }}</span>
            </th>
          </tr>
          <tr v-if="user.religion">
            <th class="pb-50">
              <feather-icon
                icon="MapPinIcon"
                class="mr-75"
              />
              <span>Religion: </span>
              <span class="font-weight-bold">{{ (user.religion) ? user.religion : 'Not Set' }}</span>
            </th>
          </tr>
        </table>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import {
  BCard, BAvatar, BRow, BCol,
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'

export default {
  components: {
    BCard,
    // BButton,
    BRow,
    BCol,
    BAvatar,
  },
  props: {
    user: {
      type: Object,
      required: true,
      default: () => (null),
    },
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  setup() {
    // const { resolveUserRoleVariant } = useUsersList()
    return {
      avatarText,
      // resolveUserRoleVariant,
    }
  },
}
</script>

<style>

</style>
