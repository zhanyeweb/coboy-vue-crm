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
          <router-link :to="'/documentary/edit/'+row.uuid" class="link-type">
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
          <span>{{ formatterDocumentaryMode(scope.row.DocumentaryMode) }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="跟单进度">
        <template slot-scope="scope">
          <span>{{ formatterDocumentaryProgress(scope.row.DocumentaryProgress) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="下次联系" width="180">
        <template slot-scope="{row}">
          <span><i class="el-icon-time" /> {{ row.NextContact | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="业务员" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.FullName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="录入时间" width="180">
        <template slot-scope="scope">
          <span><i class="el-icon-time" /> {{ scope.row.inputtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/documentary/edit/'+scope.row.uuid">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="getList" />
  </div>
</template>

<script>
import { fetchDocumentaryList } from '@/api/documentary'
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
        rows: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchDocumentaryList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },
    formatterDocumentaryMode(key) {
      switch (Number(key)) {
        case 1: {
          return '电话沟通';
        }
        case 2: {
          return '上门拜访';
        }
        case 3: {
          return '微信QQ沟通';
        }
        case 4:{
          return 'Email沟通';
        }
        case 5:{
          return '其他方式沟通';
        }
      }
    },
    formatterDocumentaryProgress(key) {
      switch (Number(key)) {
        case 1: {
          return '结束跟单';
        }
        case 2: {
          return '初次沟通';
        }
        case 3: {
          return '有意向';
        }
        case 4: {
          return '考虑中';
        }
      }
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
