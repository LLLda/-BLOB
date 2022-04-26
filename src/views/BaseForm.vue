<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 商品管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box" style="width: 100%">
        <el-table
          :data="
            commodity.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
        >
          <el-table-column
            prop="commodity_id"
            label="商品ID"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="commodity_name"
            label="商品名"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="commodity_des"
            label="商品简介"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="commodity_stock"
            label="库存"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="commodity_integral"
            label="所需积分"
            align="center"
          ></el-table-column>
          <el-table-column prop="commodity_img" label="展示图片" align="center">
            <template #default="scope">
              <img :src="scope.row.commodity_img" width="40" height="40" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="">
            <template #default="scope">
              <el-button-group>
                <el-button
                  @click="showeEditDishes(scope.row)"
                  type="primary"
                  icon="el-icon-edit"
                ></el-button>
                <el-button
                  @click="deleteCommodity(scope.row)"
                  type="primary"
                  icon="el-icon-delete"
                ></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="add-box" style="margin-top: 20px; justify-content: center">
          <el-button
            round
            @click="(changeDishes = true), (dialogType = 0)"
            type="primary"
          >
            新增商品
          </el-button>
        </div>
        <!-- 商品弹窗 -->
        <el-dialog title="商品" v-model="changeDishes" width="80%">
          <el-form
            ref="formRef"
            :rules="rules"
            :model="commodityForm"
            label-width="80px"
          >
            <el-form-item label="商品名" prop="dishes_name">
              <el-input
                rows="5"
                v-model="commodityForm.commodityName"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品介绍" prop="dishes_content">
              <el-input
                rows="5"
                v-model="commodityForm.commodityDes"
              ></el-input>
            </el-form-item>
            <el-form-item label="库存" prop="dishes_price">
              <el-input
                rows="5"
                v-model="commodityForm.commodityIntegral"
              ></el-input>
            </el-form-item>
            <el-form-item label="积分" prop="dishes_price">
              <el-input
                rows="5"
                v-model="commodityForm.commodityStock"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <input
                type="file"
                id="fileId"
                ref="addPicFile"
                name="file"
                accept="image/jpg,image/jpeg,image/png,image/bmp"
                style="display: none"
                @change="uploadImg"
              />
              <el-button class="primary" @click="$refs.addPicFile.click()"
                >上传图片</el-button
              >
              <img
                :src="commodityForm.commodityUrl"
                alt=""
                v-if="commodityForm.commodityUrl"
                style="width: 100px; height: 100px"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                v-if="dialogType === 0"
                @click="addCommodity"
                >添加</el-button
              >
              <el-button
                type="primary"
                v-if="dialogType === 1"
                @click="editCommodity"
                >确认修改</el-button
              >
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadFile } from "../api/BaseForm";
import { getCommodity, editCommodity, addCommodity } from "../api/table";
export default {
  name: "baseform",
  data() {
    return {
      commodity: [], // 商品信息
      currentPage: 1, // 初始页
      pagesize: 5, // 每页展示数据量
      dishesList: [],
      menuList: [],
      menu_id: "", // 选择的菜单id
      userId: localStorage.getItem("userId"),
      editVisible: false, // 菜单弹出层
      changeDishes: false, // 菜品弹出层
      defaultValue: "",
      commodityForm: {
        commodityName: "",
        commodityDes: "",
        commodityIntegral: "",
        commodityStock: "",
        commodityUrl: "",
        commodityId:'',
      },
      dishesForm: {
        dishes_name: "",
        dishes_price: "",
        dishes_content: "",
      }, // 菜品表单数据
      imgUrl: "",
      dialogType: null, // 弹窗类型 0-添加   1-修改
      rules: {
        commodityName: [
          { required: true, message: "商品名不能为空", trigger: "blur" },
        ],
        commodityDes: [
          { required: true, message: "商品简介不能为空", trigger: "blur" },
        ],
        commodityIntegral: [
          { required: true, message: "积分不能为空", trigger: "blur" },
        ],
        commodityStock: [
          { required: true, message: "库存不能为空", trigger: "blur" },
        ],
      },
    };
  },
  async created() {
    this.getCommodity();
  },
  methods: {
    // 获取商品
    getCommodity() {
      getCommodity().then((res) => {
        this.commodity = res;
      });
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
    },

    // 新增菜品
    addCommodity() {
      if (
        !(
          this.commodityForm.commodityName &&
          this.commodityForm.commodityDes &&
          this.commodityForm.commodityIntegral &&
          this.commodityForm.commodityStock &&
          this.commodityForm.commodityUrl
        )
      ) {
        this.$message({
          type: "error",
          message: "请输入全部信息",
        });
        return;
      }
      addCommodity({
        commodityName: this.commodityForm.commodityName,
        commodityDes: this.commodityForm.commodityDes,
        commodityType: 1,
        commodityIntegral: this.commodityForm.commodityIntegral,
        commodityStock: this.commodityForm.commodityStock,
        commodityUrl: this.commodityForm.commodityUrl,
      }).then((res) => {
        this.$message({
          type: "success",
          message: "添加商品成功",
        });
        this.commodityForm = [];
        this.imgUrl = [];
        this.changeDishes = false;
        this.getCommodity();
      });
    },
    // 修改商品弹窗
    showeEditDishes(item) {
      this.changeDishes = true;
      this.dialogType = 1;
      this.commodityForm.commodityId = item.commodity_id;
    },
    // 修改商品
    editCommodity() {
      if (
        !(
          this.commodityForm.commodityName &&
          this.commodityForm.commodityDes &&
          this.commodityForm.commodityIntegral &&
          this.commodityForm.commodityStock &&
          this.commodityForm.commodityUrl
        )
      ) {
        this.$message({
          type: "error",
          message: "请输入全部信息",
        });
        return;
      }
      editCommodity({
        commodityId: this.commodityForm.commodityId,
        commodityName: this.commodityForm.commodityName,
        commodityDes: this.commodityForm.commodityDes,
        commodityType: 1,
        commodityIntegral: this.commodityForm.commodityIntegral,
        commodityStock: this.commodityForm.commodityStock,
        commodityStatus: 1,
        commodityUrl: this.commodityForm.commodityUrl,
      }).then((res) => {
        this.$message({
          type: "success",
          message: "成功",
        });
        this.commodityForm = [];
        this.imgUrl = [];
        this.changeDishes = false;
        this.getCommodity();
      });
    },
    // 删除删除
    deleteCommodity(item) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(item);
          editCommodity({
            commodityId: item.commodity_id,
            commodityName: item.commodity_name,
            commodityDes: item.commodity_des,
            commodityType: 1,
            commodityIntegral: item.commodity_integral,
            commodityStock: item.commodity_stock,
            commodityStatus: 0,
            commodityUrl: item.commodity_img,
          }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getCommodity();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 图片上传
    async uploadImg() {
      this.commodityForm.commodityUrl = await uploadFile(
        this.$refs.addPicFile.files[0]
      );
      console.log(this.commodityForm.commodityUrl, 789789);
    },
  },
};
</script>

<style scoped>
.menu-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
}
.add-box {
  width: 100%;
  display: flex;
  justify-content: right;
  padding-bottom: 20px;
}
</style>
