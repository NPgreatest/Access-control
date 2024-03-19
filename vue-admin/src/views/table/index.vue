<template>
  <div class="app-container" >
    <el-button type="primary" @click="addRow">Add New Row</el-button>



    <el-dialog
      title="Add New Permission"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="form">
        <el-form-item label="User ID">
          <el-input v-model="form.userId"></el-input>
        </el-form-item>
        <el-form-item label="Access Teams">
          <el-select v-model="form.teamIds" multiple placeholder="Select teams">
            <el-option v-for="team in allTeams" :key="team.slug" :label="team.name" :value="team.slug"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Access Level">
          <el-select v-model="form.accessLevel">
            <el-option label="read" value="read"></el-option>
            <el-option label="read/write" value="read/write"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="submitForm">Confirm</el-button>
  </span>
    </el-dialog>




    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID " width="200">
        <template v-slot:default="scope">
          {{ scope.row._id }}
        </template>
      </el-table-column>
      <el-table-column label="User ID" width="200">
        <template v-slot:default="scope">
          {{ scope.row.userId }}
        </template>
      </el-table-column>


      <el-table-column label="Access Level" width="150" align="center">
        <template v-slot:default="scope">
          <el-select v-model="scope.row.accessLevel" @change="() => updateTeams(scope.row)" :class="{'background-green': scope.row.accessLevel === 'read', 'background-red': scope.row.accessLevel === 'read/write'}">
            <el-option label="read" value="read"></el-option>
            <el-option label="read/write" value="read/write"></el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="Access Teams" width="500" align="center">
        <template v-slot:default="scope">
          <el-select v-model="scope.row.teamIds" multiple placeholder="Select teams" @blur="() => updateTeams(scope.row)">
            <!-- 使用 team.name 作为显示的标签，使用 team.slug 作为选项的值 -->
            <el-option v-for="team in allTeams" :key="team.slug" :label="team.name" :value="team.slug"></el-option>
          </el-select>
        </template>
      </el-table-column>


      <el-table-column label="Operations" width="150" align="center">
        <template v-slot:default="scope">
          <el-button type="danger" icon="el-icon-delete" @click="deleteRow(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>



<script>
import { delPermissions, getList, updatePermissions } from '@/api/table'
import axios from 'axios'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      dialogVisible: false, // 控制对话框的显示
      form: { // 表单数据
        userId: '',
        teamIds: [],
        accessLevel: ''
      },
      list: [],
      listLoading: false,
      allTeams: []
    }
  },
  created() {
    this.fetchData()
    this.fetchTeams()
  },
  methods: {
    fetchTeams() {
      axios.get('https://api.victorops.com/api-public/v1/team', {
        headers: {
          'Accept': 'application/json',
          'X-VO-Api-Id': 'b65648ce',
          'X-VO-Api-Key': '38f5b31d3bd94f29a4e89adccdd07039'
        }
      }).then(response => {
        this.allTeams = response.data.map(team => ({
          name: team.name,
          slug: team.slug
        }));
      }).catch(error => {
        console.error('Failed to fetch teams:', error);
      })
    },
    fetchData() {
      this.listLoading = true
      getList(localStorage.getItem('token')).then(response => {
        this.list = response
        this.listLoading = false
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    submitForm() {
      // 调用updatePermissions函数来添加权限
      updatePermissions(localStorage.getItem('token'), this.form.userId, this.form.teamIds, this.form.accessLevel).then(() => {
        this.$message.success('Permission added');
        this.dialogVisible = false; // 关闭对话框
        // 可以在这里添加逻辑来刷新列表或者做其他更新
      }).catch(error => {
        console.error('Error adding permission:', error);
        this.$message.error('Failed to add permission');
      });
    },
    // updateAccessLevel(row) {
    //   updateAccess(row._id, row.accessLevel).then(() => {
    //     this.$message.success('Access level updated');
    //   }).catch(error => {
    //     console.error("Error updating access level:", error);
    //     this.$message.error('Failed to update access level');
    //   });
    // },

    updateTeams(row) {
      updatePermissions(localStorage.getItem('token'), row.userId, row.teamIds,row.accessLevel).then(() => {
        this.$message.success('Teams updated');
      }).catch(error => {
        console.error('Error updating teams:', error);
        this.$message.error('Failed to update teams');
      });
    },

    deleteRow(index, row) {
      delPermissions(localStorage.getItem('token'), row.userId).then(() => {
        this.$message.success('User Permission deleted success');
        this.fetchData()
      }).catch(error => {
        console.error('Error updating teams:', error);
        this.$message.error('Failed to update teams');
      });
    },
    addRow() {
      this.dialogVisible = true; // 显示对话框
    },
  }
}
</script>

<style>


.background-green {
  background-color: #f0f9eb; /* Light green background */
}

.background-red {
  background-color: #fef0f0; /* Light red background */
}
</style>
