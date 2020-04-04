import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/index.php?m=api&c=member&f=listStaff',
    method: 'get',
    params: query
  })
}

export function fetchStaff(uuid) {
  return request({
    url: '/index.php?m=api&c=member&f=detail',
    method: 'get',
    params: { uuid }
  })
}
export function fetchStaffById(userid) {
  return request({
    url: '/index.php?m=api&c=member&f=detail',
    method: 'get',
    params: { userid }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/staff/pv',
    method: 'get',
    params: { pv }
  })
}

export function saveStaff(data) {
  return request({
    url: '/index.php?m=api&c=member&f=saveStaff',
    method: 'post',
    data
  })
}

export function updateStaff(data) {
  return request({
    url: '/staff/update',
    method: 'post',
    data
  })
}
