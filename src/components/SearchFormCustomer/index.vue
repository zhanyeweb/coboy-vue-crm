<template>
  <el-form :inline="true" :model="formSearch" class="demo-form-inline">
    <el-form-item label="主业务员" v-if="isAccess">
      <el-select v-model="formSearch.userid" clearable placeholder="选择主业务员">
        <el-option
          v-for="item in staffList"
          :key="item.userid"
          :label="item.FullName"
          :value="item.userid"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="公司名称">
      <el-input v-model="formSearch.CorporateName" placeholder="请填写公司名称" />
    </el-form-item>
    <el-form-item label="国家">
      <el-input v-model="formSearch.country" placeholder="请填写国家名称" />
    </el-form-item>
    <el-form-item label="公司Email">
      <el-input v-model="formSearch.email" placeholder="请填写公司Email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmitAll">查询全部</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchList } from '@/api/staff'

export default {
  name: 'SearchFormCustomer',
  props: {
    onSearch: {
      type: Function,
      default: () => {}
    },
    setListQuery: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      formSearch: {
        userid: '',
        CorporateName: '',
        country: '',
        email: '',
      },
      staffList: null,
      staffTotal: 0,
      staffListLoading: true,
      staffListQuery: {
        page: 0,
        rows: 999
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'userid',
      'token',
      'permission'
    ]),
    isAccess: function() {
      let permission = [];
      if (this.permission) {
        permission = this.permission.split(',');
      }
      return permission.includes(this.userid);
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.staffListLoading = true;
      fetchList(this.staffListQuery).then(response => {
        this.staffList = response.data.items.filter(o => o.userid != 1);
        this.staffTotal = response.data.total
        this.staffListLoading = false
      })
    },
    onSubmit() {
      this.$emit('onSearch', this.formSearch);
    },
    onSubmitAll() {
      this.formSearch.userid = '';
      this.formSearch.CorporateName = '';
      this.formSearch.country = '';
      this.formSearch.email = '';
      this.$emit('onSearch', this.formSearch);
    }
  },
  watch:{

  }
}
</script>

<style scoped>

</style>
