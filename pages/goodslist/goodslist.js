// pages/goodslist/goodslist.js
let app = getApp()
let {
  requestApi
} = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:{
      title:"商品列表",
      showback:true
    },
    barH:"",
    show:true,
    currentNum:"1",
    rankshowZH:true,
    rankshowJG:true,
    goodslistDatas:[],
    //接口请求的数据
    page:1,
    sort:"goods_id",
    order:"desc",
    catid:0,
    intro:"",
    self:0,
    goods_num:0,
    min:"",
    max:"",

    widH:0, //页面高度
    searchH:0, //搜索栏高度
    tabH:0, //导航切换高度
    flag:"",
    showmask:false,// 显示蒙版
    switchChecked:false,//开关
    chooseyouhuo:false,//有货选项
    choosecuxiao:false,//促销选项
  },

  toSearch(){
    wx.switchTab({
      url: '/pages/search/search',
    })
  },

  changelist(){
    if(this.data.show==true){
      this.setData({
        show:false
      })
    }else if(this.data.show==false){
      this.setData({
        show:true
      })
    }
  },

  changerankZH(e){
    if(this.data.currentNum!=1){
      this.setData({
        currentNum:e.currentTarget.dataset.current,
      })
      this.setData({
        order:"desc",
        sort: "goods_id",
        page:1,
        goodslistDatas:[]
      })
      this.getGoodsList(this.data.catid,this.data.min,this.data.max,this.data.goods_num,this.data.page,this.data.sort,this.data.order,this.data.self,this.data.intro)
    }else if(this.data.currentNum==1){
      if(this.data.rankshowZH==true){
        this.setData({
          rankshowZH:false,
          order:"asc",
          sort: "goods_id",
          page:1,
          goodslistDatas:[]
        })
        this.getGoodsList(this.data.catid,this.data.min,this.data.max,this.data.goods_num,this.data.page,this.data.sort,this.data.order,this.data.self,this.data.intro)
      }else if(this.data.rankshowZH==false){
        this.setData({
          rankshowZH:true,
          order:"desc",
          sort:"goods_id",
          goodslistDatas:[],
          page:1,
        })
        this.getGoodsList(this.data.catid,this.data.min,this.data.max,this.data.goods_num,this.data.page,this.data.sort,this.data.order,this.data.self,this.data.intro)
      }
    }

  },
  changerankXP(e){
    this.setData({
      currentNum:e.currentTarget.dataset.current,
      rankshowZH:true,
      rankshowJG:true,
      order:"desc",
      sort:"last_update",
      goodslistDatas:[],
      page:1,
    })
    this.getGoodsList(this.data.catid,this.data.min,this.data.max,this.data.goods_num,this.data.page,this.data.sort,this.data.order,this.data.self,this.data.intro)
  },
  changerankXL(e){
    this.setData({
      currentNum:e.currentTarget.dataset.current,
      rankshowZH:true,
      rankshowJG:true,
      order:"desc",
      sort:"sales_volume",
      goodslistDatas:[],
      page:1,
    })
    this.getGoodsList(this.data.catid,this.data.min,this.data.max,this.data.goods_num,this.data.page,this.data.sort,this.data.order,this.data.self,this.data.intro)
  },
  changerankJG(e){
    if(this.data.currentNum!=4){
      this.setData({
        currentNum:e.currentTarget.dataset.current
      })
      this.setData({
        sort:"shop_price",
        order:"desc",
        goodslistDatas:[],
        page:1,
      })
      this.getGoodsList(this.data.catid,this.data.min,this.data.max,this.data.goods_num,this.data.page,this.data.sort,this.data.order,this.data.self,this.data.intro)
    }else if(this.data.currentNum==4){
      if(this.data.rankshowJG==true){
        this.setData({
          rankshowJG:false,
          sort:"shop_price",
          order:"asc",
          goodslistDatas:[],
          page:1,
        })
        this.getGoodsList(this.data.catid,this.data.min,this.data.max,this.data.goods_num,this.data.page,this.data.sort,this.data.order,this.data.self,this.data.intro)
      }else if(this.data.rankshowJG==false){
        this.setData({
          rankshowJG:true,
          sort:"shop_price",
          order:"desc",
          goodslistDatas:[],
          page:1,
        })
        this.getGoodsList(this.data.catid,this.data.min,this.data.max,this.data.goods_num,this.data.page,this.data.sort,this.data.order,this.data.self,this.data.intro)
      }
    }
  },

  async getGoodsList(cat_id,min,max,goods_num,page,sort,order,self,intro){
    wx.showLoading({
      title: '加载中',
    })
    let result=await requestApi(app.globalData.base_url+"/catalog/goodslist",{
      cat_id: cat_id, //商品ID
      warehouse_id: 0,
      area_id: 0,
      min: min, //最小价格
      max: max, //最大价格
      goods_num: goods_num,//0,1 有货1
      size: 10, //每次加载10条数据
      page: page, //当前页数
      sort: sort, //
      order: order, //desc，asc排序方式
      self: self, //1,0 自营1
      intro:intro,//"",promote促销
    },"post")
    if(result.statusCode==200){
      wx.hideLoading()
      console.log(result.data.data);
      
      if(result.data.data.length==0){
        this.setData({
          flag:false
        })
      }
      let list=this.data.goodslistDatas.concat(result.data.data)
      let pages=++this.data.page
      this.setData({
        goodslistDatas:list,
        flag:true,
        page:pages
      })
    }
  },
  loadMore(){  //加载更多
    if(this.data.flag){
      this.getGoodsList(this.data.catid,this.data.min,this.data.max,this.data.goods_num,this.data.page,this.data.sort,this.data.order,this.data.self,this.data.intro)
    }
  },
  
  switchChange(e){ //选择自营产品开关
    console.log(e.detail.value)
    if(e.detail.value==true){
      this.setData({
        switchChecked:true,
        self:1
      })
    }else if(e.detail.value==false){
      this.setData({
        switchChecked:false,
        self:0
      })
    }
  },

  youhuoFn(){ //选择有货产品
    if(this.data.chooseyouhuo==false){
      this.setData({
        chooseyouhuo:true,
        goods_num:1
      })
    }else if(this.data.chooseyouhuo==true){
      this.setData({
        chooseyouhuo:false,
        goods_num:0
      })
    }
  },
  cuxiaoFn(){ //选择促销产品
    if(this.data.choosecuxiao==false){
      this.setData({
        choosecuxiao:true,
        intro:"promote"
      })
    }else if(this.data.choosecuxiao==true){
      this.setData({
        choosecuxiao:false,
        intro:""
      })
    }
  },
  priceMin(e){ //获取输入最低价格
    // console.log(e.detail.value);
    this.setData({
      min:e.detail.value
    })
  },
  priceMax(e){ //获取输入最高价格
    // console.log(e.detail.value);
    this.setData({
      max:e.detail.value
    })
  },

  showmaskFn:function(){ //显示蒙版弹窗
    this.animationObj.translateX(225).step()
    setTimeout(() => {
      this.animationObj.translateX(0).step()
      this.setData({
        animationData: this.animationObj.export(), //导出动画
        showmask: true
      })
    }, 0)
    this.setData({
      animationData: this.animationObj.export(), //导出动画
      showmask: true
    })
  },
  closemaskFn(){ //关闭蒙版弹窗
    this.animationObj.translateX(255).step()
    setTimeout(() => {
      this.setData({
        animationData: this.animationObj.export(), //导出动画
      })
    }, 0)
    setTimeout(()=>{
      this.setData({
        showmask:false,
        switchChecked:false,
        self:0,
        goods_num:0,
        intro:"",
        min:"",
        max:""
      })
    },300)
    
  },
  confirmFn(){//点击确认
    this.animationObj.translateX(255).step()
    setTimeout(() => {
      this.setData({
        animationData: this.animationObj.export(), //导出动画
      })
    }, 0)
    setTimeout(()=>{
      this.setData({
        showmask:false,
        goodslistDatas:[],
        page:1
      })
    },300)

    console.log(this.data.catid);
    console.log(this.data.min);
    console.log(this.data.max);
    console.log(this.data.goods_num);
    console.log(this.data.page);
    console.log(this.data.sort);
    console.log(this.data.order);
    console.log(this.data.self);
    console.log(this.data.intro);

    this.getGoodsList(this.data.catid,this.data.min,this.data.max,this.data.goods_num,this.data.page,this.data.sort,this.data.order,this.data.self,this.data.intro)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      catid:options.cat_id,
      barH:app.globalData.navbarHeight
    });
    
    this.getGoodsList(this.data.catid,this.data.min,this.data.max,this.data.goods_num,this.data.page,this.data.sort,this.data.order,this.data.self,this.data.intro)
    

    let query = wx.createSelectorQuery();  
    query.select('.goodslist-header').boundingClientRect(rect=>{ //获取搜索栏高度
      // console.log(rect.height);
      this.setData({
        searchH:rect.height
      })
    }).exec(); 
    query.select('.goodslist-tab').boundingClientRect(rect=>{ //获取商品排序栏高度
      // console.log(rect.height);
      this.setData({
        tabH:rect.height
      })
      // console.log(this.data.navH);
    }).exec(); 
    try {  //获取窗口高度
      const res = wx.getSystemInfoSync()
      // console.log(res.windowHeight)
      this.setData({
        widH:res.windowHeight
      })
      // console.log(this.data.widH);
    } catch (e) {
      // Do something when catch error
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