import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/index.php?m=api&f=login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/index.php?m=api&f=getUserInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/index.php?m=api&f=logout',
    method: 'post'
  })
}
