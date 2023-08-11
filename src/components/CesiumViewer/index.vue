<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="location" @click="changeTrack">
      <p>
        经度
        <span id="location_lon">--</span> ° &nbsp;
      </p>
      <p>
        纬度
        <span id="location_lat">--</span> ° &nbsp;
      </p>
      <p>
        视高
        <span id="location_alt">--</span> km
      </p>
    </div>
  </div>
</template>
<script>
import gdData from "./gd";

export default {
  mounted() {
    this.init();
  },
  data() {
    return {
      gdData: gdData.gdData,
      stationList: [
        {
          id: "CSS",
          name: "测试站",
          url: "models/dish.glb",
          height: 0,
          // lon: -130.01,
          // lat: 35.05,
          lon: 113.94,
          lat: 32.45,
          // lon: -133.756547,
          // lat: 53.4,
          // lon: -117.5,
          // lat: 46.48,
          min: 50,
          max: 150
        },
      ],
      dic: [
      ],
      satelliteList: [
        // {
        //   satelliteCode: "text-1",
        //   name: "text-1",
        //   ru: 100,
        // },

        {
          satelliteCode: "text-1",
          name: "text-1",
          ru: 1000,
        },
        {
          satelliteCode: "text-2",
          name: "text-2",
          ru: 1000,
        },{
          satelliteCode: "text-3",
          name: "text-3",
          ru: 1000,
        }
      ],
      task: [
        // {
        //   endTime: "2022-04-09 15:09:00.375",
        //   satelliteCode: "text-1",
        //   startTime: "2022-04-09 15:04:50.547",
        //   stationCode: "QD",
        //   type: "SC"
        // },
        // {
        //   endTime: "2022-04-09 15:03:00.375",
        //   satelliteCode: "text-1",
        //   startTime: "2022-04-09 14:57:43.547",
        //   stationCode: "SY",
        //   type: "SC"
        // },

        {
          endTime: "2022-04-11 00:00:00",
          satelliteCode: "text-1",
          startTime: "2022-04-09 00:00:00",
          stationCode: "text-2",
          type: "SC"
        },
        {
          endTime: "2022-04-11 00:00:00",
          satelliteCode: "text-3",
          startTime: "2022-04-09 00:00:00",
          stationCode: "text-1",
          type: "SC"
        },
        {
          endTime: "2022-04-11 00:00:00",
          satelliteCode: "text-2",
          startTime: "2022-04-09 00:00:00",
          stationCode: "CSS",
          type: "SC"
        }
      ]

    };
  },
  methods: {
    changeTrack() {

      this.utils.startRun(window.viewer, false)
      return
      let wx = this.utils.getObjById("text-1", window.viewer);
      let cwx = this.utils.getObjById("test", window.viewer);
      if (wx) {
        let currentTime = viewer.clock.currentTime;
        let tempTime = new Cesium.JulianDate()
        currentTime.clone(tempTime)
        Cesium.JulianDate.addSeconds(tempTime, 100, tempTime);
        let position = this.utils.getEntityPos(wx, currentTime);
        let cposition = this.utils.getEntityPos(cwx, tempTime);
        let property = new Cesium.SampledPositionProperty();
        property.addSample(currentTime, Cesium.Cartesian3.fromDegrees(position.lon, position.lat, position.alt));
        property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(cposition.lon, cposition.lat, cposition.alt));

        let entitydd = viewer.entities.add({
          availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
            start: currentTime,
            stop: tempTime
          })]),
          position: property, // 点集
          model: {
            uri: "models/wx.gltf",
            scale: 1,
            minimumPixelSize: 90
          },
        })
      }

    },
    init() {
      window.viewer = new Cesium.Viewer("cesiumContainer", {
        geocoder: false,
        // baseLayerPicker: false,
        baseLayerPicker: true,
        animation: true,
        navigationHelpButton: false,
        infoBox: false,
        fullscreenButton: false,
        // sceneMode: Cesium.SceneMode.SCENE2D,
        // 连接地图服务
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
          // url: window.mapUrl + ":9109/map/?z={z}&x={x}&y={y}",
          url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          maximumLevel: 7,
          show: false
        })
      });
      // this.utils.transformTime(this, window.viewer); //时间转换
      this.utils.setView(window.viewer);
      this.utils.changeToUTC8(window.viewer);
      //   替换星空盒
      this.utils.skyBoxs(window.viewer);
      this.utils.polylineMaterial();

      const viewer = window.viewer
      // this.utils.startRun(viewer)

      //是否开启抗锯齿
      window.viewer.scene.fxaa = true;
      window.viewer.scene.debugShowFramesPerSecond = true;
      window.viewer.scene.postProcessStages.fxaa.enabled = true;
      let me = this;
      this.$nextTick(() => {
        setTimeout(() => {
          me.draw();
        });
      });
    },

    draw() {
      // 绘制轨道
      let self = this;
      console.log(new Date())
      let gdDatas = [...this.gdData];
      for (let i = 1; i <=2; i++) {
        let ephs = [...this.gdData[0].ephList];
        const {...tempItem} = this.gdData[0];
        ephs.forEach((eph, ephi) => {
          if ((ephi + 1) % 4 === 0){
            ephs[ephi] = eph - 2000000 * i;
          } else {
            if ((ephi + 1) % 2 === 0){
              ephs[ephi] = eph - 4 * i;
            }
          }
        })
        tempItem.ephList = ephs;
        tempItem.satelliteCode = tempItem.satelliteCode.replace('1', String(i + 1));
        gdDatas.push(tempItem);
      }
      this.initCal(gdDatas).then((source) => {
        console.log("source:", source);
        setTimeout(() => {
          self.addload();
        }, 1000)
      });


      // this.initCal().then((source) => {
      //   source.entities.values.forEach(item => {
      //     if (item.model) {
      //       // viewer.entities.add(item)
      //     }
      //   })
      //   console.log(new Date())
      //   // 添加站
      //   this.addStation(this.stationList);
      //   //添加条带
      //   this.addStrips();
      //   let timer = setInterval(() => {
      //     self.addload();
      //     clearInterval(timer);
      //   }, 1000);
      //   // this.addload();
      // })

      // this.addload();
      this.addStation(this.stationList);


    },
    // 添加轨道
    initCal(gd) {
      let timeLength = this.times.getCurrentDay();
      let startTime =
          timeLength[0].split(" ")[0] + "T" + timeLength[0].split(" ")[1] + "Z";
      let endTime =
          timeLength[1].split(" ")[0] + "T" + timeLength[1].split(" ")[1] + "Z";
      startTime = "2022-04-09T00:00:00Z";
      endTime = "2022-04-09T23:00:00Z";
      let modelUrl = "models/wx.gltf";
      return this.utils.czmlgo(
          // this.gdData,
          gd,
          startTime,
          endTime,
          window.viewer,
          modelUrl,
          false,
          true
      );
    },
    // 添加测站
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
    addStrips() {
      let scStart = Cesium.JulianDate.fromDate(
          new Date("2022-04-09 15:05:41.375")
      );
      let scEnd = Cesium.JulianDate.fromDate(
          new Date("2022-04-09 15:05:51.375")
      );
      let TimeInterval = new Cesium.TimeIntervalCollection();
      TimeInterval.addInterval(
          new Cesium.TimeInterval({
            start: scStart,
            stop: scEnd
          })
      );
    },
    // 添加载荷
    addload() {
      // debugger
      this.satelliteList.forEach(item => {
        let entity = this.utils.getObjById(item.satelliteCode, window.viewer);
        if (entity) {
          this.utils.moveEntity(window.viewer, 1, entity, item);
          if (item.satelliteCode.indexOf("8A")) {
            // this.utils.drawShadow(viewer, entity, "xxx", true,0)
            // this.utils.drawCone(viewer, entity, "xxx", true)
            // this.utils.getPosStrs(viewer, entity)
            this.utils.moveEntity(window.viewer, 1, entity, item);
            // this.utils.moveRectangleEntity(viewer, item.satelliteCode, 4500, 4500, entity, 26, 9, [])
          }
        }
      });
      this.timerRun();
    },
    // 任务执行监听
    timerRun() {
      // let satelliteCode = "text-1";
      // let wxEntity = this.utils.getObjById(satelliteCode, window.viewer);
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

      return

      let stationEntity = this.utils.getObjById("ZJ", window.viewer);

      let scStart = Cesium.JulianDate.fromDate(
          new Date("2022-04-09 14:49:27.547")
      );
      let scEnd = Cesium.JulianDate.fromDate(
          new Date("2022-04-09 14:54:11.547")
      );

      if (stationEntity) {
        this.utils.lineEntity(
            window.viewer,
            "zjline",
            wxEntity,
            stationEntity,
            true,
            null,
            [
              {
                start: scStart,
                stop: scEnd
              }
            ]
        );
      }

      let td1Entity = window.viewer.entities.getById("A1");
      let timeLineTest = [
        {
          type: 0,
          start: Cesium.JulianDate.fromDate(
              new Date("2022-04-09 15:03:39")
          ),
          stop: Cesium.JulianDate.fromDate(new Date("2022-04-09 15:04:39"))
        },
        {
          type: 1,
          start: Cesium.JulianDate.fromDate(
              new Date("2022-04-09 15:04:39")
          ),
          stop: Cesium.JulianDate.fromDate(new Date("2022-04-09 15:06:14"))
        },
        {
          type: 0,
          start: Cesium.JulianDate.fromDate(
              new Date("2022-04-09 15:6:14")
          ),
          stop: Cesium.JulianDate.fromDate(new Date("2022-04-09 15:7:14"))
        }
      ];
      if (td1Entity) {
        this.utils.lineEntity(
            window.viewer,
            "td1line0",
            wxEntity,
            td1Entity,
            true,
            null,
            timeLineTest,
            null
            // lineItem.colorType
        );
      }

    }
  }
};
</script>

<style scoped>
#cesiumContainer {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

.location {
  position: absolute;
  bottom: 3px;
  right: 10px;
  background: linear-gradient(180deg, #003a46 0%, #000000 100%) !important;
  border-radius: 4px;
  /* border: 1px solid rgba(0, 174, 255, 1); */
  color: #fff;
  font-size: 12px;
  padding: 0 10px;
}

.location > p {
  display: inline-block;
  height: 25px;
  line-height: 25px;
  margin: 0;
}
</style>
