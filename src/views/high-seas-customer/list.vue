<template>
  <div class="app-container">
    <SearchFormCustomer @onSearch="onSearch" />
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="编号" width="80" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="公司名称" fixed="left">
        <template slot-scope="{row}">
          <router-link :to="'/high-seas-customer/view/'+row.uuid" class="link-type">
            <span>{{ row.CorporateName }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="录入时间">
        <template slot-scope="scope">
          <span><i class="el-icon-time"></i> {{ scope.row.inputtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="业务员">
        <template slot-scope="scope">
          <span>{{ scope.row.FullName }}</span>
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

      <el-table-column align="center" label="操作" width="290" fixed="right">
        <template slot-scope="scope">
          <el-button type="success" size="small" icon="el-icon-goods" @click="onProtect(scope.row.id)">保护</el-button>
          <router-link :to="'/high-seas-customer/view/'+scope.row.uuid">
            <el-button type="primary" size="small" icon="el-icon-view">
              查看
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
import { fetchListHighSeasCustomer, protect, del } from '@/api/customer'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SearchFormCustomer from '@/components/SearchFormCustomer'

export default {
  name: 'CustomerList',
  components: { Pagination, SearchFormCustomer },
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
        type: 1,
        page: 1,
        rows: 20
      },
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'userid'
    ])
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchListHighSeasCustomer(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    onProtect(id) {
      this.$confirm('此操作将保护该客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // type 3,移入保护期，1,移出保护期
        const params = { id: id, userid: this.userid, type: 3 };
        protect(params).then(response => {
          this.$message({
            type: 'success',
            message: '保护成功!'
          });
          this.getList();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消保护'
        });          
      });
    },
    onDel(id) {
      this.$confirm('此操作将删除该客户, 是否继续?', '提示', {
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
    onSearch(data){
      this.listLoading = true;
      fetchListHighSeasCustomer({...this.listQuery, ...data}).then(response => {
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
