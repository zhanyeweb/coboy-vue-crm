import { saveProductCate, delProductCate } from '@/api/productCate'
const state = {
  treeData: [
    { uuid: '01', puuid: '0', name: '技术部', isAdding: false, isEdit: false, isVisible: true, disabled: true },
  ],
  isRepeatName: false
}

const actions = {
  initTreeItem({ commit }, items) {
    commit('INIT_TREE_ITEM', items);
  },
  addTreeItem({ commit }, newTreeItem) {
    commit('ADD_TREE_ITEM', newTreeItem);
  },
  editTreeTtem({ commit }, editTreeTtem) {
    commit('EDIT_TREE_ITEM', editTreeTtem);
  },
  delTreeItem({ commit }, delTreeTtem) {
    commit('DEL_TREE_ITEM', delTreeTtem);
  },
  checkRepeatName({ commit }, treeItem) {
    return new Promise((resolve) => {
      commit('CHECK_REPEAT_NAME', treeItem);
      resolve(state.isRepeatName);
    });
  }
}

const mutations = {
  INIT_TREE_ITEM: (state, items) => {
    console.log('items', items);
    const insertData = {isAdding: false, isEdit: false, isVisible: true, disabled: true};
    let tempData = [];
    items && items.map((v) => {
      tempData.push({...v, ...insertData});
    });
    state.treeData = tempData;
    console.log('itemsstate.treeData', state.treeData);
  },
  ADD_TREE_ITEM: (state, newTreeItem) => {
    console.log('state', state, 'newTreeItem', newTreeItem);
    state.treeData.unshift(newTreeItem);
    console.log('state.treeDataADD', state.treeData);
  },
  EDIT_TREE_ITEM: (state, editTreeTtem) => {
    console.log('state', state, 'editTreeTtem', editTreeTtem, 'this', this);
    const list = state.treeData;
    list && list.map((o, k) => {
      if (o.uuid === editTreeTtem.uuid) {
        console.log('ccc');
        list.splice(k, 1, editTreeTtem);
        // list.unshift(editTreeTtem);
      }
    });
    state.treeData = list;
    console.log('state.treeDataEDIT', state.treeData);
    if (!editTreeTtem.isEdit) {
      return new Promise((resolve, reject) => {
        saveProductCate(editTreeTtem).then(response => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  DEL_TREE_ITEM: (state, delTreeTtem) => {
    console.log('delTreeTtem', delTreeTtem);
    const list = state.treeData;
    list && list.map((o, k) => {
      if (o.uuid === delTreeTtem.uuid) {
        list.splice(k, 1);
      }
    });
    state.treeData = list;
    console.log('state.treeDataDEL', state.treeData);
    return new Promise((resolve, reject) => {
      delProductCate({uuid: delTreeTtem.uuid}).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  CHECK_REPEAT_NAME: (state, treeItem) => {
    const list = state.treeData;
    const repeat = list.filter(o => o.name && o.name.replace(/(^\s*)|(\s*$)/g, '') === treeItem.name.replace(/(^\s*)|(\s*$)/g, '') && o.uuid !== treeItem.uuid);
    console.log('repeat', repeat);
    if (repeat.length > 0) {
      state.isRepeatName = true;
    } else {
      state.isRepeatName = false;
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
