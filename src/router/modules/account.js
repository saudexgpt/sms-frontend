export default [
  {
    path: '/account/manage-fees',
    name: 'FeeSettings',
    component: () => import('@/views/modules/account/FeeSettings/ManageFees.vue'),
    meta: {
      permissions: ['can view fees settings', 'can view fees payments'],
    },
  },
  // {
  //   path: '/account/fee-payments',
  //   name: 'FeePayments',
  //   component: () => import('@/views/modules/account/FeePayments/ManagePayments.vue'),
  //   meta: {
  //     permissions: ['can view fees payments'],
  //   },
  // },
  {
    path: '/account/my-fees',
    name: 'StudentFees',
    component: () => import('@/views/modules/account/StudentFees.vue'),
    meta: {
      roles: ['student', 'parent'],
    },
  },
  {
    path: '/account/staff-salary',
    name: 'StaffSalary',
    component: () => import('@/views/modules/account/Salary/ManageStaffSalary.vue'),
    meta: {
      permissions: ['can view staff salary'],
    },
  },
  {
    path: '/account/revenue',
    name: 'Revenue',
    component: () => import('@/views/modules/account/Revenue/Revenue.vue'),
    meta: {
      permissions: ['can view revenue'],
    },
  },
  {
    path: '/account/income-and-expenses',
    name: 'IncomeExpenses',
    component: () => import('@/views/modules/account/Revenue/IncomeExpenses.vue'),
    meta: {
      permissions: ['can view revenue'],
    },
  },

]
