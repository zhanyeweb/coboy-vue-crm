import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/index.php?m=api&c=warehouse&f=getWarehouseList',
    method: 'get',
    params: query
  })
}

export function saveWarehouse(data) {
  return request({
    url: '/index.php?m=api&c=warehouse&f=saveWarehouse',
    method: 'post',
    data
  })
}

export function delWarehouse(query) {
  return request({
    url: '/index.php?m=api&c=warehouse&f=delWarehouse',
    method: 'get',
    params: query
  })
}
