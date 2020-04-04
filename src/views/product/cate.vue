<template>
  <div class="zhanye-tree">
    <div class="header"><el-button @click="addTreeItem"><i class="el-icon-plus" /></el-button></div>
    <div class="container">

      <cell v-for="(items, key) of treeData" :key="key" :items="items" />

    </div>
  </div>
</template>
<script>
import { generateUUID } from '../../utils';
import Cell from './components/Cell';
import { fetchList } from '@/api/productCate';
export default {
  name: 'Tree',
  components: {
    Cell
  },
  data() {
    return {
      // treeData: this.initTreeData()
      list: this.$store.state.productCate.treeData,
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 999
      }
    }
  },
  computed: {
    treeData: function() {
      const data = this.initTreeData(this.$store.state.productCate.treeData);
      console.log('tt', data);
      // return this.$store.state.department.treeData.filter(v => v && v.puuid === this.puuid);
      return data;
    }
    // treeData: {
    //   get: function() {
    //     return this.initTreeData();
    //   },
    //   set: function(newVal) {
    //     console.log('newVal', newVal);
    //     this.treeData = this.initTreeData();
    //   }
    // }
  },
  watch: {
    list: function(oldVal, newVal) {
      console.log('old', oldVal, 'newVal', newVal);
    },
    immediate: true,
    deep: true
  },
  mounted() {
    console.log('this.$store.state.productCate.treeData,',this.$store.state.productCate.treeData);
  },
  created() {
    this.getProductCateList();
  },
  methods: {
    getProductCateList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log('response', response)
        this.$store.dispatch('productCate/initTreeItem', response.data);
        this.listLoading = false
      })
    },
    addTreeItem() {
      const newTreeItem = { puuid: '0', uuid: generateUUID(), name: null, isAdding: true, isEdit: true, isVisible: true, disabled: true };
      this.$store.dispatch('productCate/addTreeItem', newTreeItem)
    },
    save() {
      console.log('departmentName', this.name)
    },
    initTreeData(list, puuid = '0', dept = 1) {
      // const d = this.$store.state.department.treeData.filter(v => v && v.puuid === puuid);
      const d = list.filter(v => v && v.puuid === puuid);
      return d && d.map((o) => {
        const children = this.initTreeData(list, o.uuid, dept + 1);
        const newData = {};
        // this.$set(o, 'dept', dept);
        newData.dept = dept;
        if (children.length > 0) {
        //   this.$set(o, 'children', children);
        //   this.$set(o, 'disabled', false);
          newData.children = children;
          newData.disabled = false;
        }
        return { ...o, ...newData };
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.zhanye-tree{
    background-color: #fff;
    .header{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 20px;
        border-bottom: 1px solid #eef2f6;
        border-top: 1px solid #eef2f6;
        height: 60px;
        line-height: 60px;
        padding-left: 33px;
    }
    .container{
    }
}
</style>
