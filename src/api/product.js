import request from '@/utils/request'

export function fetchProductList(query) {
  return request({
    url: '/index.php?m=api&c=product&f=listProduct',
    method: 'get',
    params: query
  })
}

export function fetchListHighSeasCustomer(query) {
  return request({
    url: '/index.php?m=api&c=customer&f=listHighSeasCustomer',
    method: 'get',
    params: query
  })
}

export function fetchProduct(uuid) {
  return request({
    url: '/index.php?m=api&c=product&f=detail',
    method: 'get',
    params: { uuid }
  })
}

export function del(id) {
  return request({
    url: '/index.php?m=api&c=product&f=delete',
    method: 'get',
    params: { id }
  })
}

export function protect(data) {
  return request({
    url: '/index.php?m=api&c=customer&f=protect',
    method: 'post',
    data
  })
}

export function saveProduct(data) {
  return request({
    url: '/index.php?m=api&c=product&f=saveProduct',
    method: 'post',
    data
  })
}

export function uploadExcel(data) {
  return request({
    url: '/index.php?m=api&c=customer&f=uploadExcel',
    method: 'post',
    data
  })
}
