<template>
  <li
    v-if="canViewVerticalNavMenuLink(item)"
    class="nav-item"
    :class="{
      'active': isActive,
      'disabled': item.disabled
    }"
  >
    <b-link
      v-bind="linkProps"
      class="d-flex align-items-center"
    >
      <feather-icon :icon="item.icon || 'CircleIcon'" />
      <span class="menu-title text-truncate">{{ t(item.title) }}</span>
      <b-badge
        v-if="item.tag"
        pill
        :variant="item.tagVariant || 'primary'"
        class="mr-1 ml-auto"
      >
        {{ item.tag }}
      </b-badge>
    </b-link>
  </li>
</template>

<script>
// import { useUtils as useAclUtils } from '@core/libs/acl'
import { BLink, BBadge } from 'bootstrap-vue'
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import useVerticalNavMenuLink from './useVerticalNavMenuLink'
import mixinVerticalNavMenuLink from './mixinVerticalNavMenuLink'

export default {
  components: {
    BLink,
    BBadge,
  },
  mixins: [mixinVerticalNavMenuLink],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { isActive, linkProps, updateIsActive } = useVerticalNavMenuLink(props.item)
    const { t } = useI18nUtils()
    // const { canViewVerticalNavMenuLink } = useAclUtils()

    return {
      isActive,
      linkProps,
      updateIsActive,

      // ACL
      // canViewVerticalNavMenuLink,

      // i18n
      t,
    }
  },
  methods: {
    // ACL
    canViewVerticalNavMenuLink(item) {
      let hasRole = true
      let hasPermission = true
      const { roles, permissions } = this.$store.getters.userData
      if (item.acl) {
        if (item.acl.roles || item.acl.permissions) {
          // If it has meta.roles or meta.permissions, accessible = hasRole || permission
          hasRole = false
          hasPermission = false
          if (item.acl.roles) {
            hasRole = roles.some(role => item.acl.roles.includes(role))
          }

          if (item.acl.permissions) {
            hasPermission = permissions.some(permission => item.acl.permissions.includes(permission))
          }
        }

        return hasRole || hasPermission
      }

      // If no meta.roles/meta.permissions inputted - the route should be accessible
      return true
    },
  },
}
</script>
