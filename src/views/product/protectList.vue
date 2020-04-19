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

      <el-table-column width="120px" align="center" label="业务员">
        <template slot-scope="scope">
          <span>{{ scope.row.BusinessManager }}</span>
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

      <el-table-column align="center" label="操作" width="280" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/customer/documentary/'+scope.row.uuid">
            <el-button type="primary" size="small" icon="el-icon-tickets">
              跟单
            </el-button>
          </router-link>
          <router-link :to="'/customer/edit/'+scope.row.uuid">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
          <el-tooltip class="item" effect="dark" content="将该客户移到公海" placement="top">
            <el-button type="warning" size="small" icon="el-icon-sold-out" @click="removeProtect(scope.row.id)">移出</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchCustomerList, protect } from '@/api/customer'
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
        type: 3, // 客户类型：1，公海客户，2，我的客户，3，保护期客户
        page: 1,
        rows: 20
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
      fetchCustomerList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
        console.log('list', this.list)
      })
    },
    removeProtect(id) {
      this.$confirm('此操作将该客户移到公海, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // type 3,移入保护期，1,移出保护期
        const params = { id: id, userid: this.userid, type: 1 };
        protect(params).then(response => {
          this.$message({
            type: 'success',
            message: '移出成功!'
          });
          this.getList();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消移出'
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
