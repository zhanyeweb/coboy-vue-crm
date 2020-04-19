import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function myFilterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route };
    // tmp.children = route.children;
    roles.map(o => {
      if (o.meta.title === tmp.meta.title) {
        if (tmp.children) {
          tmp.children = myFilterAsyncRoutes(tmp.children, o.children)
        }
        res.push(tmp);
      }
    });
    // if (myHasPermission(roles[key], tmp)) {
    //   if (tmp.children) {
    //     tmp.children = myFilterAsyncRoutes(tmp.children, roles[key].children)
    //   }
    //   res.push(tmp)
    // }
  })

  return res;
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      accessedRoutes = asyncRoutes || [];
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  analysisRoutes({ commit }, routes) {
    return new Promise(resolve => {
      let accessedRoutes;
      accessedRoutes = myFilterAsyncRoutes(asyncRoutes, routes);

      commit('SET_ROUTES', accessedRoutes)

      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
