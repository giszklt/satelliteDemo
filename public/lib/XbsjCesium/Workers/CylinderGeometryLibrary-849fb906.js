define(["exports","./ComponentDatatype-e160d612"],(function(t,n){"use strict";const o={computePositions:function(t,o,e,s,r){const i=.5*t,c=-i,a=s+s,u=new Float64Array(3*(r?2*a:a));let y,f=0,m=0;const p=r?3*a:0,d=r?3*(a+s):3*s;for(y=0;y<s;y++){const t=y/s*n.CesiumMath.TWO_PI,a=Math.cos(t),h=Math.sin(t),l=a*e,C=h*e,M=a*o,P=h*o;u[m+p]=l,u[m+p+1]=C,u[m+p+2]=c,u[m+d]=M,u[m+d+1]=P,u[m+d+2]=i,m+=3,r&&(u[f++]=l,u[f++]=C,u[f++]=c,u[f++]=M,u[f++]=P,u[f++]=i)}return u}};t.CylinderGeometryLibrary=o}));