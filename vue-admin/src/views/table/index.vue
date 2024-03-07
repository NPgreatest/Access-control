<template>
  <div class="app-container" >
    <el-button type="primary" @click="addRow">Add New Row</el-button>

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
          <el-select v-model="scope.row.accessLevel" @change="() => updateAccessLevel(scope.row)" :class="{'background-green': scope.row.accessLevel === 'read', 'background-red': scope.row.accessLevel === 'read/write'}">
            <el-option label="read" value="read"></el-option>
            <el-option label="read/write" value="read/write"></el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="Access Teams" width="500" align="center">
        <template v-slot:default="scope">
          <el-select v-model="scope.row.teamIds" multiple placeholder="Select teams" @blur="() => updateTeams(scope.row)">
            <!-- 假设这里有一个团队ID的列表 -->
            <el-option v-for="teamId in allTeams" :key="teamId" :label="teamId" :value="teamId"></el-option>
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
import { getList } from '@/api/table'

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
      list: [],
      listLoading: false,
      allTeams: ['team1', 'team2', 'team3']
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true

      getList(localStorage.getItem('token')).then(response => {
        this.list = response
        this.listLoading = false
      })
    },
    updateAccessLevel(row) {
      updateAccess(row._id, row.accessLevel).then(() => {
        this.$message.success('Access level updated');
      }).catch(error => {
        console.error("Error updating access level:", error);
        this.$message.error('Failed to update access level');
      });
    },

    updateTeams(row) {
      updateTeamsAPI(row._id, row.teamIds.split(', ')).then(() => {
        this.$message.success('Teams updated');
      }).catch(error => {
        console.error("Error updating teams:", error);
        this.$message.error('Failed to update teams');
      });
    },

    deleteRow(index, row) {
      deleteItem(row._id).then(() => {
        this.$message.success('Row deleted');
        this.list.splice(index, 1); // Remove the row from the table
      }).catch(error => {
        console.error("Error deleting item:", error);
        this.$message.error('Failed to delete row');
      });
    },
    addRow() {
      // 添加一个新行的示例数据结构，根据实际需要调整
      const newRow = {
        _id: `new_${Date.now()}`, // 生成一个临时的ID
        userId: '',
        accessLevel: 'read',
        teamIds: [],
      };
      this.list.push(newRow);
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
