import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}
export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data,
  })
}
export function getInfo() {
  return request({
    url: '/auth/user',
    method: 'get',
  })
}

export function logout(data) {
  return request({
    url: '/auth/logout',
    method: 'post',
    data,
  })
}
