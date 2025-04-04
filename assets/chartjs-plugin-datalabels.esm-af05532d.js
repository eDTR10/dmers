import{r as $,j as S}from"./index-8e4cbc88.js";import{C as Ae,a as Ee,L as Se,B as oe,A as le,p as xe,c as Ie,d as _e,g as Ne,h as Te,m as B,t as Ce,i as p,j as Re,k as Me,v as Oe,l as ue,n as G,P as ke,o as we,q as De}from"./index-f7359a56.js";Ae.register(Ee,Se,oe,le,xe,Ie,_e);const V=({title:e,percentage:t,barData:r,maxBarValue:a=100,colSpan:n=1})=>{const i={datasets:[{data:[t,100-t],backgroundColor:["#0036C5","#ECC217"],borderWidth:0,circumference:180,rotation:270}]},s={cutout:"65%",plugins:{legend:{display:!1},tooltip:{enabled:!1}},maintainAspectRatio:!1},l={labels:r.labels,datasets:[{data:r.values,backgroundColor:r.colors,borderWidth:0,borderRadius:2}]},c=Math.max(r.labels.length*25,100),d={indexAxis:"y",responsive:!0,scales:{x:{max:a,beginAtZero:!0,grid:{display:!1},ticks:{font:{size:8}}},y:{grid:{display:!1},ticks:{font:{size:8},callback:function(v,b){const _=r.labels[b];return _.length>20?_.substr(0,20)+"...":_}}}},plugins:{legend:{display:!1},tooltip:{enabled:!0,callbacks:{title:v=>r.labels[v[0].dataIndex]}}},maintainAspectRatio:!1},f=`col-span-1 md:col-span-${n}`;return S.jsxs("div",{className:`bg-white ${f} p-2 rounded-lg border border-border flex flex-col`,children:[S.jsx("h3",{className:"text-center text-xs font-medium mb-2",children:e}),S.jsxs("div",{className:"relative h-24 flex justify-center mb-2",children:[S.jsx("div",{className:"w-full h-full",children:S.jsx(Ne,{data:i,options:s})}),S.jsxs("div",{className:"absolute bottom-2 text-base font-bold",children:[t.toFixed(2),"%"]})]}),S.jsx("div",{className:"mt-2",style:{height:`${c}px`},children:S.jsx(Te,{data:l,options:d})})]})},nr=({data:e,chartColors:t=["#0036C5","#ECC217"],cardLayouts:r={digitalSkills:{title:"DIGITAL SKILLS ASSESSMENT",colSpan:1},tri:{title:"LGU Office Employee's Technology Readiness Index",colSpan:1},ictChange:{title:"ICT Change Management",colSpan:1},itReadiness:{title:"IT Readiness Assessment",colSpan:1}},gridColsBase:a})=>{var k,F,Z,J,Q,ee,re,ae;const[n,i]=$.useState({labels:[],values:[],percentage:0}),[s,l]=$.useState({labels:[],values:[],percentage:0}),[c,d]=$.useState({labels:[],values:[],percentage:0}),[f,v]=$.useState({labels:[],values:[],percentage:0});$.useEffect(()=>{D(),U(),R(),N(),setTimeout(()=>{console.log("=== OVERALL ASSESSMENT SCORES ==="),console.log("DIGITAL SKILLS ASSESSMENT:",n.percentage.toFixed(2)+"%"),console.log("LGU Office Employee's Technology Readiness Index:",s.percentage.toFixed(2)+"%"),console.log("IT Readiness Assessment:",f.percentage.toFixed(2)+"%"),console.log("ICT Change Management:",c.percentage.toFixed(2)+"%");const g=(n.percentage+s.percentage+f.percentage+c.percentage)/4;console.log("TOTAL SCORE:",g.toFixed(2)+"%"),console.log("===============================")},500)},[e]);const b=()=>{const g=["Mayors Office","Other Offices","HR Office","IT Office"],y=[];Object.keys(e).forEach(u=>{g.includes(u)&&e[u]&&Array.isArray(e[u])&&y.push(...e[u])});let h=0,m=0;return y.forEach(u=>{u["OFFICE SELECTION"]==="MIS/IT"&&[Number(u["BASIC IT READINESS 1"])||0,Number(u["BASIC IT READINESS 2"])||0,Number(u["BASIC IT READINESS 3"])||0,Number(u["BASIC IT READINESS 4"])||0].forEach(x=>{x>0&&(h+=x,m++)})}),console.log("Change Readiness Sum:",h),console.log("Change Readiness Count:",m),console.log("Change Readiness Score:",h/(m*5)*100),y},w=g=>{const y=g.filter(h=>h!=null);return y.length?y.reduce((h,m)=>h+m,0)/y.length:0},_=g=>{if(g.length===0)return 0;const h=g.length*5;return g.reduce((u,o)=>u+o,0)/h*100},D=()=>{const g=["Basic computer skill","Basic Internet searching","General computer or office productivity software use","Use of collaborative platforms","Use of communication apps","Use of social media","Content creation","Cybersecurity awareness","Programming, web, and app dev...","Digital design and data vi..."],y=b();if(y.length===0){console.error("No office data found");return}const h=Array.from({length:10},(u,o)=>{const x=`Question ${o+1} DigitalSkillsAssessment`,I=y.map(M=>Number(M[x]||0)).filter(M=>!isNaN(M)),E=I.reduce((M,O)=>M+O,0),H=I.length*5;return E/H*100}),m=w(h);i({labels:g,values:h,percentage:m})},U=()=>{const g=b();if(g.length===0){console.error("No office data found");return}const y=(I,E)=>{const H=g.flatMap(O=>Array.from({length:E},(ne,be)=>{const me=`${I} ${be+1}`;return Number(O[me]||0)})).filter(O=>!isNaN(O)),te=H.reduce((O,ne)=>O+ne,0),M=H.length*5;return te/M*100},h=y("Optimism",10),m=y("Innovativeness",7),u=y("Discomfort",10),o=y("Insecurity",9),x=(h+m+u+o)/4;l({labels:["OPTIMISM","INNOVATIVENESS","DISCOMFORT","INSECURITY"],values:[h,m,u,o],percentage:x})},R=()=>{const g=b();if(g.length===0){console.error("No office data found");return}const y={"BASIC IT READINESS":Array.from({length:4},(u,o)=>`BASIC IT READINESS ${o+1}`),"IT GOVERNANCE":Array.from({length:3},(u,o)=>`IT GOVERNANCE FRAMEWORK & POLICIES ${o+1}`),"IT STRATEGY":Array.from({length:3},(u,o)=>`IT STRATEGY AND ALIGNMENT ${o+1}`),"IT POLICIES":Array.from({length:3},(u,o)=>`IT POLICIES AND PROCEDURES ${o+1}`),"RISK MANAGEMENT":Array.from({length:3},(u,o)=>`RISK MANAGEMENT ${o+1}`),"PERFORMANCE MEASUREMENT":Array.from({length:3},(u,o)=>`IT PERFORMANCE MEASUREMENT AND REPORTING ${o+1}`),"IT INVESTMENT MANAGEMENT":Array.from({length:3},(u,o)=>`IT INVESTMENT MANAGEMENT ${o+1}`),"VENDOR MANAGEMENT":Array.from({length:3},(u,o)=>`VENDOR MANAGEMENT ${o+1}`),"IT SECURITY":Array.from({length:3},(u,o)=>`IT SECURITY AND COMPLIANCE ${o+1}`),"ICT ORGANIZATION":Array.from({length:3},(u,o)=>`ICT Organizational Structure and Skills ${o+1}`),"AUDIT & ASSURANCE":Array.from({length:3},(u,o)=>`Audit and Assurance ${o+1}`),NETWORK:Array.from({length:2},(u,o)=>`Network Infrastructure ${o+1}`),STORAGE:Array.from({length:3},(u,o)=>`Servers and Storage ${o+1}`),VIRTUALIZATION:Array.from({length:3},(u,o)=>`Virtualization ${o+1}`),BACKUP:Array.from({length:3},(u,o)=>`Data Backup and Recovery ${o+1}`),"SCALABILITY & ELASTICITY":Array.from({length:3},(u,o)=>`Scalability and Elasticity ${o+1}`),"SECURITY MEASURES":Array.from({length:4},(u,o)=>`Security Measures ${o+1}`),MONITORING:Array.from({length:3},(u,o)=>`Monitoring and Performance ${o+1}`),COMPLIANCE:Array.from({length:3},(u,o)=>`Compliance and Governance ${o+1}`),INTEGRATION:Array.from({length:3},(u,o)=>`Integration and Interoperability ${o+1}`),"DISASTER RECOVERY":Array.from({length:3},(u,o)=>`Disaster Recovery and Business Continuity ${o+1}`)},h=Object.entries(y).map(([u,o])=>{const x=[];return o.forEach(I=>{g.forEach(E=>{E&&E[I]!==void 0&&E[I]!==null&&x.push(parseFloat(E[I])||0)})}),{category:u,score:_(x)}}),m=h.reduce((u,o)=>u+o.score,0)/h.length;v({labels:h.map(u=>u.category),values:h.map(u=>u.score),percentage:m})},N=()=>{const g=b();if(g.length===0){console.error("No office data found");return}const y={"CHANGE READINESS":Array.from({length:3},(u,o)=>`CHANGE READINESS ${o+1}`),"CHANGE LEADERSHIP":Array.from({length:2},(u,o)=>`CHANGE LEADERSHIP ${o+1}`),"CHANGE COMMUNICATION":Array.from({length:3},(u,o)=>`CHANGE COMMUNICATION ${o+1}`),"IMPACT ASSESSMENT":Array.from({length:3},(u,o)=>`CHANGE IMPACT ASSESSMENT ${o+1}`),"STAKEHOLDER ENGAGEMENT":Array.from({length:3},(u,o)=>`STAKEHOLDER ENGAGEMENT ${o+1}`),"PLANNING & EXECUTION":Array.from({length:3},(u,o)=>`CHANGE PLANNING AND EXECUTION ${o+1}`),TRAINING:Array.from({length:3},(u,o)=>`TRAINING AND DEVELOPMENT ${o+1}`),"RESISTANCE MANAGEMENT":Array.from({length:3},(u,o)=>`Resistance Management ${o+1}`),EVALUATION:Array.from({length:3},(u,o)=>`Evaluation and Continuous Improvement ${o+1}`),SUSTAINABILITY:Array.from({length:3},(u,o)=>`Sustainability and Embedding ${o+1}`),FINANCIAL:Array.from({length:5},(u,o)=>`Costs or Financial ${o+1}`)},h=Object.entries(y).map(([u,o])=>{const x=[];return o.forEach(I=>{g.forEach(E=>{E&&E[I]!==void 0&&E[I]!==null&&x.push(parseFloat(E[I])||0)})}),{category:u,score:_(x)}}),m=h.reduce((u,o)=>u+o.score,0)/h.length;d({labels:h.map(u=>u.category),values:h.map(u=>u.score),percentage:m})},T=g=>Array(g).fill(0).map((y,h)=>h%2===0?t[0]:t[1]);return S.jsxs("div",{className:`grid grid-cols-${a} md:grid-cols-1  gap-4`,children:[S.jsx(V,{title:((k=r.digitalSkills)==null?void 0:k.title)||"DIGITAL SKILLS ASSESSMENT",percentage:n.percentage,barData:{labels:n.labels,values:n.values,colors:T(n.labels.length)},colSpan:((F=r.digitalSkills)==null?void 0:F.colSpan)||1}),S.jsx(V,{title:((Z=r.tri)==null?void 0:Z.title)||"LGU Office Employee's Technology Readiness Index",percentage:s.percentage,barData:{labels:s.labels,values:s.values,colors:T(s.labels.length)},colSpan:((J=r.tri)==null?void 0:J.colSpan)||1}),S.jsx(V,{title:((Q=r.ictChange)==null?void 0:Q.title)||"ICT Change Management",percentage:c.percentage,barData:{labels:c.labels,values:c.values,colors:T(c.labels.length)},colSpan:((ee=r.ictChange)==null?void 0:ee.colSpan)||1}),S.jsx(V,{title:((re=r.itReadiness)==null?void 0:re.title)||"IT Readiness Assessment",percentage:f.percentage,barData:{labels:f.labels,values:f.values,colors:T(f.labels.length)},maxBarValue:100,colSpan:((ae=r.itReadiness)==null?void 0:ae.colSpan)||1})]})};/*!
 * chartjs-plugin-datalabels v2.2.0
 * https://chartjs-plugin-datalabels.netlify.app
 * (c) 2017-2022 chartjs-plugin-datalabels contributors
 * Released under the MIT license
 */var ie=function(){if(typeof window<"u"){if(window.devicePixelRatio)return window.devicePixelRatio;var e=window.screen;if(e)return(e.deviceXDPI||1)/(e.logicalXDPI||1)}return 1}(),L={toTextLines:function(e){var t=[],r;for(e=[].concat(e);e.length;)r=e.pop(),typeof r=="string"?t.unshift.apply(t,r.split(`
`)):Array.isArray(r)?e.push.apply(e,r):G(e)||t.unshift(""+r);return t},textSize:function(e,t,r){var a=[].concat(t),n=a.length,i=e.font,s=0,l;for(e.font=r.string,l=0;l<n;++l)s=Math.max(e.measureText(a[l]).width,s);return e.font=i,{height:n*r.lineHeight,width:s}},bound:function(e,t,r){return Math.max(e,Math.min(t,r))},arrayDiff:function(e,t){var r=e.slice(),a=[],n,i,s,l;for(n=0,s=t.length;n<s;++n)l=t[n],i=r.indexOf(l),i===-1?a.push([l,1]):r.splice(i,1);for(n=0,s=r.length;n<s;++n)a.push([r[n],-1]);return a},rasterize:function(e){return Math.round(e*ie)/ie}};function X(e,t){var r=t.x,a=t.y;if(r===null)return{x:0,y:-1};if(a===null)return{x:1,y:0};var n=e.x-r,i=e.y-a,s=Math.sqrt(n*n+i*i);return{x:s?n/s:0,y:s?i/s:-1}}function $e(e,t,r,a,n){switch(n){case"center":r=a=0;break;case"bottom":r=0,a=1;break;case"right":r=1,a=0;break;case"left":r=-1,a=0;break;case"top":r=0,a=-1;break;case"start":r=-r,a=-a;break;case"end":break;default:n*=Math.PI/180,r=Math.cos(n),a=Math.sin(n);break}return{x:e,y:t,vx:r,vy:a}}var Pe=0,ce=1,de=2,fe=4,ve=8;function W(e,t,r){var a=Pe;return e<r.left?a|=ce:e>r.right&&(a|=de),t<r.top?a|=ve:t>r.bottom&&(a|=fe),a}function Ge(e,t){for(var r=e.x0,a=e.y0,n=e.x1,i=e.y1,s=W(r,a,t),l=W(n,i,t),c,d,f;!(!(s|l)||s&l);)c=s||l,c&ve?(d=r+(n-r)*(t.top-a)/(i-a),f=t.top):c&fe?(d=r+(n-r)*(t.bottom-a)/(i-a),f=t.bottom):c&de?(f=a+(i-a)*(t.right-r)/(n-r),d=t.right):c&ce&&(f=a+(i-a)*(t.left-r)/(n-r),d=t.left),c===s?(r=d,a=f,s=W(r,a,t)):(n=d,i=f,l=W(n,i,t));return{x0:r,x1:n,y0:a,y1:i}}function z(e,t){var r=t.anchor,a=e,n,i;return t.clamp&&(a=Ge(a,t.area)),r==="start"?(n=a.x0,i=a.y0):r==="end"?(n=a.x1,i=a.y1):(n=(a.x0+a.x1)/2,i=(a.y0+a.y1)/2),$e(n,i,e.vx,e.vy,t.align)}var Y={arc:function(e,t){var r=(e.startAngle+e.endAngle)/2,a=Math.cos(r),n=Math.sin(r),i=e.innerRadius,s=e.outerRadius;return z({x0:e.x+a*i,y0:e.y+n*i,x1:e.x+a*s,y1:e.y+n*s,vx:a,vy:n},t)},point:function(e,t){var r=X(e,t.origin),a=r.x*e.options.radius,n=r.y*e.options.radius;return z({x0:e.x-a,y0:e.y-n,x1:e.x+a,y1:e.y+n,vx:r.x,vy:r.y},t)},bar:function(e,t){var r=X(e,t.origin),a=e.x,n=e.y,i=0,s=0;return e.horizontal?(a=Math.min(e.x,e.base),i=Math.abs(e.base-e.x)):(n=Math.min(e.y,e.base),s=Math.abs(e.base-e.y)),z({x0:a,y0:n+s,x1:a+i,y1:n,vx:r.x,vy:r.y},t)},fallback:function(e,t){var r=X(e,t.origin);return z({x0:e.x,y0:e.y,x1:e.x+(e.width||0),y1:e.y+(e.height||0),vx:r.x,vy:r.y},t)}},C=L.rasterize;function Le(e){var t=e.borderWidth||0,r=e.padding,a=e.size.height,n=e.size.width,i=-n/2,s=-a/2;return{frame:{x:i-r.left-t,y:s-r.top-t,w:n+r.width+t*2,h:a+r.height+t*2},text:{x:i,y:s,w:n,h:a}}}function je(e,t){var r=t.chart.getDatasetMeta(t.datasetIndex).vScale;if(!r)return null;if(r.xCenter!==void 0&&r.yCenter!==void 0)return{x:r.xCenter,y:r.yCenter};var a=r.getBasePixel();return e.horizontal?{x:a,y:null}:{x:null,y:a}}function Be(e){return e instanceof le?Y.arc:e instanceof ke?Y.point:e instanceof oe?Y.bar:Y.fallback}function Ue(e,t,r,a,n,i){var s=Math.PI/2;if(i){var l=Math.min(i,n/2,a/2),c=t+l,d=r+l,f=t+a-l,v=r+n-l;e.moveTo(t,d),c<f&&d<v?(e.arc(c,d,l,-Math.PI,-s),e.arc(f,d,l,-s,0),e.arc(f,v,l,0,s),e.arc(c,v,l,s,Math.PI)):c<f?(e.moveTo(c,r),e.arc(f,d,l,-s,s),e.arc(c,d,l,s,Math.PI+s)):d<v?(e.arc(c,d,l,-Math.PI,0),e.arc(c,v,l,0,Math.PI)):e.arc(c,d,l,-Math.PI,Math.PI),e.closePath(),e.moveTo(t,r)}else e.rect(t,r,a,n)}function Fe(e,t,r){var a=r.backgroundColor,n=r.borderColor,i=r.borderWidth;!a&&(!n||!i)||(e.beginPath(),Ue(e,C(t.x)+i/2,C(t.y)+i/2,C(t.w)-i,C(t.h)-i,r.borderRadius),e.closePath(),a&&(e.fillStyle=a,e.fill()),n&&i&&(e.strokeStyle=n,e.lineWidth=i,e.lineJoin="miter",e.stroke()))}function He(e,t,r){var a=r.lineHeight,n=e.w,i=e.x,s=e.y+a/2;return t==="center"?i+=n/2:(t==="end"||t==="right")&&(i+=n),{h:a,w:n,x:i,y:s}}function Ve(e,t,r){var a=e.shadowBlur,n=r.stroked,i=C(r.x),s=C(r.y),l=C(r.w);n&&e.strokeText(t,i,s,l),r.filled&&(a&&n&&(e.shadowBlur=0),e.fillText(t,i,s,l),a&&n&&(e.shadowBlur=a))}function We(e,t,r,a){var n=a.textAlign,i=a.color,s=!!i,l=a.font,c=t.length,d=a.textStrokeColor,f=a.textStrokeWidth,v=d&&f,b;if(!(!c||!s&&!v))for(r=He(r,n,l),e.font=l.string,e.textAlign=n,e.textBaseline="middle",e.shadowBlur=a.textShadowBlur,e.shadowColor=a.textShadowColor,s&&(e.fillStyle=i),v&&(e.lineJoin="round",e.lineWidth=f,e.strokeStyle=d),b=0,c=t.length;b<c;++b)Ve(e,t[b],{stroked:v,filled:s,w:r.w,x:r.x,y:r.y+r.h*b})}var he=function(e,t,r,a){var n=this;n._config=e,n._index=a,n._model=null,n._rects=null,n._ctx=t,n._el=r};B(he.prototype,{_modelize:function(e,t,r,a){var n=this,i=n._index,s=Ce(p([r.font,{}],a,i)),l=p([r.color,Re.color],a,i);return{align:p([r.align,"center"],a,i),anchor:p([r.anchor,"center"],a,i),area:a.chart.chartArea,backgroundColor:p([r.backgroundColor,null],a,i),borderColor:p([r.borderColor,null],a,i),borderRadius:p([r.borderRadius,0],a,i),borderWidth:p([r.borderWidth,0],a,i),clamp:p([r.clamp,!1],a,i),clip:p([r.clip,!1],a,i),color:l,display:e,font:s,lines:t,offset:p([r.offset,4],a,i),opacity:p([r.opacity,1],a,i),origin:je(n._el,a),padding:Me(p([r.padding,4],a,i)),positioner:Be(n._el),rotation:p([r.rotation,0],a,i)*(Math.PI/180),size:L.textSize(n._ctx,t,s),textAlign:p([r.textAlign,"start"],a,i),textShadowBlur:p([r.textShadowBlur,0],a,i),textShadowColor:p([r.textShadowColor,l],a,i),textStrokeColor:p([r.textStrokeColor,l],a,i),textStrokeWidth:p([r.textStrokeWidth,0],a,i)}},update:function(e){var t=this,r=null,a=null,n=t._index,i=t._config,s,l,c,d=p([i.display,!0],e,n);d&&(s=e.dataset.data[n],l=Oe(ue(i.formatter,[s,e]),s),c=G(l)?[]:L.toTextLines(l),c.length&&(r=t._modelize(d,c,i,e),a=Le(r))),t._model=r,t._rects=a},geometry:function(){return this._rects?this._rects.frame:{}},rotation:function(){return this._model?this._model.rotation:0},visible:function(){return this._model&&this._model.opacity},model:function(){return this._model},draw:function(e,t){var r=this,a=e.ctx,n=r._model,i=r._rects,s;this.visible()&&(a.save(),n.clip&&(s=n.area,a.beginPath(),a.rect(s.left,s.top,s.right-s.left,s.bottom-s.top),a.clip()),a.globalAlpha=L.bound(0,n.opacity,1),a.translate(C(t.x),C(t.y)),a.rotate(n.rotation),Fe(a,i.frame,n),We(a,n.lines,i.text,n),a.restore())}});var ze=Number.MIN_SAFE_INTEGER||-9007199254740991,Ye=Number.MAX_SAFE_INTEGER||9007199254740991;function P(e,t,r){var a=Math.cos(r),n=Math.sin(r),i=t.x,s=t.y;return{x:i+a*(e.x-i)-n*(e.y-s),y:s+n*(e.x-i)+a*(e.y-s)}}function se(e,t){var r=Ye,a=ze,n=t.origin,i,s,l,c,d;for(i=0;i<e.length;++i)s=e[i],l=s.x-n.x,c=s.y-n.y,d=t.vx*l+t.vy*c,r=Math.min(r,d),a=Math.max(a,d);return{min:r,max:a}}function K(e,t){var r=t.x-e.x,a=t.y-e.y,n=Math.sqrt(r*r+a*a);return{vx:(t.x-e.x)/n,vy:(t.y-e.y)/n,origin:e,ln:n}}var ge=function(){this._rotation=0,this._rect={x:0,y:0,w:0,h:0}};B(ge.prototype,{center:function(){var e=this._rect;return{x:e.x+e.w/2,y:e.y+e.h/2}},update:function(e,t,r){this._rotation=r,this._rect={x:t.x+e.x,y:t.y+e.y,w:t.w,h:t.h}},contains:function(e){var t=this,r=1,a=t._rect;return e=P(e,t.center(),-t._rotation),!(e.x<a.x-r||e.y<a.y-r||e.x>a.x+a.w+r*2||e.y>a.y+a.h+r*2)},intersects:function(e){var t=this._points(),r=e._points(),a=[K(t[0],t[1]),K(t[0],t[3])],n,i,s;for(this._rotation!==e._rotation&&a.push(K(r[0],r[1]),K(r[0],r[3])),n=0;n<a.length;++n)if(i=se(t,a[n]),s=se(r,a[n]),i.max<s.min||s.max<i.min)return!1;return!0},_points:function(){var e=this,t=e._rect,r=e._rotation,a=e.center();return[P({x:t.x,y:t.y},a,r),P({x:t.x+t.w,y:t.y},a,r),P({x:t.x+t.w,y:t.y+t.h},a,r),P({x:t.x,y:t.y+t.h},a,r)]}});function ye(e,t,r){var a=t.positioner(e,t),n=a.vx,i=a.vy;if(!n&&!i)return{x:a.x,y:a.y};var s=r.w,l=r.h,c=t.rotation,d=Math.abs(s/2*Math.cos(c))+Math.abs(l/2*Math.sin(c)),f=Math.abs(s/2*Math.sin(c))+Math.abs(l/2*Math.cos(c)),v=1/Math.max(Math.abs(n),Math.abs(i));return d*=n*v,f*=i*v,d+=t.offset*n,f+=t.offset*i,{x:a.x+d,y:a.y+f}}function Ke(e,t){var r,a,n,i;for(r=e.length-1;r>=0;--r)for(n=e[r].$layout,a=r-1;a>=0&&n._visible;--a)i=e[a].$layout,i._visible&&n._box.intersects(i._box)&&t(n,i);return e}function Xe(e){var t,r,a,n,i,s,l;for(t=0,r=e.length;t<r;++t)a=e[t],n=a.$layout,n._visible&&(l=new Proxy(a._el,{get:(c,d)=>c.getProps([d],!0)[d]}),i=a.geometry(),s=ye(l,a.model(),i),n._box.update(s,i,a.rotation()));return Ke(e,function(c,d){var f=c._hidable,v=d._hidable;f&&v||v?d._visible=!1:f&&(c._visible=!1)})}var j={prepare:function(e){var t=[],r,a,n,i,s;for(r=0,n=e.length;r<n;++r)for(a=0,i=e[r].length;a<i;++a)s=e[r][a],t.push(s),s.$layout={_box:new ge,_hidable:!1,_visible:!0,_set:r,_idx:s._index};return t.sort(function(l,c){var d=l.$layout,f=c.$layout;return d._idx===f._idx?f._set-d._set:f._idx-d._idx}),this.update(t),t},update:function(e){var t=!1,r,a,n,i,s;for(r=0,a=e.length;r<a;++r)n=e[r],i=n.model(),s=n.$layout,s._hidable=i&&i.display==="auto",s._visible=n.visible(),t|=s._hidable;t&&Xe(e)},lookup:function(e,t){var r,a;for(r=e.length-1;r>=0;--r)if(a=e[r].$layout,a&&a._visible&&a._box.contains(t))return e[r];return null},draw:function(e,t){var r,a,n,i,s,l;for(r=0,a=t.length;r<a;++r)n=t[r],i=n.$layout,i._visible&&(s=n.geometry(),l=ye(n._el,n.model(),s),i._box.update(l,s,n.rotation()),n.draw(e,l))}},qe=function(e){if(G(e))return null;var t=e,r,a,n;if(De(e))if(!G(e.label))t=e.label;else if(!G(e.r))t=e.r;else for(t="",r=Object.keys(e),n=0,a=r.length;n<a;++n)t+=(n!==0?", ":"")+r[n]+": "+e[r[n]];return""+t},Ze={align:"center",anchor:"center",backgroundColor:null,borderColor:null,borderRadius:0,borderWidth:0,clamp:!1,clip:!1,color:void 0,display:!0,font:{family:void 0,lineHeight:1.2,size:void 0,style:void 0,weight:null},formatter:qe,labels:void 0,listeners:{},offset:4,opacity:1,padding:{top:4,right:4,bottom:4,left:4},rotation:0,textAlign:"start",textStrokeColor:void 0,textStrokeWidth:0,textShadowBlur:0,textShadowColor:void 0},A="$datalabels",pe="$default";function Je(e,t){var r=e.datalabels,a={},n=[],i,s;return r===!1?null:(r===!0&&(r={}),t=B({},[t,r]),i=t.labels||{},s=Object.keys(i),delete t.labels,s.length?s.forEach(function(l){i[l]&&n.push(B({},[t,i[l],{_key:l}]))}):n.push(t),a=n.reduce(function(l,c){return we(c.listeners||{},function(d,f){l[f]=l[f]||{},l[f][c._key||pe]=d}),delete c.listeners,l},{}),{labels:n,listeners:a})}function q(e,t,r,a){if(t){var n=r.$context,i=r.$groups,s;t[i._set]&&(s=t[i._set][i._key],s&&ue(s,[n,a])===!0&&(e[A]._dirty=!0,r.update(n)))}}function Qe(e,t,r,a,n){var i,s;!r&&!a||(r?a?r!==a&&(s=i=!0):s=!0:i=!0,s&&q(e,t.leave,r,n),i&&q(e,t.enter,a,n))}function er(e,t){var r=e[A],a=r._listeners,n,i;if(!(!a.enter&&!a.leave)){if(t.type==="mousemove")i=j.lookup(r._labels,t);else if(t.type!=="mouseout")return;n=r._hovered,r._hovered=i,Qe(e,a,n,i,t)}}function rr(e,t){var r=e[A],a=r._listeners.click,n=a&&j.lookup(r._labels,t);n&&q(e,a,n,t)}var ir={id:"datalabels",defaults:Ze,beforeInit:function(e){e[A]={_actives:[]}},beforeUpdate:function(e){var t=e[A];t._listened=!1,t._listeners={},t._datasets=[],t._labels=[]},afterDatasetUpdate:function(e,t,r){var a=t.index,n=e[A],i=n._datasets[a]=[],s=e.isDatasetVisible(a),l=e.data.datasets[a],c=Je(l,r),d=t.meta.data||[],f=e.ctx,v,b,w,_,D,U,R,N;for(f.save(),v=0,w=d.length;v<w;++v)if(R=d[v],R[A]=[],s&&R&&e.getDataVisibility(v)&&!R.skip)for(b=0,_=c.labels.length;b<_;++b)D=c.labels[b],U=D._key,N=new he(D,f,R,v),N.$groups={_set:a,_key:U||pe},N.$context={active:!1,chart:e,dataIndex:v,dataset:l,datasetIndex:a},N.update(N.$context),R[A].push(N),i.push(N);f.restore(),B(n._listeners,c.listeners,{merger:function(T,k,F){k[T]=k[T]||{},k[T][t.index]=F[T],n._listened=!0}})},afterUpdate:function(e){e[A]._labels=j.prepare(e[A]._datasets)},afterDatasetsDraw:function(e){j.draw(e,e[A]._labels)},beforeEvent:function(e,t){if(e[A]._listened){var r=t.event;switch(r.type){case"mousemove":case"mouseout":er(e,r);break;case"click":rr(e,r);break}}},afterEvent:function(e){var t=e[A],r=t._actives,a=t._actives=e.getActiveElements(),n=L.arrayDiff(r,a),i,s,l,c,d,f,v;for(i=0,s=n.length;i<s;++i)if(d=n[i],d[1])for(v=d[0].element[A]||[],l=0,c=v.length;l<c;++l)f=v[l],f.$context.active=d[1]===1,f.update(f.$context);(t._dirty||n.length)&&(j.update(t._labels),e.render()),delete t._dirty}};export{nr as D,ir as p};
