
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
            vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));\n\
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
            vec4 colorImage = texture+(image, vec2(fract(st.s - time), st.t));\n\
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
        }
        material = new Cesium.PolylineTrailLinkMaterialProperty3(Cesium.Color.GREEN, 700);


        let entity = viewer.entities.add({
            availability: TimeInterval,
            id: lineId,
            show: showEntity,
            polyline: {
                positions: new Cesium.CallbackProperty(function (time, result) {
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
                material: material,

            }
        })
        return entity
    },

//画矩形的方法
    moveRectangleEntity(viewer, id, long, width, satellite, roll, pitch, datas) { // 场景，卫星实体,视场角
        return
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
        return
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
    moveEntity(viewer, type, satellite, data) {
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

                let posData = this.setPos(viewer, satellite, 5);
                let modelMatrix = satellite.computeModelMatrix(time);

                // let css = self.getObjById("CSS", viewer);
                // let csspositon = self.getEntityPos(css, time);
                // let rp = self.getRollAndPitch(csspositon, tepPosition)
                if (typeof (modelMatrix) == 'object') {
                    Cesium.Matrix4.multiply(modelMatrix, Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(-180))), modelMatrix)
                    customSensor.modelMatrix = modelMatrix
                }
            }
        }
        viewer.scene.preRender.addEventListener(fun)
        customSensor.removeEventListener = () => {
            viewer.scene.preRender.removeEventListener(fun)
        }
        customSensor.id = data.id;
        customSensor.radius = alt;
        customSensor.directions = directions;

        customSensor._directionsDirty = true

        customSensor.showThroughEllipsoid = false

        entity = viewer.scene.primitives.add(customSensor);

        // entity.intersectionColor.red = 0.2;
        entity.lateralSurfaceMaterial.uniforms.color = color;
        return entity
    },
    getHeading(pointA, pointB) {
        //建立以点A为原点，X轴为east,Y轴为north,Z轴朝上的坐标系
        const transform = Cesium.Transforms.eastNorthUpToFixedFrame(pointA);
        //向量AB
        const positionvector = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3());
        //因transform是将A为原点的eastNorthUp坐标系中的点转换到世界坐标系的矩阵
        //AB为世界坐标中的向量
        //因此将AB向量转换为A原点坐标系中的向量，需乘以transform的逆矩阵。
        const vector = Cesium.Matrix4.multiplyByPointAsVector(Cesium.Matrix4.inverse(transform, new Cesium.Matrix4()), positionvector, new Cesium.Cartesian3());
        //归一化
        const direction = Cesium.Cartesian3.normalize(vector, new Cesium.Cartesian3());
        //heading
        const heading = Math.atan2(direction.y, direction.x) - Cesium.Math.PI_OVER_TWO;
        return Cesium.Math.TWO_PI - Cesium.Math.zeroToTwoPi(heading);
    },

    getPitch(pointA, pointB) {
        let transfrom = Cesium.Transforms.eastNorthUpToFixedFrame(pointA);
        const vector = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3());
        let direction = Cesium.Matrix4.multiplyByPointAsVector(Cesium.Matrix4.inverse(transfrom, transfrom), vector, vector);
        Cesium.Cartesian3.normalize(direction, direction);
        //因为direction已归一化，斜边长度等于1，所以余弦函数等于direction.z
        return Cesium.Math.PI_OVER_TWO - Cesium.Math.acosClamped(direction.z);
    },
    getOrientation(pointA, pointB, startTime) {
        let property = new Cesium.SampledPositionProperty();
        let stime = Cesium.JulianDate.addSeconds(
            startTime,
            0,
            new Cesium.JulianDate()
        );
        property.addSample(stime, pointA);
        let time = Cesium.JulianDate.addSeconds(
            startTime,
            1,
            new Cesium.JulianDate()
        );
        let time2 = Cesium.JulianDate.addSeconds(
            startTime,
            0.5,
            new Cesium.JulianDate()
        );
        property.addSample(time, pointB);
        let pos = Cesium.HeadingPitchRoll.fromQuaternion(new Cesium.VelocityOrientationProperty(property).getValue(time2))
        return pos
    },
    //顶点经纬度
    changeOrientation(pointA, pointB) {
        //计算经度方向的夹角
        let startPt = Cesium.Cartographic.fromDegrees(pointA.lon, pointA.lat, pointA.alt);
        let endX = Cesium.Cartographic.fromDegrees(pointB.lon, pointB.lat, pointB.alt);
        let halfLen = 100000.0
        let geoD = new Cesium.EllipsoidGeodesic();
        geoD.setEndPoints(startPt, endX);
        let innerS = geoD.surfaceDistance;
        let angleX = Math.atan(innerS / halfLen);
        let length = Math.sqrt(innerS * innerS + halfLen * halfLen);
        let angleY = Math.asin(innerS / length);

        //计算朝向
        let hpr = new Cesium.HeadingPitchRoll(0.0, angleX, angleY);

        let orientation = Cesium.Transforms.headingPitchRollQuaternion(Cesium.Cartesian3.fromDegrees(pointA.lon, pointA.lat, pointA.alt), hpr);
        return [orientation, length]
    },
    getModelMatrix(pointA, pointB) {
        //向量AB
        const vector2 = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3());
        //归一化
        const normal = Cesium.Cartesian3.normalize(vector2, new Cesium.Cartesian3());
        //旋转矩阵 rotationMatrixFromPositionVelocity源码中有，并未出现在cesiumAPI中
        const rotationMatrix3 = Cesium.Transforms.rotationMatrixFromPositionVelocity(pointA, normal, Cesium.Ellipsoid.WGS84);
        const orientation = Cesium.Quaternion.fromRotationMatrix(rotationMatrix3);
        const modelMatrix4 = Cesium.Matrix4.fromRotationTranslation(rotationMatrix3, pointA);
        //点B的模型矩阵
        //const modelMatrix4 = Cesium.Matrix4.fromRotationTranslation(rotationMatrix3, pointB);
        const hpr = Cesium.HeadingPitchRoll.fromQuaternion(orientation);
        return hpr;
    },
    //添加雷达干扰
    addRadarInteraction(viewer, lineId, entity1, entity2, showEntity, showMaterial2, times, material, colortype){

        // mars3d.Map也可以直接传入外部已经构造好的viewer, 支持config.json所有参数
        // const map = new mars3d.Map(viewer)

        const coneTrack = new mars3d.graphic.ConeTrack({
            position: entity1.position,
            targetPosition: entity2.position,
            style: {
                // length: 4000, //targetPosition存在时无需传
                angle: 3, // 半场角度
                // 自定义扩散波纹纹理
                materialType: mars3d.MaterialType.CylinderWave,
                materialOptions: {
                    color: "#ff0000",
                    repeat: 30.0,
                    thickness: 0.2
                }
            }
        })


return coneTrack

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
        }
        // material = new Cesium.PolylineTrailLinkMaterialProperty3(Cesium.Color.GREEN, 700);


        let entity = viewer.entities.add({
            availability: TimeInterval,
            id: lineId,
            show: showEntity,
            polyline: {
                positions: new Cesium.CallbackProperty(function (time, result) {
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
                width: 20,
                material: material,

            }
        })
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
                material: new Cesium.Color(51 / 255, 255 / 255, 255 / 255, 0.2),
                outline: !0,
                numberOfVerticalLines: 0,
                outlineColor: new Cesium.Color(51 / 255, 255 / 255, 255 / 255, 0.2)
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
