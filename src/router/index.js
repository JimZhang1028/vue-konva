import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import VueKonva from 'vue-konva'
import ElementUI from 'element-ui'

Vue.use(Router)
Vue.use(VueKonva)
Vue.use(ElementUI)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: Index
    }
  ]
})
