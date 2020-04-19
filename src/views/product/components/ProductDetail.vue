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
        <div class="postInfo-container">
          <el-col :span="23">
            <el-form-item style="margin-top: 40px;margin-bottom: 40px;" label-width="100px" label="产品名称:" prop="name">
              <el-input v-model="postForm.name" :rows="1" type="text" class="article-input" autosize placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
        </div>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="产品分类:" prop="cateUuid">
          <el-select v-model="postForm.cateUuid" placeholder="请选择">
            <template v-for="group in cateData">
              <el-option-group
                v-if="group.children.length > 0"
                :key="group.uuid"
                :label="group.name"
              >
                <el-option
                  v-for="item in group.children"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.uuid"
                />
              </el-option-group>
              <el-option
                v-else
                :key="group.uuid"
                :label="group.name"
                :value="group.uuid"
              />
            </template>
          </el-select>
        </el-form-item>
        <div class="postInfo-container" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="库存:" class="postInfo-container-item" prop="stock">
                <el-input v-model="postForm.stock" :rows="1" type="text" class="article-input" autosize placeholder="请输入库存" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="警告库存:" class="postInfo-container-item" prop="minStock">
                <el-input v-model="postForm.minStock" :rows="1" type="text" class="article-input" autosize placeholder="请输入警告库存" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="postInfo-container" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="成本价:" class="postInfo-container-item" prop="costPrice">
                <el-input v-model="postForm.costPrice" :rows="1" type="text" class="article-input" autosize placeholder="请输入成本价" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="销售价:" class="postInfo-container-item" prop="sellingPrice">
                <el-input v-model="postForm.sellingPrice" :rows="1" type="text" class="article-input" autosize placeholder="请输入销售价" />
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item style="margin-bottom: 20px;" label-width="100px" label="备注:">
                <el-input v-model="postForm.content" :rows="4" type="textarea" class="article-textarea" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { searchUser } from '@/api/remote-search'
import { fetchList as fetchProductCateList } from '@/api/productCate';
import { saveProduct, fetchProduct } from '@/api/product';
import { getRoles } from '@/api/role';
import { generateUUID } from '@/utils';

const defaultForm = {
  uuid: generateUUID(),
  userid: null,
  name: null,
  cateUuid: null,
  stock: null,
  minStock: null,
  costPrice: null,
  sellingPrice: null,
  content: null
}
const formLabel = {
  name: '产品名称',
  cateUuid: '产品分类',
  stock: '库存',
  minStock: '警告库存',
  costPrice: '成本价',
  sellingPrice: '销售价',
  content: '备注'
}

export default {
  name: 'ProductDetail',
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
        name: [{ validator: validateRequire }],
        cateUuid: [{ validator: validateRequire }],
        stock: [{ validator: validateRequire }],
        costPrice: [{ validator: validateRequire }],
        sellingPrice: [{ validator: validateRequire }]
      },
      tempRoute: {},
      cateData: [],
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
    this.getProductCateList();
    this.getUser();
  },
  methods: {
    getProductCateList() {
      this.listLoading = true
      fetchProductCateList(this.listDepartQuery).then(response => {
        console.log('response', response)
        const data = response.data;
        const _f = (puuid, item) => {
          item = item && item.filter(it => it.puuid === puuid);
          item && item.map((v) => {
            const childData = _f(v.uuid, data);
            v.children = childData;
          });
          console.log('item', item);
          return item;
        };
        const treeData = _f('0', data);
        console.log('treeData', treeData);
        this.cateData = treeData;
        this.listLoading = false
      })
    },
    getUser() {
      this.postForm.userid = this.userid;
    },
    fetchData(uuid) {
      fetchProduct(uuid).then(response => {
        this.postForm = response.data
        this.setTagsViewTitle()
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑产品'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.name}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑产品'
      document.title = `${title} - ${this.postForm.name}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          saveProduct(this.postForm).then(response => {
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
    uploadExcel(item) {
      const fileObj = item.file;
      // FormData 对象
      const form = new FormData();
      form.append('FILE_UPLOAD', fileObj);
      form.append('type', 3);
      uploadExcel(form).then(response => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        });
        this.loading = false;
        this.$router.push({ path: '/customer/protectList' })
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
