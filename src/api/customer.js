import request from '@/utils/request'

export function fetchCustomerList(query) {
  return request({
    url: '/index.php?m=api&c=customer&f=listCustomer',
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

export function fetchCustomer(uuid) {
  return request({
    url: '/index.php?m=api&c=customer&f=detail',
    method: 'get',
    params: { uuid }
  })
}

export function del(id) {
  return request({
    url: '/index.php?m=api&c=customer&f=delete',
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

export function saveCustomer(data) {
  return request({
    url: '/index.php?m=api&c=customer&f=saveCustomer',
    method: 'post',
    data
  })
}

export function followUpOrderId(customerId) {
  return request({
    url: '/index.php?m=api&c=customer&f=followUpOrderId',
    method: 'get',
    params: { customerId }
  })
}

export function saveFollowUpOrderId(data) {
  return request({
    url: '/index.php?m=api&c=customer&f=saveFollowUpOrderId',
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
