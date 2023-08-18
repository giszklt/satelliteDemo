import {
    eastNorthUpToFixedFrame, HeadingPitchRoll,
    northEastDownToFixedFrame,
    northUpEastToFixedFrame,
    northWestUpToFixedFrame
} from "cesium";

let utils = {
    earthRotate: null,
    // cesium 当前时间
    currentSystemTime: '',
    distanceCal(point1, point2) {
        let cartographic1 = Cesium.Cartographic.fromDegrees(point1.lon, point1.lat, point1.height);
        let cartographic2 = Cesium.Cartographic.fromDegrees(point2.lon, point2.lat, point2.height);
        let geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(cartographic1, cartographic2);
        return geodesic.surfaceDistance;
    },
    getAngle(point1, point2) {
        const distance = this.distanceCal(point1, point2);
        const radii = 6378137.0//地球半径
        const h = point2.alt;
        const l1 = Math.sin(distance / radii) * radii
        const l2 = Math.cos(distance / radii) * radii
        return Math.atan(l1 / (h + radii - l2)) * 180 / Math.PI;
    },
    getRollAndPitch(point1, point2) {
        const pP = {lon: point2.lon, lat: point1.lat, height: point1.alt};
        const rP = {lon: point1.lon, lat: point2.lat, height: point1.alt};
        const pA = this.getAngle(pP, point2);
        const rA = this.getAngle(rP, point2);
        return [pA, rA]
    },
    // utc时间转换为北京时间
    transformTime: function (me, viewer) {
        let correct = function (tar) {
            if (tar < 10) tar = '0' + tar;
            return tar
        }
        me = this;
        viewer.animation.viewModel.dateFormatter = localeDateTimeFormatter;
        viewer.animation.viewModel.timeFormatter = localeTimeFormatter;
        viewer.timeline.makeLabel = function (time) {
            return localeDateTimeFormatter(time);
        };

        // Date formatting to a global form
        function localeDateTimeFormatter(datetime, viewModel, ignoredate) {
            let julianDT = new Cesium.JulianDate();
            Cesium.JulianDate.addHours(datetime, 8, julianDT);
            let gregorianDT = Cesium.JulianDate.toGregorianDate(julianDT);
            // 赋值当前时间
            let day = correct(gregorianDT.day),
                hour = correct(gregorianDT.hour),
                millisecond = correct(gregorianDT.millisecond),
                minute = correct(gregorianDT.minute),
                month = correct(gregorianDT.month),
                second = correct(gregorianDT.second),
                year = correct(gregorianDT.year);
            me.currentSystemTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            let objDT;
            if (ignoredate) objDT = "";
            else {
                objDT = new Date(
                    gregorianDT.year,
                    gregorianDT.month - 1,
                    gregorianDT.day
                );
                objDT =
                    gregorianDT.year +
                    "年" +
                    objDT.toLocaleString("zh-cn", {
                        month: "short"
                    }) +
                    gregorianDT.day +
                    "日";
                if (viewModel || gregorianDT.hour + gregorianDT.minute === 0)
                    return objDT;
                objDT += " ";
            }
            return (
                objDT +
                Cesium.sprintf(
                    "%02d:%02d:%02d",
                    gregorianDT.hour,
                    gregorianDT.minute,
                    gregorianDT.second
                )
            );
        }

        function localeTimeFormatter(time, viewModel) {
            return localeDateTimeFormatter(time, viewModel, true);
        }

    },
    changeToUTC8: function (viewer) {
        viewer.animation.viewModel.dateFormatter = DateTimeFormatter;
        viewer.animation.viewModel.timeFormatter = TimeFormatter;
        viewer.timeline.makeLabel = DateTimeFormatter;


        function fillZero(value) {
            return (value < 10 ? '0' : '') + value
        }

        function DateTimeFormatter(datetime, viewModel, ignoredate) {
            let julianDT = new Cesium.JulianDate();
            Cesium.JulianDate.addHours(datetime, 8, julianDT);
            let gregorianDT = Cesium.JulianDate.toGregorianDate(julianDT);
            let objDT;
            if (ignoredate) {
                objDT = '';
            } else {
                objDT = new Date(gregorianDT.year, gregorianDT.month - 1, gregorianDT.day);
                objDT = gregorianDT.year + '年' + objDT.toLocaleString('zh-cn', {month: 'short'}) + gregorianDT.day + '日';
                if (viewModel || gregorianDT.hour + gregorianDT.minute === 0) {
                    return objDT
                }
            }
            return objDT + fillZero(gregorianDT.hour) + ":" + fillZero(gregorianDT.minute) + ":" + fillZero(gregorianDT.second);
        }

        function TimeFormatter(time, viewModel) {
            return DateTimeFormatter(time, viewModel, true);
        }
    },
    // 根据实体id获取实体对象
    getObjById: function (id, viewer) {
        let es = viewer.dataSources.get(0).entities;
        let e = null;
        es.values.some(item => {
            if (item.id == id) {
                e = item;
                return true
            }
        })
        return e;
        try {
            let primitives = viewer.scene.primitives || [];
            for (let i = 0; i < primitives.length; i++) {
                let p = primitives.get(i);
                if (!p.id) {
                    continue;
                }
                let obj = p.id;
                if (obj.id == id) {
                    return obj;
                }
            }
            return null;
        } catch (err) {
            return null;
        }
    },
    //显示经纬度
    mouse_move: function (even, viewer) {
        let movement = even //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
        let cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.ellipsoid);
        if (cartesian) { //将笛卡尔三维坐标转为地图坐标（弧度）
            let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian); //将地图坐标（弧度）转为十进制的度数
            let lat_String = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
            let log_String = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2); // 获取相机的高度高度作为视角高度/km
            let alti_String = (viewer.camera.positionCartographic.height / 1000).toFixed(2);
            document.getElementById('location_lon').innerHTML = log_String;
            document.getElementById('location_lat').innerHTML = lat_String;
            document.getElementById('location_alt').innerHTML = alti_String;
        }
    },
    //init生成viewer
    setView(newViewer) {
        let viewer = newViewer;
        viewer.clock._shouldAnimate = true; //时间走动
        // 监听鼠标事件,提供场景移动
        // utils.keyUp(this, viewer);
        // 显示经纬度信息
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(function (movement) {
            utils.mouse_move(movement, viewer);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.nightFadeInDistance = 75000000.0;
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
            10,
            22,
            130,
            50
        );
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(117.48, 30.67, 28000000.0)
        });
        if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
            //判断是否支持图像渲染像素化处理
            viewer.resolutionScale = window.devicePixelRatio;
        }
        viewer.scene.fxaa = true;
        viewer.scene.postProcessStages.fxaa.enabled = true;
    },
    //替换星空盒
    skyBoxs: function (viewer) {
        viewer.scene.skyBox = new Cesium.SkyBox({
            sources: {
                positiveX: "img/xkbg/tycho2t3_80_px.jpg",
                negativeX: "img/xkbg/tycho2t3_80_mx.jpg",
                positiveY: "img/xkbg/tycho2t3_80_py.jpg",
                negativeY: "img/xkbg/tycho2t3_80_my.jpg",
                positiveZ: "img/xkbg/tycho2t3_80_pz.jpg",
                negativeZ: "img/xkbg/tycho2t3_80_mz.jpg"
            }
        });
    },

    startRotate(viewer, start = true) {

        let previousTime = viewer.clock.currentTime.secondsOfDay;

        function onTickCallback() {
            let spinRate = 1;
            let currentTime = viewer.clock.currentTime.secondsOfDay;
            let delta = (currentTime - previousTime) / 1000;
            previousTime = currentTime;
            viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate * delta);
        }

        if (!start && this.earthRotate != null) {
            this.earthRotate();
            return
        }
        this.earthRotate = viewer.clock.onTick.addEventListener(onTickCallback);
    },

    //得到扇形坐标(实际上为多边形)
    getSector: function (lon, lat, radius, sangle, eangle, step) {
        let ar = []
        for (let i = sangle; i <= eangle; i += step) {
            let clon = radius * Math.sin(i * Math.PI / 180);
            let clat = radius * Math.cos(i * Math.PI / 180);
            let ec = 6356725 + (6378137 - 6356725) * (90 - lat) / 90;
            let ed = ec * Math.cos(lat * Math.PI / 180);
            let rlon = (clon / ed + lon * Math.PI / 180) * 180 / Math.PI;
            let rlat = (clat / ec + lat * Math.PI / 180) * 180 / Math.PI;
            ar.push(rlon, rlat);
        }
        if (eangle - sangle < 360) {
            ar.push(lon, lat);
        }
        return ar
    },
    //   流动材质
    polylineMaterial: function () {

        function PolylineTrailLinkMaterialProperty3(color, duration) {
            this._definitionChanged = new Cesium.Event();
            this._color = undefined;
            this._colorSubscription = undefined;
            this.color = color;
            this.duration = duration;
            this._time = (new Date()).getTime();
        }

        Object.defineProperties(PolylineTrailLinkMaterialProperty3.prototype, {
            isConstant: {
                get: function () {
                    return false;
                }
            },
            definitionChanged: {
                get: function () {
                    return this._definitionChanged;
                }
            },
            color: Cesium.createPropertyDescriptor('color')
        });
        PolylineTrailLinkMaterialProperty3.prototype.getType = function (time) {
            return 'PolylineTrailLink';
        }
        PolylineTrailLinkMaterialProperty3.prototype.getValue = function (time, result) {
            if (!Cesium.defined(result)) {
                result = {};
            }
            result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
            result.image = Cesium.Material.PolylineTrailLinkImage;
            result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
            return result;
        }
        PolylineTrailLinkMaterialProperty3.prototype.equals = function (other) {
            return this === other || (other instanceof PolylineTrailLinkMaterialProperty && Property.equals(this._color, other._color))
        };
        Cesium.PolylineTrailLinkMaterialProperty3 = PolylineTrailLinkMaterialProperty3;
        Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
        Cesium.Material.PolylineTrailLinkImage = "img/middlearrow.png"; //图片
        Cesium.Material.PolylineTrailLinkSource =
            "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
        {\n\
            czm_material material = czm_getDefaultMaterial(materialInput);\n\
            vec2 st = materialInput.st;\n\
            vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
            material.alpha = colorImage.a * color.a;\n\
            material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
            return material;\n\
        }";
        Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
            fabric: {
                type: Cesium.Material.PolylineTrailLinkType,
                uniforms: {
                    color: Cesium.Color.RED,
                    image: Cesium.Material.PolylineTrailLinkImage,
                    time: 0
                },
                source: Cesium.Material.PolylineTrailLinkSource
            },
            translucent: function (material) {
                return true;
            }
        })


        function PolylineTrailLinkMaterialProperty(color, duration) {
            this._definitionChanged = new Cesium.Event();
            this._color = undefined;
            this._colorSubscription = undefined;
            this.color = color;
            this.duration = duration;
            this._time = (new Date()).getTime();
        }

        Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
            isConstant: {
                get: function () {
                    return false;
                }
            },
            definitionChanged: {
                get: function () {
                    return this._definitionChanged;
                }
            },
            color: Cesium.createPropertyDescriptor('color')
        });
        PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
            return 'PolylineTrailLink';
        }
        PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
            if (!Cesium.defined(result)) {
                result = {};
            }
            result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
            result.image = Cesium.Material.PolylineTrailLinkImage;
            result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
            return result;
        }
        PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
            return this === other || (other instanceof PolylineTrailLinkMaterialProperty && Property.equals(this._color, other._color))
        };
        Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
        Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
        Cesium.Material.PolylineTrailLinkImage = "img/colors2.png";//图片
        Cesium.Material.PolylineTrailLinkSource =
            "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
        {\n\
            czm_material material = czm_getDefaultMaterial(materialInput);\n\
            vec2 st = materialInput.st;\n\
            vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
            material.alpha = colorImage.a * color.a;\n\
            material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
            return material;\n\
        }";
        Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
            fabric: {
                type: Cesium.Material.PolylineTrailLinkType,
                uniforms: {
                    color: Cesium.Color.RED,
                    image: Cesium.Material.PolylineTrailLinkImage,
                    time: 0
                },
                source: Cesium.Material.PolylineTrailLinkSource
            },
            translucent: function (material) {
                return true;
            }
        })

        function PolylineTrailLinkMaterialProperty2(color, duration) {
            this._definitionChanged = new Cesium.Event();
            this._color = undefined;
            this._colorSubscription = undefined;
            this.color = color;
            this.duration = duration;
            this._time = (new Date()).getTime();
        }

        Object.defineProperties(PolylineTrailLinkMaterialProperty2.prototype, {
            isConstant: {
                get: function () {
                    return false;
                }
            },
            definitionChanged: {
                get: function () {
                    return this._definitionChanged;
                }
            },
            color: Cesium.createPropertyDescriptor('color')
        });
        PolylineTrailLinkMaterialProperty2.prototype.getType = function (time) {
            return 'PolylineTrailLink';
        }
        PolylineTrailLinkMaterialProperty2.prototype.getValue = function (time, result) {
            if (!Cesium.defined(result)) {
                result = {};
            }
            result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
            result.image = "img/colors2.png";
            result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
            return result;
        }
        PolylineTrailLinkMaterialProperty2.prototype.equals = function (other) {
            return this === other || (other instanceof PolylineTrailLinkMaterialProperty2 && Property.equals(this._color, other._color))
        };
        Cesium.PolylineTrailLinkMaterialProperty2 = PolylineTrailLinkMaterialProperty2;
    },
    //画轨道方法
    czmlgo(list, startTime, endTime, viewer, modelUrl, showBillUrl, pathAll) {
        // startTime = utils
        //     .timestamp2beijing(utils.totimestamp(startTime))
        //     .replace(" ", "T");
        // endTime = utils
        //     .timestamp2beijing(utils.totimestamp(endTime))
        //     .replace(" ", "T");
        let leadTime = 86400;
        let trailTime = 86400;
        !showBillUrl ? showBillUrl = false : showBillUrl = true;
        let clock = {
            currentTime: startTime,
            interval: startTime + "/" + endTime,
            rang: "LOOP_STOP",
            step: "SYSTEM_CLOCK_MULTIPLIER",
            multiplier: 1,
        };
        let czml = [{
            availability: clock.interval,
            id: "document",
            version: "1.0",
            description: "CZML Document",
            clock: clock,
        },];
        list.forEach((item, index) => {
            if (item.gdcolor == undefined) {
                item.gdcolor = [0, 255, 255, 30]
            }
            let str = {
                id: item.satelliteCode,
                description: "",
                availability: clock.interval,
                model: {
                    gltf: modelUrl,
                    scale: 1.0,
                    minimumPixelSize: 55,
                },
                billboard: { //图标
                    image: "img/satellite2.png",
                    // pixelOffset: new Cesium.Cartesian2(100, -35),
                    show: showBillUrl,
                    scale: 0.5,
                },
                position: {
                    epoch: startTime,
                    // interpolationAlgorithm: "LAGRANGE",
                    // cartesian: item.data,
                    cartographicDegrees: item.ephList,
                    interpolationDegree: 5,
                    // referenceFrame: "INERTIAL",
                },
                label: {
                    show: true,
                    text: item.satelliteCode,
                    horizontalOrigin: "LEFT",
                    pixelOffset: {
                        cartesian2: [12, 0],
                    },
                    fillColor: {
                        rgba: [1, 253, 60, 100],
                    },
                    font: "13pt Lucida Console",
                    outlineColor: {
                        rgba: [0, 0, 0, 255],
                    },
                    outlineWidth: 3,
                },
                path: {
                    // show: [{
                    //     interval: clock.interval,
                    //     boolean: true,
                    // },],
                    width: 1,
                    show: pathAll,
                    leadTime: leadTime,
                    trailTime: trailTime,
                    resolution: 120,
                    material: {
                        solidColor: {
                            color: {
                                rgba: item.gdcolor,
                                // rgba:  [1, 253, 60, 50],
                            },
                        },
                    },
                },
            };
            czml.push(str);
        });
        // list.forEach((item, index) => {
        //     if (item.gdcolor == undefined) {
        //         item.gdcolor = [0, 255, 255, 30]
        //     }
        //     let temp = []
        //     item.ephList.forEach((e, i) => {
        //         if (i % 4 == 3) {
        //             temp.push(e + e / 2)
        //         } else {
        //             temp.push(e)
        //         }
        //     })
        //     let str = {
        //         id: "test",
        //         description: "",
        //         availability: clock.interval,
        //         model: {
        //             gltf: modelUrl,
        //             scale: 1.0,
        //             minimumPixelSize: 55,
        //         },
        //         billboard: { //图标
        //             image: "img/satellite2.png",
        //             // pixelOffset: new Cesium.Cartesian2(100, -35),
        //             show: showBillUrl,
        //             scale: 0.5,
        //         },
        //         position: {
        //             epoch: startTime,
        //             // interpolationAlgorithm: "LAGRANGE",
        //             // cartesian: item.data,
        //             cartographicDegrees: temp,
        //             interpolationDegree: 5,
        //             // referenceFrame: "INERTIAL",
        //         },
        //         label: {
        //             show: true,
        //             text: item.satelliteCode,
        //             horizontalOrigin: "LEFT",
        //             pixelOffset: {
        //                 cartesian2: [12, 0],
        //             },
        //             fillColor: {
        //                 rgba: [1, 253, 60, 100],
        //             },
        //             font: "13pt Lucida Console",
        //             outlineColor: {
        //                 rgba: [0, 0, 0, 255],
        //             },
        //             outlineWidth: 3,
        //         },
        //         path: {
        //             // show: [{
        //             //     interval: clock.interval,
        //             //     boolean: true,
        //             // },],
        //             width: 1,
        //             show: pathAll,
        //             leadTime: leadTime,
        //             trailTime: trailTime,
        //             resolution: 120,
        //             material: {
        //                 solidColor: {
        //                     color: {
        //                         rgba: item.gdcolor,
        //                         // rgba:  [1, 253, 60, 50],
        //                     },
        //                 },
        //             },
        //         },
        //     };
        //     czml.push(str);
        // });
        return viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));

    },
    // 载入模型
    createModel: function (viewer, id, name, url, height, lon, lat, min, max, ellipseShow, coverageArea, labelShow, showBillUrl) {
        if (!ellipseShow) ellipseShow = false;
        (showBillUrl == undefined) ? showBillUrl = false : showBillUrl = true;
        let label = {};
        if (labelShow) {
            label = {
                text: name,
                font: '12px SimHei ',
                Width: 100,
                height: 20,
                style: Cesium.LabelStyle.FILL,
                fillColor: Cesium.Color.WHITE,
                backgroundColor: new Cesium.Color(226, 48, 48, 0.57),
                // backgroundColor: Cesium.Color.RED.withAlpha(0.5),
                showBackground: true,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
            }
        } else {
            label = {
                text: name,
                font: '12px SimHei ',
                Width: 100,
                height: 20,
                scale: 0.7,
                style: Cesium.LabelStyle.FILL,
                fillColor: Cesium.Color.WHITE,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(30, -3),

            }
        }
        // viewer.entities.removeAll();
        let position = Cesium.Cartesian3.fromDegrees(lon, lat, height);
        let heading = Cesium.Math.toRadians(135);
        let pitch = 0;
        let roll = 0;
        let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            hpr
        );
        let entity = viewer.entities.add({
            id: id,
            name: name,
            position: position,
            orientation: orientation,
            billboard: { //图标
                image: "img/station.png",
                show: showBillUrl
            },
            model: {
                uri: url,
                minimumPixelSize: min,
                maximumScale: max
            },
            ellipse: {
                semiMinorAxis: coverageArea,
                semiMajorAxis: coverageArea,
                material: backColor(),
                show: ellipseShow
            },
            label: label,
            show: true
        });

        function backColor() {
            let color = new Cesium.ColorMaterialProperty({
                red: 154 / 255,
                green: 80 / 255,
                blue: 255 / 255,
                alpha: 0.2
            });
            if (showBillUrl) {
                color = new Cesium.ColorMaterialProperty({red: 154 / 255, green: 80 / 255, blue: 255 / 255, alpha: 0.5})
            }
            return color
        }

        return entity;
        // viewer.trackedEntity = entity;
    },
    setPos(viewer, entity, step) {
        let computeLine = function (position, startTime, step) {
            let property = new Cesium.SampledPositionProperty();
            position.forEach((item, index) => {
                let time = Cesium.JulianDate.addSeconds(
                    startTime,
                    index * step,
                    new Cesium.JulianDate()
                );
                property.addSample(time, item);
            });
            let time2 = Cesium.JulianDate.addSeconds(
                startTime,
                step / position.length,
                new Cesium.JulianDate()
            );
            const sys = new Cesium.VelocityOrientationProperty(property).getValue(time2)
            let pos = Cesium.HeadingPitchRoll.fromQuaternion(sys)
            return {
                sys: sys,
                positions: position,
                olj: {
                    // heading: pos.heading,
                    // pitch: pos.pitch,
                    // roll: pos.roll
                    heading: Cesium.Math.toDegrees(pos.heading),
                    pitch: Cesium.Math.toDegrees(pos.pitch),
                    roll: Cesium.Math.toDegrees(pos.roll)
                }
            }
        };
        let tiem1 = viewer.clock.currentTime;
        let time2 = Cesium.JulianDate.addSeconds(
            viewer.clock.currentTime,
            5,
            new Cesium.JulianDate()
        );
        let position = [entity.position.getValue(tiem1), entity.position.getValue(time2)];
        return computeLine(position, tiem1, step);
    },
    // 获取实体某时间的位置信息
    getEntityPos: function (entity, time) {
        if (entity.position.getValue(time)) {
            let cartographic = Cesium.Cartographic.fromCartesian(entity.position.getValue(time));
            return {
                lon: Cesium.Math.toDegrees(cartographic.longitude),
                lat: Cesium.Math.toDegrees(cartographic.latitude),
                alt: cartographic.height,
            }
        } else {
            return {
                lon: 0,
                lat: 0,
                alt: 0,
            }
        }
    },
    // 流动线条连接两实体
    lineEntity: function (viewer, lineId, entity1, entity2, showEntity, showMaterial2, times, material, colortype) {
        // let lineEntuty = this.getObjById(lineId, viewer)
        // if (lineEntuty) {
        //     return
        // }
        let TimeInterval = null;
        if (times) {
            TimeInterval = new Cesium.TimeIntervalCollection();
            times.forEach(time => {
                TimeInterval.addInterval(new Cesium.TimeInterval({
                    start: time.start,
                    stop: time.stop,
                    data: true
                }))
            })
        }
        if (entity2.ellipse) {
            entity2.ellipse.show = new Cesium.ConstantProperty(function () {
                let cu = viewer.clock.currentTime;
                let show = false;
                if (cu >= times[0].start && cu <= times[0].stop) {
                    show = true;
                }
                return show;
            })

            // entity2.ellipse.show = TimeInterval;
        }

        // 暂时保留之前版本
        let getMaterial = function () {
            // debugger
            let materialTep = new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.RED, 700); //BLUE
            if (showMaterial2) materialTep = new Cesium.PolylineTrailLinkMaterialProperty2(Cesium.Color.GREEN, 700);
            return materialTep
        };
        // debugger;
        // if (!material) material = getMaterial();
        // (showMaterial2 == undefined) ? showMaterial2 = false: showMaterial2 = true;

        // debugger
        // let tempRed = new Cesium.PolylineTrailLinkMaterialProperty2(Cesium.Color.RED, 700);
        // let tempBlue = new Cesium.PolylineTrailLinkMaterialProperty2(Cesium.Color.BLUE, 700)
        // let selfmaterial = showMaterial2 === 'red' ? tempRed : tempBlue;


        // debugger
        if (viewer.entities.getById(lineId)) {
            return
        }
        // if (colortype === 'blue') {
        //     material = new Cesium.PolylineTrailLinkMaterialProperty2(Cesium.Color.BLUE, 700);
        // }
        // if (colortype === 'red') {
        //     material = new Cesium.PolylineTrailLinkMaterialProperty2(Cesium.Color.RED, 700);
        // }
        material = new Cesium.PolylineTrailLinkMaterialProperty3(Cesium.Color.GREEN, 700);


        let entity = viewer.entities.add({
            availability: TimeInterval,
            id: lineId,
            show: showEntity,
            polyline: {
                positions: new Cesium.CallbackProperty(function (time, result) {
                    // let tempMaterial = new Cesium.PolylineTrailLinkMaterialProperty2(Cesium.Color.GREEN, 700);
                    // if (times.length > 1) {
                    //     times.some(item => {
                    //         if (time.secondsOfDay >= item.start.secondsOfDay && time.secondsOfDay <= item.stop.secondsOfDay) {
                    //             tempMaterial = item.type == 1 ? new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.RED, 700) : tempMaterial;
                    //             return true;
                    //         }
                    //     })
                    // }
                    // entity.polyline.material = tempMaterial;
                    if (entity1.position.getValue(time)) {
                        let sourpos = entity1.position.getValue(time);
                        let cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(sourpos);
                        let lon1 = Cesium.Math.toDegrees(cartographic1.longitude);
                        let lat1 = Cesium.Math.toDegrees(cartographic1.latitude);
                        let height1 = cartographic1.height;
                        let tarpos = entity2.position.getValue(time);
                        let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(tarpos);
                        let lon2 = Cesium.Math.toDegrees(cartographic.longitude);
                        let lat2 = Cesium.Math.toDegrees(cartographic.latitude);
                        let height2 = cartographic.height;
                        return Cesium.Cartesian3.fromDegreesArrayHeights([lon1, lat1, height1, lon2, lat2, height2], Cesium.Ellipsoid
                            .WGS84, result);
                    }
                }, false),
                arcType: Cesium.ArcType.NONE,
                width: 2,
                // material: new Cesium.PolylineGlowMaterialProperty({
                //     glowPower: 0.5,
                //     color: Cesium.Color.RED.withAlpha(0.5)
                // }),
                material: material,
                // material: selfmaterial,

            }
        })
        return entity
    },

