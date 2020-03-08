// components/NavigationBar/NavigationBar.js
var appInst = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isStudent: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIPhoneX: appInst.isIPX,
    activeIndex: 0,
    teacher: [
      {
        "pagePath": "pages/home/index/index",
        "text": "首页",
        "iconPath": "../../images/index.png",
        "selectedIconPath": "../../images/index_active.png"
      },
      {
        "pagePath": "pages/curricul/index",
        "text": "课表",
        "iconPath": "../../images/curricul.png",
        "selectedIconPath": "./images/curricul_active.png"
      },
      {
        "pagePath": "pages/order/index",
        "text": "订单",
        "iconPath": "../../images/order.png",
        "selectedIconPath": "../../images/order_active.png"
      },
      {
        "pagePath": "pages/my/index",
        "text": "我的",
        "iconPath": "../../images/my.png",
        "selectedIconPath": "../../images/my_active.png"
      }
    ],
    student: [
      {
        "pagePath": "pages/Student/index/index",
        "text": "首页",
        "iconPath": "../../images/Students/home.png",
        "selectedIconPath": "../../images/Students/homeActive.png"
      },
      {
        "pagePath": "pages/Student/TeacherList/TeacherList",
        "text": "教员",
        "iconPath": "../../images/Students/teacher.png",
        "selectedIconPath": "../../images/Students/teacherActive.png"
      },

      {
        "pagePath": "pages/Student/MyCurriculum/MyCurriculum",
        "text": "课程",
        "iconPath": "../../images/Students/curriculum.png",
        "selectedIconPath": "../../images/Students/curriculumActive.png",
        login: true,
      },

      {
        "pagePath": "pages/Student/My/My",
        "text": "我的",
        "iconPath": "../../images/Students/my.png",
        "selectedIconPath": "../../images/Students/myActive.png"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

  attached() {
    const { isStudent, teacher, student } = this.data
    const curPages = getCurrentPages();
    const router = curPages.pop()
    const activeIndex = (isStudent ? student : teacher).findIndex(item => router.route === item.pagePath)

    this.setData({ activeIndex: activeIndex < 0 ? 0 : activeIndex })
  }
})
