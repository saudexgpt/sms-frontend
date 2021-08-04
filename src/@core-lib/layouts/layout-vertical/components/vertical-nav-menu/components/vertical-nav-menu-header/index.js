import { useUtils as useI18nUtils } from '@core/libs/i18n'
import store from '@/store'
// import { useUtils as useAclUtils } from '@core/libs/acl'

const { t } = useI18nUtils()
// const { canViewVerticalNavMenuHeader } = useAclUtils()

function canViewVerticalNavMenuHeader(item) {
  let hasRole = true
  let hasPermission = true
  const { roles, permissions } = store.getters.userData
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
}
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  render(h) {
    const span = h('span', {}, t(this.item.header))
    const icon = h('feather-icon', { props: { icon: 'MoreHorizontalIcon', size: '18' } })
    if (canViewVerticalNavMenuHeader(this.item)) {
      return h('li', { class: 'navigation-header text-truncate' }, [span, icon])
    }
    return h()
  },
}
