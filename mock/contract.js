import Mock from 'mockjs';

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    // 编号
    id: '@increment',
    // 录入时间
    inputtime: +Mock.Random.date('T'),
    updatetime: +Mock.Random.date('T'),
    // 公司名称
    CorporateName: '@first',
    // 联系人
    contact: '@first',
    // 合同编号
    ContractNumber: '@first',
    // 开始日期
    StartDate: '@first',
    // 结束日期
    EndDate: '@first',
    // 合同金额
    ContractAmount: '@first',
    // 已收款
    MakeCollections: '@first',
    // 欠款
    arrears: '@first',
    // 备注
    remarks: '@first',
    // 附件
    file: '@first',
    // 审核
    ToExamine: '@first',
    // 操作员
    operator: '@first'
  }))
}

export default [
  {
    url: '/contract/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/contract/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/contract/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/contract/add',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/contract/save',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

