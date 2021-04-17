import Vue from 'vue'
import Router from 'vue-router'
import APKFileUpload from '../components/APKFileUpload'
import CommonFileUpload from '../components/CommonFileUpload'
import BigFileUpload from '../components/BigFileUpload'
import StopUpload from '../components/StopUpload'
import QuickUpload from '../components/QuickUpload'
import SingleFileUpload from '../components/SingleFileUpload'
import MultiFileUpload from  '../components/MultiFileUpload'
import PictureUpload from '../components/PictureUpload'
import Login from '../components/Login'
import home from '../components/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {path:'/home',component:home,name:'home',
      redirect: "apkFileUpload",
      children: [
        {path:'/apkFileUpload',component:APKFileUpload,name:'apkFileUpload'},
        {path:'/commonFileUpload',component:CommonFileUpload,name:'commonFileUpload'},
        {path:'/singleFileUpload',component:SingleFileUpload,name:'singleFileUpload'},
        {path:'/bigFileUpload',component:BigFileUpload,name:'bigFileUpload'},
        {path:'/stopUpload',component:StopUpload,name:'stopUpload'},
        {path:'/quickUpload',component:QuickUpload,name:'quickUpload'},
        {path:'/multiFileUpload',component:MultiFileUpload,name:'multiFileUpload'},
        {path:'/pictureUpload',component:PictureUpload,name:'pictureUpload'},
      ]
    },
    {path:'/',component:Login,name:'Login'}
  ]
})
