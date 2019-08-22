<template>
  <div class='container-wraper'>
    <div id='scale-contianer'>
      <v-stage ref='stage' :config='stageSize' @wheel='handleWheel' @dragstart='handleDrag'>
        <v-layer ref='layer' draggable='true'>
          <!-- 地图 -->
          <v-image :config='{
            image: image,
            ...imageConfig,
          }' />
          <!-- 围栏 -->
          <v-line 
            :config="{
              x: this.fenceX,
              y: this.fenceY,
              points: this.fencePoints,
              tension: 0,
              closed: true,
              stroke: 'black'
            }"
          />
          <!-- marker标记 -->
          <v-image
            v-for='(item, i) in imgMarkerConfig'
            v-bind:key='item.id'
            @click='mouseClick(item)'
            @mousemove='mouseoverMarker'
            @mouseleave='mouseoutMarker'
            :config='{
                image: imgMarker,
                scaleX: imageConfig.scaleX,
                scaleY: imageConfig.scaleY,
                ...imgMarkerConfig[i],
            }'
          />
        </v-layer>
      </v-stage>
      <!-- 提示气泡窗口 -->
      <div class='tipsWindow' slot='tipsWindow'>
        <div class='close'>
          <span @click='closeTips'>×</span>
        </div>
        <div class='content'>
          <el-tooltip class='item' effect='dark' content='123' placement='right'>
            <div class='msg'>{{ msg }}</div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Mapimg from '../assets/map.jpg';
import Marker from '../assets/marker.jpg';

