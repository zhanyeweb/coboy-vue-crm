<template>
  <el-form :model="postForm">
    <el-form-item label="密码">
      <el-input v-model.trim="postForm.password" type="password"/>
    </el-form-item>
    <el-form-item label="确认密码">
      <el-input v-model.trim="postForm.notPassword" type="password"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { saveStaff, updateStaff, fetchStaffById } from '@/api/staff';

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  data(){
    return{
      postForm: Object.assign({}, this.user),
    }
  },
  created() {
    if (this.user.userid) {
      this.fetchData(this.user.userid);
    }
  },
  methods: {
    fetchData(userid) {
      fetchStaffById(userid).then(response => {
        this.postForm = response.data
        this.postForm.password = null;
      }).catch(err => {
        console.log(err)
      })
    },
    submit() {
      this.loading = true
      if(!this.postForm.password){
        this.$message({
          message: '密码不能为空',
          type: 'error',
          duration: 5 * 1000
        });
        return;
      }
      if(this.postForm.password!==this.postForm.notPassword){
        this.$message({
          message: '密码和确认密码不相等',
          type: 'error',
          duration: 5 * 1000
        });
        return;
      }
      saveStaff(this.postForm).then(response => {
        this.postForm.password = null;
        this.postForm.notPassword = null;
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 5 * 1000
        });
        this.loading = false;
      }).catch(err => {
        console.log(err);
      });
    }
  }
}
</script>
