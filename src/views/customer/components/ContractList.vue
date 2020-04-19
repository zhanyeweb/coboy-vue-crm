<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="编号" width="80" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="合同编号">
        <template slot-scope="scope">
          <span>{{ scope.row.ContractNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="联系人">
        <template slot-scope="scope">
          <span>{{ scope.row.contact }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="开始日期">
        <template slot-scope="scope">
          <span><i class="el-icon-time" /> {{ scope.row.StartDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="结束日期">
        <template slot-scope="scope">
          <span><i class="el-icon-time" /> {{ scope.row.EndDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="合同金额">
        <template slot-scope="scope">
          <span>{{ scope.row.ContractAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="已收款">
        <template slot-scope="scope">
          <span>{{ scope.row.receivables }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="欠款">
        <template slot-scope="scope">
          <span>{{ (scope.row.ContractAmount-scope.row.receivables).toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="录入时间">
        <template slot-scope="scope">
          <span><i class="el-icon-time" /> {{ scope.row.inputtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="审核">
        <template slot-scope="scope">
          <span>{{ scope.row.ToExamine }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEditDialog(scope.row.uuid)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="getList" />
  </div>
</template>

<script>
import { fetchContractList } from '@/api/contract'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ContractList',
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
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    customerId: {
      type: Number,
      default: ''
    },
    handleEditDialog: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 20,
        customerId: this.customerId
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchContractList(this.listQuery).then(response => {
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
