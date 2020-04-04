<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" type="success" @click="submitForm">
          提交
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <div class="panel-heading">编辑内容</div>
          </el-col>
        </el-row>

        <el-form-item style="margin-top: 40px;margin-bottom: 40px;" label-width="100px" label="登录账号:" prop="username">
          <el-input v-model="postForm.username" :rows="1" :disabled="isEdit" type="text" class="article-input" autosize placeholder="请输入登录账号" required />
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="密码:" :prop="isEdit ? '': 'password'">
          <el-input v-model="postForm.password" :rows="1" type="password" class="article-input" autosize placeholder="请输入密码" required />
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="确认密码:" :prop="isEdit ? '': 'notPassword'">
          <el-input v-model="postForm.notPassword" :rows="1" type="password" class="article-input" autosize placeholder="请输入确认密码" />
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="姓名:" prop="FullName">
          <el-input v-model="postForm.FullName" :rows="1" type="text" class="article-input" autosize placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="性别:" >
          <el-radio v-model="postForm.sex" label="1">男生</el-radio>
          <el-radio v-model="postForm.sex" label="2">女生</el-radio>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;display:none;" label-width="100px" label="所在部门:" prop="departmentUuid">
            <el-select v-model="postForm.departmentUuid" placeholder="请选择">
              <template v-for="group in departData">
              <el-option-group
                v-if="group.children.length > 0"
                :key="group.uuid"
                :label="group.departmentName">
                <el-option
                  v-for="item in group.children"
                  :key="item.uuid"
                  :label="item.departmentName"
                  :value="item.uuid">
                </el-option>
              </el-option-group>
                <el-option
                  v-else
                  :key="group.uuid"
                  :label="group.departmentName"
                  :value="group.uuid">
                </el-option>
              </template>
            </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="角色/ 职位:" prop="rolesId">
          <el-select v-model="postForm.rolesId" placeholder="请选择">
            <el-option
               v-for="item in rolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="手机号码:">
          <el-input v-model="postForm.mobile" :rows="1" type="text" class="article-input" autosize placeholder="请输入手机号码" />
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="Email:">
          <el-input v-model="postForm.email" :rows="1" type="text" class="article-input" autosize placeholder="请输入Email" />
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="籍贯:">
          <el-input v-model="postForm.NativePlace" :rows="1" type="text" class="article-input" autosize placeholder="请输入籍贯" />
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="备注:">
          <el-input v-model="postForm.remarks" :rows="5" type="textarea" class="article-textarea" autosize placeholder="请输入备注" />
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'
import { fetchList as fetchDepartmentList } from '@/api/department';
import { saveStaff, updateStaff, fetchStaff } from '@/api/staff';
import { getRoles } from '@/api/role';
import { generateUUID } from '@/utils';

const defaultForm = {
  uuid: generateUUID(),
  username: null,
  password: null,
  FullName: null,
  sex: '1',
  notPassword: null,
  departmentUuid: null,
  rolesId: null,
  mobile: null,
  email: null,
  NativePlace: null,
  remarks: null
}
const formLabel = {
  username: '登录账号',
  password: '密码',
  FullName: '姓名',
  sex: '性别',
  notPassword: '确认密码',
  departmentUuid: '所在部门',
  rolesId: '角色/ 职位',
  mobile: '手机号码',
  email: 'Email',
  NativePlace: '籍贯',
  remarks: '备注'
}

export default {
  name: 'CustomerDetail',
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
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
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        username: [{ validator: validateRequire }],
        password: [{ validator: validateRequire }],
        FullName: [{ validator: validateRequire }],
        sex: [{ validator: validateRequire }],
        notPassword: [{ validator: validateRequire }],
        departmentUuid: [{ validator: validateRequire }],
        rolesId: [{ validator: validateRequire }],
        mobile: [{ validator: validateRequire }]
      },
      tempRoute: {},
      departData: [],
      listDepartQuery: {
        page: 1,
        rows: 999
      },
      rolesList: []
    }
  },
  computed: {

  },
  created() {
    if (this.isEdit) {
      const uuid = this.$route.params && this.$route.params.uuid;
      this.fetchData(uuid);
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
    this.getDepartmentList();
    this.getRoles();
  },
  methods: {
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    getDepartmentList() {
      this.listLoading = true
      fetchDepartmentList(this.listDepartQuery).then(response => {
        
        const data = response.data;
        const _f = (puuid, item) => {
          item = item && item.filter(it => it.puuid === puuid);
          item && item.map((v) => {
            const childData = _f(v.uuid, data);
            v.children = childData;
          });
          
          return item;
        };
        const treeData = _f('0', data);
        
        this.departData = treeData;
        this.listLoading = false
      })
    },
    fetchData(id) {
      fetchStaff(id).then(response => {
        this.postForm = response.data
        this.postForm.password = null;
        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑员工'
      const route = Object.assign({}, this.tempRoute, { title: `${title}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑员工'
      document.title = `${title}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          saveStaff(this.postForm).then(response => {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.loading = false;
            this.$router.push({path:'/staff/list'});
          }).catch(err => {
            console.log(err);
          });
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    margin: 40px 45px 20px 50px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border: 1px solid #ebeef5;
    -webkit-transition: .3s;
    transition: .3s;
    border-radius: 4px;
    .panel-heading{
      padding: 18px 20px;
      border-bottom: 1px solid #ebeef5;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      background: none;
      color: #333;
      border-color: #ddd;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      font-weight: bold;
    }
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-input {
  width: 80%;
}
.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
