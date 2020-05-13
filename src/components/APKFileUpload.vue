<template>
  <div>
    <uploader
        browse_button="browse_button"
        :url="server_config.url+'/BigFile/'"
        chunk_size="2MB"
        :filters="{
          mime_types : [
            { title : 'APK files', extensions : 'apk' }
          ],
          prevent_duplicates:true
        }"
        :FilesAdded="filesAdded"
        :multi_selection="false"
        :BeforeUpload="beforeUpload"
        @inputUploader="inputUploader"
    />
    <el-button type="primary" id="browse_button">选择APK文件</el-button>
    <br/>
    <el-table
      :data="tableData"
      style="width: 100%; margin: 10px 10px;">
      <el-table-column
        label="文件名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="大小">
        <template slot-scope="scope">
          <span>{{scope.row.size}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === -1">正在计算MD5</span>
          <span v-if="scope.row.status === 1">MD5计算完成，准备上传</span>
          <span v-if="scope.row.status === 4" style="color: brown">上传失败</span>
          <span v-if="scope.row.status === 5" style="color: chartreuse">已上传</span>
          <el-progress v-if="scope.row.status === 2" :text-inside="true" :stroke-width="20"
                       :percentage="scope.row.percent"/>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="deleteFile(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br/>
    <el-input
      type="text"
      style="width:15%;"
      placeholder="请输入版本号"
      v-model="versionNumber">
    </el-input>
    <el-input
      type="text"
      style="width:15%;"
      placeholder="请输入版本名称"
      v-model="versionName">
    </el-input>
    <br/>
    <br/>
    <el-input
      type="textarea"
      style="width:80%;"
      :rows="20"
      placeholder="请输入更新内容"
      v-model="textarea">
    </el-input>
    <br/>
    <br/>
    <el-button type="danger" @click=startUpload(up)>开始上传</el-button>
  </div>
</template>

<script>
  import FileMd5 from '../models/file-md5.js'
  import Uploader from './Uploader'
  export default {
    name: 'APKFileUpload',
    data() {
      return {
        server_config: this.global.server_config,
        up: {},
        files:[],
        tableData: [],
        versionNumber: '',
        versionName: '',
        textarea: ''
      }
    },
    components: {
      'uploader': Uploader
    },
    watch: {
      files: {
        handler() {
          this.tableData = [];
          this.files.forEach((e) => {
            this.tableData.push({
              name: e.name,
              size: e.size,
              status: e.status,
              id: e.id,
              percent: e.percent
            });
          });
        },
        deep: true
      }
    },
    methods: {
      inputUploader(up) {
        this.up = up;
        this.files = up.files;
      },
      filesAdded(up, files) {
        if (up.files.length > 1) {
          up.removeFile(up.files[0])
        }
        files.forEach((f) => {
          f.status = -1;
          FileMd5(f.getNative(), (e, md5) => {
            f["md5"] = md5;
            f.status = 1;
          });
        });
      },
      deleteFile(id) {
        let file = this.up.getFile(id);
        this.up.removeFile(file);
      },
      beforeUpload(up, file) {
        up.setOption("multipart_params", {"size":file.size,"md5":file.md5});
      },
      startUpload(up) {
        up.start();

        console.log("number:"+this.versionNumber + " name:" + this.versionName + " content:" + this.textarea);
        console.log("files[0].name:"+this.files[0].name + " this.files[0].md5:" + this.files[0].md5 + " this.files[0].size:" + this.files[0].size);
        this.$axios.post(this.server_config.url + '/APKFile/info', {
          "verionNumber": this.versionNumber,
          "versionName": this.versionName,
          "name": this.files[0].name,
          "md5": this.files[0].md5,
          "content": this.textarea,
          "size": this.files[0].size
        }).then(function (response) {
          console.log(response);
        }).catch(function (error) {
          console.log(error);
        });
      }
    }
  }
</script>

<style scoped>

</style>

