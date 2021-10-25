export default [
  {
    path: '/acl/roles',
    name: 'manage-roles',
    component: () => import('@/views/modules/access-control/Roles.vue'),
    meta: {
      roles: ['admin'],
    },
  },
  // {
  //   path: '/acl/permissions',
  //   name: 'manage-permissions',
  //   component: () => import('@/views/modules/access-control/Permissions.vue'),
  //   meta: {
  //     roles: ['super'],
  //   },
  // },
]
