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
          <router-link :to="'/customer/edit/'+row.id" class="link-type">
            <span>{{ row.CorporateName }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="跟单联系人">
        <template slot-scope="scope">
          <span>{{ scope.row.DocumentaryContact }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="跟单方式">
        <template slot-scope="scope">
          <span>{{ scope.row.DocumentaryMode }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="跟单进度">
        <template slot-scope="scope">
          <span>{{ scope.row.DocumentaryProgress }}</span>
        </template>
      </el-table-column>

      <el-table-column label="下次联系" width="110">
        <template slot-scope="{row}">
          <span>{{ row.NextContact }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>

      <el-table-column label="业务员" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.BusinessManager }}</span>
        </template>
      </el-table-column>

      <el-table-column label="录入时间" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.inputtime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/customer/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/documentary'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'DocumentaryList',
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
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
        console.log('list', this.list)
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
