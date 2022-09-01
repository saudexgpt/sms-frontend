export default [
  {
    title: 'Account',
    icon: 'CreditCardIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      modules: ['account'],
      except: ['super'],
    },
    children: [
      {
        title: 'Manage Fees',
        route: 'FeeSettings',
        acl: {
          modules: ['account'],
          // roles: ['accountant'],
          permissions: ['can view fees settings', 'can view fees payments'],
        },
      },
      // {
      //   title: 'Fee Payments',
      //   route: 'FeePayments',
      //   acl: {
      //     modules: ['account'],
      //     // roles: ['accountant'],
      //     permissions: ['can view fees payments'],
      //   },
      // },
      {
        title: 'Manage Salary',
        route: 'StaffSalary',
        acl: {
          modules: ['account'],
          // roles: ['accountant'],
          permissions: ['can view staff salary'],
        },
      },
      {
        title: 'Statements',
        route: 'Revenue',
        acl: {
          modules: ['account'],
          // roles: ['accountant'],
          permissions: ['can view revenue'],
        },
      },
      {
        title: 'My Fees',
        route: 'StudentFees',
        acl: {
          modules: ['account'],
          roles: ['student'],
        },
      },
      {
        title: 'School Fees',
        route: 'StudentFees',
        acl: {
          modules: ['account'],
          roles: ['parent'],
        },
      },
    ],
  },
]
