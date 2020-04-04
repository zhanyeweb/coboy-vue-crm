<template>
  <div class="item-cell">
    <span class="symbol" :style="symbolStyleMarginLeft" />
    <span class="tree-name">{{ item.name }}</span>
    <div class="handle">
      <el-button class="style-none" :disabled="item.disabled" @click="onVisible"><i :class="isFold ? 'el-icon-caret-bottom' : 'el-icon-caret-top'" /></el-button>
      <el-button class="style-none" @click="add"><i class="el-icon-plus" /></el-button>
      <el-button class="style-none" @click="edit"><i class="el-icon-edit" /></el-button>
      <el-button class="style-none" @click="del"><i class="el-icon-delete" /></el-button>
    </div>
  </div>
</template>
<script>
import { generateUUID } from '../../../utils'
export default {
  name: 'ItemCell',
  props: {
    item: {
      type: Object,
      default: undefined
    }
  },
  computed: {
    symbolStyleMarginLeft: function() {
      return 'margin-left:' + this.item.dept * 30 + 'px';
    },
    isFold: function() {
      console.log('this.itemttt', this.item);
      return !!(this.item.isVisible && this.item.children && this.item.children.length > 0);
    }
  },
  methods: {
    onVisible() {
    //   this.item.isVisible = !this.item.isVisible;
    //   console.log('this.item.isVisible', this.item.isVisible);
      const editTreeTtem = { ...this.item, isVisible: !this.item.isVisible };
      this.$store.dispatch('productCate/editTreeTtem', editTreeTtem);
    },
    add() {
      const editTreeTtem = { ...this.item, isVisible: true };
      this.$store.dispatch('productCate/editTreeTtem', editTreeTtem);

      const newTreeItem = { puuid: this.item.uuid, uuid: generateUUID(), name: null, isAdding: true, isEdit: true, isVisible: true, disabled: true };
      this.$store.dispatch('productCate/addTreeItem', newTreeItem);
    },
    edit() {
      const editTreeTtem = { ...this.item, isEdit: true };
      this.$store.dispatch('productCate/editTreeTtem', editTreeTtem);
      // this.item.isEdit = true;
      // this.$set(this.item, 'isEdit', true);
    },
    del() {
      if (this.item.children && this.item.children.length > 0) {
        this.$message({
          type: 'warning',
          message: '请先删除子栏目！'
        });
        return;
      }
      this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('productCate/delTreeItem', this.item);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.item-cell{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .symbol{
        border-bottom: 1px solid #cfcfcf;
        border-left: 1px solid #cfcfcf;
        display: inline-block;
        height: 15px;
        margin-left: 30px;
        margin-right: 15px;
        vertical-align: middle;
        width: 30px;
    }
    .tree-name{
        margin-left: 15px;
    }
    .handle{
        margin-left: 15px;
        .style-none{
            border: none;
            padding: 0;
            margin: 0;
            background-color: transparentify;
        }
        >>> [class*='el-button']{
            margin-left: 10px;
            margin-right: 10px;
            font-size: 16px;
        }
    }
}
</style>
