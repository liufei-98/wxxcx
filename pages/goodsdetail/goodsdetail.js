// pages/goodsdetail/goodsdetail.js
let app=getApp()
let {
  requestApi
} = require("../../utils/request.js")
let wxParse = require("../../wxParse/wxParse.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    barH:"",//头部高度
    opacity:0, //头部透明度
    color:"#fff",
    bgc:"0.4",
    titleArr:["商品","详情","推荐"],
    activeIndex:0,
    windH:"",//页面可用高度
    goodsDetailData:[],//商品数据
    cityDatas:[],//设置地址
    buyNum:1,//商品购买数量
    showMask:false,//是否显示蒙版
    goodsDatas:[],//推荐商品数据
    flag:"",
    goId: "detail0",
    gid:0, //商品的id
    cartNum:0,
  },
  // 头部返回
  goback(){
    wx.navigateBack({})
  },
  // 切换选择城市
  changeCity(e){
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
  //请求商品详情数据
  async getGoodsDetail(goods_id){
    wx.showLoading({
      title: '加载中',
    })
    let goodsdetail=await requestApi(app.globalData.base_url+"/goods/show",{
      goods_id: goods_id,
      warehouse_id: 0,
      area_id: 0,
      is_delete: 0,
      is_on_sale: 1,
      is_alone_sale: 1,
      parent_id:"",
    },"post")
    // console.log(goodsdetail.data.data);
    this.setData({
      goodsDetailData:goodsdetail.data.data
    })
    wxParse.wxParse('content', 'html', goodsdetail.data.data.goods_desc, this);
    setTimeout(()=>{
      this.infoScrollFn()
    },3000)
  },
  //请求推荐商品数据
  async getGoodsLists(page){
    wx.showLoading({
      title: '加载中',
    })
    let goodslist=await requestApi(app.globalData.base_url+"/goods/goodsguess",{
      page: page,
      size: 10
    },"post")
    // console.log(goodslist.data.data);
    if(goodslist.statusCode==200){
      setTimeout(()=>{
        wx.hideLoading()
      },3000)
      // console.log(goodslist.data.data);
      if(goodslist.data.data.length==0){
        this.setData({
          flag:false
        })
      }
      let list=this.data.goodsDatas.concat(goodslist.data.data)
      let pages=++this.data.page
      this.setData({
        goodsDatas:list,
        flag:true,
        page:pages
      })
    }
  },
  // 加载更多
  loadMore(){
    if(this.data.flag){
      this.getGoodsLists(this.data.page)
    }
  },
  // 滚动页面
  scrollPage(e){
    // console.log(e.detail.scrollTop);
    var scrollY=e.detail.scrollTop
    let bgAlpha=scrollY/400;
    let bgcolor=0.4-scrollY/400*0.4
    if(scrollY>=400){
      this.setData({
        color:"#888",
        bgc:"0",
        opacity:"1"
      })
    }else if(scrollY<=400){
      this.setData({
        opacity:bgAlpha,
        color:"#fff",
        bgc:bgcolor
      })
    }
    for(var i=0;i<this.data.topArr.length;i++){
        if(scrollY<this.data.topArr[i]-this.data.barH/2+this.data.heightArr[i]){
          // console.log(scrollY);
          this.setData({
            activeIndex:i
          })
          break;
        }
    }
  },
  // 获取节点滚动信息
  infoScrollFn(){
    var topArr=[]  //各部分距离顶部的高度组成的数组
    var heightArr=[] //各部分自身的高度组成的数组
    for(var i=0;i<3;i++){
      var idDetail="#detail"+i
      var query=wx.createSelectorQuery()
      query.select(idDetail).boundingClientRect()
      query.exec((res)=>{
        var top=res[0].top       // #the-id节点的上边界坐标
        var height=res[0].height
        topArr.push(top)
        heightArr.push(height)
        // console.log(topArr);
        // console.log(heightArr);
        this.setData({
          topArr:topArr,
          heightArr:heightArr
        })
      })
    }
  },
  // 点击头部快速导航
  tabnavFn(e){
    let index=e.currentTarget.dataset.index
    let id=e.currentTarget.dataset.id
    // console.log(index);
    // console.log(id);
    this.setData({
      goId:id,
      activeIndex:index
    })  
  },
  // 点击改变商品数量
  changeNum(e){
    console.log(e.currentTarget.dataset.num);
    if(e.currentTarget.dataset.num==0){
      if(this.data.buyNum<=1){
        this.setData({
          buyNum:1
        })
      }else{
        this.setData({
          buyNum:this.data.buyNum-1
        })
      }
    }else{
      this.setData({
        buyNum:this.data.buyNum+1
      })
    }
  },
  //输入商品数量
  inputNum(e){
    this.setData({
      buyNum:e.detail.value
    })
  },
  // 点击显示蒙版
  showMaskFn(){
    this.animationObj.translateY(225).step()
    setTimeout(() => {
      this.animationObj.translateY(0).step()
      this.setData({
        animationData: this.animationObj.export(), //导出动画
        showMask: true
      })
    }, 0)
    this.setData({
      animationData: this.animationObj.export(), //导出动画
      showMask:true
    })
  },
  // 点击关闭蒙版
  closeMaskFn(){
    this.animationObj.translateY(255).step()
    setTimeout(() => {
      this.setData({
        animationData: this.animationObj.export(), //导出动画
      })
    }, 0)
    setTimeout(()=>{
      this.setData({
        showMask:false
      })
    },300)
  },
  //验证商品数量
  RegNumFn(){
    var regNum1=new RegExp('[0-9]','g');//判断用户输入的是否为数字 true
    var regNum2=new RegExp('^[1-9]','g');//判断以1-9开头 true
    var regNum3=new RegExp('[\.]','g');//判断包含小数点 false
    var rsNum1=regNum1.exec(this.data.buyNum);
    var rsNum2=regNum2.exec(this.data.buyNum);
    var rsNum3=regNum3.exec(this.data.buyNum);
    if(!rsNum1||!rsNum2||rsNum3){
      wx.showToast({
        title: '请输入数字',
        icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
        duration: 2000     
      }) 
      this.setData({
        buyNum:1
      })
    }else{
      if(this.data.buyNum>this.data.goodsDetailData.goods_number){
        wx.showToast({
          title: '库存不足',
          icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
          duration: 2000     
        }) 
        this.setData({
          buyNum:this.data.goodsDetailData.goods_number
        })
      }else{
        this.animationObj.translateY(255).step()
        setTimeout(() => {
          this.setData({
            animationData: this.animationObj.export(), //导出动画
          })
        }, 0)
        setTimeout(()=>{
          this.setData({
            showMask:false
          })
        },300)
      }
    }
  },
  //点击确认选项加入购物车
  addCartOk(){
    console.log(this.data.buyNum);
    var buyNums=0
    buyNums=this.data.buyNum+this.data.cartNum
    this.setData({
      cartNum:buyNums
    })
    var goods=this.data.goodsDetailData //获取商品信息
    goods.isSelect=true //给商品信息添加选中状态
    goods.buyNum=this.data.buyNum //给商品信息添加购买数量
    var gid=this.data.gid //获取商品id
    var cartDatas=wx.getStorageSync('carts') || []  //设置本地缓存数据，'carts'为本地缓存中指定的 key
    if(cartDatas.length>0){  //当本地缓存中有数据
      for(var key in cartDatas){ //将本地缓存中的数据遍历出来
        if(cartDatas[key].goods_id==gid){ //如果本地缓存中有当前商品数据
          cartDatas[key].buyNum=cartDatas[key].buyNum+this.data.buyNum //购买该商品的数量等于之前的商品数量加上现在的购买数量
          try{
            wx.setStorageSync('carts', cartDatas)
            wx.showToast({  //提示添加成功
              title: '添加成功',
              icon: 'success',
              duration: 2000
            })
            this.RegNumFn()
          }catch(err){
            console.log(err);  
            wx.showToast({
              title: '添加失败',
              icon: 'error',
              duration: 2000
            })
          }
          return;
        }
      }
      //购物车中没有当前数据，并且购物车中已经存在数据
      cartDatas.push(goods)
    }else{
      cartDatas.push(goods)
      this.RegNumFn()
    }
    //当本地缓存中没有数据时直接添加
    wx.setStorageSync('carts', cartDatas)
    
  },
  toCart(){
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      barH:app.globalData.navbarHeight,
      gid:options.goods_id,
    })
    // console.log(app.globalData.navbarHeight);
    // console.log(options.goods_id);
    this.getGoodsDetail(options.goods_id)
    this.getGoodsLists(1)
    try {  //获取窗口高度
      const res = wx.getSystemInfoSync()
      this.setData({
        widH:res.windowHeight
      })
    } catch (e) {
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //定义一个动画实例对象
    this.animationObj = wx.createAnimation({
      delay: 0, //延迟动画
      duration: 300, //持续时间
      timingFunction: "linear" //过度效果
    })
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
    console.log(cartList);
    var total=0
    for(var i=0;i<cartList.length;i++){
      if(cartList[i].isSelect){
        total+=cartList[i].buyNum
      }
    }
    this.setData({
      cartNum:total
    })
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