//画矩形的方法
    moveRectangleEntity(viewer, id, long, width, satellite, roll, pitch, datas) { // 场景，卫星实体,视场角
        let rectangularPyramidSensor = new CesiumSensors.RectangularPyramidSensorVolume();
        rectangularPyramidSensor.id = id;
        let currentTime = viewer.clock.currentTime;
        let position = this.getEntityPos(satellite, currentTime);
        let self = this;
        rectangularPyramidSensor.radius = position.alt * 2.5;
        rectangularPyramidSensor.xHalfAngle = Math.atan((long / position.alt) * 2.5); //长
        rectangularPyramidSensor.yHalfAngle = Math.atan((width / position.alt) * 2.5); //宽
        rectangularPyramidSensor.intersectionColor = new Cesium.Color(0.0, 1.0, 1.0, 1);
        rectangularPyramidSensor.intersectionWidth = 2.5;
        rectangularPyramidSensor.lateralSurfaceMaterial = Cesium.Material.fromType('Color');
        rectangularPyramidSensor.lateralSurfaceMaterial.uniforms.color = new Cesium.Color(0.0, 1.0, 1.0, 0.5);
        let fun = (scene, time) => {
            if (satellite.computeModelMatrix(time)) {
                let show = true;
                let pitchAngle = 180;
                let rollAngle = 0;
                datas.some(data => {
                    show = self.checkShowByTime(time, data.startTime, data.endTime)
                    console.log(show)
                    pitchAngle = pitchAngle + (show ? data.pitchAngle : 0);
                    rollAngle = show ? data.rollAngle : 0;
                    return show;
                })
                rectangularPyramidSensor.show = show;
                let modelMatrix = satellite.computeModelMatrix(time);
                pitchAngle = 206;
                rollAngle = 26;
                //1是前后摆，按Y轴。0是左右，按X轴
                if (roll) {
                    Cesium.Matrix4.multiply(modelMatrix, Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rollAngle))), modelMatrix)
                }
                if (pitch) {
                    Cesium.Matrix4.multiply(modelMatrix, Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(pitchAngle))), modelMatrix)
                }

                rectangularPyramidSensor.modelMatrix = modelMatrix;
                let posData = this.setPos(viewer, satellite, 1);
                if (posData) {
                    satellite.orientation = posData.sys;
                }
            }
        }
        viewer.scene.preRender.addEventListener(fun);
        rectangularPyramidSensor.removeEventListener = () => {
            viewer.scene.preRender.removeEventListener(fun)
        }
        let entity = viewer.scene.primitives.add(rectangularPyramidSensor);
        entity.eType = "sensor";
        return entity
    },
    moveRectangleEntity1(viewer, id, long, width, satellite, roll, pitch, datas) { // 场景，卫星实体,视场角
        let rectangularPyramidSensor = new CesiumSensors.RectangularPyramidSensorVolume();
        rectangularPyramidSensor.id = id;
        let currentTime = viewer.clock.currentTime;
        let position = this.getEntityPos(satellite, currentTime);
        let self = this;
        rectangularPyramidSensor.radius = position.alt * 2.5;
        rectangularPyramidSensor.xHalfAngle = Math.atan((long / position.alt) * 2.5); //长
        rectangularPyramidSensor.yHalfAngle = Math.atan((width / position.alt) * 2.5); //宽
        rectangularPyramidSensor.intersectionColor = new Cesium.Color(0.0, 1.0, 1.0, 1);
        rectangularPyramidSensor.intersectionWidth = 2.5;
        rectangularPyramidSensor.lateralSurfaceMaterial = Cesium.Material.fromType('Color');
        rectangularPyramidSensor.lateralSurfaceMaterial.uniforms.color = new Cesium.Color(0.0, 1.0, 1.0, 0.5);
        let fun = (scene, time) => {
            if (satellite.computeModelMatrix(time)) {
                let show = true;
                let pitchAngle = 180;
                let rollAngle = 0;
                datas.some(data => {
                    show = self.checkShowByTime(time, data.startTime, data.endTime)
                    console.log(show)
                    pitchAngle = pitchAngle + (show ? data.pitchAngle : 0);
                    rollAngle = show ? data.rollAngle : 0;
                    return show;
                })
                rectangularPyramidSensor.show = show;
                let modelMatrix = satellite.computeModelMatrix(time);
                pitchAngle = 206;
                rollAngle = 26;
                //1是前后摆，按Y轴。0是左右，按X轴
                if (roll) {
                    Cesium.Matrix4.multiply(modelMatrix, Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rollAngle))), modelMatrix)
                }
                if (pitch) {
                    Cesium.Matrix4.multiply(modelMatrix, Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(pitchAngle))), modelMatrix)
                }

                rectangularPyramidSensor.modelMatrix = modelMatrix;
                let posData = this.setPos(viewer, satellite, 1);
                if (posData) {
                    satellite.orientation = posData.sys;
                }
            }
        }
        viewer.scene.preRender.addEventListener(fun);
        rectangularPyramidSensor.removeEventListener = () => {
            viewer.scene.preRender.removeEventListener(fun)
        }
        let entity = viewer.scene.primitives.add(rectangularPyramidSensor);
        entity.eType = "sensor";
        return entity
    },
    //绘制投影
    moveEntity(viewer, type, satellite, data) { // 场景，卫星实体,视场角
        //圆锥clockNow===2;
        let entity = null;
        let clockNow = 1;
        let color = new Cesium.Color(51 / 255, 255 / 255, 255 / 255, 0.2);
        if (type == 2) clockNow = 90;
        let currentTime = viewer.clock.currentTime;
        let position = this.getEntityPos(satellite, currentTime);
        let alt = position.alt * 2.5;
        if (type == 2) {
            alt = position.alt * 10 + position.alt * 10;
        }
        let customSensor = new CesiumSensors.CustomSensorVolume();
        // debugger
        let directions = [];
        let maxAngle = data.maxAngle ? data.maxAngle : 360;
        let minAngle = data.minAngle ? data.minAngle : 0;
        let ru = data.ru;
        for (let i = minAngle; i <= maxAngle; i++) {
            let clock = Cesium.Math.toRadians(clockNow * (i + 180));// 弧度
            if (data.isld) {
                let lat = position.lat;
                ru = data.type == 1 ? 2000 : 3000
                if (lat > -50 && lat < 50) {
                    ru = data.type == 1 ? 3000 : 4000
                }
            }
            //根据高度，计算视场角的far值
            let tempFar = (180 / Math.PI) * 2 * Math.atan(ru * 1000 / position.alt);
            if (tempFar > 90) {
                tempFar = 180 - tempFar;
            }
            let cone = Cesium.Math.toRadians(tempFar);
            directions.push(new Cesium.Spherical(clock, cone));
        }

        let sectorPolygon = this.getSector(position.lon, position.lat, (ru * 1000) / 2, minAngle + 30, maxAngle + 30, 1);
        // let sector = viewer.entities.add({
        //     id: 'sector',
        //     show: viewer.scene.mode != 3,
        //     polygon: {
        //         hierarchy: new Cesium.CallbackProperty(() => {
        //             return new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(sectorPolygon))
        //         }, false),
        //         material: color,
        //         extrudedHeight: 100,
        //     }
        // })

        // let sector = viewer.scene.primitives.add(new Cesium.Primitive({
        //     geometryInstances: new Cesium.GeometryInstance({
        //         id: 'sector',
        //         geometry: new Cesium.PolygonGeometry({
        //             polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(sectorPolygon))
        //         })
        //     }),
        //     appearance: new Cesium.EllipsoidSurfaceAppearance({
        //         material: Cesium.Material({
        //             Color: color
        //         }),
        //     }),
        //     // show: viewer.scene.mode != 3,
        // }));
        if (data.isais)
            directions.push(new Cesium.Spherical(0, 0));
        let self = this;
        let fun = (scene, time) => {
            if (satellite.computeModelMatrix(time)) {
                let tepPosition = self.getEntityPos(satellite, time);
                if (data.isld) {
                    let lat = tepPosition.lat;
                    let tempru = data.type == 1 ? 2000 : 3000
                    if (lat > -50 && lat < 50) {
                        tempru = data.type == 1 ? 3000 : 4000
                    }
                    if (ru != tempru) {
                        ru = tempru;
                        viewer.scene.primitives.remove(entity);
                        // viewer.entities.remove(sector);
                        viewer.scene.preRender.removeEventListener(fun);
                        self.moveEntity(viewer, type, satellite, data)
                    }
                }
                customSensor.show = scene.mode == 3
                // sector.show = scene.mode != 3;
                //
                // viewer.scene.primitives.remove(sector);
                // sector.destroy()
                // sector = viewer.scene.primitives.add(new Cesium.Primitive({
                //     geometryInstances: new Cesium.GeometryInstance({
                //         id: 'sector',
                //         geometry: new Cesium.PolygonGeometry({
                //             polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(sectorPolygon))
                //         })
                //     }),
                //     appearance: new Cesium.EllipsoidSurfaceAppearance({
                //         material: Cesium.Material({
                //             Color: color
                //         }),
                //     }),
                //     show: viewer.scene.mode != 3,
                // }));
                let posData = this.setPos(viewer, satellite, 5);
                let modelMatrix = satellite.computeModelMatrix(time);

                // let css = self.getObjById("CSS", viewer);
                // let csspositon = self.getEntityPos(css, time);
                // let rp = self.getRollAndPitch(csspositon, tepPosition)
                if (typeof (modelMatrix) == 'object') {
                    Cesium.Matrix4.multiply(modelMatrix, Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(-180))), modelMatrix)
                    //如果条带在卫星前进轨道右边，测摆取负数，在左则反之
                    //俯仰默认旋转180
                    // Cesium.Matrix4.multiply(modelMatrix, Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians((rp[0])))), modelMatrix)
                    // Cesium.Matrix4.multiply(modelMatrix, Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(-180 - rp[1]))), modelMatrix)

                    customSensor.modelMatrix = modelMatrix
                    // sector.modelMatrix = modelMatrix
                }
                // satellite.orientation = posData.sys;
                // console.log(posData.olj.heading)
                let tema = Math.abs(posData.olj.heading) * 2 + 90
                sectorPolygon = self.getSector(tepPosition.lon, tepPosition.lat, (ru * 1000) / 2, minAngle + tema, maxAngle + tema, 1);
            }
        }
        viewer.scene.preRender.addEventListener(fun)
        customSensor.removeEventListener = () => {
            viewer.scene.preRender.removeEventListener(fun)
        }
        customSensor.id = data.id;
        customSensor.radius = alt;
        customSensor.directions = directions;

        customSensor.show = viewer.scene.mode == 3

        customSensor._directionsDirty = true

        // customSensor.showThroughEllipsoid = true
        entity = viewer.scene.primitives.add(customSensor);

        entity.intersectionColor.red = 0.2;
        entity.lateralSurfaceMaterial.uniforms.color = color;
        return entity
    },
    //添加雷达干扰
    addRadarInteraction(viewer, type, satellite, data) { // 场景，卫星实体,视场角
        //圆锥clockNow===2;
        let entity = null;
        let currentTime = viewer.clock.currentTime;
        let position = this.getEntityPos(satellite, currentTime);
        let self = this;

        let i = Cesium.Cartesian3.fromDegrees(position.lon, position.lat);
        let r = Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(i), new Cesium.Cartesian3(0, 0, position.alt / 2), new Cesium.Matrix4);
        //
        // var modelMatrix111 = Cesium.Matrix4.multiplyByTranslation(
        //     Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid),
        //     new Cesium.Cartesian3(0.0, 0.0, position.alt * 0.5), new Cesium.Matrix4()
        // );

        let n = new Cesium.CylinderGeometry({
            length: position.alt,
            topRadius: 0,
            bottomRadius: 1000000,
            vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat
        });
        let s = new Cesium.GeometryInstance({geometry: n, modelMatrix: r});
        let radarInteraction = new Cesium.Primitive({
            geometryInstances: [s],
            appearance: new Cesium.MaterialAppearance({
                material: new Cesium.Material({
                    fabric: {
                        type: "VtxfShader1",
                        uniforms: {
                            color: new Cesium.Color(1, 0, 0, 1),
                            repeat: 30,
                            offset: 0,
                            thickness: .3
                        },
                        source: " uniform vec4 color;" +
                            " uniform float repeat;" +
                            " uniform float offset;" +
                            " uniform float thickness;" +
                            " czm_material czm_getMaterial(czm_materialInput materialInput)" +
                            " {" +
                            " czm_material material = czm_getDefaultMaterial(materialInput);" +
                            " float sp = 1.0/repeat;" +
                            " vec2 st = materialInput.st;" +
                            // " vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));" +
                            " float dis = distance(st, vec2(0.5));" +
                            " float m = mod(dis + offset, sp);" +
                            " float a = step(sp*(1.0-thickness), m);" +
                            " material.diffuse = color.rgb;" +
                            // " material.alpha = colorImage.a * color.a;" +
                            " material.alpha = a * color.a;" +
                            " return material;" +
                            " } "
                    }, translucent: !1
                }), faceForward: !1, closed: !0
            })
        })
        let fun = (scene, time) => {
            let offset = radarInteraction.appearance.material.uniforms.offset;
            offset -= 0.001;
            if (offset > 1.0) {
                offset = 0.0;
            }
            radarInteraction.appearance.material.uniforms.offset = offset;
            let tempPosition = self.getEntityPos(satellite, time);
            radarInteraction.modelMatrix = Cesium.Matrix4.multiplyByTranslation(
                Cesium.Transforms.eastNorthUpToFixedFrame(satellite.position.getValue(time)),
                new Cesium.Cartesian3(0.0, 0.0, 100), new Cesium.Matrix4()
            );



            return
            if (satellite.computeModelMatrix(time)) {
                let modelMatrix = satellite.computeModelMatrix(time);
                if (typeof (modelMatrix) == 'object') {
                    // Cesium.Matrix4.multiply(modelMatrix, Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(0))), modelMatrix)
                    //如果条带在卫星前进轨道右边，测摆取负数，在左则反之
                    //俯仰默认旋转180
                    // Cesium.Matrix4.multiply(modelMatrix, Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians((rp[0])))), modelMatrix)
                    // Cesium.Matrix4.multiply(modelMatrix, Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(-180 - rp[1]))), modelMatrix)

                    // Cesium.HeadingPitchRoll.fromQuaternion(y, p)

                    let tempPosition = self.getEntityPos(satellite, time);
                    // Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(y, p), S, b.modelMatrix)
                    // let tempPosition = self.getEntityPos(satellite, time);
//                     let tti = Cesium.Cartesian3.fromDegrees(tempPosition.lon, tempPosition.lat);
//                     let ttr = Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(tti), new Cesium.Cartesian3(0, 0, tempPosition.alt / 2), new Cesium.Matrix4);
//
//
//                     let ttn = new Cesium.CylinderGeometry({
//                         length: tempPosition.alt,
//                         topRadius: 0,
//                         bottomRadius: 1000000,
//                         vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat
//                     });
//                     let tts = new Cesium.GeometryInstance({geometry: ttn, modelMatrix: ttr});
//                     let tradarInteraction = new Cesium.Primitive({
//                         geometryInstances: [tts],
//                         appearance: new Cesium.MaterialAppearance({
//                             material: new Cesium.Material({
//                                 fabric: {
//                                     type: "VtxfShader1",
//                                     uniforms: {
//                                         color: new Cesium.Color(1, 0, 0, 1),
//                                         repeat: 30,
//                                         offset: 0,
//                                         thickness: .3
//                                     },
//                                     source: " uniform vec4 color;" +
//                                         " uniform float repeat;" +
//                                         " uniform float offset;" +
//                                         " uniform float thickness;" +
//                                         " czm_material czm_getMaterial(czm_materialInput materialInput)" +
//                                         " {" +
//                                         " czm_material material = czm_getDefaultMaterial(materialInput);" +
//                                         " float sp = 1.0/repeat;" +
//                                         " vec2 st = materialInput.st;" +
//                                         // " vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));" +
//                                         " float dis = distance(st, vec2(0.5));" +
//                                         " float m = mod(dis + offset, sp);" +
//                                         " float a = step(sp*(1.0-thickness), m);" +
//                                         " material.diffuse = color.rgb;" +
//                                         // " material.alpha = colorImage.a * color.a;" +
//                                         " material.alpha = a * color.a;" +
//                                         " return material;" +
//                                         " } "
//                                 }, translucent: !1
//                             }), faceForward: !1, closed: !0
//                         })
//                     })
//                     console.log(tradarInteraction.modelMatrix, ttr)
//                     console.log(Cesium.Matrix4.getRotation(ttr), ttr)
//                     // radarInteraction.modelMatrix = tradarInteraction.modelMatrix;
//                     // console.log(Cesium.Matrix4.setRotation(radarInteraction.modelMatrix, ttr))
//                     // return
//                     radarInteraction.modelMatrix = Cesium.Matrix4.setRotation(radarInteraction.modelMatrix, Cesium.Matrix4.getRotation(ttr));
// return
                    const origin = Cesium.Cartesian3.fromDegrees(tempPosition.lon, tempPosition.lat, 0);
                    console.log(satellite.position.getValue(time))
                    console.log(Cesium.Cartesian3.fromDegrees(tempPosition.lon, tempPosition.lat))
                    radarInteraction.modelMatrix = Cesium.Matrix4.multiplyByTranslation(
                        Cesium.Transforms.eastNorthUpToFixedFrame(satellite.position.getValue(time)),
                        new Cesium.Cartesian3(0.0, 0.0, tempPosition.alt * 0.5), new Cesium.Matrix4()
                    );
                    return;
                    radarInteraction.modelMatrix = Cesium.Matrix4.multiplyByTranslation(
                        Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(tempPosition.lon, tempPosition.lat)),
                        new Cesium.Cartesian3(0.0, 0.0, tempPosition.alt * 0.5), new Cesium.Matrix4()
                    );

                    return

                    //上下平移
                    let translation = new Cesium.Cartesian3(0, -Cesium.Ellipsoid.WGS84.maximumRadius - tempPosition.alt, 0);
                    let m4 = Cesium.Matrix4.fromTranslation(translation);
                    // let tempM = Cesium.Transforms.northUpEastToFixedFrame(origin);
                    // let tempM = Cesium.Transforms.northWestUpToFixedFrame(origin);
                    // let tempM = Cesium.Transforms.northEastDownToFixedFrame(origin);
                    var center = Cesium.Cartesian3.fromDegrees(lon, lat)
                    var hpr = new Cesium.HeadingPitchRoll(h1 + h2, p1 + p2, r1 + r2)
                    var q1 = Cesium.Transforms.headingPitchRollQuaternion(center, hpr)
                    let tempM = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
                    tempM = Cesium.Matrix4.fromTranslationQuaternionRotationScale(origin, rotation,)
                    // let tempM = modelMatrix;
                    // tempM = modelMatrix
                    // Cesium.Matrix4.multiply(tempM, ccccc, tempM);
                    Cesium.Matrix4.multiply(tempM, m4, tempM);
                    Cesium.Matrix4.multiply(modelMatrix, tempM, modelMatrix);
                    // Cesium.Matrix4.multiply(modelMatrix, m4, modelMatrix);
                    // Cesium.Matrix4.multiply(tempM, tempM, tempM);
                    // Cesium.Matrix4.multiply(tempM, tempM, tempM);
                    // let tempM = Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(origin), new Cesium.Cartesian3(0, 0, Cesium.Ellipsoid.WGS84.maximumRadius), new Cesium.Matrix4)
                    // let tempM = Cesium.Transforms.headingPitchRollToFixedFrame(origin, new Cesium.HeadingPitchRoll(0,  -Math.PI / 2, 0))

                    // Cesium.Matrix4.multiply(tempM, Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(90))), tempM)
                    //  Cesium.Matrix4.multiply(tempM, Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(90))), tempM)
                    //  Cesium.Matrix4.multiply(tempM, Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(90))), tempM)
                    radarInteraction.modelMatrix = modelMatrix;
                    // radarInteraction.modelMatrix = tempM
                    // console.log(radarInteraction)
                    // // return
                    // if (radarInteraction.geometryInstances){
                    //     console.log(radarInteraction.geometryInstances)
                    //     radarInteraction.geometryInstances[0].modelMatrix = modelMatrix
                    // }
                    // console.log(tempRadarInteraction.modelMatrix)
                    // new Cesium.GeometryInstance({geometry: n, modelMatrix: r});
                    // radarInteraction.modelMatrix = modelMatrix
                }
            }
        }
        viewer.scene.preUpdate.addEventListener(fun)
        radarInteraction.removeEventListener = () => {
            viewer.scene.preUpdate.removeEventListener(fun)
        }
        radarInteraction.id = data.id;

        // customSensor.show = viewer.scene.mode == 3
        // customSensor.showThroughEllipsoid = true
        entity = viewer.scene.primitives.add(radarInteraction);
        return entity
    },
    //entities方式添加点、labels
    drawPoints(viewer, points) {
        if (Array.isArray(points)) {
            points.forEach(point => {
                viewer.entities.add({
                    id: point.id,
                    position: Cesium.Cartesian3.fromDegrees(point.lonlat[0], point.lonlat[1]),
                    point: {
                        pixelSize: 10,
                        color: Cesium.Color.YELLOW,
                        outlineColor: Cesium.Color.fromCssColorString("#f10808"),
                        outlineWidth: 1,
                    },
                    label: {
                        text: point.name + '\n' + "经度：" + point.lonlat[0] + '\n' + "纬度：" + point.lonlat[1],
                        font: "16px SimHei ",
                        scale: 0.8,
                        style: Cesium.LabelStyle.FILL,
                        outlineWidth: 2,
                        fillColor: Cesium.Color.fromCssColorString("rgb(52,241,22)"),
                        outlineColor: Cesium.Color.fromCssColorString("rgb(243,23,49)"),
                        pixelOffset: new Cesium.Cartesian2(0, 10),
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.TOP, //BOTTOM
                        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
                    },
                });
            });
        }
    },
    //primitives方式添加点、label
    drawPrimitivesPoints(viewer, points) {
        if (Array.isArray(points)) {
            points.forEach(point => {
                let selpoints = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
                selpoints.add({
                    id: point.id,
                    position: Cesium.Cartesian3.fromDegrees(point.lonlat[0], point.lonlat[1]),
                    color: Cesium.Color.YELLOW,
                    outlineColor: Cesium.Color.fromCssColorString("#f10808"),
                    outlineWidth: 1,
                });
                let sellabels = viewer.scene.primitives.add(new Cesium.LabelCollection());
                sellabels.add({
                    position: Cesium.Cartesian3.fromDegrees(point.lonlat[0], point.lonlat[1]),
                    text: point.name + '\n' + "经度：" + point.lonlat[0] + '\n' + "纬度：" + point.lonlat[1],
                    font: "16px SimHei ",
                    scale: 0.8,
                    style: Cesium.LabelStyle.FILL,
                    outlineWidth: 2,
                    fillColor: Cesium.Color.fromCssColorString("rgb(52,241,22)"),
                    outlineColor: Cesium.Color.fromCssColorString("rgb(243,23,49)"),
                    pixelOffset: new Cesium.Cartesian2(0, 10),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.TOP, //BOTTOM
                    scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
                });
            });
        }
    },
    // 绘制四棱投影，效果差
    drawShadow: function (viewer, entity, id, showEntity, viewAngles, time) {
        let TimeInterval = null
        if (time) {
            TimeInterval = new Cesium.TimeIntervalCollection([
                new Cesium.TimeInterval({
                    start: time.start,
                    stop: time.stop
                })
            ])
        }
        let viewAngle = 30;//视场角
        if (viewAngles) viewAngle = viewAngles;
        if (showEntity == null) {
            showEntity = false;
        }
        let currentTime = viewer.clock.currentTime;
        let cartesian = entity.position.getValue(currentTime);
        if (!cartesian || !cartesian.x || !cartesian.y) {
            return;
        }
        let ellipsoid = viewer.scene.globe.ellipsoid;
        let cartographic = ellipsoid.cartesianToCartographic(cartesian);
        let pos = {
            lon: cartographic.longitude,
            lat: cartographic.latitude,
            alt: cartographic.height
        };
        if (!pos.alt) {
            pos.alt = 0
        } else {
            pos.alt = Number(pos.alt.toFixed(3));
        }
        pos.lon = Number(Cesium.Math.toDegrees(pos.lon).toFixed(3));
        pos.lat = Number(Cesium.Math.toDegrees(pos.lat).toFixed(3));

        let position = new Cesium.CallbackProperty(function (time, result) {
            if (entity.position.getValue(time)) {
                let sourpos = entity.position.getValue(time);
                let cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(sourpos);
                let lon1 = Cesium.Math.toDegrees(cartographic1.longitude);
                let lat1 = Cesium.Math.toDegrees(cartographic1.latitude);
                let height1 = cartographic1.height;
                return Cesium.Cartesian3.fromDegrees(lon1, lat1, height1);
            }
        }, false)
        let alt = pos.alt * 2.5;
        let enti = viewer.entities.add({
            name: '视椎体',
            position: position,
            orientation: Cesium.Transforms.headingPitchRollQuaternion(
                Cesium.Cartesian3.fromDegrees(pos.lon, pos.lat, pos.alt),
                Cesium.HeadingPitchRoll.fromDegrees(0, -90, 0)
            ),
            id: id,
            availability: TimeInterval,
            ellipsoid: {
                radii: new Cesium.Cartesian3(alt, alt, alt),
                innerRadii: new Cesium.Cartesian3(0.001, 0.001, 0.001),
                minimumClock: Cesium.Math.toRadians(-viewAngle),
                maximumClock: Cesium.Math.toRadians(viewAngle),
                minimumCone: Cesium.Math.toRadians(viewAngle + 90),
                maximumCone: Cesium.Math.toRadians(90 - viewAngle),
                material: new Cesium.ColorMaterialProperty(Cesium.Color.BLUE.withAlpha(0.4)),
                outline: false,
                subdivisions: 256,
                stackPartitions: 64,
                slicePartitions: 64,
            },
            show: showEntity,
        });
        return enti;
    },
    //  电子，绘制圆锥仅适合无俯仰和测摆
    drawCone: function (viewer, entity, id, showEntity, time) {
        let TimeInterval = null
        if (time) {
            TimeInterval = new Cesium.TimeIntervalCollection([
                new Cesium.TimeInterval({
                    start: time.start,
                    stop: time.stop
                })
            ])
        }
        let currentTime = viewer.clock.currentTime;
        let cartesian = entity.position.getValue(currentTime);
        if (!cartesian || !cartesian.x || !cartesian.y) {
            return;
        }

        let position = new Cesium.CallbackProperty(function (time, result) {
            if (entity.position.getValue(time)) {
                let sourpos = entity.position.getValue(time);
                let cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(sourpos);
                let lon1 = Cesium.Math.toDegrees(cartographic1.longitude);
                let lat1 = Cesium.Math.toDegrees(cartographic1.latitude);
                let height1 = cartographic1.height;
                return Cesium.Cartesian3.fromDegrees(lon1, lat1, height1 / 2);

            }
        }, false);
        let height = new Cesium.CallbackProperty(function (time, result) {
            if (entity.position.getValue(time)) {
                let sourpos = entity.position.getValue(time);
                let cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(sourpos);
                let height1 = cartographic1.height;
                return height1
            }
        }, false);
        let enti = viewer.entities.add({
            name: '圆锥体',
            position: position,
            id: id,
            availability: TimeInterval,
            cylinder: {
                HeightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                length: height,
                topRadius: 0,
                bottomRadius: 500000,//幅宽
                material: Cesium.Color.RED.withAlpha(0.4),
                outline: !0,
                numberOfVerticalLines: 0,
                outlineColor: Cesium.Color.RED.withAlpha(0.4)
            },
            show: showEntity,
        });
        return enti;
    },
    // 绘制投影
    getPosStrs: function (viewer, entity, color, pose) {
        if (utils.getObjById(entity._id + 'cylinder')) {
            let tarEntity = utils.getObjById(entity._id + 'cylinder');
            viewer.entities.remove(tarEntity)
        } else {
            let currentTime = viewer.clock.currentTime;
            let cartesian = entity.position.getValue(currentTime);
            if (!cartesian || !cartesian.x || !cartesian.y) {
                return;
            }
            let ellipsoid = viewer.scene.globe.ellipsoid;
            let cartographic = ellipsoid.cartesianToCartographic(cartesian);
            let pos = {
                lon: cartographic.longitude,
                lat: cartographic.latitude,
                alt: cartographic.height
            };
            if (!pos.alt) {
                pos.alt = "";
            } else {
                pos.alt = Number(pos.alt.toFixed(3));
            }
            pos.lon = Number(Cesium.Math.toDegrees(pos.lon).toFixed(3));
            pos.lat = Number(Cesium.Math.toDegrees(pos.lat).toFixed(3));
            // let position = Cesium.Cartesian3.fromDegrees(pos.lon, pos.lat, pos.alt);

            let position = new Cesium.CallbackProperty(function (time, result) {
                if (entity.position.getValue(time)) {
                    let sourpos = entity.position.getValue(time);
                    let cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(sourpos);
                    let lon1 = Cesium.Math.toDegrees(cartographic1.longitude);
                    let lat1 = Cesium.Math.toDegrees(cartographic1.latitude);
                    let height1 = cartographic1.height;
                    return Cesium.Cartesian3.fromDegrees(lon1, lat1, height1);

                }
            }, false);
            let orientation = new Cesium.CallbackProperty((time) => {
                let currentCartesian = entity.position.getValue(time);
                if (!currentCartesian || !currentCartesian.x || !currentCartesian.y) {
                    return;
                }
                // debugger
                return Cesium.Transforms.headingPitchRollQuaternion(
                    currentCartesian,
                    new Cesium.HeadingPitchRoll(
                        Cesium.Math.toRadians(0),
                        Cesium.Math.toRadians(-90),
                        Cesium.Math.toRadians(0)
                    )
                );
            })
            if (pose) {
                orientation = new Cesium.CallbackProperty((time) => {
                    let currentCartesian = entity.position.getValue(time);
                    if (!currentCartesian || !currentCartesian.x || !currentCartesian.y) {
                        return;
                    }
                    return Cesium.Transforms.headingPitchRollQuaternion(
                        currentCartesian,
                        new Cesium.HeadingPitchRoll(
                            Cesium.Math.toRadians(pose.pitchAngle),
                            Cesium.Math.toRadians(pose.rollAngle - 90),
                            Cesium.Math.toRadians(pose.yawAngle)
                        )
                    );
                })
            }

            let enti = viewer.entities.add({
                name: '视椎体',
                position: position,
                orientation: orientation,
                ellipsoid: {
                    radii: new Cesium.Cartesian3(pos.alt * 2, pos.alt * 2, pos.alt * 2),
                    innerRadii: new Cesium.Cartesian3(100.0, 100.0, 100.0),
                    minimumClock: Cesium.Math.toRadians(-15.0),
                    maximumClock: Cesium.Math.toRadians(15.0),
                    minimumCone: Cesium.Math.toRadians(75.0),
                    maximumCone: Cesium.Math.toRadians(105.0),
                    material: new Cesium.ColorMaterialProperty(Cesium.Color.RED.withAlpha(0.5)),
                    outline: false
                }
                // position: Cesium.Cartesian3.fromDegrees(pos.lon, pos.lat, pos.alt / 2),
                // cylinder: {
                // 	length: pos.alt,
                // 	topRadius: 0.0,
                // 	bottomRadius: pos.alt / 3,
                // 	material: material,
                // 	outline: !0,
                // 	numberOfVerticalLines: 0,
                // 	outlineColor: Cesium.Color.RED.withAlpha(.2)
                // }
            });
            // 姿态

            // let timer = setTimeout(function () {
            //     viewer.entities.remove(enti)
            //     clearTimeout(enti)
            // }, 1000)
        }
    },
}
window.utils = utils;
export default {
    install(Vue, options) {
        Vue.prototype.utils = utils;
    }
};
