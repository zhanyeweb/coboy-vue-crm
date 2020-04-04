import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/index.php?m=api&f=getMyRoutes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/index.php?m=api&f=getRoles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/index.php?m=api&f=addRole',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/index.php?m=api&f=updateRole&id=${id}`,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/index.php?m=api&f=deleteRole&id=${id}`,
    method: 'delete'
  })
}
