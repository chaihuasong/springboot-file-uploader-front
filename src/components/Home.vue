<template>
  <div id="app">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu router :default-active="defaultActive" style="height: 100%">
          <el-menu-item index="apkFileUpload">
            <i class="el-icon-tickets"></i>
            <span slot="title">APK上传</span>
            <router-link to="{ path: '/apkFileUpload' }"/>
          </el-menu-item>
          <el-menu-item index="commonFileUpload">
            <i class="el-icon-tickets"></i>
            <span slot="title">文件上传</span>
            <router-link to="{ path: '/commonFileUpload' }"/>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="text-align: center; font-size: 22px; color: white">
          <span>HTZUploader</span>
        </el-header>
        <el-main class="my-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      defaultActive: this.$route.name
    }
  },
  methods: {
    redirectUrl(val){
      this.$router.push(val);
    }
  }
}
</script>

<style>
.el-header {
  background-color: #076df1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
.my-main {
  margin: 1em 1em;
}
</style>
