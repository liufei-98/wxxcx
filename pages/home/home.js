// pages/home/home.js
let app = getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    params:{
      title:"大商创"
    },
    barH:"",
    swipeDatas:[],  //首页轮播图图片数据
    page:1,//请求数据的页数
    indicatorDots:true, //轮播图指示点是否显示
    autoplay: true, //轮播图自动轮播是否开启
    interval: 2000, //轮播图切换间隔时间
    duration: 500, //轮播图滑动动画时长
    current:0,  //轮播图当前所在滑块的 index
    flag:"",
    tabNavDatas:[{  //分类切换导航条数据
      id:1,
      title:"首页"
    },{
      id:2,
      title:"家用电器"
    },{
      id:3,
      title:"男装女装"
    },{
      id:4,
      title:"靴鞋箱包"
    },{
      id:5,
      title:"手机数码"
    },{
      id:6,
      title:"电脑办公"
    },{
      id:7,
      title:"家居家纺"
    },{
      id:8,
      title:"个人化妆"
    }],
    currentIndex:0,
    oLeft:0,
    widH:0, //页面可用高度
    searchH:0, //搜索栏高度
    navH:0, //导航切换高度
    //conH:'widH'-'searchH'-'navH', //内容高度
    ocolor:"#f34646", //轮播背景颜色
    goodsLists:[], //推荐商品数据
    // 家用电器
    EleheaderLists:[],
    ElebrandLists:[],
    // 男装女装
    PsheaderLists:[],
    PsbrandLists:[],
    // 靴鞋箱包
    BoxheaderLists:[],
    BoxbrandLists:[],
    // 手机数码
    PhheaderLists:[],
    PhbrandLists:[],
    // 电脑办公
    CpheaderLists:[],
    CpbrandLists:[],
    // 家居家纺
    HsheaderLists:[],
    HsbrandLists:[],
    // 个人化妆
    FcheaderLists:[],
    FcbrandLists:[],
    // 首页品牌展示区
    memberLists1:[],
    memberLists2:[],
    memberLists3:[],
    //倒计时
    hr: 0,
    min: 0,
    sec: 0,
    end:Date.parse(new Date("2020-10-29 00:00:00")),
    seckillDatas:[{
      id:1,
      time:"00:00",
      statenow:"抢购中",
      statewait:"即将开始",
      isshow:1
    },{
      id:2,
      time:"6:00",
      statenow:"抢购中",
      statewait:"即将开始",
      isshow:2
    },{
      id:3,
      time:"12:00",
      statenow:"抢购中",
      statewait:"即将开始",
      isshow:3
    },{
      id:4,
      time:"18:00",
      statenow:"抢购中",
      statewait:"即将开始",
      isshow:4
    }],
    show:1,
    currentNum:0,
    seckillgoodsLists1:[],
    seckillgoodsLists2:[],
    seckillgoodsLists3:[],
    seckillgoodsLists4:[],
  },
 

  toSearch(){  //去搜索页
    wx.switchTab({
      url: '../search/search'
    })
  },

  changeTab(e){  //滑动是切换tab-nav
    // console.log(e.detail.current);
    if(e.detail.current>=2 && e.detail.current<7){
    this.setData({
      oLeft:(e.detail.current-2)*75
    })
    }
    this.setData({
      currentIndex:e.detail.current
    })
    console.log(this.data.currentIndex);
    if (this.data.currentIndex!=0) {
      this.setData({
        autoplay:false,
        ocolor:"#f34646",
        current:0
      })
    }
  },

  changeSwiper(e){  //分类切换导航条
    //console.log(e.currentTarget);
    this.setData({
      currentIndex:e.currentTarget.dataset.current
    })
  },
  changelist(e){  //切换秒杀页
    this.setData({
      currentNum:e.detail.current
    })
  },
  scrollPage(e){ //页面向下滚动
    // console.log(e.detail.scrollTop);
    if(e.detail.scrollTop<120){
      this.setData({
        autoplay:true
      })
    }else if(e.detail.scrollTop>=120){
        this.setData({
          autoplay:false,
          ocolor:"#f34646",
          current:0
      })
     }
  },
  

  swiperChange:function(e){ //轮播图自动切换
    this.setData({
      current:e.detail.current
    })
    let _this=this
    let _index=_this.data.current
    // console.log(_index);
    this.setData({
      flag:_index
    })
    if(e.detail.current==0){
      this.setData({
        ocolor:"#f34646"
      })
    }else if(e.detail.current==1){
      this.setData({
        ocolor:"#e43124"
      })
    }else if(e.detail.current==2){
      this.setData({
        ocolor:"#3c81ff"
      })
    }else if(e.detail.current==3){
      this.setData({
        ocolor:"#028379"
      })
    }else if(e.detail.current==4){
      this.setData({
        ocolor:"#4091ff"
      })
    }
  },

  getListDataFn(){  //获取推荐商品的数据
    wx.showLoading({
      title: '加载中',
    })
    //?page=1&size=10&type=is_best
    wx.request({
      url: 'https://x.dscmall.cn/api/goods/type_list',
      data:{
        page:this.data.page,
        size:10,
        type:"is_best"
      },
      success:(res)=>{
        // console.log(res);
        if(res.statusCode==200){
          wx.hideLoading()
          if(res.data.data.length==0){
            this.setData({
              flag:false
            })
          }
          let list=this.data.goodsLists.concat(res.data.data)
          let page=++this.data.page
          this.setData({
            goodsLists:list,
            flag:true,
            page:page
          })
        }
      }
    })
  },

  loadMore(){  //加载更多
    if(this.data.flag){
      this.getListDataFn()
    }
  },
 

  countdown() {  //设定倒计时
    var now = Date.parse(new Date());
    var msec = this.data.end - now;
       
    let hr = parseInt((msec / 1000 / 60 / 60) % 24);
    let min = parseInt((msec / 1000 / 60) % 60);
    let sec = parseInt((msec / 1000) % 60);
    this.hr = hr > 9 ? hr : "0" + hr;
    this.min = min > 9 ? min : "0" + min;
    this.sec = sec > 9 ? sec : "0" + sec;
    const that = this;
    setTimeout(function () {
      that.countdown();
    }, 1000);
    this.setData({
      hr:this.hr,
      min:this.min,
      sec:this.sec,
    })
  },
  
  tabTimeFn(){  //重置倒计时时间
    var now = Date.parse(new Date());
    var msec = this.data.end - now;
     if(msec<=0){
        this.setData({
          end:this.data.end+21600000
        })
      }
      const that = this;
      setTimeout(function(){
       that.tabTimeFn();
      },100)
  },

  changeTime(e){ //切换秒杀页
    // console.log(e.currentTarget);
    this.setData({
      currentNum:e.currentTarget.dataset.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        barH:app.globalData.navbarHeight
      })
    var _this=this;

    wx.request({ //请求首页轮播图数据
      url: 'http://192.168.0.175:3000/api/v1/index/swipe',
      success:function(res){
        // console.log(res.data.data);
        _this.setData({swipeDatas:res.data.data});
      },
    })

    let query = wx.createSelectorQuery();  
    query.select('.search-wipe').boundingClientRect(rect=>{ //获取搜索栏高度
      // console.log(rect.height);
      this.setData({
        searchH:rect.height
      })
    }).exec(); 

    query.select('.tab-nav-wrap').boundingClientRect(rect=>{ //获取分类导航切换栏高度
      // console.log(rect.height);
      this.setData({
        navH:rect.height
      })
      // console.log(this.data.navH);
    }).exec(); 

    try {  //获取窗口高度
      const res = wx.getSystemInfoSync()
      // console.log(this.data.conH)
      this.setData({
        widH:res.windowHeight
      })
      // console.log(this.data.widH);
    } catch (e) {
      // Do something when catch error
    }

    this.getListDataFn() //获取推荐商品第一页数据
    
    // 家用电器数据 Ele
    wx.request({
      url: 'https://x.dscmall.cn/api/visual/visual_second_category?cat_id=858',
      success:function(res){
        _this.setData({EleheaderLists:res.data.data.category})
        _this.setData({ElebrandLists:res.data.data.brand})
      }
    })
    // 男装女装数据 Ps
    wx.request({
      url: 'https://x.dscmall.cn/api/visual/visual_second_category?cat_id=6',
      success:function(res){
        _this.setData({PsheaderLists:res.data.data.category})
        _this.setData({PsbrandLists:res.data.data.brand})
      }
    })
    // 靴鞋箱包数据 Box
    wx.request({
      url: 'https://x.dscmall.cn/api/visual/visual_second_category?cat_id=8',
      success:function(res){
        _this.setData({BoxheaderLists:res.data.data.category})
        _this.setData({BoxbrandLists:res.data.data.brand})
      }
    })
    // 手机数码数据 Ph
    wx.request({
      url: 'https://x.dscmall.cn/api/visual/visual_second_category?cat_id=3',
      success:function(res){
        _this.setData({PhheaderLists:res.data.data.category})
        _this.setData({PhbrandLists:res.data.data.brand})
      }
    })
    // 电脑办公数据 Cp
    wx.request({
      url: 'https://x.dscmall.cn/api/visual/visual_second_category?cat_id=4',
      success:function(res){
        _this.setData({CpheaderLists:res.data.data.category})
        _this.setData({CpbrandLists:res.data.data.brand})
      }
    })
    // 家居家纺数据 Hs
    wx.request({
      url: 'https://x.dscmall.cn/api/visual/visual_second_category?cat_id=5',
      success:function(res){
        _this.setData({HsheaderLists:res.data.data.category})
        _this.setData({HsbrandLists:res.data.data.brand})
      }
    }) 
    // 个人化妆数据 Fc
    wx.request({
      url: 'https://x.dscmall.cn/api/visual/visual_second_category?cat_id=860',
      success:function(res){
        _this.setData({FcheaderLists:res.data.data.category})
        _this.setData({FcbrandLists:res.data.data.brand})
      }
    })

    //品牌专区轮播数据
    wx.request({ //第一版
      url: 'http://192.168.0.175:3000/api/v1/index/swipe1',
      success:function(res){
        // console.log(res);
        _this.setData({memberLists1:res.data.data})
      }
    })
    wx.request({ //第二版
      url: 'http://192.168.0.175:3000/api/v1/index/swipe2',
      success:function(res){
        // console.log(res);
        _this.setData({memberLists2:res.data.data})
      }
    })
  wx.request({ //第三版
    url: 'http://192.168.0.175:3000/api/v1/index/swipe3',
    success:function(res){
      // console.log(res);
      _this.setData({memberLists3:res.data.data})
    }
  })

  var nowHr=new Date().getHours() //获取当前小时
  // console.log(nowHr);
  if(nowHr<6){
    this.setData({
      currentNum:0,
      show:1
    })
  }else if(nowHr>=6&&nowHr<12){
    this.setData({
      currentNum:1,
      show:2
    })
  }else if(nowHr>=12&&nowHr<18){
    this.setData({
      currentNum:2,
      show:3
    })
  }else if(nowHr>=18){
    this.setData({
      currentNum:3,
      show:4
    })
  }
  
  //获取秒杀商品数据
  wx.request({ //0-6点场
    url: 'https://x.dscmall.cn/api/visual/visual_seckill?id=15&tomorrow=1',
    success:function(res){
      _this.setData({seckillgoodsLists1:res.data.data.seckill_list})
    }
  })
  wx.request({ //6-12点场
    url: 'https://x.dscmall.cn/api/visual/visual_seckill?id=16&tomorrow=1',
    success:function(res){
      _this.setData({seckillgoodsLists2:res.data.data.seckill_list})
    }
  })
  wx.request({ //12-18点场
    url: 'https://x.dscmall.cn/api/visual/visual_seckill?id=27&tomorrow=0',
    success:function(res){
      _this.setData({seckillgoodsLists3:res.data.data.seckill_list})
    }
  })
  wx.request({  //18-24点场
    url: 'https://x.dscmall.cn/api/visual/visual_seckill?id=28&tomorrow=0',
    success:function(res){
      _this.setData({seckillgoodsLists4:res.data.data.seckill_list})
    }
  })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.countdown();  //初始化秒杀倒计时
    this.tabTimeFn();  //秒杀倒计时结束时重置秒杀时间
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
