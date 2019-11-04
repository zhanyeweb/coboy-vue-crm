import Mock from 'mockjs'

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    // 编号
    id: '@increment',
    // 录入时间
    inputtime: +Mock.Random.date('T'),
    updatetime: +Mock.Random.date('T'),
    // 业务员
    BusinessManager: '@first',
    // 国家
    country: '@first',
    // 公司名称
    CorporateName: '@first',
    // 主要联系人
    PrimaryContact: '@first',
    // 职位
    position: '@first',
    // 邮箱
    email: '@first',
    // 电话
    tel: '@first',
    // 地址
    address: '@first',
    // 网站
    website: '@first',
    // 主营产品
    MainProducts: '@first',
    // 展厅数量
    NumberOfExhibitionHalls: '@first',
    // 客户信息来源
    CustomerSource: '@first',
    // 备注
    remarks: '@first',
    // 联系进度
    ContactProgress: '@first',
  }))
}

export default [
  {
    url: '/customer/list',
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
    url: '/customer/detail',
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
    url: '/customer/pv',
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
    url: '/customer/add',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/customer/save',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

