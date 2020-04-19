<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="编号" width="80" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="订单编号" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.OrderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="250px" label="公司名称" fixed="left">
        <template slot-scope="{row}">
          <span>{{ row.CorporateName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="联系人">
        <template slot-scope="scope">
          <span>{{ scope.row.contact }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="下单日期">
        <template slot-scope="scope">
          <span><i class="el-icon-time" /> {{ scope.row.OrderDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="交单日期">
        <template slot-scope="scope">
          <span><i class="el-icon-time" /> {{ scope.row.PresentationDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="订单总金额">
        <template slot-scope="scope">
          <span>{{ scope.row.OrderAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="已收款">
        <template slot-scope="scope">
          <span>{{ scope.row.receivables }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="欠款">
        <template slot-scope="scope">
          <span>{{ (scope.row.OrderAmount-scope.row.receivables).toFixed(2) }}</span>
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

      <el-table-column width="100px" label="收货人">
        <template slot-scope="scope">
          <span>{{ scope.row.consignee }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="收货人电话">
        <template slot-scope="scope">
          <span>{{ scope.row.ConsigneeTelephone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button type="success" size="small" icon="el-icon-view" @click="onViewProduct(scope.row.uuid)">
            查看商品
          </el-button>
          <router-link :to="'/order/edit/'+scope.row.uuid">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="onDel(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="getList" />
    <el-dialog :visible.sync="productDialogVisible" :title="'订单商品'" width="1000px">
      <el-table :data="productList" type="index" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="序号" type="index" width="100" fixed="left" />
        <el-table-column align="center" label="商品名称" fixed="left">
          <template slot-scope="scope">
            <span>{{ scope.row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="成本价" width="100">
          <template slot-scope="scope">
            <span>{{ (scope.row.costPrice) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="售价" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.sellingPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="数量" width="100">
          <template slot-scope="scope">
            {{ scope.row.num }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="折扣" width="100">
          <template slot-scope="scope">
            {{ scope.row.discount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品总金额" width="100">
          <template slot-scope="scope">
            {{ scope.row.totalSum }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" width="100">
          <template slot-scope="scope">
            {{ scope.row.info }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="录入时间" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.inputtime | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { fetchOrderList, viewProduct, del } from '@/api/order'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'OrderList',
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
      },
      productList: [],
      productTotal: 0,
      productListLoading: true,
      listViewProductQuery: {
        page: 1,
        rows: 20,
        uuid: undefined
      },
      productDialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchOrderList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
        console.log('list', this.list)
      })
    },
    onDel(id) {
      this.$confirm('此操作将删除该订单, 是否继续?', '提示', {
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
    },
    onViewProduct(uuid) {
      this.productDialogVisible = true;
      viewProduct({ ...this.listViewProductQuery, uuid }).then(response => {
        this.productList = response.data.items
        this.productTotal = response.data.total
        this.productListLoading = false
        console.log('list', this.productList)
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
