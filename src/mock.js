// 引入mockjs
const Mock = require('mockjs')
// 使用mockjs模拟数据
Mock.mock('/api/marker', (req, res) => { // 当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据
  let list = []
  list = [
    {
      class: 'marker',
      name: 'Marker-1',
      width: 30,
      height: 30,
      x: 100,
      y: 300
    },
    {
      class: 'marker',
      name: 'Marker-2',
      width: 30,
      height: 30,
      x: 163,
      y: 233
    },
    {
      class: 'marker',
      name: 'Marker-3',
      width: 30,
      height: 30,
      x: 350,
      y: 168
    }
  ]
  const defaultList = list
  return {
    data: {list, defaultList}
  }
})

Mock.mock('/api/fence', (req, res) => { // 当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据
  let list = []
  list = [
    {
      x: 0,
      y: 0
    },
    {
      x: 300,
      y: 0
    },
    {
      x: 100,
      y: 100
    }
  ]
  return {
    data: list
  }
})
