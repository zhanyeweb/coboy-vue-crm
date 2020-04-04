import request from '@/utils/request'

export function searchCustomer(searchCustomerName) {
  return request({
    url: '/index.php?m=api&c=customer&f=searchCustomer',
    method: 'get',
    params: { searchCustomerName }
  })
}

export function transactionList(query) {
  return request({
    url: '/transaction/list',
    method: 'get',
    params: query
  })
}
