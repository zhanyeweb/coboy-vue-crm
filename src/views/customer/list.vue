<template>
  <div class="app-container">

    <SearchFormCustomer @onSearch="onSearch" />

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column type="expand" >
      <template slot-scope="props">
        <el-form label-position="left" inline class="table-expand" v-if="isUserAccess(props.row.userid)">
          <el-form-item label="公司名称">
            <span>{{ props.row.CorporateName }}</span>
          </el-form-item>
          <el-form-item label="编号">
            <span>{{ props.row.id }}</span>
          </el-form-item>
          <el-form-item label="录入时间">
            <span>{{ props.row.inputtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-form-item>
          <el-form-item label="主业务员">
            <span>{{ props.row.FullName }}</span>
          </el-form-item>
          <el-form-item label="国家">
            <span>{{ props.row.country }}</span>
          </el-form-item>
          <el-form-item label="主要联系人">
            <span>{{ props.row.PrimaryContact }}</span>
          </el-form-item>
          <el-form-item label="职位">
            <span>{{ props.row.position }}</span>
          </el-form-item>
          <el-form-item label="邮箱">
            <span>{{ props.row.email }}</span>
          </el-form-item>
          <el-form-item label="电话">
            <span>{{ props.row.tel }}</span>
          </el-form-item>
          <el-form-item label="地址">
            <span>{{ props.row.address }}</span>
          </el-form-item>
          <el-form-item label="网站">
            <span>{{ props.row.website }}</span>
          </el-form-item>
          <el-form-item label="主营产品">
            <span>{{ props.row.MainProducts }}</span>
          </el-form-item>
          <el-form-item label="展厅数量">
            <span>{{ props.row.NumberOfExhibitionHalls }}</span>
          </el-form-item>
          <el-form-item label="客户信息来源">
            <span>{{ props.row.CustomerSource }}</span>
          </el-form-item>
          <el-form-item label="备注">
            <span>{{ props.row.remarks }}</span>
          </el-form-item>
          <el-form-item label="联系进度">
            <span>{{ props.row.ContactProgress }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>

      <el-table-column align="center" label="编号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="公司名称">
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
          <el-button v-if="isAccess" size="mini" @click="handleShowDialog(scope.row.id, scope.row.userid)">添加修改</el-button>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="国家">
        <template slot-scope="scope">
          <span>{{ scope.row.country }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="380" fixed="right">
        <template slot-scope="scope"  v-if="isUserAccess(scope.row.userid)">
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
          <el-button v-if="isAccess" type="danger" size="small" icon="el-icon-delete" @click="onDel(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="getList" />
    <el-dialog width="500px" :visible.sync="dialogVisible" :title="'添加修改副业务员'">
      <el-select v-model="followUpOrderIds" multiple placeholder="请选择">
        <el-option
          v-for="item in userList"
          :key="item.userid"
          :label="item.FullName"
          :value="item.userid"
          :disabled="item.disabled"
        />
      </el-select>
      <el-button v-loading="loading" type="success" @click="submitFollowUpOrderId">
        提交
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import { fetchCustomerList, protect, followUpOrderId, saveFollowUpOrderId, realDel } from '@/api/customer'
import { fetchList as fetchUserList } from '@/api/staff'
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
        type: 2, // 客户类型：1，公海客户，2，我的客户，3，保护期客户
        page: 1,
        rows: 10
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
    this.getList();
    this.fetchUserList();
  },
  methods: {
    isUserAccess(userid){
      if(userid !== this.userid){
        let permission = [];
        if (this.permission) {
          permission = this.permission.split(',');
        }
        return permission.includes(this.userid);
      }else{
        return true;
      }

    },
    fetchUserList() {
      fetchUserList(this.listUserQuery).then(response => {
        this.userList = response.data.items.filter(o => o.userid != 1);
        this.userTotal = response.data.total
      });
    },
    getList() {
      this.listLoading = true;
      this.listQuery.token = this.token;
      fetchCustomerList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
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
    },
    handleShowDialog(customerId, userid) {
      this.followUpOrderIds = [];
      this.currentCustomerId = customerId;
      this.userList.map((o, k) => {
        this.userList[k].disabled = o.userid === userid;
      });
      followUpOrderId(customerId).then(response => {
        const items = response.data.items;
        this.followUpOrderIds = items.map(o => o.userid);
      });
      this.dialogVisible = true;
    },
    handleHideDialog() {
      this.dialogVisible = false;
    },
    submitFollowUpOrderId() {
      saveFollowUpOrderId({ customerId: this.currentCustomerId, followUpOrderIds: this.followUpOrderIds }).then(response => {
        this.dialogVisible = false;
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      });
    },
    onSearch(data) {
      this.listLoading = true;
      this.listQuery = deepClone({ ...this.listQuery, ...data });
      fetchCustomerList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },
    onDel(id) {
      this.$confirm('此操作将删除该客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        realDel(id).then(response => {
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
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 48%;
}
</style>
