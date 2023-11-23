<template>
  <b-card v-if="user">
    <!-- User Avatar & Action Buttons -->
    <div
      align="center"
      style="background: #f0f0f0; padding: 10px"
    >
      <img
        :src="baseServerUrl +'storage/'+ user.photo"
        alt="Photo"
        width="120"
        onerror="this.src='/images/profile-image.png'"
        style="border: #000000 solid 3px; border-radius: 5px"
      >
      <div>
        <br>
        <h5>{{ user.first_name +' ' + user.last_name }}</h5>
        <small class="font-weight-bold">{{ user.email }}</small><br>
        <span class="font-weight-bold">{{ user.phone }}</span>
      </div>
      <!-- <b-avatar
            :src="baseServerUrl +'storage/'+user.photo"
            variant="light-primary"
            onerror="this.src='/images/profile-image.png'"
            size="120px"
            rounded
          /> -->
      <!-- <div class="d-flex flex-column ml-1">
            <div class="mb-1">
              <h2 class="mb-0">
                {{ user.first_name +' ' + user.last_name }}
              </h2>
              <small class="font-weight-bold">{{ user.email }}</small><br>
              <span class="font-weight-bold">{{ user.phone }}</span>
            </div>
          </div> -->
    </div>
    <!-- We want to make sure only the owner of the data can modify it-->
    <div
      v-if="userData.id === user.id"
      class="demo-inline-spacing"
    >
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
    <table class="table-bordered mt-2 mt-xl-0 w-100">
      <tr>
        <th class="padded-th">
          <span>ID: </span>
          <span class="font-weight-bold">{{ user.username }}</span>
        </th>
      </tr>
      <tr>
        <th class="padded-th">
          <span>Gender: </span>
          <span class="font-weight-bold">{{ user.gender }}</span>
        </th>
      </tr>
      <tr v-if="user.dob">
        <th class="padded-th">
          <span>DOB: </span>
          <span class="font-weight-bold">{{ user.dob }}</span>
        </th>
      </tr>
      <tr v-if="user.religion">
        <th class="padded-th">
          <span>Religion: </span>
          <span class="font-weight-bold">{{ (user.religion) ? user.religion : 'Not Set' }}</span>
        </th>
      </tr>
      <tr>
        <th class="padded-th">
          <span>Address: </span>
          <span class="font-weight-bold">{{ user.address }}</span>
        </th>
      </tr>
      <tr v-if="user.state">
        <th class="padded-th">
          <span>State Of Origin: </span>
          <span class="font-weight-bold">{{ (user.state) ? user.state.name : 'Not Set' }}</span>
        </th>
      </tr>
      <tr v-if="user.lga">
        <th class="padded-th">
          <span>LGA of Origin: </span>
          <span class="font-weight-bold">{{ (user.lga) ? user.lga.name : 'Not Set' }}</span>
        </th>
      </tr>
    </table>
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
  BButton, BCard,
} from 'bootstrap-vue'
import { mapGetters } from 'vuex'
// import { avatarText } from '@core/utils/filter'
import UploadPhoto from '@/views/modules/user/UploadPhoto.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BCard,
    BButton,
    // BAvatar,
    UploadPhoto,
  },
  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    // const { resolveUserRoleVariant } = useUsersList()
    return {
      // avatarText,
      // resolveUserRoleVariant,
      form: {
        email: '',
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
    ...mapGetters([
      'userData',
    ]),
  },
  mounted() {
    this.form.email = this.user.email
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

<style scoped>
.card-body {
  padding: 0.5rem;
}
.padded-th {
  padding: 1rem;
}
</style>
