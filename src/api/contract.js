import request from '@/utils/request'

export function fetchContractList(query) {
  return request({
    url: '/index.php?m=api&c=contract&f=listContract',
    method: 'get',
    params: query
  })
}

export function fetchContract(uuid) {
  return request({
    url: '/index.php?m=api&c=contract&f=detail',
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

export function saveContract(data) {
  return request({
    url: '/index.php?m=api&c=contract&f=saveContract',
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
