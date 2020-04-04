import request from '@/utils/request'

export function fetchOrderList(query) {
  return request({
    url: '/index.php?m=api&c=order&f=listOrder',
    method: 'get',
    params: query
  })
}

export function viewProduct(query) {
  return request({
    url: '/index.php?m=api&c=order&f=viewProduct',
    method: 'get',
    params: query
  })
}

export function fetchOrder(uuid) {
  return request({
    url: '/index.php?m=api&c=order&f=detail',
    method: 'get',
    params: { uuid }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/contract/pv',
    method: 'get',
    params: { pv }
  })
}

export function saveOrder(data) {
  return request({
    url: '/index.php?m=api&c=order&f=saveOrder',
    method: 'post',
    data
  })
}

export function uploadEnclosures(data) {
  return request({
    url: '/index.php?m=api&c=contract&f=uploadEnclosures',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/index.php?m=api&c=order&f=delete',
    method: 'get',
    params: { id }
  })
}
