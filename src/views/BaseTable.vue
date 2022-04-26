<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 兑换记录
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select
          v-model="type"
          placeholder="按状态查询"
          class="handle-select mr10"
        >
          <el-option key="2" label="全部兑换记录" value="2"></el-option>
          <el-option key="1" label="未换取" value="1"></el-option>
          <el-option key="0" label="已换取" value="0"></el-option>
        </el-select>

        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >确认</el-button
        >
      </div>
      <el-table
        :data="
          orderList.slice((currentPage - 1) * pagesize, currentPage * pagesize)
        "
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="commodityRecord_id"
          label="兑换ID"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="commodityList[0].commodity_name"
          label="兑换商品"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="userCList[0].userC_name"
          label="兑换人"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="commodityRecord_time"
          label="兑换时间"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="commodityRecord_status"
          label="兑换状态"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="">
          <template #default="scope">
            <el-button-group>
              <el-button
                @click="showeMore(scope.row.commodityRecord_id)"
                type="primary"
                >兑换</el-button
              >
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="orderList.length"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
// import { fetchData } from "../api/index";
import { getRecordByType, editCommodityById } from "../api/table";
import { seachOrderById } from "../api/dashboard";
import crtTimeFtt from "../utils/index.js";

export default {
  name: "basetable",
  created() {
    this.init();
  },
  data() {
    return {
      orderList: [],
      orderId: "",
      currentPage: 1, // 初始页
      pagesize: 5, // 每页展示数据量
      type: "",
    };
  },
  methods: {
    //   数据初始化
    init() {
      getRecordByType({ type: 2 }).then((res) => {
        res.forEach((item) => {
          item.commodityRecord_time = crtTimeFtt(
            Number(item.commodityRecord_time)
          );
          if (item.commodityRecord_status == 1) {
            item.commodityRecord_status = "未换取";
          } else {
            item.commodityRecord_status = "已换取";
          }
          this.orderList.push(item);
        });
        this.orderList.reverse();
      });
    },
    // 查询
    handleSearch() {
      this.orderList = [];
      if (this.type === "") {
        console.log(1);
        this.init();
      } else {
        console.log(this.type);
        getRecordByType({ type: this.type }).then((res) => {
          res.forEach((item) => {
            item.commodityRecord_time = crtTimeFtt(
              Number(item.commodityRecord_time)
            );
            if (item.commodityRecord_status == 1) {
              item.commodityRecord_status = "未换取";
            } else {
              item.commodityRecord_status = "已换取";
            }

            this.orderList.push(item);
          });
          this.orderList.reverse()
        });
      }
    },
    showeMore(item) {
      editCommodityById({ commodityRecordId: item }).then((res) => {
        this.$message({
          message: "兑换成功",
          type: "success",
        });
        this.handleSearch();
      });
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
    },
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 300px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
