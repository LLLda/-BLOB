<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-emoji"></i> 内容管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="header">
        <h3>
          公告管理<span class="warn"
            >（列表第一条公告为当前客户端展示公告）</span
          >
        </h3>
        <el-button type="primary" round @click="dialogVisible = true">
          新增公告<i class="el-icon-circle-plus-outline el-icon--right"></i>
        </el-button>
      </div>

      <el-table
        :data="announcement.slice(0, 10)"
        border
        class="table announcement"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="announcement_id"
          label="公告ID"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="announcement_headline"
          label="公告标题"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="announcement_content"
          label="公告内容"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="announcement_time"
          label="发布时间"
          align="center"
        ></el-table-column>
      </el-table>
      <div class="info">
        <span class="warn">仅展示最仅10条公告记录</span>
      </div>

      <el-dialog
        v-model="dialogVisible"
        title="新增公告"
        width="30%"
        :before-close="handleClose"
      >
        <el-form :model="form">
          <el-form-item label="公告标题" :label-width="formLabelWidth">
            <el-input v-model="form.announcementHeadline" autocomplete="off" />
          </el-form-item>
          <el-form-item label="公告内容" :label-width="formLabelWidth">
            <el-input v-model="form.announcementContent" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addAnnouncement">添加</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="gap"></div>
    <div class="container" v-if="classify">
      <h3>分区管理</h3>
      <el-table
        :data="classify"
        border
        class="table announcement"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="classify_id"
          label="分区ID"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="classify_name"
          label="分区名"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="classify_des"
          label="分区介绍"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="">
          <template #default="scope">
            <el-button-group>
              <el-button
                @click="showeEditClassify(scope.row)"
                type="primary"
                icon="el-icon-edit"
              ></el-button>
              <el-button
                @click="delClassify(scope.row)"
                type="primary"
                icon="el-icon-delete"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div class="add-box" style="margin-top: 20px; justify-content: center">
        <el-button round @click="addEditClassify" type="primary">
          新增分区
        </el-button>
      </div>
      <el-dialog title="分区" v-model="show" width="80%">
        <el-form
          ref="formRef"
          :rules="rules"
          :model="classifyForm"
          label-width="80px"
        >
          <el-form-item label="分区名" prop="classify_name">
            <el-input rows="5" v-model="classifyForm.classifyName"></el-input>
          </el-form-item>
          <el-form-item label="分区介绍" prop="classify_des">
            <el-input rows="5" v-model="classifyForm.classifyDes"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              v-if="dialogType === 0"
              @click="addClassify"
              >添加</el-button
            >
            <el-button
              type="primary"
              v-if="dialogType === 1"
              @click="editClassify"
              >确认修改</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getAnnouncement,
  addAnnouncement,
  getClassify,
  addClassify,
  editClassify,
} from "../api/index";
import crtTimeFtt from "../utils/index.js";
export default {
  name: "icon",
  created() {
    this.init();
  },
  data() {
    return {
      announcement: [],
      dialogVisible: false,
      classify: "",
      show: false, // 分区编辑添加展示
      dialogType: "", // 弹窗类型
      form: {
        announcementHeadline: "",
        announcementContent: "",
      },
      classifyForm: {
        classifyName: "",
        classifyDes: "",
      },
    };
  },
  methods: {
    init() {
      this.getClassify();
      this.getAnnouncement();
    },
    // 获取公告
    getAnnouncement() {
      getAnnouncement().then((res) => {
        res.forEach((item) => {
          item.announcement_time = crtTimeFtt(Number(item.announcement_time));
          this.announcement.push(item);
        });
        this.announcement.reverse();
      });
    },
    // 添加公告
    addAnnouncement() {
      addAnnouncement({
        announcementTime: new Date().getTime(),
        ...this.form,
      }).then((res) => {
        if (res) {
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.announcement = [];
          this.getAnnouncement();
          this.dialogVisible = false;
        }
      });
    },
    // 获取分区
    getClassify() {
      getClassify().then((res) => {
        this.classify = res;
      });
    },
    // 展示编辑弹窗
    showeEditClassify(item) {
      this.classifyForm.classifyName = item.classify_name;
      this.classifyForm.classifyDes = item.classify_des;
      (this.classifyId = item.classify_id), (this.show = true);
      this.dialogType = 1;
    },
    // 展示新增弹窗
    addEditClassify() {
      this.show = true;
      this.dialogType = 0;
    },
    // 编辑分区
    editClassify() {
      editClassify({
        classifyId: this.classifyId,
        ...this.classifyForm,
      }).then((res) => {
        if (res == "success") {
          this.$message({
            message: "成功",
            type: "success",
          });
          this.getClassify();
          this.show = false;
        } else {
          this.$message({
            message: "失败",
            type: "fail",
          });
        }
      });
    },
    // 新增分区
    addClassify() {
      addClassify({ ...this.classifyForm }).then((res) => {
        if (res == "success") {
          this.$message({
            message: "成功",
            type: "success",
          });
          this.getClassify();
          this.show = false;
        } else {
          this.$message({
            message: "失败",
            type: "fail",
          });
        }
      });
    },
    // 删除分区
    delClassify(item) {
      editClassify({
        classifyId: item.classify_id,
        classifyStatus: 1,
      }).then((res) => {
        if (res == "success") {
          this.$message({
            message: "成功",
            type: "success",
          });
          this.getClassify();
        } else {
          this.$message({
            message: "失败",
            type: "fail",
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.warn {
  font-size: 14px;
  color: #7a7a7a;
}
.announcement {
  margin-top: 30px;
}
.header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info {
  margin-top: 20px;
  display: flex;
  justify-content: right;
}
.gap {
  height: 5px;
}
.add-box {
  width: 100%;
  display: flex;
  justify-content: right;
  padding-bottom: 20px;
}
</style>
