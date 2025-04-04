import{b as le,d as ie,r as w,j as e}from"./index-8e4cbc88.js";import{C as oe,a as ce,L as de,P as me,b as fe,p as Ne,c as ue,d as he,D as p,e as Ae}from"./index-f7359a56.js";oe.register(ce,de,me,fe,Ne,ue,he);function xe(){const{lguName:a}=le(),s=ie(),[l,D]=w.useState(null),[$,j]=w.useState(0),[E,v]=w.useState("About"),[x,M]=w.useState([]),[g,S]=w.useState(null),[R,O]=w.useState({}),[n,ee]=w.useState("DIGITAL SKILLS ASSESSMENT"),[F,se]=w.useState([]),[L,Y]=w.useState("All Offices");w.useEffect(()=>{var N,c;(N=s.state)!=null&&N.score&&j(s.state.score);const i=a||((c=s.state)==null?void 0:c.lguName);if(i&&p){const d=p.Info.find(m=>{var u;return((u=m["LGU Name"])==null?void 0:u.toUpperCase())===i.toUpperCase()}),o=p["Mayors Office"].find(m=>{var u;return((u=m["LGU Name"])==null?void 0:u.toUpperCase())===i.toUpperCase()});if(d){D({...d,...o});const m=ge(i,["Mayors Office","Other Offices","HR Office","IT Office"]);m&&(S(m),j(m.totalScore),O(m.componentScores),console.log("Component Scores:",m.componentScores.digitalSkills));const u=["Mayor's Office","HR Office","IT Office"],C=p["Other Offices"].filter(G=>{var Q;return((Q=G["LGU Name"])==null?void 0:Q.toUpperCase())===i.toUpperCase()}),y=[...new Set(C.map(G=>G["Office Name"]))];se(["All Offices",...u,...y])}}},[a,s]);function U(i){switch(i){case"DIGITAL SKILLS ASSESSMENT":return R.digitalSkills;case"TECHNOLOGY READINESS INDEX":return R.techReadiness;case"IT READINESS ASSESSMENT":return R.itReadiness;case"ICT CHANGE MANAGEMENT":return R.changeManagement}}if(!l)return e.jsx("div",{className:"min-h-full w-full flex items-center justify-center",children:e.jsx("div",{className:"p-5 w-[95%] flex flex-col bg-card/25 border border-border rounded-lg",children:e.jsx("h1",{className:"py-4 px-2 text-center font-bold text-xl border text-[#0036C5] border-[#0036C5]",children:"LGU Information Not Found"})})});const r=i=>{if(i==="All Offices")return t();const N=i==="Mayor's Office"?"Mayors Office":i;let c,d=p;if(["Mayor's Office","HR Office","IT Office"].includes(i)?c=d[N==="Mayor's Office"?"Mayors Office":N].find(u=>{var C,y;return((C=u["LGU Name"])==null?void 0:C.toUpperCase())===((y=l["LGU Name"])==null?void 0:y.toUpperCase())}):c=d["Other Offices"].find(u=>{var C,y;return((C=u["LGU Name"])==null?void 0:C.toUpperCase())===((y=l["LGU Name"])==null?void 0:y.toUpperCase())&&u["Office Name"]===i}),!c)return t();let o=[],m=[];switch(n){case"DIGITAL SKILLS ASSESSMENT":o=k[0].data,m=o.map((u,C)=>{const y=`Question ${C+1} DigitalSkillsAssessment`,G=c[y]||0;return Number(G)/5*100});break;case"TECHNOLOGY READINESS INDEX":o=k[1].data,m=o.map(u=>{var Q;const C=u.split(" ")[0],y=parseInt(((Q=u.match(/\((\d+) questions\)/))==null?void 0:Q[1])||"0");let G=0;for(let K=1;K<=y;K++){const Z=`${C} ${K}`;G+=Number(c[Z]||0)}return G/(y*5)*100});break;default:return t()}return{labels:o,datasets:[{label:`${n} - ${i}`,data:m,borderColor:"#0036C5",backgroundColor:"rgba(0, 54, 197, 0.1)",tension:.4}]}},t=()=>{let i=[],N=[];switch(n){case"DIGITAL SKILLS ASSESSMENT":i=k[0].data,N=g.digitalSkills.scores.map(c=>c.score);break;case"TECHNOLOGY READINESS INDEX":i=k[1].data,N=g.technologyReadiness.categories.map(c=>c.average);break;case"IT READINESS ASSESSMENT":i=k[2].data,N=g.itReadiness.categories.map(c=>c.score);break;case"ICT CHANGE MANAGEMENT":i=k[3].data,N=g.changeManagement.categories.map(c=>c.score);break}return{labels:i,datasets:[{label:n,data:N,borderColor:"#0036C5",backgroundColor:"rgba(0, 54, 197, 0.1)",tension:.4}]}},I=()=>{var N,c;if(!g)return null;const i=L==="All Offices"?t():r(L);return e.jsxs("div",{className:"space-y-4  w-full",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-4 mb-6",children:[e.jsx("label",{className:"font-medium",children:"Select Assessment:"}),e.jsx("select",{value:n,onChange:d=>{ee(d.target.value),Y("All Offices")},className:"border rounded-md p-2",children:k.map(d=>e.jsx("option",{value:d.title,children:d.title},d.title))})]}),e.jsx("div",{className:"flex flex-col md:flex-row gap-6",children:e.jsxs("div",{className:"w-full grid grid-cols-2 md:grid-cols-1 gap-5 order-1 md:order-2",children:[e.jsxs("div",{className:" col-span-1",children:[e.jsxs("div",{className:"bg-white p-4 rounded-lg shadow flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsxs("h3",{className:"text-lg font-semibold",children:[n," Score"]}),e.jsx("p",{className:"text-sm text-gray-600",children:L==="All Offices"?"Average across all offices":`For ${L}`})]}),e.jsxs("div",{className:"relative w-24 h-24 ",children:[e.jsxs("svg",{className:"w-full h-full md:hidden transform -rotate-90",children:[e.jsx("circle",{cx:"48",cy:"48",r:"40",fill:"none",stroke:"#eee",strokeWidth:"8"}),e.jsx("circle",{cx:"48",cy:"48",r:"40",fill:"none",stroke:U(n)>=80?"#10B981":U(n)>=60?"#0036C5":U(n)>=40?"#FBBF24":"#EF4444",strokeWidth:"8",strokeLinecap:"round",strokeDasharray:`${U(n)/100*251.2} 251.2`})]}),e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:e.jsxs("span",{className:"text-2xl font-bold",style:{color:U(n)>=80?"#10B981":U(n)>=60?"#0036C5":U(n)>=40?"#FBBF24":"#EF4444"},children:[(N=U(n))==null?void 0:N.toFixed(1),"%"]})})]})]}),e.jsxs("div",{className:"w-full  order-2 md:order-1",children:[e.jsx("h3",{className:"text-xl font-semibold mt-10 mb-4",children:"Detailed Scores"}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2  gap-4  overflow-y-auto pr-2",children:(c=k.find(d=>d.title===n))==null?void 0:c.data.map((d,o)=>{var y,G,Q,K,Z,te,re,ae;let m=0,u=[];switch(n){case"DIGITAL SKILLS ASSESSMENT":m=(y=g.digitalSkills.scores[o])==null?void 0:y.score,u=((G=g.digitalSkills.scores[o])==null?void 0:G.responses)||[];break;case"TECHNOLOGY READINESS INDEX":m=(Q=g.technologyReadiness.categories[o])==null?void 0:Q.average;break;case"IT READINESS ASSESSMENT":m=(Z=(K=g.itReadiness)==null?void 0:K.categories[o])==null?void 0:Z.score;break;case"ICT CHANGE MANAGEMENT":m=(re=(te=g.changeManagement)==null?void 0:te.categories[o])==null?void 0:re.score;break}const C=m>=80?"bg-blue-50 border-blue-300":m>=50?" bg-yellow-100/40 border-yellow-200":m>=30?"bg-red-100 border-red-200":"bg-red-50 border-red-200";return e.jsxs("div",{className:`p-4 rounded-lg border ${C} hover:shadow-md cursor-pointer transition-all duration-200`,children:[e.jsx("div",{className:"text-sm text-gray-600 font-medium",children:d}),e.jsxs("div",{className:"text-lg font-semibold text-[#0036C5]",children:[m==null?void 0:m.toFixed(2),"%"]}),n==="DIGITAL SKILLS ASSESSMENT"&&(u==null?void 0:u.length)>0&&e.jsxs("div",{className:"mt-2",children:[e.jsx("button",{onClick:()=>{M(f=>f.includes(`${n}-${o}`)?f.filter(h=>h!==`${n}-${o}`):[...f,`${n}-${o}`])},className:"text-xs text-blue-600 hover:underline",children:x.includes(`${n}-${o}`)?"Hide Details":"View Office Responses"}),x.includes(`${n}-${o}`)&&e.jsx("div",{className:"mt-2 text-xs bg-white p-2 rounded border",children:e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-left py-1",children:"Office"}),e.jsx("th",{className:"text-right py-1",children:"Rating (1-5)"})]})}),e.jsx("tbody",{children:F.filter(f=>f!=="All Offices").map((f,h)=>{const B=f==="Mayor's Office"?"Mayors Office":f;let P=0,A=p;if(["Mayor's Office","HR Office","IT Office"].includes(f)){const b=A[B==="Mayor's Office"?"Mayors Office":B].find(H=>{var T,_;return((T=H["LGU Name"])==null?void 0:T.toUpperCase())===((_=l["LGU Name"])==null?void 0:_.toUpperCase())});P=Number((b==null?void 0:b[`Question ${o+1} DigitalSkillsAssessment`])||0)}else{let b=p["Other Offices"].find(H=>{var T,_;return((T=H["LGU Name"])==null?void 0:T.toUpperCase())===((_=l["LGU Name"])==null?void 0:_.toUpperCase())&&H["Office Name"]===f});P=Number((b==null?void 0:b[`Question ${o+1} DigitalSkillsAssessment`])||0)}return e.jsxs("tr",{className:"border-t",children:[e.jsx("td",{className:"py-1",children:f}),e.jsx("td",{className:"text-right py-1",children:e.jsxs("div",{className:"flex items-center justify-end",children:[e.jsx("div",{className:"w-24 bg-gray-200 rounded-full h-2 mr-2",children:e.jsx("div",{className:"bg-blue-600 h-2 rounded-full",style:{width:`${P/5*100}%`}})}),P]})})]},h)})})]})})]}),n==="TECHNOLOGY READINESS INDEX"&&e.jsxs("div",{className:"mt-2",children:[e.jsx("button",{onClick:()=>{M(f=>f.includes(`${n}-${o}`)?f.filter(h=>h!==`${n}-${o}`):[...f,`${n}-${o}`])},className:"text-xs text-blue-600 hover:underline",children:x.includes(`${n}-${o}`)?"Hide Questions":"View Questions"}),x.includes(`${n}-${o}`)&&e.jsx("div",{className:"mt-2 text-xs bg-white p-2 rounded border",children:e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-left py-1",children:"Question"}),e.jsx("th",{className:"text-right py-1",children:"Average Score"})]})}),e.jsx("tbody",{children:k[1].questions[d.split(" ")[0]].map((f,h)=>{const P=Se(F,d.split(" ")[0],h+1,l)/5*100;return e.jsxs(e.Fragment,{children:[e.jsxs("tr",{className:"border-t hover:bg-gray-50 cursor-pointer",onClick:()=>{M(A=>A.includes(`${n}-${o}-${h}`)?A.filter(b=>b!==`${n}-${o}-${h}`):[...A,`${n}-${o}-${h}`])},children:[e.jsx("td",{className:"py-1",children:f}),e.jsx("td",{className:"text-right py-1",children:e.jsxs("div",{className:"flex items-center justify-end",children:[e.jsx("div",{className:"w-24 bg-gray-200 rounded-full h-2 mr-2",children:e.jsx("div",{className:"bg-blue-600 h-2 rounded-full",style:{width:`${P}%`}})}),P.toFixed(1),"%"]})})]},h),x.includes(`${n}-${o}-${h}`)&&e.jsx("tr",{children:e.jsx("td",{colSpan:2,children:e.jsx("div",{className:"pl-4 py-2 bg-gray-50",children:e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-left py-1",children:"Office"}),e.jsx("th",{className:"text-right py-1",children:"Rating (0-5)"})]})}),e.jsx("tbody",{children:F.filter(A=>A!=="All Offices").map((A,b)=>{const H=A==="Mayor's Office"?"Mayors Office":A;let T=0,_=p;if(["Mayor's Office","HR Office","IT Office"].includes(A)){const q=_[H==="Mayor's Office"?"Mayors Office":H].find(J=>{var W,X;return((W=J["LGU Name"])==null?void 0:W.toUpperCase())===((X=l["LGU Name"])==null?void 0:X.toUpperCase())});T=Number((q==null?void 0:q[`${d.split(" ")[0]} ${h+1}`])||0)}else{let q=p["Other Offices"].find(J=>{var W,X;return((W=J["LGU Name"])==null?void 0:W.toUpperCase())===((X=l["LGU Name"])==null?void 0:X.toUpperCase())&&J["Office Name"]===A});T=Number((q==null?void 0:q[`${d.split(" ")[0]} ${h+1}`])||0)}return e.jsxs("tr",{className:"border-t",children:[e.jsx("td",{className:"py-1",children:A}),e.jsx("td",{className:"text-right py-1",children:e.jsxs("div",{className:"flex items-center justify-end",children:[e.jsx("div",{className:"w-24 bg-gray-200 rounded-full h-2 mr-2",children:e.jsx("div",{className:"bg-blue-600 h-2 rounded-full",style:{width:`${T/5*100}%`}})}),T]})})]},b)})})]})})})})]})})})]})})]}),(n==="IT READINESS ASSESSMENT"||n==="ICT CHANGE MANAGEMENT")&&e.jsxs("div",{className:"mt-2",children:[e.jsx("button",{onClick:()=>{M(f=>f.includes(`${n}-${o}`)?f.filter(h=>h!==`${n}-${o}`):[...f,`${n}-${o}`])},className:"text-xs text-blue-600 hover:underline",children:x.includes(`${n}-${o}`)?"Hide Questions":"View Questions"}),x.includes(`${n}-${o}`)&&e.jsx("div",{className:"mt-2 text-xs bg-white p-2 rounded border",children:e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-left py-1",children:"Question"}),e.jsx("th",{className:"text-right py-1",children:"Score"})]})}),e.jsx("tbody",{children:(ae=k.find(f=>f.title===n))==null?void 0:ae.questions[d.split(" (")[0]].map((f,h)=>{let B=0;const P=n==="IT READINESS ASSESSMENT"?`${d.split(" (")[0].replace(/ /g," ")} ${h+1}`:`${d.split(" (")[0]} ${h+1}`;let A=p["IT Office"].find(H=>{var T,_;return((T=H["LGU Name"])==null?void 0:T.toUpperCase())===((_=l["LGU Name"])==null?void 0:_.toUpperCase())});B=Number((A==null?void 0:A[P])||0);const b=B/5*100;return e.jsxs("tr",{className:"border-t",children:[e.jsx("td",{className:"py-1",children:f}),e.jsx("td",{className:"text-right py-1",children:e.jsxs("div",{className:"flex items-center justify-end",children:[e.jsx("div",{className:"w-24 bg-gray-200 rounded-full h-2 mr-2",children:e.jsx("div",{className:"bg-blue-600 h-2 rounded-full",style:{width:`${b}%`}})}),b.toFixed(1),"%"]})})]},h)})})]})})]})]},o)})})]})]}),e.jsx("div",{className:"bg-white p-6 col-span-1 rounded-lg shadow",children:e.jsx("div",{className:"h-[500px]",children:e.jsx(Ae,{data:i,options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{beginAtZero:!0,max:100,title:{display:!0,text:"Score (%)"}}},plugins:{legend:{position:"top"},title:{display:!0,text:`${n} Breakdown${L!=="All Offices"?` - ${L}`:""}`}}}})})})]})})]})};return e.jsx("div",{className:"min-h-full w-full py-10 flex items-center justify-center",children:e.jsxs("div",{className:"p-5 h-full relative  w-[95%] flex flex-col bg-card/25 border border-border border-b-0 rounded-lg   ",children:[e.jsx("h1",{className:"py-4 px-2 text-center font-bold text-xl mb-4 border text-[#0036C5] border-[#0036C5]",children:`${l["LGU Name"]}, Misamis Oriental`}),e.jsx("div",{className:"bg-white h-full p-6 rounded-lg border border-border ",children:e.jsxs("div",{className:"flex relative h-full justify-between md:items-end items-center md:flex-col",children:[e.jsx("div",{className:"w-[80%] md:w-full ",children:e.jsxs("div",{className:"grid grid-cols-3 gap-6",children:[e.jsx(V,{span:"2",label:"Municipality",value:l["LGU Name"]}),e.jsx(V,{label:"Income Class",value:l["Income Class"]}),e.jsx(V,{label:"Mayor",value:l.Mayor}),e.jsx(V,{label:"Vice Mayor",value:l["Vice Mayor"]}),e.jsx(V,{label:"Population",value:l["No. of Population"]}),e.jsx(V,{label:"Barangays",value:l["No. of Barangays"]}),e.jsx("div",{children:e.jsx(V,{label:"Location",value:`${l.Latitude}° N, ${l.Longitude}° E`})})]})}),e.jsxs("div",{className:" w-[30%] md:w-full  h-full flex flex-col  items-center md:items-end ",children:[e.jsx(Ee,{score:Math.round($)}),e.jsxs("h1",{className:" absolute bottom-0 right-0 md:left-0  font-black text-6xl text-[#a8b6cb]",children:[l["LGU Name"]," "]})]})]})}),e.jsx("div",{className:"border-b w-full border-gray-200",children:e.jsx("nav",{className:"flex",children:["About","Assessment","Attachments"].map(i=>e.jsx("button",{onClick:()=>v(i),className:`mr-4 md:mr-8 py-3 md:py-4 px-1 text-sm md:text-base ${E===i?"border-b-2 border-red-500 text-red-500 font-medium":"text-gray-500 hover:text-gray-700 border-transparent"}`,children:i},i))})}),e.jsxs("div",{className:"py-4 md:py-6 w-full md:w-full",children:[E==="About"&&e.jsxs("div",{className:"w-full  md:flex-row grid grid-cols-6",children:[e.jsx("div",{className:" col-span-4 pr-0 md:pr-6",children:e.jsx("p",{className:"mb-4 text-sm md:text-base",children:l.descriptioon})}),e.jsx("div",{className:" col-span-2  flex justify-center items-start",children:e.jsx("img",{src:l.Logo,alt:`${l["LGU Name"]} Logo`,className:" w-full max-w-[200px] mt-[10%] h-auto object-contain"})})]}),E==="Assessment"&&I(),E==="Attachments"&&e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Attachments"})]})]})})}const V=({label:a,value:s,span:l})=>e.jsxs("div",{className:`bg-gray-50 p-4 rounded-lg border border-border col-span-${l||1}`,children:[e.jsx("div",{className:"text-sm text-gray-700 mb-1",children:a}),e.jsx("div",{className:"font-bold text-lg",children:s})]}),Ee=({score:a})=>e.jsxs("div",{className:" flex flex-col items-center ",children:[e.jsx("div",{className:"text-xl font-bold text-[#0036C5] mb-2",children:"Score"}),e.jsxs("div",{className:"relative w-40 h-40",children:[e.jsxs("svg",{className:"w-full h-full transform -rotate-90",children:[e.jsx("circle",{cx:"80",cy:"80",r:"70",fill:"none",stroke:"#ecc216",strokeWidth:"15"}),e.jsx("circle",{cx:"80",cy:"80",r:"70",fill:"none",stroke:"#0036C5",strokeWidth:"15",strokeLinecap:"round",strokeDasharray:`${a/100*439.6} 439.6`})]}),e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:e.jsxs("span",{className:"text-5xl font-bold",style:{color:a>=50?"#0036c6":"#ecc216"},children:[a,"%"]})})]})]}),ne=a=>{const s=a.reduce((D,$)=>D+Number($||0),0),l=a.length*5;return s/l*100},z=a=>{const s=a.filter(l=>l!=null);return s.length?s.reduce((l,D)=>l+D,0)/s.length:0},ge=(a,s)=>{let l=[],D=p;if(s.forEach(r=>{var t,I;if(r==="Other Offices"){const i=(t=p[r])==null?void 0:t.filter(N=>{var c;return((c=N["LGU Name"])==null?void 0:c.toUpperCase())===(a==null?void 0:a.toUpperCase())});i&&l.push(...i)}else{const i=(I=D[r])==null?void 0:I.filter(N=>{var c;return((c=N["LGU Name"])==null?void 0:c.toUpperCase())===(a==null?void 0:a.toUpperCase())});i&&l.push(...i)}}),console.log("Offices Data:",l),!l.length)return null;const $=Array.from({length:10},(r,t)=>{const I=`Question ${t+1} DigitalSkillsAssessment`,i=l.map(o=>Number(o[I]||0)),N=i.reduce((o,m)=>o+m,0),c=i.length*5,d=N/c*100;return{question:I,responses:i,score:d}}),j=(r,t)=>{const I=l.flatMap(c=>Array.from({length:t},(d,o)=>Number(c[`${r} ${o+1}`]||0))),i=I.reduce((c,d)=>c+d,0),N=I.length*5;return i/N*100},E=j("Optimism",10),v=j("Innovativeness",7),x=j("Discomfort",10),M=j("Insecurity",9),g=[{category:"Optimism",average:E},{category:"Innovativeness",average:v},{category:"Discomfort",average:x},{category:"Insecurity",average:M}],S=p["IT Office"].find(r=>r["LGU Name"]===a),R={"BASIC IT READINESS":Array.from({length:4},(r,t)=>`BASIC IT READINESS ${t+1}`),"IT GOVERNANCE FRAMEWORK & POLICIES":Array.from({length:3},(r,t)=>`IT GOVERNANCE FRAMEWORK & POLICIES ${t+1}`),"IT STRATEGY AND ALIGNMENT":Array.from({length:3},(r,t)=>`IT STRATEGY AND ALIGNMENT ${t+1}`),"IT POLICIES AND PROCEDURES":Array.from({length:3},(r,t)=>`IT POLICIES AND PROCEDURES ${t+1}`),"RISK MANAGEMENT":Array.from({length:3},(r,t)=>`RISK MANAGEMENT ${t+1}`),"IT PERFORMANCE MEASUREMENT AND REPORTING":Array.from({length:3},(r,t)=>`IT PERFORMANCE MEASUREMENT AND REPORTING ${t+1}`),"IT INVESTMENT MANAGEMENT":Array.from({length:3},(r,t)=>`IT INVESTMENT MANAGEMENT ${t+1}`),"VENDOR MANAGEMENT":Array.from({length:3},(r,t)=>`VENDOR MANAGEMENT ${t+1}`),"IT SECURITY AND COMPLIANCE":Array.from({length:3},(r,t)=>`IT SECURITY AND COMPLIANCE ${t+1}`),"ICT Organizational Structure and Skills":Array.from({length:3},(r,t)=>`ICT Organizational Structure and Skills ${t+1}`),"Audit and Assurance":Array.from({length:3},(r,t)=>`Audit and Assurance ${t+1}`),"Network Infrastructure":Array.from({length:2},(r,t)=>`Network Infrastructure ${t+1}`),"Servers and Storage":Array.from({length:3},(r,t)=>`Servers and Storage ${t+1}`),Virtualization:Array.from({length:3},(r,t)=>`Virtualization ${t+1}`),"Data Backup and Recovery":Array.from({length:3},(r,t)=>`Data Backup and Recovery ${t+1}`),"Scalability and Elasticity":Array.from({length:3},(r,t)=>`Scalability and Elasticity ${t+1}`),"Security Measures":Array.from({length:4},(r,t)=>`Security Measures ${t+1}`),"Monitoring and Performance":Array.from({length:3},(r,t)=>`Monitoring and Performance ${t+1}`),"Compliance and Governance":Array.from({length:3},(r,t)=>`Compliance and Governance ${t+1}`),"Integration and Interoperability":Array.from({length:3},(r,t)=>`Integration and Interoperability ${t+1}`),"Disaster Recovery and Business Continuity":Array.from({length:3},(r,t)=>`Disaster Recovery and Business Continuity ${t+1}`)},O=Object.entries(R).map(([r,t])=>{const I=t.map(N=>Number((S==null?void 0:S[N])||0)),i=ne(I);return{category:r,score:i}});let n=0;O.map(r=>n+=r.score),console.log("IT Readiness Scores:",O),n=n/21,console.log("IT Readiness Scores:",n);const ee={"CHANGE READINESS":Array.from({length:3},(r,t)=>`CHANGE READINESS ${t+1}`),"CHANGE LEADERSHIP":Array.from({length:2},(r,t)=>`CHANGE LEADERSHIP ${t+1}`),"CHANGE COMMUNICATION":Array.from({length:3},(r,t)=>`CHANGE COMMUNICATION ${t+1}`),"CHANGE IMPACT ASSESSMENT":Array.from({length:3},(r,t)=>`CHANGE IMPACT ASSESSMENT ${t+1}`),"STAKEHOLDER ENGAGEMENT":Array.from({length:3},(r,t)=>`STAKEHOLDER ENGAGEMENT ${t+1}`),"CHANGE PLANNING AND EXECUTION":Array.from({length:3},(r,t)=>`CHANGE PLANNING AND EXECUTION ${t+1}`),"TRAINING AND DEVELOPMENT":Array.from({length:3},(r,t)=>`TRAINING AND DEVELOPMENT ${t+1}`),"Resistance Management":Array.from({length:3},(r,t)=>`Resistance Management ${t+1}`),"Evaluation and Continuous Improvement":Array.from({length:3},(r,t)=>`Evaluation and Continuous Improvement ${t+1}`),"Sustainability and Embedding":Array.from({length:3},(r,t)=>`Sustainability and Embedding ${t+1}`),"Costs or Financial":Array.from({length:5},(r,t)=>`Costs or Financial ${t+1}`)},F=Object.entries(ee).map(([r,t])=>({category:r,score:ne(t.map(I=>Number((S==null?void 0:S[I])||0)))})),se=g.map(r=>({...r,average:r.average}));console.log("categoryAverages :",se);const L=z(O.map(r=>r.score)),Y=z(F.map(r=>r.score)),U=(z($.map(r=>r.score))+(E+v+x+M)/4+L+Y)/4;return{digitalSkills:{scores:$,average:z($.map(r=>r.score))},technologyReadiness:{categories:g,average:(E+v+x+M)/4},itReadiness:{categories:O,average:L},changeManagement:{categories:F,average:Y},totalScore:Math.round(U*100)/100,componentScores:{digitalSkills:Math.round(z($.map(r=>r.score))*100)/100,techReadiness:Math.round((E+v+x+M)/4*100)/100,itReadiness:Math.round(L*100)/100,changeManagement:Math.round(Y*100)/100}}},k=[{title:"DIGITAL SKILLS ASSESSMENT",data:["Basic computer skill","Basic Internet searching","General computer or office productivity software use","Use of collaborative platforms","Use of communication apps","Use of social media","Content creation","Cybersecurity awareness","Programming, web, and app dev...","Digital design and data vi..."]},{title:"TECHNOLOGY READINESS INDEX",data:["Optimism (10 questions)","Innovativeness (7 questions)","Discomfort (10 questions)","Insecurity (9 questions)"],questions:{Optimism:Array.from({length:10},(a,s)=>`Q${s+1}`),Innovativeness:Array.from({length:7},(a,s)=>`Q${s+1}`),Discomfort:Array.from({length:10},(a,s)=>`Q${s+1}`),Insecurity:Array.from({length:9},(a,s)=>`Q${s+1}`)}},{title:"IT READINESS ASSESSMENT",data:["BASIC IT READINESS (4 questions)","IT GOVERNANCE FRAMEWORK & POLICIES (3 questions)","IT STRATEGY AND ALIGNMENT (3 questions)","IT POLICIES AND PROCEDURES (3 questions)","RISK MANAGEMENT (3 questions)","IT PERFORMANCE MEASUREMENT AND REPORTING (3 questions)","IT INVESTMENT MANAGEMENT (3 questions)","VENDOR MANAGEMENT (3 questions)","IT SECURITY AND COMPLIANCE (3 questions)","ICT Organizational Structure and Skills (3 questions)","Audit and Assurance (3 questions)","Network Infrastructure (2 questions)","Servers and Storage (3 questions)","Virtualization (3 questions)","Data Backup and Recovery (3 questions)","Scalability and Elasticity (3 questions)","Security Measures (4 questions)","Monitoring and Performance (3 questions)","Compliance and Governance (3 questions)","Integration and Interoperability (3 questions)","Disaster Recovery and Business Continuity (3 questions)"],questions:{"BASIC IT READINESS":Array.from({length:4},(a,s)=>`Q${s+1}`),"IT GOVERNANCE FRAMEWORK & POLICIES":Array.from({length:3},(a,s)=>`Q${s+1}`),"IT STRATEGY AND ALIGNMENT":Array.from({length:3},(a,s)=>`Q${s+1}`),"IT POLICIES AND PROCEDURES":Array.from({length:3},(a,s)=>`Q${s+1}`),"RISK MANAGEMENT":Array.from({length:3},(a,s)=>`Q${s+1}`),"IT PERFORMANCE MEASUREMENT AND REPORTING":Array.from({length:3},(a,s)=>`Q${s+1}`),"IT INVESTMENT MANAGEMENT":Array.from({length:3},(a,s)=>`Q${s+1}`),"VENDOR MANAGEMENT":Array.from({length:3},(a,s)=>`Q${s+1}`),"IT SECURITY AND COMPLIANCE":Array.from({length:3},(a,s)=>`Q${s+1}`),"ICT Organizational Structure and Skills":Array.from({length:3},(a,s)=>`Q${s+1}`),"Audit and Assurance":Array.from({length:3},(a,s)=>`Q${s+1}`),"Network Infrastructure":Array.from({length:2},(a,s)=>`Q${s+1}`),"Servers and Storage":Array.from({length:3},(a,s)=>`Q${s+1}`),Virtualization:Array.from({length:3},(a,s)=>`Q${s+1}`),"Data Backup and Recovery":Array.from({length:3},(a,s)=>`Q${s+1}`),"Scalability and Elasticity":Array.from({length:3},(a,s)=>`Q${s+1}`),"Security Measures":Array.from({length:4},(a,s)=>`Q${s+1}`),"Monitoring and Performance":Array.from({length:3},(a,s)=>`Q${s+1}`),"Compliance and Governance":Array.from({length:3},(a,s)=>`Q${s+1}`),"Integration and Interoperability":Array.from({length:3},(a,s)=>`Q${s+1}`),"Disaster Recovery and Business Continuity":Array.from({length:3},(a,s)=>`Q${s+1}`)}},{title:"ICT CHANGE MANAGEMENT",data:["CHANGE READINESS (3 questions)","CHANGE LEADERSHIP (2 questions)","CHANGE COMMUNICATION (3 questions)","CHANGE IMPACT ASSESSMENT (3 questions)","STAKEHOLDER ENGAGEMENT (3 questions)","CHANGE PLANNING AND EXECUTION (3 questions)","TRAINING AND DEVELOPMENT (3 questions)","Resistance Management (3 questions)","Evaluation and Continuous Improvement (3 questions)","Sustainability and Embedding (3 questions)","Costs or Financial (5 questions)"],questions:{"CHANGE READINESS":Array.from({length:3},(a,s)=>`Q${s+1}`),"CHANGE LEADERSHIP":Array.from({length:2},(a,s)=>`Q${s+1}`),"CHANGE COMMUNICATION":Array.from({length:3},(a,s)=>`Q${s+1}`),"CHANGE IMPACT ASSESSMENT":Array.from({length:3},(a,s)=>`Q${s+1}`),"STAKEHOLDER ENGAGEMENT":Array.from({length:3},(a,s)=>`Q${s+1}`),"CHANGE PLANNING AND EXECUTION":Array.from({length:3},(a,s)=>`Q${s+1}`),"TRAINING AND DEVELOPMENT":Array.from({length:3},(a,s)=>`Q${s+1}`),"Resistance Management":Array.from({length:3},(a,s)=>`Q${s+1}`),"Evaluation and Continuous Improvement":Array.from({length:3},(a,s)=>`Q${s+1}`),"Sustainability and Embedding":Array.from({length:3},(a,s)=>`Q${s+1}`),"Costs or Financial":Array.from({length:5},(a,s)=>`Q${s+1}`)}}],Se=(a,s,l,D)=>{let $=0,j=0;return a.filter(E=>E!=="All Offices").forEach(E=>{var M,g;let v=null,x=p;if(["Mayor's Office","HR Office","IT Office"].includes(E)?v=(M=x[E==="Mayor's Office"?"Mayors Office":E])==null?void 0:M.find(R=>{var O,n;return((O=R["LGU Name"])==null?void 0:O.toUpperCase())===((n=D["LGU Name"])==null?void 0:n.toUpperCase())}):v=(g=p["Other Offices"])==null?void 0:g.find(S=>{var R,O,n;return((R=S["LGU Name"])==null?void 0:R.toUpperCase())===((O=D["LGU Name"])==null?void 0:O.toUpperCase())&&((n=S["Office Name"])==null?void 0:n.trim())===E.trim()}),v){const S=Number(v[`${s} ${l}`]||0);S>0&&($+=S,j++)}}),j>0?$/j:0};export{xe as default};
