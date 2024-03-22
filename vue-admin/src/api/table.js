import request from '@/utils/request'

export function getList(token) {
  return request({
    url: '/admin_api/permissions',
    method: 'get',
    headers: { 'Authorization': token }
  })
}

export function changePassword(token,username, newPassword) {
  return request({
    url: '/admin_api/change_password',
    method: 'post',
    headers: { 'Authorization': token },
    data: { username, newPassword}
  })
}

export function updatePermissions(token,userId, teamIds, accessLevel) {
  // Ensure the required parameters are provided
  if (!token || !userId || !teamIds || !accessLevel) {
    throw new Error('Missing required parameters: token, teamIds, accessLevel');
  }

  return request({
    url: '/admin_api/permissions/update',
    method: 'post',
    data: {userId, teamIds, accessLevel },
    headers: { 'Authorization': token }
  })
}


export function delPermissions(token,userId) {
  // Ensure the required parameters are provided
  if (!token || !userId) {
    throw new Error('Missing required parameters: token, teamIds, accessLevel');
  }
  return request({
    url: '/admin_api/permissions/delete',
    method: 'post',
    data: {userId},
    headers: { 'Authorization': token }
  })
}
