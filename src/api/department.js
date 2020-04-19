import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/index.php?m=api&f=getDepartmentList',
    method: 'get',
    params: query
  })
}

export function saveDepartment(data) {
  return request({
    url: '/index.php?m=api&f=saveDepartment',
    method: 'post',
    data
  })
}

export function delDepartment(query) {
  return request({
    url: '/index.php?m=api&f=delDepartment',
    method: 'get',
    params: query
  })
}
