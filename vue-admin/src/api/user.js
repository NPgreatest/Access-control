import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin_api/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin_api/info',
    method: 'get',
    headers: { 'Authorization': token }
  })
}

