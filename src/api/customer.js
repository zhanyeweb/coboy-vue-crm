import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/customer/list',
    method: 'get',
    params: query
  })
}

export function fetchCustomer(id) {
  return request({
    url: '/customer/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/customer/pv',
    method: 'get',
    params: { pv }
  })
}

export function saveCustomer(data) {
  return request({
    url: '/customer/save',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
