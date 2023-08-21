<template>
  <div id="container">
  </div>
</template>

<script>
// import * as Cesium from "cesium"
// import 'cesium/Source/Widgets/widgets.css'
// import "cesium/widgets.css"
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
        },

        {
          satelliteCode: "bd4",
          name: "bd4",
          ru: 1000,
        },
        {
          satelliteCode: "bdG1",
          name: "bdG1",
          ru: 1000,
        },
      ],
    }
  },
  methods: {
    init() {
      // const viewer = new Cesium.Viewer("container", {
      //   // baseLayerPicker: false,
      //   baseLayerPicker: false,
      //   animation: true,
      //   timeline:true,
      //   infoBox: false,
      // });

      const earth = new XE.Earth('container', {
        baseLayerPicker: true,
        animation: true,
        timeline: true,
        infobox: false,
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
          // url: window.mapUrl + ":9109/map/?z={z}&x={x}&y={y}",
          url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          maximumLevel: 7,
          show: true
        })
      });

      earth.sceneTree.root = {
        "children": [
          {
            "czmObject": {
              "name": "默认离线影像",
              "xbsjType": "Imagery",
              "xbsjImageryProvider": {
                "createTileMapServiceImageryProvider": {
                  "url": XE.HTML.cesiumDir + 'Assets/Textures/NaturalEarthII',
                  "fileExtension": 'jpg',
                },
                "type": "createTileMapServiceImageryProvider"
              }
            }
          },
        ]
      };

      const viewer = earth.czm.viewer;
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

      // debugger
      this.satelliteList.forEach(item => {
        // return
        let entity = this.utils.getObjById(item.satelliteCode, window.viewer);
        if (entity) {
          this.utils.moveEntity(window.viewer, 1, entity, item);
          this.utils.addRadarInteraction(window.viewer, 1, entity, item);
          if (item.satelliteCode.indexOf("8A")) {
            // this.utils.drawShadow(viewer, entity, "xxx", true,0)
            // this.utils.drawCone(viewer, entity, "xxx", true)
            // this.utils.getPosStrs(viewer, entity)
            // this.utils.moveEntity(window.viewer, 1, entity, item);
            // this.utils.moveRectangleEntity(viewer, item.satelliteCode, 4500, 4500, entity, 26, 9, [])
          }
        }
      });
      // this.timerRun();
    },
  },
  mounted() {
    this.init()
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
