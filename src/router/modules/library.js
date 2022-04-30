export default [
  {
    path: '/library/books',
    name: 'LibraryBooks',
    component: () => import('@/views/modules/library/index.vue'),
    meta: {
      roles: ['librarian'],
    },
  },
  // {
  //   path: '/library/add-book',
  //   name: 'AddBook',
  //   component: () => import('@/views/modules/library/partials/AddBook.vue'),
  //   meta: {
  //     roles: ['librarian'],
  //   },
  // },
  {
    path: '/library/borrowed-books',
    name: 'BorrowedBooks',
    component: () => import('@/views/modules/library/BorrowedBooks.vue'),
    meta: {
      roles: ['librarian', 'staff', 'student'],
    },
  },
  {
    path: '/library/available-books',
    name: 'AvailableBooks',
    component: () => import('@/views/modules/library/AvailableBooks.vue'),
    meta: {
      roles: ['librarian', 'staff', 'student'],
    },
  },
]