export default {
  data () {
    return {
      msg: '',
      stageSize: {
        width: 0,
        height: 0
      },
      image: null,
      imgMarker: null,
      imageConfig: {
        id: 'myImg',
        scaleX: 0.8,
        scaleY: 0.8,
        x: 0,
        y: 0
      },
      markerList: [
        {
          class: 'marker',
          width: 30,
          height: 30,
          x: 100,
          y: 300
        },
        {
          class: 'marker',
          width: 30,
          height: 30,
          x: 163,
          y: 233
        },
        {
          class: 'marker',
          width: 30,
          height: 30,
          x: 350,
          y: 168
        }
      ],
      imgMarkerConfig: [
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
      ],
      fencePoints: [],
      fenceX: 0,
      fenceY: 0,
      isTips: true
    }
  },
  computed: {
    // 根据地图初始化缩放的比例，初始化marker坐标位置
    initMarkerCoordinate: function() {
      // 缩放坐标位置
      for (let i = 0; i < this.imgMarkerConfig.length; i++) {
        this.imgMarkerConfig[i].scaleX = 0.8
        this.imgMarkerConfig[i].scaleY = 0.8
        this.imgMarkerConfig[i].x = (this.imgMarkerConfig[i].x * 0.8) + this.imageConfig.x
        this.imgMarkerConfig[i].y = (this.imgMarkerConfig[i].y * 0.8) + this.imageConfig.y
      }
      // 围栏
      this.fenceCoordinate();
    }
  },
  created() {
    // marker标记点
    const imgMarker = new window.Image()
    imgMarker.src = Marker;

    // 地图背景
    const image = new window.Image()
    image.src = Mapimg;
    
    //载入地图和标记点
    this.loadMap(image)
    this.loadMarker(imgMarker)
  },
  methods: {
    // 载入地图
    loadMap: function(image) {
      image.onload = () => {
        this.image = image
        const { scaleX, scaleY } = this.imageConfig

        const scaleContainer = document.getElementById('scale-contianer')
        const containerWidth = scaleContainer.clientWidth
        const containerHeight = scaleContainer.clientHeight
        this.stageSize = {
          width: containerWidth,
          height: containerHeight
        }

        // 设置图片位于中心点
        const x = (containerWidth - image.width * scaleX) / 2
        const y = (containerHeight - image.height * scaleY) / 2
        this.imageConfig.x = x < 0 ? 0 : x
        this.imageConfig.y = y < 0 ? 0 : y

        // 调用computed中定义的initMarkerCoordinate对marker位置进行初始化
        this.initMarkerCoordinate
      }
    },
    // 载入标记点
    loadMarker: function(imgMarker) {
      imgMarker.onload = () => {
        this.imgMarker = imgMarker
      }
    },
    handleWheel: function(e) {
      // 缩放时先关闭显示的气泡
      this.closeTips()
      // 地图缩放
      const shape = e.target
      // if (shape.attrs.id !== 'myImg') {
      //   // 只允许在图片上点击滚轮缩放
      //   return
      // }
      let scale = this.imageConfig.scaleX
      if (e.evt.deltaY > 0 && scale > 0.25) { // 缩小
        scale = scale - 0.05
      } else if (e.evt.deltaY < 0 && scale < 1.5) { // 放大
        scale = scale + 0.05
      }
      this.imageConfig.scaleX = scale
      this.imageConfig.scaleY = scale

      // 根据缩放控制marker位置
      this.zoomCoordinate(this.markerList, scale)
      // 根据缩放控制围栏位置
      this.fenceCoordinate();
    },
    // 拖拽画布
    handleDrag: function(e) {
      this.closeTips()
    },
    // 缩放比例
    zoomCoordinate: function(markerList, scale) {
      // 根据缩放控制marker位置
      for (let i = 0; i < markerList.length; i++) {
        this.imgMarkerConfig[i].scaleX = scale
        this.imgMarkerConfig[i].scaleY = scale
        this.imgMarkerConfig[i].x = (markerList[i].x * scale) + this.imageConfig.x
        this.imgMarkerConfig[i].y = (markerList[i].y * scale) + this.imageConfig.y
      }
    },
    // 控制围栏位置
    fenceCoordinate: function() {
      const defaultPoints = [
        {
          x:0,
          y:0
        },
        {
          x:300,
          y:0
        },
        {
          x:100,
          y:100
        }
      ];
      this.fenceX = (300 * this.imageConfig.scaleX) + this.imageConfig.x;
      this.fenceY = (230 * this.imageConfig.scaleY) + this.imageConfig.y;
      this.fencePoints = [];
      for (let i = 0; i < defaultPoints.length; i++) {
        this.fencePoints.push(defaultPoints[i].x * this.imageConfig.scaleX);
        this.fencePoints.push(defaultPoints[i].y * this.imageConfig.scaleY);
      }
    },
    // 鼠标经过marker标记
    mouseoverMarker: function(e) {
      if (this.isTips) {
        document.getElementsByClassName('tipsWindow')[0].style.display = 'block'
        document.getElementsByClassName('tipsWindow')[0].style.left =
          e.evt.x + 25 + 'px'
        document.getElementsByClassName('tipsWindow')[0].style.top =
          e.evt.y - 15 + 'px'
        // 给气泡填充显示信息
        this.msg = e.target.attrs.name
      }
    },
    // 鼠标离开marker
    mouseoutMarker: function(e) {
      if (this.isTips) {
        document.getElementsByClassName('tipsWindow')[0].style.display = 'none'
      }
    },
    // 点击marker标记，固定气泡其实窗
    mouseClick: function(e){
      this.isTips = false
      console.log(e)
    },
    // 关闭气泡
    closeTips: function(e){
      this.isTips = true
      document.getElementsByClassName('tipsWindow')[0].style.display = 'none'
    }
  }
}
</script>

<style lang='less' scoped>
// @import '../style/mixin'
.container-wraper {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
#scale-contianer {
  height: 100%;
  width: 100%;
  background: #ccc;
  overflow: hidden;
  box-sizing: border-box;
}
.tipsWindow {
  width: 150px;
  height: 200px;
  border: 1px solid rgba(0, 0, 0, 1);
  border-radius: 4px;
  box-shadow: 3px 3px 3px #3d3d3d;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  position: absolute;
  top: 0px;
  left: 0px;
  display: none;
  .content {
    width: 100%;
    height: calc(~'(100% - 20px)');
    overflow-y: auto;
    text-align: center;
  }
  .close {
    width: 100%;
    height: 20px;
    line-height: 20px;
    color: #3d3d3d;
    text-align: right;
  }
  .close span{
    color: red;
    display: block;
    padding-right: 5px;
    cursor: pointer;
  }
}
.tipsWindow::before {
  content: '';
  width: 0;
  height: 0;
  border: 10px solid;
  position: absolute;
  bottom: 170px;
  left: -20px;
  border-left-color: transparent;
  border-right-color: rgba(0, 0, 0, 0.8);
  border-top-color: transparent;
  border-bottom-color: transparent;
}
</style>
