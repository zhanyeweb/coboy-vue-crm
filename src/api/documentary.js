import request from '@/utils/request'

export function fetchCustomerList(query) {
  return request({
    url: '/index.php?m=api&c=documentary&f=listCustomer',
    method: 'get',
    params: query
  })
}

export function fetchDocumentaryList(query) {
  return request({
    url: '/index.php?m=api&c=documentary&f=listDocumentary',
    method: 'get',
    params: query
  })
}

export function fetchListByCustomerDocumentary(query) {
  return request({
    url: '/index.php?m=api&c=documentary&f=listByCustomerDocumentary',
    method: 'get',
    params: query
  })
}

export function fetchDocumentary(uuid) {
  return request({
    url: '/index.php?m=api&c=documentary&f=detail',
    method: 'get',
    params: { uuid }
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
    url: '/index.php?m=api&c=documentary&f=saveDocumentary',
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

export function deleteDocumentary(uuid) {
  return request({
    url: '/index.php?m=api&c=documentary&f=deleteDocumentary',
    method: 'get',
    params: { uuid }
  })
}
