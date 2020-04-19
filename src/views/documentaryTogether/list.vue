<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="编号" width="80" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="公司名称" fixed="left">
        <template slot-scope="{row}">
          <router-link :to="'/customer/edit/'+row.uuid" class="link-type">
            <span>{{ row.CorporateName }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="录入时间">
        <template slot-scope="scope">
          <span><i class="el-icon-time" /> {{ scope.row.inputtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="主业务员">
        <template slot-scope="scope">
          <span>{{ scope.row.FullName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="副业务员">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.subBusiness" :key="index">
            {{ item.FullName }}
          </span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="国家">
        <template slot-scope="scope">
          <span>{{ scope.row.country }}</span>
        </template>
      </el-table-column>

      <el-table-column label="主要联系人" width="110">
        <template slot-scope="{row}">
          <span>{{ row.PrimaryContact }}</span>
        </template>
      </el-table-column>

      <el-table-column label="职位" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.position }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邮箱" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电话" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>

      <el-table-column label="地址" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column label="网站" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.website }}</span>
        </template>
      </el-table-column>

      <el-table-column label="主营产品" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.MainProducts }}</span>
        </template>
      </el-table-column>

      <el-table-column label="展厅数量" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.NumberOfExhibitionHalls }}</span>
        </template>
      </el-table-column>

      <el-table-column label="客户信息来源" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.CustomerSource }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>

      <el-table-column label="联系进度" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.ContactProgress }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/documentaryTogether/detail/'+scope.row.uuid">
            <el-button type="primary" size="small" icon="el-icon-tickets">
              跟单
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchCustomerList } from '@/api/documentary'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'CustomerList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        type: 2, // 客户类型：1，公海客户，2，我的客户，3，保护期客户
        page: 1,
        rows: 20,
        token: null
      },
      dialogVisible: false,
      followUpOrderIds: [],
      userList: null,
      userTotal: 0,
      listUserQuery: {
        page: 0,
        rows: 99
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'userid',
      'token'
    ])
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.token = this.token;
      fetchCustomerList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
