import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/contract/list',
    method: 'get',
    params: query
  })
}

export function fetchDetail(id) {
  return request({
    url: '/contract/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/contract/pv',
    method: 'get',
    params: { pv }
  })
}

export function saveContract(data) {
  return request({
    url: '/contract/save',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/contract/update',
    method: 'post',
    data
  })
}
