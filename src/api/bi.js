import request from '@/utils/request'

export function fetchBi(query) {
    return request({
      url: '/index.php?m=api&c=bi&f=init',
      method: 'get',
      params: query
    })
}