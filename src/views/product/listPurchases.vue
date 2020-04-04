<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="编号" width="50" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="产品名称" fixed="left">
        <template slot-scope="{row}">
            <span>{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="原有库存">
        <template slot-scope="scope">
          <span>{{ scope.row.currentStock }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" label="采购数量">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存放仓库" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.warehouseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.supplierName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.unitPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总折扣" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.totalDiscount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总成本" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.totalCost }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总运费" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.totalFreight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.payType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经办人" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.personInCharge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购日期" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.procurementDate | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="录入时间">
        <template slot-scope="scope">
          <span><i class="el-icon-time"></i> {{ scope.row.inputtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="danger" size="small" icon="el-icon-delete"  @click="onDel(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchPurchasesList, del } from '@/api/purchases'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'listPurchases',
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
        rows: 20,
        token: null
      }
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
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.token = this.token;
      fetchPurchasesList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    onDel(id) {
      this.$confirm('此操作将删除该采购,相应的库存也会减少, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        })
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
