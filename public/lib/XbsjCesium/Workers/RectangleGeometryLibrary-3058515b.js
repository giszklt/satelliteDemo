define(["exports","./Matrix2-590828b3","./defaultValue-69ee94f4","./Check-3bce9c53","./Transforms-7a61bdac","./ComponentDatatype-e160d612"],(function(t,n,a,e,o,s){"use strict";const r=Math.cos,i=Math.sin,c=Math.sqrt,g={computePosition:function(t,n,e,o,s,g,u){const h=n.radiiSquared,l=t.nwCorner,C=t.boundingRectangle;let S=l.latitude-t.granYCos*o+s*t.granXSin;const d=r(S),w=i(S),M=h.z*w;let X=l.longitude+o*t.granYSin+s*t.granXCos;const Y=d*r(X),m=d*i(X),p=h.x*Y,f=h.y*m,x=c(p*Y+f*m+M*w);if(g.x=p/x,g.y=f/x,g.z=M/x,e){const n=t.stNwCorner;a.defined(n)?(S=n.latitude-t.stGranYCos*o+s*t.stGranXSin,X=n.longitude+o*t.stGranYSin+s*t.stGranXCos,u.x=(X-t.stWest)*t.lonScalar,u.y=(S-t.stSouth)*t.latScalar):(u.x=(X-C.west)*t.lonScalar,u.y=(S-C.south)*t.latScalar)}}},u=new n.Matrix2;let h=new n.Cartesian3;const l=new n.Cartographic;let C=new n.Cartesian3;const S=new o.GeographicProjection;function d(t,a,e,o,s,r,i){const c=Math.cos(a),g=o*c,l=e*c,d=Math.sin(a),w=o*d,M=e*d;h=S.project(t,h),h=n.Cartesian3.subtract(h,C,h);const X=n.Matrix2.fromRotation(a,u);h=n.Matrix2.multiplyByVector(X,h,h),h=n.Cartesian3.add(h,C,h),r-=1,i-=1;const Y=(t=S.unproject(h,t)).latitude,m=Y+r*M,p=Y-g*i,f=Y-g*i+r*M,x=Math.max(Y,m,p,f),G=Math.min(Y,m,p,f),R=t.longitude,y=R+r*l,b=R+i*w,O=R+i*w+r*l;return{north:x,south:G,east:Math.max(R,y,b,O),west:Math.min(R,y,b,O),granYCos:g,granYSin:w,granXCos:l,granXSin:M,nwCorner:t}}g.computeOptions=function(t,a,e,o,r,i,c){let g,u=t.east,h=t.west,w=t.north,M=t.south,X=!1,Y=!1;w===s.CesiumMath.PI_OVER_TWO&&(X=!0),M===-s.CesiumMath.PI_OVER_TWO&&(Y=!0);const m=w-M;g=h>u?s.CesiumMath.TWO_PI-h+u:u-h;const p=Math.ceil(g/a)+1,f=Math.ceil(m/a)+1,x=g/(p-1),G=m/(f-1),R=n.Rectangle.northwest(t,i),y=n.Rectangle.center(t,l);0===e&&0===o||(y.longitude<R.longitude&&(y.longitude+=s.CesiumMath.TWO_PI),C=S.project(y,C));const b=G,O=x,P=n.Rectangle.clone(t,r),W={granYCos:b,granYSin:0,granXCos:O,granXSin:0,nwCorner:R,boundingRectangle:P,width:p,height:f,northCap:X,southCap:Y};if(0!==e){const t=d(R,e,x,G,0,p,f);w=t.north,M=t.south,u=t.east,h=t.west,W.granYCos=t.granYCos,W.granYSin=t.granYSin,W.granXCos=t.granXCos,W.granXSin=t.granXSin,P.north=w,P.south=M,P.east=u,P.west=h}if(0!==o){e-=o;const t=n.Rectangle.northwest(P,c),a=d(t,e,x,G,0,p,f);W.stGranYCos=a.granYCos,W.stGranXCos=a.granXCos,W.stGranYSin=a.granYSin,W.stGranXSin=a.granXSin,W.stNwCorner=t,W.stWest=a.west,W.stSouth=a.south}return W},t.RectangleGeometryLibrary=g}));