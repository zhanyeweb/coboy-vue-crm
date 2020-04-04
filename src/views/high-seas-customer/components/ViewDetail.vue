<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <div class="panel-heading">客户详细</div>
          </el-col>
        </el-row>
        <div class="postInfo-container">
            <el-col :span="23">
            <el-form-item style="margin-top: 40px;margin-bottom: 40px;" label-width="100px" label="公司名称:" prop="CorporateName">
                <div>{{postForm.CorporateName}}</div>
            </el-form-item>
            </el-col>
        </div>
        <div class="postInfo-container" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="主要联系人:" class="postInfo-container-item" prop="PrimaryContact">
                <div>{{postForm.PrimaryContact}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="职位:" class="postInfo-container-item" prop="position">
                <div>{{postForm.position}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="电话:" class="postInfo-container-item" prop="tel">
                <div>{{postForm.tel}}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="postInfo-container" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="国家:" class="postInfo-container-item">
                <div>{{postForm.country}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="邮箱:" class="postInfo-container-item">
                <div>{{postForm.email}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="客户信息来源:" class="postInfo-container-item">
                <div>{{postForm.CustomerSource}}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="postInfo-container" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="展厅数量:" class="postInfo-container-item">
                <div>{{postForm.NumberOfExhibitionHalls}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="联系进度:" class="postInfo-container-item">
                <div>{{postForm.ContactProgress}}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-form-item label-width="100px" label="地址:" style="margin-bottom: 20px;">
          <div>{{postForm.address}}</div>
        </el-form-item>

        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="网站:" >
          <div>{{postForm.website}}</div>
        </el-form-item>

        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="主营产品:" >
          <div>{{postForm.MainProducts}}</div>
        </el-form-item>
        <el-col :span="23">
          <el-form-item style="margin-bottom: 20px;" label-width="100px" label="备注:">
            <div>{{postForm.remarks}}</div>
          </el-form-item>
        </el-col>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchList as fetchDepartmentList } from '@/api/department';
import { saveCustomer, fetchCustomer, uploadExcel } from '@/api/customer';
import { getRoles } from '@/api/role';
import { generateUUID } from '@/utils';

const defaultForm = {
  uuid: generateUUID(),
  userid: null,
  type: 1, // 客户类型：1，公海客户，2，我的客户，3，保护期客户
  CorporateName: null,
  country: null,
  PrimaryContact: null,
  position: null,
  email: null,
  tel: null,
  NumberOfExhibitionHalls: null,
  CustomerSource: null,
  ContactProgress: null,
  address: null,
  website: null,
  MainProducts: null,
  remarks: null
}
const formLabel = {
  CorporateName: '公司名称',
  country: '国家',
  PrimaryContact: '主要联系人',
  position: '职位',
  email: 'Email',
  tel: '电话',
  NumberOfExhibitionHalls: '展厅数量',
  CustomerSource: '客户信息来源',
  ContactProgress: '联系进度',
  address: '地址',
  website: '网站',
  MainProducts: '主营产品',
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
        CorporateName: [{ validator: validateRequire }],
        PrimaryContact: [{ validator: validateRequire }],
        position: [{ validator: validateRequire }],
        tel: [{ validator: validateRequire }],
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
    ...mapGetters([
      'name',
      'userid'
    ])
  },
  created() {
    if (this.isEdit) {
      const uuid = this.$route.params && this.$route.params.uuid;
      this.fetchData(uuid);
    }
    this.getUser();
  },
  methods: {
    getUser() {
      this.postForm.userid = this.userid;
    },
    fetchData(uuid) {
      fetchCustomer(uuid).then(response => {
        this.postForm = response.data
        this.setTagsViewTitle()
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑客户'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.CorporateName}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑客户'
      document.title = `${title} - ${this.postForm.CorporateName}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          saveCustomer(this.postForm).then(response => {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.loading = false;
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
    draftForm() {
      if (this.postForm.CorporateName.length === 0 || this.postForm.tel.length === 0) {
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
    },
    uploadExcel(item){
      const fileObj = item.file;
      // FormData 对象
      const form = new FormData();
      form.append('FILE_UPLOAD', fileObj);
      form.append('type', 1);
      uploadExcel(form).then(response => {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.loading = false;
            this.$router.push({path:'/high-seas-customer/mylist'})
          }).catch(err => {
            this.loading = false;
            console.log(err);
      });
    },
    downFile(url, filename) {
        // 创建隐藏的可下载链接
        const eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        eleLink.href = url;
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
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
    overflow: hidden;
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
    border-radius: 5px;
    border: 1px solid #bfcbd9;
  }
}
.uploadExcel{
  display: inline-block;
}
</style>
