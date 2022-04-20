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
            :text="avatarText(user.first_name +' ' + user.last_name)"
            size="120px"
            rounded
          />
          <div class="d-flex flex-column ml-1">
            <div class="mb-1">
              <h2 class="mb-0">
                {{ user.first_name +' ' + user.last_name }}
              </h2>
              <small class="font-weight-bold">{{ user.email }}</small><br>
              <span class="font-weight-bold">{{ user.phone }}</span>
            </div>
          </div>
        </div>

        <div class="demo-inline-spacing">
          <b-button
            v-if="user.role !== 'student'"
            size="sm"
            variant="primary"
            @click="changePhoto()"
          >
            Change Photo
          </b-button>
          <b-button
            size="sm"
            variant="danger"
            @click="dialogVisible = true"
          >
            Update Password
          </b-button>
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
    <el-dialog
      title="Change Password"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-row
        v-loading="load"
        :gutter="10"
      >
        <el-col :xs="24">
          <el-input
            v-model="form.email"
            disabled
          />
          <br><br>
        </el-col>
        <el-col :xs="24">
          <el-input
            v-model="form.new_password"
            placeholder="Enter New Password"
            type="password"
          />
          <br><br>
        </el-col>
        <el-col :xs="24">
          <el-input
            v-model="form.confirm_password"
            placeholder="Confirm New Password"
            type="password"
          />
        </el-col>
      </el-row>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="danger"
          @click="dialogVisible = false"
        >Cancel</el-button>
        <el-button
          type="success"
          @click="updatePassword()"
        >Submit</el-button>
      </span>
    </el-dialog>
    <upload-photo
      v-if="isUploadPhotoSidebarActive"
      v-model="isUploadPhotoSidebarActive"
      :user="user"
      @save="updatePhoto"
    />
  </b-card>
</template>

<script>
import {
  BButton, BCard, BAvatar, BRow, BCol,
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
import UploadPhoto from '@/views/modules/user/UploadPhoto.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BCard,
    BButton,
    BRow,
    BCol,
    BAvatar,
    UploadPhoto,
  },
  props: {
    user: {
      type: Object,
      required: true,
      default: () => (null),
    },
  },
  data() {
    // const { resolveUserRoleVariant } = useUsersList()
    return {
      avatarText,
      // resolveUserRoleVariant,
      form: {
        email: this.user.email,
        new_password: '',
        confirm_password: '',
      },
      dialogVisible: false,
      load: false,
      isUploadPhotoSidebarActive: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  methods: {
    updatePassword() {
      const app = this
      if (app.form.confirm_password === app.form.new_password && app.form.new_password !== '') {
        app.load = true
        const changePasswordResource = new Resource('user-setup/reset/password')
        changePasswordResource.update(app.user.id, app.form)
          .then(() => {
            app.$message('Password updated successfully')
            app.logout()
          }).catch(error => {
            console.log(error)
            app.load = false
          })
      } else {
        app.$alert('New Password does not match')
      }
    },
    changePhoto() {
      const app = this
      app.isUploadPhotoSidebarActive = true
    },
    updatePhoto(photo) {
      const app = this
      app.user.photo = photo
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login').catch(() => {})
    },
  },
}
</script>

<style>

</style>
