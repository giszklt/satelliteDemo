define(["exports","./arrayRemoveDuplicates-99a4d101","./Matrix2-590828b3","./defaultValue-69ee94f4","./ComponentDatatype-e160d612","./PolylinePipeline-65400fae"],(function(e,t,i,n,o,r){"use strict";const a={};function s(e,t){return o.CesiumMath.equalsEpsilon(e.latitude,t.latitude,o.CesiumMath.EPSILON10)&&o.CesiumMath.equalsEpsilon(e.longitude,t.longitude,o.CesiumMath.EPSILON10)}const l=new i.Cartographic,h=new i.Cartographic;const g=new Array(2),c=new Array(2),u={positions:void 0,height:void 0,granularity:void 0,ellipsoid:void 0};a.computePositions=function(e,a,p,d,y,m){const f=function(e,o,r,a){const g=(o=t.arrayRemoveDuplicates(o,i.Cartesian3.equalsEpsilon)).length;if(g<2)return;const c=n.defined(a),u=n.defined(r),p=new Array(g),d=new Array(g),y=new Array(g),m=o[0];p[0]=m;const f=e.cartesianToCartographic(m,l);u&&(f.height=r[0]),d[0]=f.height,y[0]=c?a[0]:0;let P=d[0]===y[0],A=1;for(let t=1;t<g;++t){const n=o[t],l=e.cartesianToCartographic(n,h);u&&(l.height=r[t]),P=P&&0===l.height,s(f,l)?f.height<l.height&&(d[A-1]=l.height):(p[A]=n,d[A]=l.height,y[A]=c?a[t]:0,P=P&&d[A]===y[A],i.Cartographic.clone(l,f),++A)}return P||A<2?void 0:(p.length=A,d.length=A,y.length=A,{positions:p,topHeights:d,bottomHeights:y})}(e,a,p,d);if(!n.defined(f))return;a=f.positions,p=f.topHeights,d=f.bottomHeights;const P=a.length,A=P-2;let C,w;const v=o.CesiumMath.chordLength(y,e.maximumRadius),b=u;if(b.minDistance=v,b.ellipsoid=e,m){let e,t=0;for(e=0;e<P-1;e++)t+=r.PolylinePipeline.numberOfPoints(a[e],a[e+1],v)+1;C=new Float64Array(3*t),w=new Float64Array(3*t);const i=g,n=c;b.positions=i,b.height=n;let o=0;for(e=0;e<P-1;e++){i[0]=a[e],i[1]=a[e+1],n[0]=p[e],n[1]=p[e+1];const t=r.PolylinePipeline.generateArc(b);C.set(t,o),n[0]=d[e],n[1]=d[e+1],w.set(r.PolylinePipeline.generateArc(b),o),o+=t.length}}else b.positions=a,b.height=p,C=new Float64Array(r.PolylinePipeline.generateArc(b)),b.height=d,w=new Float64Array(r.PolylinePipeline.generateArc(b));return{bottomPositions:w,topPositions:C,numCorners:A}},e.WallGeometryLibrary=a}));