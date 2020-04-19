<template>
  <el-form :model="postForm">
    <el-form-item label="账号">
      <el-input v-model.trim="postForm.username" :disabled="true" />
    </el-form-item>
    <el-form-item label="姓名">
      <el-input v-model.trim="postForm.FullName" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="postForm.email" />
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
  data() {
    return {
      postForm: Object.assign({}, this.user)
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
      saveStaff(this.postForm).then(response => {
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
