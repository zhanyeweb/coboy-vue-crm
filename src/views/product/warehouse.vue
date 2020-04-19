<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddWarehouse">新建仓库</el-button>

    <el-table v-loading="listLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="仓库名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.warehouseName }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="负责人">
        <template slot-scope="scope">
          {{ scope.row.personInCharge }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="电话">
        <template slot-scope="scope">
          {{ scope.row.tel }}
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="录入时间">
        <template slot-scope="scope">
          <span><i class="el-icon-time" /> {{ scope.row.inputtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="220px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="getList" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑仓库':'新建仓库'">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input v-model="postForm.warehouseName" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="personInCharge">
          <el-input v-model="postForm.personInCharge" placeholder="负责人" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="postForm.tel" placeholder="电话" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="postForm.info"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="备注描述"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmWarehouse">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import path from 'path'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { deepClone } from '@/utils'
import { saveWarehouse, fetchList, delWarehouse } from '@/api/warehouse';
import { generateUUID } from '@/utils';

const defaultFormData = {
  uuid: generateUUID(),
  warehouseName: '',
  personInCharge: '',
  tel: '',
  info: ''
}
const formLabel = {
  warehouseName: '仓库名称',
  personInCharge: '负责人'
}
export default {
  name: 'Warehouse',
  components: { Pagination },
  data() {
    const validateRequire = (rule, value, callback) => {
      console.log('value', value);
      if (value === '' || value === null) {
        this.$message({
          message: formLabel[rule.field] + '为必传项',
          type: 'error'
        })
        callback(new Error(formLabel[rule.field] + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultFormData),
      rules: {
        warehouseName: [{ validator: validateRequire }],
        personInCharge: [{ validator: validateRequire }]
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 20,
        token: null
      },
      dialogVisible: false,
      dialogType: 'new'
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
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAddWarehouse() {
      this.postForm = Object.assign({}, defaultFormData)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.postForm = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认要删除这个仓库吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await delWarehouse({ id: row.id })
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    confirmWarehouse() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          saveWarehouse(this.postForm).then(response => {
            this.getList();
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.loading = false;
            this.dialogVisible = false;
          }).catch(err => {
            this.loading = false;
            console.log(err);
          });
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
