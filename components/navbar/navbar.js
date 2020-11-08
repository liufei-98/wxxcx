// components/navbar/navbar.js
let app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    params:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    barH:"",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goback(){
      wx.navigateBack({})
    }
  },
  attached(){
    this.setData({
      barH:app.globalData.navbarHeight
    })
  },

})
