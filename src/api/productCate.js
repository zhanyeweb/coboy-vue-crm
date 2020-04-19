import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/index.php?m=api&c=product&f=getProductCateList',
    method: 'get',
    params: query
  })
}

export function saveProductCate(data) {
  return request({
    url: '/index.php?m=api&c=product&f=saveProductCate',
    method: 'post',
    data
  })
}

export function delProductCate(query) {
  return request({
    url: '/index.php?m=api&c=product&f=delProductCate',
    method: 'get',
    params: query
  })
}
