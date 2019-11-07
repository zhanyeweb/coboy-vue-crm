import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/documentary/list',
    method: 'get',
    params: query
  })
}

export function fetchDetail(id) {
  return request({
    url: '/documentary/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/documentary/pv',
    method: 'get',
    params: { pv }
  })
}

export function saveDocumentary(data) {
  return request({
    url: '/documentary/save',
    method: 'post',
    data
  })
}

export function updateDocumentary(data) {
  return request({
    url: '/documentary/update',
    method: 'post',
    data
  })
}
