import request from '@/utils/request'

export function fetchPurchasesList(query) {
  return request({
    url: '/index.php?m=api&c=purchases&f=listPurchases',
    method: 'get',
    params: query
  })
}

export function fetchPurchases(uuid) {
  return request({
    url: '/index.php?m=api&c=purchases&f=detail',
    method: 'get',
    params: { uuid }
  })
}

export function del(id) {
  return request({
    url: '/index.php?m=api&c=purchases&f=delete',
    method: 'get',
    params: { id }
  })
}

export function savePurchases(data) {
  return request({
    url: '/index.php?m=api&c=purchases&f=savePurchases',
    method: 'post',
    data
  })
}
