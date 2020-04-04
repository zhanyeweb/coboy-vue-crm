import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页概况', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/list',
    name: 'Customer',
    meta: {
      title: '客户管理',
      icon: 'user'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/customer/list'),
        name: '我的客户',
        meta: {
          title: '我的客户'
        }
      },
      {
        path: 'protectList',
        component: () => import('@/views/customer/protectList'),
        name: '保护期客户',
        meta: {
          title: '保护期客户'
        }
      },
      {
        path: 'add',
        component: () => import('@/views/customer/add'),
        name: '添加客户',
        meta: {
          title: '添加客户'
        }
      },
      {
        path: 'edit/:uuid',
        component: () => import('@/views/customer/edit'),
        name: '编辑客户',
        meta: {
          title: '编辑客户'
        },
        hidden: true
      },
      {
        path: 'documentary/:uuid',
        component: () => import('@/views/customer/documentary'),
        name: '跟单管理',
        meta: {
          title: '跟单管理'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/high-seas-customer',
    component: Layout,
    redirect: '/high-seas-customer/list',
    name: 'high-seas-customer',
    meta: {
      title: '公海客户',
      icon: 'peoples'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/high-seas-customer/list'),
        name: 'high-seas-customer',
        meta: { title: '公海客户列表' }
      },
      {
        path: 'mylist',
        component: () => import('@/views/high-seas-customer/mylist'),
        name: 'high-seas-customer',
        meta: { title: '我的公海客户' }
      },
      {
        path: 'add',
        component: () => import('@/views/high-seas-customer/add'),
        name: 'high-seas-customer',
        meta: { title: '添加公海客户' }
      },
      {
        path: 'edit/:uuid',
        component: () => import('@/views/high-seas-customer/edit'),
        name: 'high-seas-customer',
        meta: { title: '编辑公海客户' },
        hidden: true
      },
      {
        path: 'view/:uuid',
        component: () => import('@/views/high-seas-customer/view'),
        name: 'high-seas-customer',
        meta: { title: '查看公海客户' },
        hidden: true
      },
    ]
  },
  {
    path: '/contract',
    component: Layout,
    redirect: '/contract/list',
    name: 'contract',
    meta: {
      title: '合同管理',
      icon: 'documentation'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/contract/list'),
        name: 'contract',
        meta: { title: '合同列表' }
      },
      {
        path: 'add',
        component: () => import('@/views/contract/add'),
        name: 'contract',
        meta: { title: '添加合同' }
      },
      {
        path: 'edit/:uuid',
        component: () => import('@/views/contract/edit'),
        name: 'contract',
        meta: { title: '编辑合同' },
        hidden: true
      }
    ]
  },
  {
    path: '/documentaryTogether',
    component: Layout,
    redirect: '/documentaryTogether/list',
    name: 'documentaryTogether',
    meta: {
      title: '联合跟单',
      icon: 'form'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/documentaryTogether/list'),
        name: 'documentaryTogether',
        meta: { title: '跟单客户' }
      },
      {
        path: 'detail/:uuid',
        component: () => import('@/views/documentaryTogether/detail'),
        name: 'documentary',
        meta: { title: '跟单详情' },
        hidden: true
      }
    ]
  },
  {
    path: '/documentary',
    component: Layout,
    redirect: '/documentary/list',
    name: 'documentary',
    meta: {
      title: '跟单管理',
      icon: 'form'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/documentary/list'),
        name: 'documentary',
        meta: { title: '跟单列表' }
      },
      {
        path: 'add',
        component: () => import('@/views/documentary/add'),
        name: 'documentary',
        meta: { title: '添加跟单' }
      },
      {
        path: 'edit/:uuid',
        component: () => import('@/views/documentary/edit'),
        name: 'documentary',
        meta: { title: '编辑跟单' },
        hidden: true
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: 'order',
    meta: {
      title: '订单管理',
      icon: 'documentation'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/order/list'),
        name: 'order',
        meta: { title: '订单列表' }
      },
      {
        path: 'add',
        component: () => import('@/views/order/add'),
        name: 'order',
        meta: { title: '添加订单' }
      },
      {
        path: 'edit/:uuid',
        component: () => import('@/views/order/edit'),
        name: 'order',
        meta: { title: '编辑订单' },
        hidden: true
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: 'product',
    meta: {
      title: '商品进销存',
      icon: 'form'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/product/list'),
        name: 'product',
        meta: { title: '商品列表' }
      },
      {
        path: 'add',
        component: () => import('@/views/product/add'),
        name: 'product',
        meta: { title: '添加商品' }
      },
      {
        path: 'edit/:uuid',
        component: () => import('@/views/product/edit'),
        name: 'product',
        meta: { title: '编辑商品' },
        hidden: true
      },
      {
        path: 'cate',
        component: () => import('@/views/product/cate'),
        name: 'product',
        meta: { title: '商品分类' }
      },
      {
        path: 'listPurchases',
        component: () => import('@/views/product/listPurchases'),
        name: 'product',
        meta: { title: '采购管理' }
      },
      {
        path: 'addPurchases',
        component: () => import('@/views/product/addPurchases'),
        name: 'product',
        meta: { title: '添加采购' }
      },
      {
        path: 'editPurchases',
        component: () => import('@/views/product/editPurchases'),
        name: 'product',
        meta: { title: '编辑采购' },
        hidden: true
      },
      {
        path: 'warehouse',
        component: () => import('@/views/product/warehouse'),
        name: 'product',
        meta: { title: '仓库管理' }
      },
      {
        path: 'supplier',
        component: () => import('@/views/product/supplier'),
        name: 'product',
        meta: { title: '供应商管理' }
      },
    ]
  },
  {
    path: '/department',
    component: Layout,
    meta: {
      title: '部门设置'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/department/index'),
        name: 'Department',
        meta: { title: '部门设置', icon: 'component', affix: true }
      }
    ]
  },
  {
    path: '/staff',
    component: Layout,
    redirect: '/staff/list',
    name: 'staff',
    meta: {
      title: '员工管理',
      icon: 'staff'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/staff/list'),
        name: 'staff',
        meta: { title: '员工列表' }
      },
      {
        path: 'add',
        component: () => import('@/views/staff/add'),
        name: 'staff',
        meta: { title: '添加员工' }
      },
      {
        path: 'edit/:uuid',
        component: () => import('@/views/staff/edit'),
        name: 'staff',
        meta: { title: '编辑员工' },
        hidden: true
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    meta: {
      title: '权限设置'
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'permission',
        meta: { title: '权限设置', icon: 'lock', affix: true }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/profile',
    name: 'setting',
    meta: {
      title: '系统设置',
      icon: 'setting'
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/profile/index'),
        name: 'setting',
        meta: { title: '个人资料', noCache: true }
      },
      {
        path: 'setting',
        component: () => import('@/views/profile/index'),
        name: 'setting',
        meta: { title: '管理设置', noCache: true }
      }
    ]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab', icon: 'tab' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', meta: { title: '404' }, redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
