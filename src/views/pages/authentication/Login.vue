<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Left Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            fluid
            :src="imgUrl"
            alt="Login V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-2"
      >
        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >

          <b-card-title
            class="mb-1 font-weight-bold"
            title-tag="h2"
            align="center"
          >
            <img
              src="/images/logo/logo.png"
              alt="logo"
              width="250"
              class="mx-auto"
            >
          </b-card-title>
          <b-form
            v-loading="loading"
            class="auth-login-form mt-2"
            @submit.prevent="login"
          >
            <!-- email -->
            <b-form-group
              label="Username"
              label-for="login-email"
            >
              <b-form-input
                id="login-email"
                v-model="userEmail"
                name="login-email"
                placeholder="Enter username"
              />
            </b-form-group>

            <!-- forgot password -->
            <b-form-group>
              <b-input-group
                class="input-group-merge"
              >
                <b-form-input
                  id="login-password"
                  v-model="password"
                  class="form-control-merge"
                  :type="passwordFieldType"
                  name="login-password"
                  placeholder="Password"
                />
                <b-input-group-append is-text>
                  <feather-icon
                    class="cursor-pointer"
                    :icon="passwordToggleIcon"
                    @click="togglePasswordVisibility"
                  />
                </b-input-group-append>
              </b-input-group>
            </b-form-group>

            <!-- checkbox -->
            <!-- <b-form-group>
                <b-form-checkbox
                  id="remember-me"
                  v-model="status"
                  name="checkbox-1"
                >
                  Remember Me
                </b-form-checkbox>
              </b-form-group> -->

            <!-- submit buttons -->
            <b-button
              variant="primary"
              block
              @click="login"
            >
              Sign in
            </b-button>
          </b-form>

        </b-col>
      </b-col>
    <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
// import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BRow, BCol, BFormGroup, BFormInput, BInputGroupAppend, BInputGroup, BCardTitle, BImg, BForm, BButton, VBTooltip,
} from 'bootstrap-vue'
// import useJwt from '@/auth/jwt/useJwt'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import store from '@/store'
// import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import { isUserLoggedIn } from '@/utils/auth' // get token from cookie

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BRow,
    BCol,
    // BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    // BFormCheckbox,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    // ValidationProvider,
    // ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: '',
      password: 'password',
      userEmail: 'admin@demo.com',
      sideImg: require('@/assets/images/pages/login-v2.svg'),

      // validation rules
      required,
      email,
      loading: false,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    // login() {
    //   this.$refs.loginForm.validate().then(success => {
    //     if (success) {
    //       useJwt.login({
    //         email: this.userEmail,
    //         password: this.password,
    //       })
    //         .then(response => {
    //           const { userData } = response.data
    //           useJwt.setToken(response.data.accessToken)
    //           useJwt.setRefreshToken(response.data.refreshToken)
    //           localStorage.setItem('userData', JSON.stringify(userData))
    //           this.$ability.update(userData.ability)

    //           // ? This is just for demo purpose as well.
    //           // ? Because we are showing eCommerce app's cart items count in navbar
    //           this.$store.commit('app-ecommerce/UPDATE_CART_ITEMS_COUNT', userData.extras.eCommerceCartItemsCount)

    //           // ? This is just for demo purpose. Don't think CASL is role based in this case, we used role in if condition just for ease
    //           this.$router.replace(getHomeRouteForLoggedInUser(userData.role))
    //             .then(() => {
    //               this.$toast({
    //                 component: ToastificationContent,
    //                 position: 'top-right',
    //                 props: {
    //                   title: `Welcome ${userData.fullName || userData.username}`,
    //                   icon: 'CoffeeIcon',
    //                   variant: 'success',
    //                   text: `You have successfully logged in as ${userData.role}. Now you can start to explore!`,
    //                 },
    //               })
    //             })
    //         })
    //         .catch(error => {
    //           this.$refs.loginForm.setErrors(error.response.data.error)
    //         })
    //     }
    //   })
    // },
    isLoggedIn() {
      // If user is already logged in notify
      if (isUserLoggedIn) {
        return true
      }
      return false
    },
    login() {
      // if (this.isLoggedIn()) {
      //   window.location = '/dashboard-ecommerce' // this.$router.push('/').catch(() => {}) // window.location = '/dashboard/ecommerce'
      //   this.$toast({
      //     component: ToastificationContent,
      //     position: 'top-right',
      //     props: {
      //       title: 'Already Logged In',
      //       icon: 'BellIcon',
      //       variant: 'warning',
      //       text: 'You are already logged in!',
      //     },
      //   })
      //   return
      // }

      // Loading
      this.loading = true

      const payload = {
        userDetails: {
          username: this.userEmail,
          password: this.password,
          // remember_me: this.checkbox_remember_me,
        },
      }
      this.$store
        .dispatch('user/login', payload.userDetails)
        .then(() => {
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Login Success',
              icon: 'BellIcon',
              variant: 'success',
              text: 'Welcome',
            },
          })
          // we load the browser this once
          window.location = '/' // this.$router.push({ path: '/' }).catch(() => {}) // window.location = '/dashboard/ecommerce'
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: error.response.statusText,
              icon: 'CoffeeIcon',
              variant: 'danger',
              text: error.response.data.message,
            },
          })
          // console.log(error.response)
        })

      //   this.$store.dispatch('auth/login', payload)
      //     .then(() => { this.$vs.loading.close() })
      //     .catch(error => {
      //       this.$vs.loading.close()
      //       this.$vs.notify({
      //         title: 'Error',
      //         text: error.message,
      //         iconPack: 'feather',
      //         icon: 'icon-alert-circle',
      //         color: 'danger'
      //       })
      //     })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
