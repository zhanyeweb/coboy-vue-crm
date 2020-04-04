import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/index.php?m=api&c=supplier&f=getSupplierList',
    method: 'get',
    params: query
  })
}

export function saveSupplier(data) {
  return request({
    url: '/index.php?m=api&c=supplier&f=saveSupplier',
    method: 'post',
    data
  })
}

export function delSupplier(query) {
  return request({
    url: '/index.php?m=api&c=supplier&f=delSupplier',
    method: 'get',
    params: query
  })
}