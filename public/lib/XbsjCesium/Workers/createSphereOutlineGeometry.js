define(["./defaultValue-69ee94f4","./Matrix2-590828b3","./Check-3bce9c53","./EllipsoidOutlineGeometry-8645ccf4","./ComponentDatatype-e160d612","./WebGLConstants-f63312fc","./RuntimeError-0e565491","./GeometryOffsetAttribute-a5193540","./Transforms-7a61bdac","./_commonjsHelpers-3aae1032-15991586","./combine-0259f56f","./GeometryAttribute-80f64991","./GeometryAttributes-1b4134a9","./IndexDatatype-2373d532"],(function(e,i,t,n,o,r,s,a,l,d,c,u,m,p){"use strict";function f(t){const o=e.defaultValue(t.radius,1),r={radii:new i.Cartesian3(o,o,o),stackPartitions:t.stackPartitions,slicePartitions:t.slicePartitions,subdivisions:t.subdivisions};this._ellipsoidGeometry=new n.EllipsoidOutlineGeometry(r),this._workerName="createSphereOutlineGeometry"}f.packedLength=n.EllipsoidOutlineGeometry.packedLength,f.pack=function(e,i,t){return n.EllipsoidOutlineGeometry.pack(e._ellipsoidGeometry,i,t)};const y=new n.EllipsoidOutlineGeometry,G={radius:void 0,radii:new i.Cartesian3,stackPartitions:void 0,slicePartitions:void 0,subdivisions:void 0};return f.unpack=function(t,o,r){const s=n.EllipsoidOutlineGeometry.unpack(t,o,y);return G.stackPartitions=s._stackPartitions,G.slicePartitions=s._slicePartitions,G.subdivisions=s._subdivisions,e.defined(r)?(i.Cartesian3.clone(s._radii,G.radii),r._ellipsoidGeometry=new n.EllipsoidOutlineGeometry(G),r):(G.radius=s._radii.x,new f(G))},f.createGeometry=function(e){return n.EllipsoidOutlineGeometry.createGeometry(e._ellipsoidGeometry)},function(i,t){return e.defined(t)&&(i=f.unpack(i,t)),f.createGeometry(i)}}));