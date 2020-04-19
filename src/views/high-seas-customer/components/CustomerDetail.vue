<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="(()=>{downFile(baseUrl+'uploadfile/template.xlsx','Excel模板.xlsx')})">
          下载Excel模板
        </el-button>
        <el-upload
          class="uploadExcel"
          action=""
          :show-file-list="false"
          :http-request="uploadExcel"
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        >
          <el-button v-loading="loading" style="margin-left: 10px;" type="primary">
            导入Excel数据
          </el-button>
        </el-upload>
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
        <div class="postInfo-container">
          <el-col :span="23">
            <el-form-item style="margin-top: 40px;margin-bottom: 40px;" label-width="100px" label="公司名称:" prop="CorporateName">
              <el-input v-model="postForm.CorporateName" :rows="1" type="text" class="article-input" autosize placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>
        </div>
        <div class="postInfo-container" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="主要联系人:" class="postInfo-container-item" prop="PrimaryContact">
                <el-input v-model="postForm.PrimaryContact" :rows="1" type="text" class="article-input" autosize placeholder="请输入主要联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="职位:" class="postInfo-container-item" prop="position">
                <el-input v-model="postForm.position" :rows="1" type="text" class="article-input" autosize placeholder="请输入职位" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="电话:" class="postInfo-container-item" prop="tel">
                <el-input v-model="postForm.tel" :rows="1" type="text" class="article-input" autosize placeholder="请输入电话" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="postInfo-container" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="邮箱:" class="postInfo-container-item">
                <el-input v-model="postForm.email" :rows="1" type="text" class="article-input" autosize placeholder="请输入邮箱" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="Whatsapp:" class="postInfo-container-item" prop="whatsapp">
                <el-input v-model="postForm.whatsapp" :rows="1" type="text" class="article-input" autosize placeholder="请输入Whatsapp" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="LinkedIn:" class="postInfo-container-item" prop="linkedin">
                <el-input v-model="postForm.linkedin" :rows="1" type="text" class="article-input" autosize placeholder="请输入LinkedIn" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="postInfo-container" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="国家:" class="postInfo-container-item">
                <el-input v-model="postForm.country" :rows="1" type="text" class="article-input" autosize placeholder="请输入国家" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="客户信息来源:" class="postInfo-container-item">
                <el-input v-model="postForm.CustomerSource" :rows="1" type="text" class="article-input" autosize placeholder="请输入客户信息来源" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="postInfo-container" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="展厅数量:" class="postInfo-container-item">
                <el-input v-model="postForm.NumberOfExhibitionHalls" :rows="1" type="text" class="article-input" autosize placeholder="请输入展厅数量" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-form-item label-width="100px" label="地址:" style="margin-bottom: 20px;">
          <el-input v-model="postForm.address" :rows="1" type="text" class="article-input" autosize placeholder="请输入地址" />
        </el-form-item>

        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="网站:">
          <el-input v-model="postForm.website" :rows="1" type="text" class="article-input" autosize placeholder="请输入网站" />
        </el-form-item>

        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="主营产品:">
          <el-input v-model="postForm.MainProducts" :rows="1" type="text" class="article-input" autosize placeholder="请输入主营产品" />
        </el-form-item>
        <el-col :span="23">
          <el-form-item style="margin-bottom: 20px;" label-width="100px" label="联系进度:">
            <el-input v-model="postForm.ContactProgress" :rows="4" type="textarea" class="article-textarea" placeholder="请输入联系进度" />
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item style="margin-bottom: 20px;" label-width="100px" label="备注:">
            <el-input v-model="postForm.remarks" :rows="4" type="textarea" class="article-textarea" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchList as fetchDepartmentList } from '@/api/department';
import { saveCustomer, fetchCustomer, uploadExcel } from '@/api/customer';
import { getRoles } from '@/api/role';
import { generateUUID } from '@/utils';

const defaultForm = {
  uuid: null,
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
  remarks: null,
  whatsapp: null,
  linkedin: null,
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
  remarks: '备注',
  whatsapp: 'Whatsapp',
  linkedin: 'LinkedIn',
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
    ]),
    ...mapState({
      baseUrl: state => state.settings.baseUrl
    })
  },
  created() {
    if (this.isEdit) {
      const uuid = this.$route.params && this.$route.params.uuid;
      this.fetchData(uuid);
    }else{
      this.postForm.uuid = generateUUID();
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
            this.$router.push({ path: '/high-seas-customer/edit/' + this.postForm.uuid });
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
    uploadExcel(item) {
      this.loading = true;
      const fileObj = item.file;
      // FormData 对象
      const form = new FormData();
      form.append('FILE_UPLOAD', fileObj);
      form.append('type', 1);
      uploadExcel(form).then(response => {
        if(response.data){
          const { importCount, notImportInfo } = response.data;
          let html = '';
          notImportInfo.map((o, i) => {
            html += '<p>'+(i + 1)+'. '+ o +'</p>';
          });
          const _this = this;
          const messageTxt = notImportInfo.length > 0 ? 
          '<h5>导入条数：' + importCount + '</h5><h5>存在重复相似数据：</h5>' + html 
           : '导入成功';
          this.$notify({
            title: '系统提示：',
            dangerouslyUseHTMLString: true,
            message: messageTxt,
            type: 'success',
            duration: 0,
            onClose: function() {
              if(importCount === 0){
                _this.$router.push({ path: '/high-seas-customer/add' });
              }else{
                _this.$router.push({ path: '/high-seas-customer/mylist' });
              }
            }
          });
          this.loading = false;
        }else{
          this.loading = false;
          this.$notify.error({
            title: '系统提示：',
            message: response.message,
            duration: 3000,
          });
        }
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
