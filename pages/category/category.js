// pages/category/category.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:{
      title:"商品分类"
    },
    barH:"",
    categoryLeftDatas:[],
    categoryRightDatas:[],
    widH:0,
    currentIndex:0,
    adimageList:[],
    catId:858,
    adimagesrc:"",
    righturl:"https://x.dscmall.cn/api/catalog/list/858"
  },

  toSearch(){  //去搜索页
    wx.switchTab({
      url: '../search/search'
    })
  },

  changeTabnav(e){
    console.log(e);
    
    this.setData({
      currentIndex:e.currentTarget.dataset.current,
      catId:e.currentTarget.dataset.catid,
      adimagesrc:e.currentTarget.dataset.imagesrc,
      righturl:`https://x.dscmall.cn/api/catalog/list/${e.currentTarget.dataset.catid}`
    })
    console.log(this.data.catId);
    console.log(this.data.righturl);
    this.getcategoryDatasFn()
  },

  getcategoryDatasFn(){
    wx.request({
      url: this.data.righturl,
      success:(res)=>{
        console.log(res)
        console.log(res.data.data)
        if(res.statusCode==200){
          this.setData({
            categoryRightDatas:res.data.data,
          })
        }
      }
    })
  },
  nextpage(e){
    console.log(e);
    // this.setData({
    //   currentIndex:++this.data.currentIndex
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      barH:app.globalData.navbarHeight
    })
    var _this=this;
    wx.request({
      url: 'https://x.dscmall.cn/api/catalog/list',
      success:function(res){
        console.log(res.data.data);
        _this.setData({
          categoryLeftDatas:res.data.data,
          adimagesrc:res.data.data[0].touch_catads
        });
      },
    })

    this.getcategoryDatasFn()
    

    const res = wx.getSystemInfoSync()
      // console.log(res.windowHeight)
      this.setData({
        widH:res.windowHeight
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})