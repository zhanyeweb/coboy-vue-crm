<template>
  <section class="edit-cell">
    <span class="symbol" :style="symbolStyleMarginLeft" />
    <div class="input-box">
      <el-input v-model="departmentName" placeholder="请输入名称" />
      <el-button type="primary" class="save-btn" @click="save">确定</el-button>
    </div>
    <el-button class="cancel-btn" @click="cancel">取消</el-button>
  </section>
</template>
<script>
export default {
  name: 'EditCell',
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      departmentName: null
    }
  },
  computed: {
    symbolStyleMarginLeft: function() {
      return 'margin-left:' + this.item.dept * 30 + 'px';
    }
  },
  created() {
    this.departmentName = this.item.departmentName;
  },
  methods: {
    save() {
      console.log('item', this.item);
      if (this.departmentName === null || this.departmentName && this.departmentName.replace(/(^\s*)|(\s*$)/g, '') === '') {
        this.$message({
          type: 'warning',
          message: '请输入名称！'
        });
        return;
      }
      const editTreeTtem = { ...this.item, isEdit: false, departmentName: this.departmentName.replace(/(^\s*)|(\s*$)/g, '') };
      this.$store.dispatch('department/checkRepeatName', editTreeTtem).then((isRepeatName) => {
        if (isRepeatName) {
          this.$message({
            type: 'warning',
            message: '名称有重复！'
          });
        } else {
          this.$store.dispatch('department/editTreeTtem', editTreeTtem);
        }
      });
    },
    cancel() {
      if (this.item.isAdding) {
        console.log('isAdding');
        this.$store.dispatch('department/delTreeItem', this.item);
      } else {
        console.log('isEdit');
        const editTreeTtem = { ...this.item, isEdit: false };
        this.$store.dispatch('department/editTreeTtem', editTreeTtem);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-cell{
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
    .input-box{
        display: inline-block;
        margin-left: 15px;
        margin-right: 8px;
        position: relative;
        width: 220px;
        >>> [class*='el-input']{
                input[class*='el-input__inner']{
                    border-radius: 38px;
                    height: 38px;
                    padding: 1px 15px;
                    &:focus{
                        border: 1px solid #47bcfc;
                    }
                }
        }
        .save-btn{
            position: absolute;
            right: 0;
            top: 0;
            border-radius: 38px;
            color: #fff;
            height: 38px;
            padding: 0;
            width: 38px;
            background-color: #47bcfc;
            border: 1px solid #47bcfc;
            opacity: 0.9;
            &:hover{
                opacity: 1;
            }
        }
    }
    .cancel-btn{
        background-color: #e4e4e4;
        border: 1px solid #e4e4e4;
        color: #333;
        border-radius: 38px;
        height: 38px;
        padding: 0;
        width: 38px;
        &:hover{
            background-color: #47bcfc;
            border: 1px solid #47bcfc;
            color: #fff;
        }
    }
}
</style>
