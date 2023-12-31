/**
 * Cesium Sensors - https://github.com/AnalyticalGraphicsInc/cesium-sensors
 *
 * Copyright 2011-2014 Analytical Graphics Inc. and Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Portions licensed separately.
 * See https://github.com/AnalyticalGraphicsInc/cesium-sensors/blob/master/LICENSE.md for full licensing details.
 */

/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

/* eslint-disable */

!function () {
    var e, i, t;
    !function (r) {
        function o(e, i) {
            return S.call(e, i)
        }

        function n(e, i) {
            var t, r, o, n, s, a, u, l, c, h, d, m = i && i.split("/"), C = g.map, f = C && C["*"] || {};
            if (e && "." === e.charAt(0)) if (i) {
                for (m = m.slice(0, m.length - 1), e = e.split("/"), s = e.length - 1, g.nodeIdCompat && w.test(e[s]) && (e[s] = e[s].replace(w, "")), e = m.concat(e), c = 0; c < e.length; c += 1) if (d = e[c], "." === d) e.splice(c, 1), c -= 1; else if (".." === d) {
                    if (1 === c && (".." === e[2] || ".." === e[0])) break;
                    c > 0 && (e.splice(c - 1, 2), c -= 2)
                }
                e = e.join("/")
            } else 0 === e.indexOf("./") && (e = e.substring(2));
            if ((m || f) && C) {
                for (t = e.split("/"), c = t.length; c > 0; c -= 1) {
                    if (r = t.slice(0, c).join("/"), m) for (h = m.length; h > 0; h -= 1) if (o = C[m.slice(0, h).join("/")], o && (o = o[r])) {
                        n = o, a = c;
                        break
                    }
                    if (n) break;
                    !u && f && f[r] && (u = f[r], l = c)
                }
                !n && u && (n = u, a = l), n && (t.splice(0, a, n), e = t.join("/"))
            }
            return e
        }

        function s(e, i) {
            return function () {
                return m.apply(r, y.call(arguments, 0).concat([e, i]))
            }
        }

        function a(e) {
            return function (i) {
                return n(i, e)
            }
        }

        function u(e) {
            return function (i) {
                p[e] = i
            }
        }

        function l(e) {
            if (o(_, e)) {
                var i = _[e];
                delete _[e], v[e] = !0, d.apply(r, i)
            }
            if (!o(p, e) && !o(v, e)) throw new Error("No " + e);
            return p[e]
        }

        function c(e) {
            var i, t = e ? e.indexOf("!") : -1;
            return t > -1 && (i = e.substring(0, t), e = e.substring(t + 1, e.length)), [i, e]
        }

        function h(e) {
            return function () {
                return g && g.config && g.config[e] || {}
            }
        }

        var d, m, C, f, p = {}, _ = {}, g = {}, v = {}, S = Object.prototype.hasOwnProperty, y = [].slice, w = /\.js$/;
        C = function (e, i) {
            var t, r = c(e), o = r[0];
            return e = r[1], o && (o = n(o, i), t = l(o)), o ? e = t && t.normalize ? t.normalize(e, a(i)) : n(e, i) : (e = n(e, i), r = c(e), o = r[0], e = r[1], o && (t = l(o))), {
                f: o ? o + "!" + e : e,
                n: e,
                pr: o,
                p: t
            }
        }, f = {
            require: function (e) {
                return s(e)
            }, exports: function (e) {
                var i = p[e];
                return "undefined" != typeof i ? i : p[e] = {}
            }, module: function (e) {
                return {id: e, uri: "", exports: p[e], config: h(e)}
            }
        }, d = function (e, i, t, n) {
            var a, c, h, d, m, g, S = [], y = typeof t;
            if (n = n || e, "undefined" === y || "function" === y) {
                for (i = !i.length && t.length ? ["require", "exports", "module"] : i, m = 0; m < i.length; m += 1) if (d = C(i[m], n), c = d.f, "require" === c) S[m] = f.require(e); else if ("exports" === c) S[m] = f.exports(e), g = !0; else if ("module" === c) a = S[m] = f.module(e); else if (o(p, c) || o(_, c) || o(v, c)) S[m] = l(c); else {
                    if (!d.p) throw new Error(e + " missing " + c);
                    d.p.load(d.n, s(n, !0), u(c), {}), S[m] = p[c]
                }
                h = t ? t.apply(p[e], S) : void 0, e && (a && a.exports !== r && a.exports !== p[e] ? p[e] = a.exports : h === r && g || (p[e] = h))
            } else e && (p[e] = t)
        }, e = i = m = function (e, i, t, o, n) {
            if ("string" == typeof e) return f[e] ? f[e](i) : l(C(e, i).f);
            if (!e.splice) {
                if (g = e, g.deps && m(g.deps, g.callback), !i) return;
                i.splice ? (e = i, i = t, t = null) : e = r
            }
            return i = i || function () {
            }, "function" == typeof t && (t = o, o = n), o ? d(r, e, i, t) : setTimeout(function () {
                d(r, e, i, t)
            }, 4), m
        }, m.config = function (e) {
            return m(e)
        }, e._defined = p, t = function (e, i, t) {
            i.splice || (t = i, i = []), o(p, e) || o(_, e) || (_[e] = [e, i, t])
        }, t.amd = {jQuery: !0}
    }(), t("ConicSensorGraphics", ["Cesium/Core/defaultValue", "Cesium/Core/defined", "Cesium/Core/DeveloperError", "Cesium/Core/Event", "Cesium/DataSources/createMaterialPropertyDescriptor", "Cesium/DataSources/createPropertyDescriptor"], function (e, i, t, r, o, n) {
        "use strict";
        var s = function (i) {
            this._minimumClockAngle = void 0, this._minimumClockAngleSubscription = void 0, this._maximumClockAngle = void 0, this._maximumClockAngleSubscription = void 0, this._innerHalfAngle = void 0, this._innerHalfAngleSubscription = void 0, this._outerHalfAngle = void 0, this._outerHalfAngleSubscription = void 0, this._lateralSurfaceMaterial = void 0, this._lateralSurfaceMaterialSubscription = void 0, this._intersectionColor = void 0, this._intersectionColorSubscription = void 0, this._intersectionWidth = void 0, this._intersectionWidthSubscription = void 0, this._showIntersection = void 0, this._showIntersectionSubscription = void 0, this._radius = void 0, this._radiusSubscription = void 0, this._show = void 0, this._showSubscription = void 0, this._definitionChanged = new r, this.merge(e(i, e.EMPTY_OBJECT))
        };
        return Object.defineProperties(s.prototype, {
            definitionChanged: {
                get: function () {
                    return this._definitionChanged
                }
            },
            minimumClockAngle: n("minimumClockAngle"),
            maximumClockAngle: n("maximumClockAngle"),
            innerHalfAngle: n("innerHalfAngle"),
            outerHalfAngle: n("outerHalfAngle"),
            lateralSurfaceMaterial: o("lateralSurfaceMaterial"),
            intersectionColor: n("intersectionColor"),
            intersectionWidth: n("intersectionWidth"),
            showIntersection: n("showIntersection"),
            radius: n("radius"),
            show: n("show")
        }), s.prototype.clone = function (e) {
            return i(e) || (e = new s), e.show = this.show, e.innerHalfAngle = this.innerHalfAngle, e.outerHalfAngle = this.outerHalfAngle, e.minimumClockAngle = this.minimumClockAngle, e.maximumClockAngle = this.maximumClockAngle, e.radius = this.radius, e.showIntersection = this.showIntersection, e.intersectionColor = this.intersectionColor, e.intersectionWidth = this.intersectionWidth, e.lateralSurfaceMaterial = this.lateralSurfaceMaterial, e
        }, s.prototype.merge = function (i) {
            this.show = e(this.show, i.show), this.innerHalfAngle = e(this.innerHalfAngle, i.innerHalfAngle), this.outerHalfAngle = e(this.outerHalfAngle, i.outerHalfAngle), this.minimumClockAngle = e(this.minimumClockAngle, i.minimumClockAngle), this.maximumClockAngle = e(this.maximumClockAngle, i.maximumClockAngle), this.radius = e(this.radius, i.radius), this.showIntersection = e(this.showIntersection, i.showIntersection), this.intersectionColor = e(this.intersectionColor, i.intersectionColor), this.intersectionWidth = e(this.intersectionWidth, i.intersectionWidth), this.lateralSurfaceMaterial = e(this.lateralSurfaceMaterial, i.lateralSurfaceMaterial)
        }, s
    }), t("text", {
        load: function (e) {
            throw new Error("Dynamic load not allowed: " + e)
        }
    }), t("text!CustomSensorVolumeFS.glsl", [], function () {
        return "#ifdef GL_OES_standard_derivatives\n#extension GL_OES_standard_derivatives : enable\n#endif\nuniform bool u_showIntersection;\nuniform bool u_showThroughEllipsoid;\nuniform float u_sensorRadius;\nuniform float u_normalDirection;\nvarying vec3 v_positionWC;\nvarying vec3 v_positionEC;\nvarying vec3 v_normalEC;\nvec4 getColor(float sensorRadius, vec3 pointEC)\n{\nczm_materialInput materialInput;\nvec3 pointMC = (czm_inverseModelView * vec4(pointEC, 1.0)).xyz;\nmaterialInput.st = sensor2dTextureCoordinates(sensorRadius, pointMC);\nmaterialInput.str = pointMC / sensorRadius;\nvec3 positionToEyeEC = -v_positionEC;\nmaterialInput.positionToEyeEC = positionToEyeEC;\nvec3 normalEC = normalize(v_normalEC);\nmaterialInput.normalEC = u_normalDirection * normalEC;\nczm_material material = czm_getMaterial(materialInput);\nreturn mix(czm_phong(normalize(positionToEyeEC), material,czm_lightDirectionEC), vec4(material.diffuse, material.alpha), 0.4);\n}\nbool isOnBoundary(float value, float epsilon)\n{\nfloat width = getIntersectionWidth();\nfloat tolerance = width * epsilon;\n#ifdef GL_OES_standard_derivatives\nfloat delta = max(abs(dFdx(value)), abs(dFdy(value)));\nfloat pixels = width * delta;\nfloat temp = abs(value);\nreturn temp < tolerance && temp < pixels || (delta < 10.0 * tolerance && temp - delta < tolerance && temp < pixels);\n#else\nreturn abs(value) < tolerance;\n#endif\n}\nvec4 shade(bool isOnBoundary)\n{\nif (u_showIntersection && isOnBoundary)\n{\nreturn getIntersectionColor();\n}\nreturn getColor(u_sensorRadius, v_positionEC);\n}\nfloat ellipsoidSurfaceFunction(vec3 point)\n{\nvec3 scaled = czm_ellipsoidInverseRadii * point;\nreturn dot(scaled, scaled) - 1.0;\n}\nvoid main()\n{\nvec3 sensorVertexWC = czm_model[3].xyz;\nvec3 sensorVertexEC = czm_modelView[3].xyz;\nfloat ellipsoidValue = ellipsoidSurfaceFunction(v_positionWC);\nif (!u_showThroughEllipsoid)\n{\nif (ellipsoidValue < 0.0)\n{\ndiscard;\n}\nif (inSensorShadow(sensorVertexWC, v_positionWC))\n{\ndiscard;\n}\n}\nif (distance(v_positionEC, sensorVertexEC) > u_sensorRadius)\n{\ndiscard;\n}\nbool isOnEllipsoid = isOnBoundary(ellipsoidValue, czm_epsilon3);\ngl_FragColor = shade(isOnEllipsoid);\n}"
    }), t("text!CustomSensorVolumeVS.glsl", [], function () {
        return "attribute vec4 position;\nattribute vec3 normal;\nvarying vec3 v_positionWC;\nvarying vec3 v_positionEC;\nvarying vec3 v_normalEC;\nvoid main()\n{\ngl_Position = czm_modelViewProjection * position;\nv_positionWC = (czm_model * position).xyz;\nv_positionEC = (czm_modelView * position).xyz;\nv_normalEC = czm_normal * normal;\n}"
    }), t("text!SensorVolume.glsl", [], function () {
        return "uniform vec4 u_intersectionColor;\nuniform float u_intersectionWidth;\nbool inSensorShadow(vec3 coneVertexWC, vec3 pointWC)\n{\nvec3 D = czm_ellipsoidInverseRadii;\nvec3 q = D * coneVertexWC;\nfloat qMagnitudeSquared = dot(q, q);\nfloat test = qMagnitudeSquared - 1.0;\nvec3 temp = D * pointWC - q;\nfloat d = dot(temp, q);\nreturn (d < -test) && (d / length(temp) < -sqrt(test));\n}\nvec4 getIntersectionColor()\n{\nreturn u_intersectionColor;\n}\nfloat getIntersectionWidth()\n{\nreturn u_intersectionWidth;\n}\nvec2 sensor2dTextureCoordinates(float sensorRadius, vec3 pointMC)\n{\nfloat t = pointMC.z / sensorRadius;\nfloat s = 1.0 + (atan(pointMC.y, pointMC.x) / czm_twoPi);\ns = s - floor(s);\nreturn vec2(s, t);\n}"
    }), t("CustomSensorVolume", ["Cesium/Core/BoundingSphere", "Cesium/Core/Cartesian3", "Cesium/Core/Color", "Cesium/Core/combine", "Cesium/Core/ComponentDatatype", "Cesium/Core/defaultValue", "Cesium/Core/defined", "Cesium/Core/destroyObject", "Cesium/Core/DeveloperError", "Cesium/Core/Matrix4", "Cesium/Core/PrimitiveType", "Cesium/Renderer/Buffer", "Cesium/Renderer/BufferUsage", "Cesium/Renderer/ShaderSource", "Cesium/Renderer/DrawCommand", "Cesium/Renderer/RenderState", "Cesium/Renderer/ShaderProgram", "Cesium/Renderer/VertexArray", "text!./CustomSensorVolumeFS.glsl", "text!./CustomSensorVolumeVS.glsl", "text!./SensorVolume.glsl", "Cesium/Scene/BlendingState", "Cesium/Scene/CullFace", "Cesium/Scene/Material", "Cesium/Scene/Pass", "Cesium/Scene/SceneMode"], function (e, i, t, r, o, n, s, a, u, l, c, h, d, m, C, f, p, _, g, v, S, y, w, A, M, x) {
        "use strict";

        function E(t) {
            for (var r = t._directions, o = r.length, n = new Float32Array(3 * o), s = isFinite(t.radius) ? t.radius : I, a = [i.ZERO], u = o - 2, l = o - 1, c = 0; o > c; u = l++, l = c++) {
                var h = i.fromSpherical(r[u], T), d = i.fromSpherical(r[l], D), m = i.fromSpherical(r[c], k),
                    C = Math.max(i.angleBetween(h, d), i.angleBetween(d, m)), f = s / Math.cos(.5 * C),
                    p = i.multiplyByScalar(d, f, new i);
                n[3 * l] = p.x, n[3 * l + 1] = p.y, n[3 * l + 2] = p.z, a.push(p)
            }
            return e.fromPoints(a, t._boundingSphere), n
        }

        function b(e, t) {
            for (var r = E(e), n = e._directions.length, s = new Float32Array(18 * n), a = 0, u = n - 1, l = 0; n > l; u = l++) {
                var c = new i(r[3 * u], r[3 * u + 1], r[3 * u + 2]), m = new i(r[3 * l], r[3 * l + 1], r[3 * l + 2]),
                    C = i.normalize(i.cross(m, c, H), H);
                s[a++] = 0, s[a++] = 0, s[a++] = 0, s[a++] = C.x, s[a++] = C.y, s[a++] = C.z, s[a++] = m.x, s[a++] = m.y, s[a++] = m.z, s[a++] = C.x, s[a++] = C.y, s[a++] = C.z, s[a++] = c.x, s[a++] = c.y, s[a++] = c.z, s[a++] = C.x, s[a++] = C.y, s[a++] = C.z
            }
            var f = h.createVertexBuffer({context: t, typedArray: new Float32Array(s), usage: d.STATIC_DRAW}),
                p = 6 * Float32Array.BYTES_PER_ELEMENT, g = [{
                    index: P.position,
                    vertexBuffer: f,
                    componentsPerAttribute: 3,
                    componentDatatype: o.FLOAT,
                    offsetInBytes: 0,
                    strideInBytes: p
                }, {
                    index: P.normal,
                    vertexBuffer: f,
                    componentsPerAttribute: 3,
                    componentDatatype: o.FLOAT,
                    offsetInBytes: 3 * Float32Array.BYTES_PER_ELEMENT,
                    strideInBytes: p
                }];
            return new _({context: t, attributes: g})
        }

        var P = {position: 0, normal: 1}, I = 5906376272e3, V = function (i) {
            i = n(i, n.EMPTY_OBJECT), this._pickId = void 0, this._pickPrimitive = n(i._pickPrimitive, this), this._frontFaceColorCommand = new C, this._backFaceColorCommand = new C, this._pickCommand = new C, this._boundingSphere = new e, this._boundingSphereWC = new e, this._frontFaceColorCommand.primitiveType = c.TRIANGLES, this._frontFaceColorCommand.boundingVolume = this._boundingSphereWC, this._frontFaceColorCommand.owner = this, this._backFaceColorCommand.primitiveType = this._frontFaceColorCommand.primitiveType, this._backFaceColorCommand.boundingVolume = this._frontFaceColorCommand.boundingVolume, this._backFaceColorCommand.owner = this, this._pickCommand.primitiveType = this._frontFaceColorCommand.primitiveType, this._pickCommand.boundingVolume = this._frontFaceColorCommand.boundingVolume, this._pickCommand.owner = this, this.show = n(i.show, !0), this.showIntersection = n(i.showIntersection, !0), this.showThroughEllipsoid = n(i.showThroughEllipsoid, !1), this._showThroughEllipsoid = this.showThroughEllipsoid, this.modelMatrix = l.clone(n(i.modelMatrix, l.IDENTITY)), this._modelMatrix = new l, this.radius = n(i.radius, Number.POSITIVE_INFINITY), this._directions = void 0, this._directionsDirty = !1, this.directions = s(i.directions) ? i.directions : [], this.lateralSurfaceMaterial = s(i.lateralSurfaceMaterial) ? i.lateralSurfaceMaterial : A.fromType(A.ColorType), this._lateralSurfaceMaterial = void 0, this._translucent = void 0, this.intersectionColor = t.clone(n(i.intersectionColor, t.WHITE)), this.intersectionWidth = n(i.intersectionWidth, 5), this.id = i.id, this._id = void 0;
            var r = this;
            this._uniforms = {
                u_showThroughEllipsoid: function () {
                    return r.showThroughEllipsoid
                }, u_showIntersection: function () {
                    return r.showIntersection
                }, u_sensorRadius: function () {
                    return isFinite(r.radius) ? r.radius : I
                }, u_intersectionColor: function () {
                    return r.intersectionColor
                }, u_intersectionWidth: function () {
                    return r.intersectionWidth
                }, u_normalDirection: function () {
                    return 1
                }
            }, this._mode = x.SCENE3D
        };
        Object.defineProperties(V.prototype, {
            directions: {
                get: function () {
                    return this._directions
                }, set: function (e) {
                    this._directions = e, this._directionsDirty = !0
                }
            }
        });
        var T = new i, D = new i, k = new i, H = new i;
        return V.prototype.update = function (i) {
            if (this._mode = i.mode, this.show) {
                var t = i.context, o = i.commandList, n = this.lateralSurfaceMaterial.isTranslucent();
                if (this._showThroughEllipsoid !== this.showThroughEllipsoid || !s(this._frontFaceColorCommand.renderState) || this._translucent !== n) {
                    this._showThroughEllipsoid = this.showThroughEllipsoid, this._translucent = n;
                    var a;
                    n ? (a = f.fromCache({
                        depthTest: {enabled: !this.showThroughEllipsoid},
                        depthMask: !1,
                        blending: y.ALPHA_BLEND,
                        cull: {enabled: !0, face: w.BACK}
                    }), this._frontFaceColorCommand.renderState = a, this._frontFaceColorCommand.pass = M.TRANSLUCENT, a = f.fromCache({
                        depthTest: {enabled: !this.showThroughEllipsoid},
                        depthMask: !1,
                        blending: y.ALPHA_BLEND,
                        cull: {enabled: !0, face: w.FRONT}
                    }), this._backFaceColorCommand.renderState = a, this._backFaceColorCommand.pass = M.TRANSLUCENT, a = f.fromCache({
                        depthTest: {enabled: !this.showThroughEllipsoid},
                        depthMask: !1,
                        blending: y.ALPHA_BLEND
                    }), this._pickCommand.renderState = a) : (a = t.createRenderState({
                        depthTest: {enabled: !0},
                        depthMask: !0
                    }), this._frontFaceColorCommand.renderState = a, this._frontFaceColorCommand.pass = M.OPAQUE, a = f.fromCache({
                        depthTest: {enabled: !0},
                        depthMask: !0
                    }), this._pickCommand.renderState = a)
                }
                var u = this._directionsDirty;
                if (u) {
                    this._directionsDirty = !1, this._va = this._va && this._va.destroy();
                    var c = this._directions;
                    c && c.length >= 3 && (this._frontFaceColorCommand.vertexArray = b(this, t), this._backFaceColorCommand.vertexArray = this._frontFaceColorCommand.vertexArray, this._pickCommand.vertexArray = this._frontFaceColorCommand.vertexArray)
                }
                if (s(this._frontFaceColorCommand.vertexArray)) {
                    var h = i.passes, d = !l.equals(this.modelMatrix, this._modelMatrix);
                    d && l.clone(this.modelMatrix, this._modelMatrix), (u || d) && e.transform(this._boundingSphere, this.modelMatrix, this._boundingSphereWC), this._frontFaceColorCommand.modelMatrix = this.modelMatrix, this._backFaceColorCommand.modelMatrix = this._frontFaceColorCommand.modelMatrix, this._pickCommand.modelMatrix = this._frontFaceColorCommand.modelMatrix;
                    var C = this._lateralSurfaceMaterial !== this.lateralSurfaceMaterial;
                    if (this._lateralSurfaceMaterial = this.lateralSurfaceMaterial, this._lateralSurfaceMaterial.update(t), h.render) {
                        var _ = this._frontFaceColorCommand, A = this._backFaceColorCommand;
                        if (C || !s(_.shaderProgram)) {
                            var E = new m({sources: [S, this._lateralSurfaceMaterial.shaderSource, g]});
                            _.shaderProgram = p.replaceCache({
                                context: t,
                                shaderProgram: _.shaderProgram,
                                vertexShaderSource: v,
                                fragmentShaderSource: E,
                                attributeLocations: P
                            }), _.uniformMap = r(this._uniforms, this._lateralSurfaceMaterial._uniforms), A.shaderProgram = _.shaderProgram, A.uniformMap = r(this._uniforms, this._lateralSurfaceMaterial._uniforms), A.uniformMap.u_normalDirection = function () {
                                return -1
                            }
                        }
                        n ? o.push(this._backFaceColorCommand, this._frontFaceColorCommand) : o.push(this._frontFaceColorCommand)
                    }
                    if (h.pick) {
                        var I = this._pickCommand;
                        if (s(this._pickId) && this._id === this.id || (this._id = this.id, this._pickId = this._pickId && this._pickId.destroy(), this._pickId = t.createPickId({
                            primitive: this._pickPrimitive,
                            id: this.id
                        })), C || !s(I.shaderProgram)) {
                            var V = new m({
                                sources: [S, this._lateralSurfaceMaterial.shaderSource, g],
                                pickColorQualifier: "uniform"
                            });
                            I.shaderProgram = p.replaceCache({
                                context: t,
                                shaderProgram: I.shaderProgram,
                                vertexShaderSource: v,
                                fragmentShaderSource: V,
                                attributeLocations: P
                            });
                            var T = this, D = {
                                czm_pickColor: function () {
                                    return T._pickId.color
                                }
                            };
                            I.uniformMap = r(r(this._uniforms, this._lateralSurfaceMaterial._uniforms), D)
                        }
                        I.pass = n ? M.TRANSLUCENT : M.OPAQUE, o.push(I)
                    }
                }
            }
        }, V.prototype.isDestroyed = function () {
            return !1
        }, V.prototype.destroy = function () {
            return this._frontFaceColorCommand.vertexArray = this._frontFaceColorCommand.vertexArray && this._frontFaceColorCommand.vertexArray.destroy(), this._frontFaceColorCommand.shaderProgram = this._frontFaceColorCommand.shaderProgram && this._frontFaceColorCommand.shaderProgram.destroy(), this._pickCommand.shaderProgram = this._pickCommand.shaderProgram && this._pickCommand.shaderProgram.destroy(), this._pickId = this._pickId && this._pickId.destroy(), a(this)
        }, V
    }), t("ConicSensorVisualizer", ["Cesium/Core/AssociativeArray", "Cesium/Core/Cartesian3", "Cesium/Core/Color", "Cesium/Core/defined", "Cesium/Core/destroyObject", "Cesium/Core/DeveloperError", "Cesium/Core/Math", "Cesium/Core/Matrix3", "Cesium/Core/Matrix4", "Cesium/Core/Quaternion", "Cesium/Core/Spherical", "./CustomSensorVolume", "Cesium/DataSources/MaterialProperty", "Cesium/DataSources/Property"], function (e, i, t, r, o, n, s, a, u, l, c, h, d, m) {
        "use strict";

        function C(e, i, t, o) {
            var n = i[e];
            r(n) || (i[e] = n = new c), n.clock = t, n.cone = o, n.magnitude = 1
        }

        function f(e, i, t, r, o) {
            var n, a = e.directions, u = 0, l = s.toRadians(2);
            if (0 === i && t === s.TWO_PI) for (n = 0; n < s.TWO_PI; n += l) C(u++, a, n, o); else {
                for (n = i; t > n; n += l) C(u++, a, n, o);
                if (C(u++, a, t, o), r) {
                    for (n = t; n > i; n -= l) C(u++, a, n, r);
                    C(u++, a, i, r)
                } else C(u++, a, t, 0)
            }
            a.length = u, e.directions = a
        }

        function p(e, i, t) {
            var o = i[e.id];
            if (r(o)) {
                var n = o.primitive;
                t.remove(n), n.isDestroyed() || n.destroy(), delete i[e.id]
            }
        }

        var _ = t.WHITE, g = 1, v = Number.POSITIVE_INFINITY, S = new a, y = new i, w = new l, A = function (i, t) {
            t.collectionChanged.addEventListener(A.prototype._onCollectionChanged, this), this._scene = i, this._primitives = i.primitives, this._entityCollection = t, this._hash = {}, this._entitiesToVisualize = new e, this._onCollectionChanged(t, t.values, [], [])
        };
        return A.prototype.update = function (e) {
            for (var t = this._entitiesToVisualize.values, o = this._hash, n = this._primitives, c = 0, C = t.length; C > c; c++) {
                var p, A, M = t[c], x = M._conicSensor, E = o[M.id],
                    b = M.isShowing && M.isAvailable(e) && m.getValueOrDefault(x._show, e, !0);
                if (b && (p = m.getValueOrUndefined(M._position, e, y), A = m.getValueOrUndefined(M._orientation, e, w), b = r(p) && r(A)), b) {
                    var P = r(E) ? E.primitive : void 0;
                    r(P) || (P = new h, P.id = M, n.add(P), E = {
                        primitive: P,
                        position: void 0,
                        orientation: void 0,
                        minimumClockAngle: void 0,
                        maximumClockAngle: void 0,
                        innerHalfAngle: void 0,
                        outerHalfAngle: void 0
                    }, o[M.id] = E), i.equals(p, E.position) && l.equals(A, E.orientation) || (u.fromRotationTranslation(a.fromQuaternion(A, S), p, P.modelMatrix), E.position = i.clone(p, E.position), E.orientation = l.clone(A, E.orientation)), P.show = !0;
                    var I = m.getValueOrDefault(x._minimumClockAngle, e, 0),
                        V = m.getValueOrDefault(x._maximumClockAngle, e, s.TWO_PI),
                        T = m.getValueOrDefault(x._innerHalfAngle, e, 0),
                        D = m.getValueOrDefault(x._outerHalfAngle, e, Math.PI);
                    (I !== E.minimumClockAngle || V !== E.maximumClockAngle || T !== E.innerHalfAngle || D !== E.outerHalfAngle) && (f(P, I, V, T, D), E.innerHalfAngle = T, E.maximumClockAngle = V, E.outerHalfAngle = D, E.minimumClockAngle = I), P.radius = m.getValueOrDefault(x._radius, e, v), P.lateralSurfaceMaterial = d.getValue(e, x._lateralSurfaceMaterial, P.lateralSurfaceMaterial), P.intersectionColor = m.getValueOrClonedDefault(x._intersectionColor, e, _, P.intersectionColor), P.intersectionWidth = m.getValueOrDefault(x._intersectionWidth, e, g)
                } else r(E) && (E.primitive.show = !1)
            }
            return !0
        }, A.prototype.isDestroyed = function () {
            return !1
        }, A.prototype.destroy = function () {
            for (var e = this._entitiesToVisualize.values, i = this._hash, t = this._primitives, r = e.length - 1; r > -1; r--) p(e[r], i, t);
            return o(this)
        }, A.prototype._onCollectionChanged = function (e, i, t, o) {
            var n, s, a = this._entitiesToVisualize, u = this._hash, l = this._primitives;
            for (n = i.length - 1; n > -1; n--) s = i[n], r(s._conicSensor) && r(s._position) && r(s._orientation) && a.set(s.id, s);
            for (n = o.length - 1; n > -1; n--) s = o[n], r(s._conicSensor) && r(s._position) && r(s._orientation) ? a.set(s.id, s) : (p(s, u, l), a.remove(s.id));
            for (n = t.length - 1; n > -1; n--) s = t[n], p(s, u, l), a.remove(s.id)
        }, A
    }), t("CustomPatternSensorGraphics", ["Cesium/Core/defaultValue", "Cesium/Core/defined", "Cesium/Core/DeveloperError", "Cesium/Core/Event", "Cesium/DataSources/createMaterialPropertyDescriptor", "Cesium/DataSources/createPropertyDescriptor"], function (e, i, t, r, o, n) {
        "use strict";
        var s = function (i) {
            this._directions = void 0, this._directionsSubscription = void 0, this._lateralSurfaceMaterial = void 0, this._lateralSurfaceMaterialSubscription = void 0, this._intersectionColor = void 0, this._intersectionColorSubscription = void 0, this._intersectionWidth = void 0, this._intersectionWidthSubscription = void 0, this._showIntersection = void 0, this._showIntersectionSubscription = void 0, this._radius = void 0, this._radiusSubscription = void 0, this._show = void 0, this._showSubscription = void 0, this._definitionChanged = new r, this.merge(e(i, e.EMPTY_OBJECT))
        };
        return Object.defineProperties(s.prototype, {
            definitionChanged: {
                get: function () {
                    return this._definitionChanged
                }
            },
            directions: n("directions"),
            lateralSurfaceMaterial: o("lateralSurfaceMaterial"),
            intersectionColor: n("intersectionColor"),
            intersectionWidth: n("intersectionWidth"),
            showIntersection: n("showIntersection"),
            radius: n("radius"),
            show: n("show")
        }), s.prototype.clone = function (e) {
            return i(e) || (e = new s), e.directions = this.directions, e.radius = this.radius, e.show = this.show, e.showIntersection = this.showIntersection, e.intersectionColor = this.intersectionColor, e.intersectionWidth = this.intersectionWidth, e.lateralSurfaceMaterial = this.lateralSurfaceMaterial, e
        }, s.prototype.merge = function (i) {
            this.directions = e(this.directions, i.directions), this.radius = e(this.radius, i.radius), this.show = e(this.show, i.show), this.showIntersection = e(this.showIntersection, i.showIntersection), this.intersectionColor = e(this.intersectionColor, i.intersectionColor), this.intersectionWidth = e(this.intersectionWidth, i.intersectionWidth), this.lateralSurfaceMaterial = e(this.lateralSurfaceMaterial, i.lateralSurfaceMaterial)
        }, s
    }), t("CustomPatternSensorVisualizer", ["Cesium/Core/AssociativeArray", "Cesium/Core/Cartesian3", "Cesium/Core/Color", "Cesium/Core/defined", "Cesium/Core/destroyObject", "Cesium/Core/DeveloperError", "Cesium/Core/Matrix3", "Cesium/Core/Matrix4", "Cesium/Core/Quaternion", "./CustomSensorVolume", "Cesium/DataSources/MaterialProperty", "Cesium/DataSources/Property"], function (e, i, t, r, o, n, s, a, u, l, c, h) {
        "use strict";

        function d(e, i, t) {
            var o = i[e.id];
            if (r(o)) {
                var n = o.primitive;
                t.remove(n), n.isDestroyed() || n.destroy(), delete i[e.id]
            }
        }

        var m = t.WHITE, C = 1, f = Number.POSITIVE_INFINITY, p = new s, _ = new i, g = new u, v = function (i, t) {
            t.collectionChanged.addEventListener(v.prototype._onCollectionChanged, this), this._scene = i, this._primitives = i.primitives, this._entityCollection = t, this._hash = {}, this._entitiesToVisualize = new e, this._onCollectionChanged(t, t.values, [], [])
        };
        return v.prototype.update = function (e) {
            for (var t = this._entitiesToVisualize.values, o = this._hash, n = this._primitives, d = 0, v = t.length; v > d; d++) {
                var S, y, w, A = t[d], M = A._customPatternSensor, x = o[A.id],
                    E = A.isShowing && A.isAvailable(e) && h.getValueOrDefault(M._show, e, !0);
                if (E && (S = h.getValueOrUndefined(A._position, e, _), y = h.getValueOrUndefined(A._orientation, e, g), w = h.getValueOrUndefined(M._directions, e), E = r(S) && r(y) && r(w)), E) {
                    var b = r(x) ? x.primitive : void 0;
                    r(b) || (b = new l, b.id = A, n.add(b), x = {
                        primitive: b,
                        position: void 0,
                        orientation: void 0
                    }, o[A.id] = x), i.equals(S, x.position) && u.equals(y, x.orientation) || (a.fromRotationTranslation(s.fromQuaternion(y, p), S, b.modelMatrix), x.position = i.clone(S, x.position), x.orientation = u.clone(y, x.orientation)), b.show = !0, b.directions = w, b.radius = h.getValueOrDefault(M._radius, e, f), b.lateralSurfaceMaterial = c.getValue(e, M._lateralSurfaceMaterial, b.lateralSurfaceMaterial), b.intersectionColor = h.getValueOrClonedDefault(M._intersectionColor, e, m, b.intersectionColor), b.intersectionWidth = h.getValueOrDefault(M._intersectionWidth, e, C)
                } else r(x) && (x.primitive.show = !1)
            }
            return !0
        }, v.prototype.isDestroyed = function () {
            return !1
        }, v.prototype.destroy = function () {
            for (var e = this._entitiesToVisualize.values, i = this._hash, t = this._primitives, r = e.length - 1; r > -1; r--) d(e[r], i, t);
            return o(this)
        }, v.prototype._onCollectionChanged = function (e, i, t, o) {
            var n, s, a = this._entitiesToVisualize, u = this._hash, l = this._primitives;
            for (n = i.length - 1; n > -1; n--) s = i[n], r(s._customPatternSensor) && r(s._position) && r(s._orientation) && a.set(s.id, s);
            for (n = o.length - 1; n > -1; n--) s = o[n], r(s._customPatternSensor) && r(s._position) && r(s._orientation) ? a.set(s.id, s) : (d(s, u, l), a.remove(s.id));
            for (n = t.length - 1; n > -1; n--) s = t[n], d(s, u, l), a.remove(s.id)
        }, v
    }), t("RectangularSensorGraphics", ["Cesium/Core/defaultValue", "Cesium/Core/defined", "Cesium/Core/DeveloperError", "Cesium/Core/Event", "Cesium/DataSources/createPropertyDescriptor"], function (e, i, t, r, o) {
        "use strict";
        var n = function () {
            this._xHalfAngle = void 0, this._xHalfAngleSubscription = void 0, this._yHalfAngle = void 0, this._yHalfAngleSubscription = void 0, this._lateralSurfaceMaterial = void 0, this._lateralSurfaceMaterialSubscription = void 0, this._intersectionColor = void 0, this._intersectionColorSubscription = void 0, this._intersectionWidth = void 0, this._intersectionWidthSubscription = void 0, this._showIntersection = void 0, this._showIntersectionSubscription = void 0, this._radius = void 0, this._radiusSubscription = void 0, this._show = void 0, this._showSubscription = void 0, this._definitionChanged = new r
        };
        return Object.defineProperties(n.prototype, {
            definitionChanged: {
                get: function () {
                    return this._definitionChanged
                }
            },
            xHalfAngle: o("xHalfAngle"),
            yHalfAngle: o("yHalfAngle"),
            lateralSurfaceMaterial: o("lateralSurfaceMaterial"),
            intersectionColor: o("intersectionColor"),
            intersectionWidth: o("intersectionWidth"),
            showIntersection: o("showIntersection"),
            radius: o("radius"),
            show: o("show")
        }), n.prototype.clone = function (e) {
            return i(e) || (e = new n), e.xHalfAngle = this.xHalfAngle, e.yHalfAngle = this.yHalfAngle, e.radius = this.radius, e.show = this.show, e.showIntersection = this.showIntersection, e.intersectionColor = this.intersectionColor, e.intersectionWidth = this.intersectionWidth, e.lateralSurfaceMaterial = this.lateralSurfaceMaterial, e
        }, n.prototype.merge = function (i) {
            this.xHalfAngle = e(this.xHalfAngle, i.xHalfAngle), this.yHalfAngle = e(this.yHalfAngle, i.yHalfAngle), this.radius = e(this.radius, i.radius), this.show = e(this.show, i.show), this.showIntersection = e(this.showIntersection, i.showIntersection), this.intersectionColor = e(this.intersectionColor, i.intersectionColor), this.intersectionWidth = e(this.intersectionWidth, i.intersectionWidth), this.lateralSurfaceMaterial = e(this.lateralSurfaceMaterial, i.lateralSurfaceMaterial)
        }, n
    }), t("RectangularPyramidSensorVolume", ["Cesium/Core/clone", "Cesium/Core/defaultValue", "Cesium/Core/defined", "Cesium/Core/destroyObject", "Cesium/Core/DeveloperError", "Cesium/Core/Math", "Cesium/Core/Spherical", "./CustomSensorVolume"], function (e, i, t, r, o, n, s, a) {
        "use strict";

        function u(e, i, r, o) {
            var n = i[e];
            t(n) || (i[e] = n = new s), n.clock = r, n.cone = o, n.magnitude = 1
        }

        function l(e) {
            var i = e._customSensor.directions, t = Math.tan(Math.min(e._xHalfAngle, n.toRadians(89))),
                r = Math.tan(Math.min(e._yHalfAngle, n.toRadians(89))), o = Math.atan(t / r),
                s = Math.atan(Math.sqrt(t * t + r * r));
            u(0, i, o, s), u(1, i, n.toRadians(180) - o, s), u(2, i, n.toRadians(180) + o, s), u(3, i, -o, s), i.length = 4, e._customSensor.directions = i
        }

        var c = function (t) {
            t = i(t, i.EMPTY_OBJECT);
            var r = e(t);
            r._pickPrimitive = i(t._pickPrimitive, this), r.directions = void 0, this._customSensor = new a(r), this._xHalfAngle = i(t.xHalfAngle, n.PI_OVER_TWO), this._yHalfAngle = i(t.yHalfAngle, n.PI_OVER_TWO), l(this)
        };
        return Object.defineProperties(c.prototype, {
            xHalfAngle: {
                get: function () {
                    return this._xHalfAngle
                }, set: function (e) {
                    this._xHalfAngle !== e && (this._xHalfAngle = e, l(this))
                }
            }, yHalfAngle: {
                get: function () {
                    return this._yHalfAngle
                }, set: function (e) {
                    this._yHalfAngle !== e && (this._yHalfAngle = e, l(this))
                }
            }, show: {
                get: function () {
                    return this._customSensor.show
                }, set: function (e) {
                    this._customSensor.show = e
                }
            }, showIntersection: {
                get: function () {
                    return this._customSensor.showIntersection
                }, set: function (e) {
                    this._customSensor.showIntersection = e
                }
            }, showThroughEllipsoid: {
                get: function () {
                    return this._customSensor.showThroughEllipsoid
                }, set: function (e) {
                    this._customSensor.showThroughEllipsoid = e
                }
            }, modelMatrix: {
                get: function () {
                    return this._customSensor.modelMatrix
                }, set: function (e) {
                    this._customSensor.modelMatrix = e
                }
            }, radius: {
                get: function () {
                    return this._customSensor.radius
                }, set: function (e) {
                    this._customSensor.radius = e
                }
            }, lateralSurfaceMaterial: {
                get: function () {
                    return this._customSensor.lateralSurfaceMaterial
                }, set: function (e) {
                    this._customSensor.lateralSurfaceMaterial = e
                }
            }, intersectionColor: {
                get: function () {
                    return this._customSensor.intersectionColor
                }, set: function (e) {
                    this._customSensor.intersectionColor = e
                }
            }, intersectionWidth: {
                get: function () {
                    return this._customSensor.intersectionWidth
                }, set: function (e) {
                    this._customSensor.intersectionWidth = e
                }
            }, id: {
                get: function () {
                    return this._customSensor.id
                }, set: function (e) {
                    this._customSensor.id = e
                }
            }
        }), c.prototype.update = function (e) {
            this._customSensor.update(e)
        }, c.prototype.isDestroyed = function () {
            return !1
        }, c.prototype.destroy = function () {
            return this._customSensor = this._customSensor && this._customSensor.destroy(), r(this)
        }, c
    }), t("RectangularSensorVisualizer", ["Cesium/Core/AssociativeArray", "Cesium/Core/Cartesian3", "Cesium/Core/Color", "Cesium/Core/defined", "Cesium/Core/destroyObject", "Cesium/Core/DeveloperError", "Cesium/Core/Math", "Cesium/Core/Matrix3", "Cesium/Core/Matrix4", "Cesium/Core/Quaternion", "./RectangularPyramidSensorVolume", "Cesium/DataSources/MaterialProperty", "Cesium/DataSources/Property"], function (e, i, t, r, o, n, s, a, u, l, c, h, d) {
        "use strict";

        function m(e, i, t) {
            var o = i[e.id];
            if (r(o)) {
                var n = o.primitive;
                t.remove(n), n.isDestroyed() || n.destroy(), delete i[e.id]
            }
        }

        var C = t.WHITE, f = 1, p = Number.POSITIVE_INFINITY, _ = new a, g = new i, v = new l, S = function (i, t) {
            t.collectionChanged.addEventListener(S.prototype._onCollectionChanged, this), this._scene = i, this._primitives = i.primitives, this._entityCollection = t, this._hash = {}, this._entitiesToVisualize = new e, this._onCollectionChanged(t, t.values, [], [])
        };
        return S.prototype.update = function (e) {
            for (var t = this._entitiesToVisualize.values, o = this._hash, n = this._primitives, m = 0, S = t.length; S > m; m++) {
                var y, w, A = t[m], M = A._rectangularSensor, x = o[A.id],
                    E = A.isShowing && A.isAvailable(e) && d.getValueOrDefault(M._show, e, !0);
                if (E && (y = d.getValueOrUndefined(A._position, e, g), w = d.getValueOrUndefined(A._orientation, e, v), E = r(y) && r(w)), E) {
                    var b = r(x) ? x.primitive : void 0;
                    r(b) || (b = new c, b.id = A, n.add(b), x = {
                        primitive: b,
                        position: void 0,
                        orientation: void 0
                    }, o[A.id] = x), i.equals(y, x.position) && l.equals(w, x.orientation) || (u.fromRotationTranslation(a.fromQuaternion(w, _), y, b.modelMatrix), x.position = i.clone(y, x.position), x.orientation = l.clone(w, x.orientation)), b.show = !0, b.xHalfAngle = d.getValueOrDefault(M._xHalfAngle, e, s.PI_OVER_TWO), b.yHalfAngle = d.getValueOrDefault(M._yHalfAngle, e, s.PI_OVER_TWO), b.radius = d.getValueOrDefault(M._radius, e, p), b.lateralSurfaceMaterial = h.getValue(e, M._lateralSurfaceMaterial, b.lateralSurfaceMaterial), b.intersectionColor = d.getValueOrClonedDefault(M._intersectionColor, e, C, b.intersectionColor), b.intersectionWidth = d.getValueOrDefault(M._intersectionWidth, e, f)
                } else r(x) && (x.primitive.show = !1)
            }
            return !0
        }, S.prototype.isDestroyed = function () {
            return !1
        }, S.prototype.destroy = function () {
            for (var e = this._entitiesToVisualize.values, i = this._hash, t = this._primitives, r = e.length - 1; r > -1; r--) m(e[r], i, t);
            return o(this)
        }, S.prototype._onCollectionChanged = function (e, i, t, o) {
            var n, s, a = this._entitiesToVisualize, u = this._hash, l = this._primitives;
            for (n = i.length - 1; n > -1; n--) s = i[n], r(s._rectangularSensor) && r(s._position) && r(s._orientation) && a.set(s.id, s);
            for (n = o.length - 1; n > -1; n--) s = o[n], r(s._rectangularSensor) && r(s._position) && r(s._orientation) ? a.set(s.id, s) : (m(s, u, l), a.remove(s.id));
            for (n = t.length - 1; n > -1; n--) s = t[n], m(s, u, l), a.remove(s.id)
        }, S
    }), t("initialize", ["Cesium/Core/Cartesian3", "Cesium/Core/Color", "Cesium/Core/defined", "Cesium/Core/Spherical", "Cesium/Core/TimeInterval", "Cesium/DataSources/CzmlDataSource", "Cesium/DataSources/DataSourceDisplay", "./ConicSensorGraphics", "./ConicSensorVisualizer", "./CustomPatternSensorGraphics", "./CustomPatternSensorVisualizer", "./RectangularSensorGraphics", "./RectangularSensorVisualizer"], function (e, i, t, r, o, n, s, a, u, l, c, h, d) {
        "use strict";

        function m(i, o, n, s, a) {
            var u, l, c = [], h = o.unitSpherical, d = o.spherical, m = o.unitCartesian, C = o.cartesian;
            if (t(h)) {
                for (u = 0, l = h.length; l > u; u += 2) c.push(new r(h[u], h[u + 1]));
                o.array = c
            } else if (t(d)) {
                for (u = 0, l = d.length; l > u; u += 3) c.push(new r(d[u], d[u + 1], d[u + 2]));
                o.array = c
            } else if (t(m)) {
                for (u = 0, l = m.length; l > u; u += 3) {
                    var f = r.fromCartesian3(new e(m[u], m[u + 1], m[u + 2]));
                    r.normalize(f, f), c.push(f)
                }
                o.array = c
            } else if (t(C)) {
                for (u = 0, l = C.length; l > u; u += 3) c.push(r.fromCartesian3(new e(C[u], C[u + 1], C[u + 2])));
                o.array = c
            }
            g(Array, i, "directions", o, n, s, a)
        }

        function C(e, t, r, o, n) {
            g(Boolean, e, "show", t.show, r, o, n), g(Number, e, "radius", t.radius, r, o, n), g(Boolean, e, "showIntersection", t.showIntersection, r, o, n), g(i, e, "intersectionColor", t.intersectionColor, r, o, n), g(Number, e, "intersectionWidth", t.intersectionWidth, r, o, n), v(e, "lateralSurfaceMaterial", t.lateralSurfaceMaterial, r, o, n)
        }

        function f(e, i, r, n) {
            var s = i.agi_conicSensor;
            if (t(s)) {
                var u, l = s.interval;
                t(l) && (S.iso8601 = l, u = o.fromIso8601(S));
                var c = e.conicSensor;
                t(c) || (e.addProperty("conicSensor"), e.conicSensor = c = new a), C(c, s, u, n, r), g(Number, c, "innerHalfAngle", s.innerHalfAngle, u, n, r), g(Number, c, "outerHalfAngle", s.outerHalfAngle, u, n, r), g(Number, c, "minimumClockAngle", s.minimumClockAngle, u, n, r), g(Number, c, "maximumClockAngle", s.maximumClockAngle, u, n, r)
            }
        }

        function p(e, i, r, n) {
            var s = i.agi_customPatternSensor;
            if (t(s)) {
                var a, u = s.interval;
                t(u) && (S.iso8601 = u, a = o.fromIso8601(S));
                var c = e.customPatternSensor;
                t(c) || (e.addProperty("customPatternSensor"), e.customPatternSensor = c = new l), C(c, s, a, n, r);
                var h = s.directions;
                if (t(h)) if (Array.isArray(h)) for (var d = h.length, f = 0; d > f; f++) m(c, h[f], a, n, r); else m(c, h, a, n, r)
            }
        }

        function _(e, i, r, n) {
            var s = i.agi_rectangularSensor;
            if (t(s)) {
                var a, u = s.interval;
                t(u) && (S.iso8601 = u, a = o.fromIso8601(S));
                var l = e.rectangularSensor;
                t(l) || (e.addProperty("rectangularSensor"), e.rectangularSensor = l = new h), C(l, s, a, n, r), g(Number, l, "xHalfAngle", s.xHalfAngle, a, n, r), g(Number, l, "yHalfAngle", s.yHalfAngle, a, n, r)
            }
        }

        var g = n.processPacketData, v = n.processMaterialPacketData, S = {iso8601: void 0}, y = !1, w = function () {
            if (!y) {
                n.updaters.push(f, p, _);
                var e = s.defaultVisualizersCallback;
                s.defaultVisualizersCallback = function (i, t, r) {
                    var o = r.entities, n = e(i, t, r);
                    return n.concat([new u(i, o), new c(i, o), new d(i, o)])
                }, y = !0
            }
        };
        return w
    }), t("CesiumSensors", ["./initialize", "./ConicSensorGraphics", "./ConicSensorVisualizer", "./CustomPatternSensorGraphics", "./CustomPatternSensorVisualizer", "./CustomSensorVolume", "./RectangularPyramidSensorVolume", "./RectangularSensorGraphics", "./RectangularSensorVisualizer"], function (e, i, t, r, o, n, s, a, u) {
        "use strict";
        return e(), {
            ConicSensorGraphics: i,
            ConicSensorVisualizer: t,
            CustomPatternSensorGraphics: r,
            CustomPatternSensorVisualizer: o,
            CustomSensorVolume: n,
            RectangularPyramidSensorVolume: s,
            RectangularSensorGraphics: a,
            RectangularSensorVisualizer: u
        }
    }), function () {
        "use strict";
        t("Cesium/Core/defaultValue", function () {
            return Cesium.defaultValue
        }), t("Cesium/Core/defined", function () {
            return Cesium.defined
        }), t("Cesium/Core/defineProperties", function () {
            return Cesium.defineProperties
        }), t("Cesium/Core/DeveloperError", function () {
            return Cesium.DeveloperError
        }), t("Cesium/Core/Event", function () {
            return Cesium.Event
        }), t("Cesium/DataSources/createMaterialPropertyDescriptor", function () {
            return Cesium.createMaterialPropertyDescriptor
        }), t("Cesium/DataSources/createPropertyDescriptor", function () {
            return Cesium.createPropertyDescriptor
        }), t("Cesium/Core/AssociativeArray", function () {
            return Cesium.AssociativeArray
        }), t("Cesium/Core/Cartesian3", function () {
            return Cesium.Cartesian3
        }), t("Cesium/Core/Color", function () {
            return Cesium.Color
        }), t("Cesium/Core/destroyObject", function () {
            return Cesium.destroyObject
        }), t("Cesium/Core/Math", function () {
            return Cesium.Math
        }), t("Cesium/Core/Matrix3", function () {
            return Cesium.Matrix3
        }), t("Cesium/Core/Matrix4", function () {
            return Cesium.Matrix4
        }), t("Cesium/Core/Quaternion", function () {
            return Cesium.Quaternion
        }), t("Cesium/Core/Spherical", function () {
            return Cesium.Spherical
        }), t("Cesium/DataSources/MaterialProperty", function () {
            return Cesium.MaterialProperty
        }), t("Cesium/DataSources/Property", function () {
            return Cesium.Property
        }), t("Cesium/Core/BoundingSphere", function () {
            return Cesium.BoundingSphere
        }), t("Cesium/Core/combine", function () {
            return Cesium.combine
        }), t("Cesium/Core/ComponentDatatype", function () {
            return Cesium.ComponentDatatype
        }), t("Cesium/Core/PrimitiveType", function () {
            return Cesium.PrimitiveType
        }), t("Cesium/Renderer/Buffer", function () {
            return Cesium.Buffer
        }), t("Cesium/Renderer/BufferUsage", function () {
            return Cesium.BufferUsage
        }), t("Cesium/Renderer/ShaderSource", function () {
            return Cesium.ShaderSource
        }), t("Cesium/Renderer/DrawCommand", function () {
            return Cesium.DrawCommand
        }), t("Cesium/Renderer/RenderState", function () {
            return Cesium.RenderState
        }), t("Cesium/Renderer/ShaderProgram", function () {
            return Cesium.ShaderProgram
        }), t("Cesium/Renderer/VertexArray", function () {
            return Cesium.VertexArray
        }), t("Cesium/Scene/BlendingState", function () {
            return Cesium.BlendingState
        }), t("Cesium/Scene/CullFace", function () {
            return Cesium.CullFace
        }), t("Cesium/Scene/Material", function () {
            return Cesium.Material
        }), t("Cesium/Scene/Pass", function () {
            return Cesium.Pass
        }), t("Cesium/Scene/SceneMode", function () {
            return Cesium.SceneMode
        }), t("Cesium/Core/TimeInterval", function () {
            return Cesium.TimeInterval
        }), t("Cesium/DataSources/CzmlDataSource", function () {
            return Cesium.CzmlDataSource
        }), t("Cesium/DataSources/DataSourceDisplay", function () {
            return Cesium.DataSourceDisplay
        }), t("Cesium/Core/clone", function () {
            return Cesium.clone
        }), i(["CesiumSensors"], function (e) {
            var i = "undefined" != typeof window ? window : "undefined" != typeof self ? self : {};
            i.CesiumSensors = e
        }, void 0, !0)
    }()
}();
