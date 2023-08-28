<template>
  <div>
    <div id="container">
    </div>

    <canvas id="canvas-a" width="400px" height="400pxs"></canvas>
    <canvas id="canvas-b" width="400px" height="400px"></canvas>
    <canvas id="canvas-c" width="400px" height="400px"></canvas>
  </div>
</template>

<script>

let changenum = 0;
let curCanvas = 'a';
let map = null
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      stationList: [
        {
          id: "CSS",
          name: "测试站",
          url: "data/dish.glb",
          height: 0,
          lon: 113.94,
          lat: 32.45,
          min: 50,
          max: 150
        },
      ],
      satelliteList: [
        {
          satelliteCode: "bd",
          name: "bd",
          ru: 1000,
        }
      ],
      radar: [
        {
          satelliteCode: "bd4",
          target: 'bdG1',
          name: "target",
        }],
      task: [
        {
          endTime: "2021-11-25 19:12:00",
          satelliteCode: "bd",
          startTime: "2021-11-24 19:12:00",
          stationCode: "bd4",
          type: "SC"
        },
        // {
        //   endTime: "2021-11-24 11:12:00",
        //   satelliteCode: "text-1",
        //   startTime: "2021-11-25 11:12:00",
        //   stationCode: "text-3",
        //   type: "SC"
        // },
        // {
        //   endTime: "2021-11-24 11:12:00",
        //   satelliteCode: "text-1",
        //   startTime: "2021-11-25 11:12:00",
        //   stationCode: "CSS",
        //   type: "SC"
        // }
      ]
    }
  },
  methods: {
    init() {
      const viewer = new Cesium.Viewer("container", {
        geocoder: false,
        baseLayerPicker: true,
        animation: true,
        navigationHelpButton: false,
        infoBox: false,
        fullscreenButton: false,
        // sceneMode: Cesium.SceneMode.SCENE2D,
        // 连接地图服
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
          // url: window.mapUrl + ":9109/map/?z={z}&x={x}&y={y}",
          url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          maximumLevel: 15,
          show: false
        })
      });
      console.log("Cesium原生Cesium构造完成", viewer) // 打印测试信息

      // mars3d.Map也可以直接传入外部已经构造好的viewer, 支持config.json所有参数
      map = new mars3d.Map(viewer, {
        scene: {
          center: {lat: 30.054604, lng: 108.885436, alt: 17036414, heading: 0, pitch: -90},
          fxaa: true
        },
        control: {
          contextmenu: {hasDefault: true} // 右键菜单
        }
      })
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 0;
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 2500000000;


      this.utils.changeToUTC8(viewer);

      this.utils.polylineMaterial();
      window.viewer = viewer

      const self = this
      viewer.dataSources.add(
          Cesium.CzmlDataSource.load("./data/geo.czml")
      ).then(source => {
        self.addload();

      });

      this.addStation(this.stationList);
    },
    addStation(stationList) {
      if (stationList.length > 0) {
        stationList.forEach(item => {
          this.utils.createModel(
              window.viewer,
              item.id,
              item.name,
              item.url,
              item.height,
              item.lon,
              item.lat,
              item.min,
              item.max,
              false,
              900000,
              true
          );
        });
      }
    },

    addload() {
      let self = this
      // debugger
      this.satelliteList.forEach(item => {
        // return
        let entity = this.utils.getObjById(item.satelliteCode, window.viewer);
        if (entity) {
          this.utils.drawCone(window.viewer, entity, '11', true);
        }
      });
      this.radar.forEach(item => {
        let sentity = this.utils.getObjById(item.satelliteCode, window.viewer);
        let eentity = this.utils.getObjById(item.target, window.viewer);
        let scStart = Cesium.JulianDate.fromDate(
            new Date("2021-11-24 00:00:00")
        );
        let scEnd = Cesium.JulianDate.fromDate(
            new Date("2022-11-26 00:00:00")
        );
        if (sentity && eentity) {
          let graphicLayer = new mars3d.layer.GraphicLayer()
          map.addLayer(graphicLayer)

          let coneTrack = this.utils.addRadarInteraction(window.viewer,
              "zjline",
              sentity,
              eentity,
              true,
              null,
              [
                {
                  start: scStart,
                  stop: scEnd
                }
              ]);
          graphicLayer.addGraphic(coneTrack)
          return
          let m = new Cesium.ImageMaterialProperty({
            image: new Cesium.CallbackProperty(this.drawCanvasImage, false),
            transparent: true
          })
          this.utils.addRadarInteraction(window.viewer,
              "zjline",
              sentity,
              eentity,
              true,
              null,
              [
                {
                  start: scStart,
                  stop: scEnd
                }
              ],
              m);
        }
      });

      this.timerRun();
    },
    readyCanvas(convasid, radius) {
      let canvas = document.getElementById(convasid);
      let cwidth = 400;
      let cheight = 400;
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, cwidth, cheight);
      ctx.fillStyle = 'rgba(255, 255, 255, 0)';
      ctx.fillRect(0, 0, cwidth, cheight);

      for (let ii = 0; radius <= 200; ii++) {
        ctx.lineWidth = 5;
        //开始一个新的绘制路径
        ctx.beginPath();
        //设置弧线的颜色
        let trans = 1.0 - (radius / 255);
        ctx.strokeStyle = "rgba(255, 0, 255, " + trans + ")";
        let circle = {
          x: 200, //圆心的x轴坐标值
          y: 200, //圆心的y轴坐标值
          r: radius //圆的半径
        };
        //以canvas中的坐标点(200,200)为圆心，绘制一个半径为50px的圆形
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, true);
        //按照指定的路径绘制弧线
        ctx.stroke();
        radius += 20;
      }
    },
    drawCanvasImage(time, result) {
      changenum++;
      let canvas = document.getElementById("canvas-" + curCanvas);
      if (changenum >= 20) {
        changenum = 0;
        if (curCanvas === 'a')
          curCanvas = 'b';
        else if (curCanvas === 'b')
          curCanvas = 'c';
        else
          curCanvas = 'a';
      }
      return canvas;
    },
    timerRun(){
      // debugger
      this.task.forEach(item => {
        let scTimes = [];
        if (item.type == "SC") {
          let scStart = Cesium.JulianDate.fromDate(
              new Date(item.startTime)
          );
          let scEnd = Cesium.JulianDate.fromDate(new Date(item.endTime));
          let sId = item.stationCode;
          scTimes.push({
            start: scStart,
            stop: scEnd
          });
          let stationEntity = this.utils.getObjById(sId, window.viewer);
          let wxId = item.satelliteCode;
          let wxEntity = this.utils.getObjById(wxId, window.viewer);
          // debugger
          if (stationEntity) {
            this.utils.lineEntity(
                window.viewer,
                wxId + "" + sId,
                wxEntity,
                stationEntity,
                true,
                null,
                // "red", //可传参为red 和 blue
                scTimes
            );
          }
        }
      });
    }


  },
  mounted() {
    this.init()

    this.readyCanvas("canvas-a", 5);
    this.readyCanvas("canvas-b", 10);
    this.readyCanvas("canvas-c", 15);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#container {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
