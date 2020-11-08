// pages/cart/cart.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:{
      title:"购物车"
    },
    barH:"",//自定义头部高度
    cityDatas:"",
    widH:"",//页面可用高度
    nogoods:false,
    cartListDatas:[],//购物车商品数据
    isSelectAll:true, //全选按钮
  },
  changeCity(e){ //切换城市地址
    this.setData({
      cityDatas:e.detail.value
    })
    var cityData=wx.getStorageSync('city')||[]
    cityData.splice(0,1,e.detail.value)
    try{
      wx.setStorageSync('city', cityData)
      wx.showToast({  //提示添加成功
        title: '设置成功',
        icon: 'success',
        duration: 2000
      })
    }catch(err){
      console.log(err);  
      wx.showToast({
        title: '设置失败',
        icon: 'error',
        duration: 2000
      })
    }
  },
    changeSelect(e){ //点击每个商品前的按钮
      // console.log(e.currentTarget);
      var index=e.currentTarget.dataset.index
      var cartListDatas=this.data.cartListDatas
      var isSelect=cartListDatas[index].isSelect
      cartListDatas[index].isSelect=!isSelect
      this.setData({
        cartListDatas:cartListDatas
      })
      //临时数组
      var arr=[]
      for(var i=0;i<cartListDatas.length;i++){
        if(cartListDatas[i].isSelect){
          arr.push(cartListDatas[i])
        }
      }
      if(arr.length==cartListDatas.length){
        this.setData({
          isSelectAll:true
        })
      }else{
        this.setData({
          isSelectAll:false
        })
      }
      this.totalPrice()
    },
    selectAllFn(){ //点击全选按钮
      var cartListDatas=this.data.cartListDatas
      var isSelectAll=this.data.isSelectAll
      isSelectAll=!isSelectAll
      for(var i=0;i<cartListDatas.length;i++){
        cartListDatas[i].isSelect=isSelectAll
      }
      this.setData({
        cartListDatas:cartListDatas,
        isSelectAll:isSelectAll
      })
    this.totalPrice()
    },
    addCartNum(e){ //点击+号
      var index=e.currentTarget.dataset.index
      console.log(index);
      var cartListDatas=this.data.cartListDatas
      var buyNum=cartListDatas[index].buyNum
      cartListDatas[index].buyNum=buyNum+1
      console.log(cartListDatas);
      
      this.setData({
        cartListDatas:cartListDatas
      })
      this.totalPrice()
    },
    jianCartNum(e){ //点击-号
      var index=e.currentTarget.dataset.index
      console.log(index);
      var cartListDatas=this.data.cartListDatas
      var buyNum=cartListDatas[index].buyNum
      if(buyNum>1){
        cartListDatas[index].buyNum=buyNum-1
      }
      console.log(cartListDatas);
      
      this.setData({
        cartListDatas:cartListDatas
      })
      this.totalPrice()
    },
    totalPrice(){  //计算总价
      var cartListDatas=this.data.cartListDatas
      try{
        wx.setStorageSync('carts', cartListDatas)
      }catch(err){
        console.log(err); 
      }
  
      var total=0
      for(var i=0;i<cartListDatas.length;i++){
        if(cartListDatas[i].isSelect){
          total+=cartListDatas[i].shop_price*cartListDatas[i].buyNum
        }
      }
      this.setData({
        totalPrice:total
      })
      
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const res = wx.getSystemInfoSync()
    this.setData({
      barH:app.globalData.navbarHeight,
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
    var cityList=wx.getStorageSync("city")
    this.setData({
      cityDatas:cityList,
    })
    var cartList=wx.getStorageSync("carts") || []
    this.setData({
      navH:app.globalData.navbarHeight,
      cartListDatas:cartList
    })
    console.log(this.data.cartListDatas.length);
    
    if(this.data.cartListDatas.length==0){
      this.setData({
        nogoods:true
      })
    }else{
      this.setData({
        nogoods:false
      })
    }
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