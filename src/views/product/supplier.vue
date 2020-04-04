<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddSupplier">新建供应商</el-button>

    <el-table v-loading="listLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="合作状态">
        <template slot-scope="scope">
          {{ Number(scope.row.status) === 1 ? '已合作' : '未合作' }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="联系人">
        <template slot-scope="scope">
          {{ scope.row.liaison }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="电话">
        <template slot-scope="scope">
          {{ scope.row.tel }}
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="录入时间">
        <template slot-scope="scope">
          <span><i class="el-icon-time"></i> {{ scope.row.inputtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑供应商':'新建供应商'">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label="供应商名称：" prop="name">
          <el-input v-model="postForm.name" placeholder="供应商名称" />
        </el-form-item>
        <el-form-item label="合作情况：" prop="status">
            <el-radio v-model="postForm.status" label="1">已合作</el-radio>
            <el-radio v-model="postForm.status" label="2">未合作</el-radio>
        </el-form-item>
        <el-form-item label="联系人：" prop="liaison">
          <el-input v-model="postForm.liaison" placeholder="联系人" />
        </el-form-item>
        <el-form-item label="电话：">
          <el-input v-model="postForm.tel" placeholder="电话" />
        </el-form-item>
        <el-form-item label="备注：">
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
        <el-button type="primary" @click="confirmSupplier">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import path from 'path'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { deepClone } from '@/utils'
import { saveSupplier, fetchList, delSupplier } from '@/api/supplier';
import { generateUUID } from '@/utils';

const defaultFormData = {
  uuid: generateUUID(),
  name: '',
  status: '1',
  liaison: '',
  tel: '',
  info: ''
}
const formLabel = {
  name: '供应商名称',
  liaison: '联系人'
}
export default {
  name: 'supplier',
  components: { Pagination },
  data() {
    const validateRequire = (rule, value, callback) => {
      console.log('value',value);
      if (value === '' || value === null) {
        this.$message({
          message: formLabel[rule.field] + '为必传项',
          type: 'error'
        })
        callback(new Error(formLabel[rule.field]  + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultFormData),
      rules: {
        name: [{ validator: validateRequire }],
        liaison: [{ validator: validateRequire }],
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
      dialogType: 'new',
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
    handleAddSupplier() {
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
      this.$confirm('确认要删除这个供应商吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await delSupplier({id:row.id})
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    confirmSupplier() {
       this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          saveSupplier(this.postForm).then(response => {
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
    },
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
