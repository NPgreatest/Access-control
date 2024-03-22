<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="newPassword">UserName:</label>
        <input type="text" id="username" v-model="username">
      </div>
      <div class="form-group">
        <label for="newPassword">New Password:</label>
        <input type="password" id="newPassword" v-model="newPassword">
      </div>
      <button type="submit">Change Password</button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { changePassword } from '@/api/table'

export default {
  name: 'Dashboard',
  data() {
    return {
      newPassword: '',
      username:','
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    token() {
      // 假设 token 存储在 Vuex store 的 'token' getter 中
      // 如果存储方式不同，请根据您的项目实际情况调整
      return this.$store.getters.token
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.newPassword || !this.username) {
        alert('Please enter a new password or username');
        return
      }
      try {
        const response = await changePassword(localStorage.getItem('token'), this.username, this.newPassword);
        alert(response.message); // 或者根据 response.code 进行更详细的处理
        this.newPassword = ''; // 重置密码输入框
      } catch (error) {
        console.error('Password change failed:', error);
        alert('Failed to change password');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* 基础容器样式 */
.dashboard-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* 标题和文本样式 */
.dashboard-text {
  font-size: 18px;
  margin-bottom: 20px;
}

/* 表单样式 */
form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-weight: 500;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

/* 提交按钮样式 */
button[type="submit"] {
  padding: 10px 20px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}


</style>
