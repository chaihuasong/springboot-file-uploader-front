# SpringBoot文件上传系统前端

> 🤡 原项目链接 https://github.com/gaoyuyue/MyUploader

> 快速开始(启动后端项目后)

```shell
npm install
npm run build
npm run dev
```

> 单文件上传，多文件上传，大文件上传，断点续传，文件秒传，图片上传
> 
> 后端项目地址： [SpringBoot文件上传系统后端](https://github.com/hacker-and-painter/springboot-file-uploader)

[![Build Status](https://www.travis-ci.org/gaoyuyue/MyUploader.svg?branch=master)](https://www.travis-ci.org/gaoyuyue/MyUploader)
[![GitHub license](https://img.shields.io/github/license/gaoyuyue/MyUploader.svg)](https://github.com/gaoyuyue/MyUploader/blob/master/LICENSE)

# 简介
项目采用前后端分离的方式进行开发，实现了几种常用的文件上传功能。
前端采用 vue.js + plupload + element-ui 实现了文件在浏览器端的发送, 后端采用 spring boot + spring + spring mvc + mybatis 实现了文件在服务器端的接收和存储。

***本项目为前端实现***
# 效果图
> 演示地址： [https://gaoyuyue.github.io/MyUploader](https://gaoyuyue.github.io/MyUploader)
>
> *ps: 用git pages搭建的静态页面，只能演示前端功能*
### 单文件上传
![](https://i.imgur.com/vBr8ZJq.gif)
### 多文件上传
![](https://i.imgur.com/Db6eaMJ.gif)
### 大文件上传
![](https://i.imgur.com/qAyksE8.gif)
### 断点续传
![](https://i.imgur.com/I1G01MT.gif)
### 文件秒传
![](https://i.imgur.com/XHZHGeo.gif)
### 图片上传
![](https://i.imgur.com/HFZQnV3.gif)
# 前端实现
## 组件列表
- 单文件上传（包含文件过滤功能）：[SingleFileUpload.vue](https://github.com/gaoyuyue/MyUploader/blob/master/src/components/SingleFileUpload.vue)
- 多文件上传：[MultiFileUpload.vue](https://github.com/gaoyuyue/MyUploader/blob/master/src/components/MultiFileUpload.vue)
- 大文件上传：[BigFileUpload.vue](https://github.com/gaoyuyue/MyUploader/blob/master/src/components/BigFileUpload.vue)
- 断点续传：[StopUpload.vue](https://github.com/gaoyuyue/MyUploader/blob/master/src/components/StopUpload.vue)
- 文件秒传：[QuickUpload.vue](https://github.com/gaoyuyue/MyUploader/blob/master/src/components/QuickUpload.vue)
- 图片上传：[PictureUpload.vue](https://github.com/gaoyuyue/MyUploader/blob/master/src/components/PictureUpload.vue)
## 引入plupload
> plupload版本: 2.3.6
> 
> 官方文档： [https://www.plupload.com/docs/](https://www.plupload.com/docs/)
> 
> 中文文档： [http://www.phpin.net/tools/plupload/](http://www.phpin.net/tools/plupload/)

为了方便使用我将plupload封装为成一个vue组件[Uploader.vue](https://github.com/gaoyuyue/MyUploader/blob/master/src/components/Uploader.vue)

**例子：**
```vue
<template>
    <div>
      <uploader
        browse_button="browse_button"
        :url="server_config.url+'/File/'"
        @inputUploader="inputUploader"
      />
      <el-button id="browse_button" type="primary">选择文件</el-button>
      <span v-for="file in files">{{file.name}}</span>
      <el-button type="danger" @click="up.start()">开始上传</el-button>
    </div>
</template>

<script>
  import Uploader from './Uploader'
  export default {
    name: "FileUpload",
    data() {
      return {
        server_config: this.global.server_config,
        files:[],
        up: {}
      }
    },
    methods: {
      inputUploader(up) {
        this.up = up;
        this.files = up.files;
      }
    },
    components: {
      'uploader': Uploader
    },
  }
</script>

<style scoped>
</style>
```
### 使用Uploader组件必须要配置的参数：
- browse_button： 选择文件button的id
- url： 文件上传地址
- inputUploader方法： 用于获取uploader对象


> 为了获取uploader对象，自定义了inputUploader方法，需要在引用Uploader.vue的组件中实现inputUploader方法，inputUploader方法中传入了一个参数即uploader对象。*关于uploader对象及其他配置参数请参考plupload官方文档*

## 计算文件MD5值（用于文件妙传）
采用js-spark-md5.js, 项目地址： [https://github.com/satazor/js-spark-md5](https://github.com/satazor/js-spark-md5)

**file-md5.js**
```javascript
'use strict';

import '../plugins/js-spark-md5.js'

export default function (file, callback) {
  var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    file = file,
    chunkSize = 2097152,                             // Read in chunks of 2MB
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0,
    spark = new SparkMD5.ArrayBuffer(),
    fileReader = new FileReader();

  fileReader.onload = function (e) {
    console.log('read chunk nr', currentChunk + 1, 'of', chunks);
    spark.append(e.target.result);                   // Append array buffer
    currentChunk++;

    if (currentChunk < chunks) {
      loadNext();
    } else {
      callback(null, spark.end());
      console.log('finished loading');
    }
  };

  fileReader.onerror = function () {
    callback('oops, something went wrong.');
  };

  function loadNext() {
    var start = currentChunk * chunkSize,
      end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }

  loadNext();
};
```
> 文件秒传： 在添加文件后计算文件的MD5值，在文件上传前先向服务器传送MD5值查询此文件是否已上传，如果文件存在返回false将文件状态置为已上传，否则上传文件。

## 图片预览
使用FileReader读取文件并转成Base64编码字符串, 填入`<image/>`标签的src属性上，即可实现图片预览功能。

**file-url.js**
```javascript
export default function (file, callback) {
  if (!file || !/image\//.test(file.type)) return;
  let fileReader = new FileReader();
  fileReader.onload = function () {
    callback(null,fileReader.result);
  };
  fileReader.onerror = function () {
    callback('oops, something went wrong.');
  };
  fileReader.readAsDataURL(file);
}
```



