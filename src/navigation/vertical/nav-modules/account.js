export default [
  {
    title: 'Finance',
    icon: 'CreditCardIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      modules: ['account'],
      except: ['super', 'teacher'],
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
        title: 'Income/Expenses',
        route: 'IncomeExpenses',
        acl: {
          modules: ['account'],
          // roles: ['accountant'],
          permissions: ['can view revenue'],
        },
      },
      {
        title: 'Report',
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
