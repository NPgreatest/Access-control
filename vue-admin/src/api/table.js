import request from '@/utils/request'

export function getList(token) {
  return request({
    url: '/admin_api/permissions',
    method: 'get',
    headers: { 'Authorization': token }
  })
}
