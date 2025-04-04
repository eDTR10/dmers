import{u as b,r as S,j as a}from"./index-8e4cbc88.js";import{C as R,A as M,c as O,d as v,a as j,L,P as G,b as _,p as $,f as D,e as k,D as P}from"./index-f7359a56.js";import{D as U,p as w}from"./chartjs-plugin-datalabels.esm-af05532d.js";const c=P;R.register(M,O,v,j,L,G,_,$);const C=m=>{const o=m.filter(l=>l!=null);return o.length?o.reduce((l,h)=>l+h,0)/o.length:0},y=m=>{const o=m.filter(g=>g!=null);if(o.length===0)return 0;const l=o.length*5;return o.reduce((g,N)=>g+N,0)/l*100},H=m=>{const o=m[0]["LGU Name"],l=c["IT Office"].find(s=>s["LGU Name"]===o),g=Array.from({length:10},(s,i)=>`Question ${i+1} DigitalSkillsAssessment`).map(s=>{const i=m.map(e=>Number(e[s]||0)).filter(e=>!isNaN(e)),A=i.reduce((e,n)=>e+n,0),r=i.length*5;return A/r*100}),N=C(g),f=Object.entries({Optimism:{count:10},Innovativeness:{count:7},Discomfort:{count:10},Insecurity:{count:9}}).map(([s,{count:i}])=>{const A=m.flatMap(n=>Array.from({length:i},(d,x)=>{const T=`${s} ${x+1}`;return Number(n[T]||0)})).filter(n=>!isNaN(n)),r=A.reduce((n,d)=>n+d,0),e=A.length*5;return{category:s.toUpperCase(),score:r/e*100}}),p=C(f.map(s=>s.score));let u=0;if(l){const s={"BASIC IT READINESS":Array.from({length:4},(r,e)=>`BASIC IT READINESS ${e+1}`),"IT GOVERNANCE":Array.from({length:3},(r,e)=>`IT GOVERNANCE FRAMEWORK & POLICIES ${e+1}`),"IT STRATEGY":Array.from({length:3},(r,e)=>`IT STRATEGY AND ALIGNMENT ${e+1}`),"IT POLICIES":Array.from({length:3},(r,e)=>`IT POLICIES AND PROCEDURES ${e+1}`),"RISK MANAGEMENT":Array.from({length:3},(r,e)=>`RISK MANAGEMENT ${e+1}`),"PERFORMANCE MEASUREMENT":Array.from({length:3},(r,e)=>`IT PERFORMANCE MEASUREMENT AND REPORTING ${e+1}`),"IT INVESTMENT MANAGEMENT":Array.from({length:3},(r,e)=>`IT INVESTMENT MANAGEMENT ${e+1}`),"VENDOR MANAGEMENT":Array.from({length:3},(r,e)=>`VENDOR MANAGEMENT ${e+1}`),"IT SECURITY":Array.from({length:3},(r,e)=>`IT SECURITY AND COMPLIANCE ${e+1}`),"ICT ORGANIZATION":Array.from({length:3},(r,e)=>`ICT Organizational Structure and Skills ${e+1}`),"AUDIT & ASSURANCE":Array.from({length:3},(r,e)=>`Audit and Assurance ${e+1}`),NETWORK:Array.from({length:2},(r,e)=>`Network Infrastructure ${e+1}`),STORAGE:Array.from({length:3},(r,e)=>`Servers and Storage ${e+1}`),VIRTUALIZATION:Array.from({length:3},(r,e)=>`Virtualization ${e+1}`),BACKUP:Array.from({length:3},(r,e)=>`Data Backup and Recovery ${e+1}`),"SCALABILITY & ELASTICITY":Array.from({length:3},(r,e)=>`Scalability and Elasticity ${e+1}`),"SECURITY MEASURES":Array.from({length:4},(r,e)=>`Security Measures ${e+1}`),MONITORING:Array.from({length:3},(r,e)=>`Monitoring and Performance ${e+1}`),COMPLIANCE:Array.from({length:3},(r,e)=>`Compliance and Governance ${e+1}`),INTEGRATION:Array.from({length:3},(r,e)=>`Integration and Interoperability ${e+1}`),"DISASTER RECOVERY":Array.from({length:3},(r,e)=>`Disaster Recovery and Business Continuity ${e+1}`)};u=Object.entries(s).map(([r,e])=>({category:r,score:y(e.map(n=>Number(l[n]||0)))})).reduce((r,e)=>r+e.score,0)/Object.keys(s).length}let E=0;if(l){const s={"CHANGE READINESS":Array.from({length:3},(r,e)=>`CHANGE READINESS ${e+1}`),"CHANGE LEADERSHIP":Array.from({length:2},(r,e)=>`CHANGE LEADERSHIP ${e+1}`),"CHANGE COMMUNICATION":Array.from({length:3},(r,e)=>`CHANGE COMMUNICATION ${e+1}`),"IMPACT ASSESSMENT":Array.from({length:3},(r,e)=>`CHANGE IMPACT ASSESSMENT ${e+1}`),"STAKEHOLDER ENGAGEMENT":Array.from({length:3},(r,e)=>`STAKEHOLDER ENGAGEMENT ${e+1}`),"PLANNING & EXECUTION":Array.from({length:3},(r,e)=>`CHANGE PLANNING AND EXECUTION ${e+1}`),TRAINING:Array.from({length:3},(r,e)=>`TRAINING AND DEVELOPMENT ${e+1}`),"RESISTANCE MANAGEMENT":Array.from({length:3},(r,e)=>`Resistance Management ${e+1}`),EVALUATION:Array.from({length:3},(r,e)=>`Evaluation and Continuous Improvement ${e+1}`),SUSTAINABILITY:Array.from({length:3},(r,e)=>`Sustainability and Embedding ${e+1}`),FINANCIAL:Array.from({length:5},(r,e)=>`Costs or Financial ${e+1}`)};E=Object.entries(s).map(([r,e])=>({category:r,score:y(e.map(n=>Number(l[n]||0)))})).reduce((r,e)=>r+e.score,0)/Object.keys(s).length}const t=(N+p+u+E)/4;return{digitalSkills:{percentage:N,data:g,labels:Array.from({length:10},(s,i)=>`Question ${i+1}`)},techReadiness:{percentage:p,data:f.map(s=>s.score),labels:f.map(s=>s.category)},itReadiness:{percentage:u},changeManagement:{percentage:E},totalScore:t}};function W(){const m=b(),[o,l]=S.useState([]),[h,g]=S.useState({}),[N,I]=S.useState("");S.useEffect(()=>{if(c["Mayors Office"]&&c["IT Office"]&&c["HR Office"]&&c["Other Offices"]){const s=[...c["Mayors Office"],...c["IT Office"],...c["HR Office"],...c["Other Offices"]].reduce((e,n)=>{if(n.Province==="Misor"){const d=n["LGU Name"];e[d]||(e[d]=[]),e[d].push(n)}return e},{}),A=[...Object.entries(s).map(([e,n])=>{const d=H(n);return{name:e,score:Math.round(d.totalScore*100)/100,digitalSkills:Math.round(d.digitalSkills.percentage*100)/100,techReadiness:Math.round(d.techReadiness.percentage*100)/100,itReadiness:Math.round(d.itReadiness.percentage*100)/100,changeManagement:Math.round(d.changeManagement.percentage*100)/100}})].sort((e,n)=>n.score-e.score).map((e,n)=>({...e,rank:n+1}));l(A);const r={labels:["Digital Skills","Tech Readiness","IT Readiness","Change Management","Overall Score"],datasets:A.map((e,n)=>({label:e.name,data:[e.digitalSkills,e.techReadiness,e.itReadiness,e.changeManagement,e.score],borderColor:n%2===0?"#0036C5":"#ECC217",backgroundColor:n%2===0?"#0036C520":"#ECC21720",tension:.1}))};g(r)}},[]);const f=o.filter(t=>t.name.toLowerCase().includes(N.toLowerCase())),p={labels:o.map(t=>t.name),datasets:[{data:o.map(t=>t.score),backgroundColor:o.map((t,s)=>s%2===0?"#0036C5":"#ECC217"),borderWidth:1}]},u=t=>{m(`/misamis-oriental/${t.name}`,{state:{lguName:t.name,score:t.score}})},E=Object.keys(c).reduce((t,s)=>(Array.isArray(c[s])?t[s]=c[s].filter(i=>i.Province==="Misor"):t[s]=c[s],t),{});return a.jsx("div",{className:"min-h-full w-full flex items-center justify-center",children:a.jsxs("div",{className:"p-5 w-[95%] h-[90%] flex flex-col bg-card/25 border border-border rounded-lg",children:[a.jsx("h1",{className:"py-4 px-2 rounded-sm text-center font-bold text-xl mb-4 border text-[#0036C5] border-[#0036C5]",children:"Misamis Oriental Province"}),a.jsxs("div",{className:"flex flex-row md:flex-col md:items-center space-x-4 md:gap-10",children:[a.jsx("div",{className:"w-[30%] md:w-full border border-gray-200 rounded-lg overflow-hidden",children:a.jsxs("div",{className:"bg-white",children:[a.jsx("div",{className:"flex items-center p-4 border-b border-gray-200",children:a.jsxs("div",{className:"relative flex-grow",children:[a.jsx("input",{type:"text",placeholder:"Search",className:"w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg",value:N,onChange:t=>I(t.target.value)}),a.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:a.jsx("svg",{className:"h-5 w-5 text-gray-400",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})})})]})}),a.jsxs("div",{className:"grid grid-cols-5 border-b border-gray-200 text-sm font-medium text-gray-700",children:[a.jsx("div",{className:"p-4 col-span-1 flex items-center",children:"Rank"}),a.jsxs("div",{className:"p-4 col-span-2 flex items-center",children:["LGU Name",a.jsx("svg",{className:"ml-1 h-4 w-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]}),a.jsxs("div",{className:"p-4 col-span-2 flex items-center",children:["Score (%)",a.jsx("svg",{className:"ml-1 h-4 w-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]})]}),a.jsx("div",{className:"divide-y divide-gray-200 max-h-[500px] overflow-y-auto",children:f.map(t=>a.jsxs("div",{className:"cursor-pointer grid grid-cols-5 hover:bg-gray-50",onClick:()=>u(t),children:[a.jsx("div",{className:"p-4 col-span-1",children:t.rank}),a.jsx("div",{className:"p-4 col-span-2 truncate",children:t.name}),a.jsxs("div",{className:"p-4 col-span-2",children:[t.score," %"]})]},t.name))})]})}),a.jsxs("div",{className:"w-[70%] md:w-full flex flex-col gap-5 justify-center  space-y-4 md:space-y-0",children:[a.jsx(U,{data:E,title:"Digital Skills Card Full Width",gridColsBase:1}),a.jsxs("div",{className:"bg-white p-4 border border-gray-200 rounded-lg",children:[a.jsx("h2",{className:"text-lg font-medium mb-4",children:"LGUs Assessment Scores"}),a.jsx("div",{className:"h-[300px] flex justify-center",children:a.jsx(D,{data:p,options:{maintainAspectRatio:!1,plugins:{legend:{position:"bottom",labels:{boxWidth:12}},datalabels:{display:!0,color:"#fff",font:{weight:"bold",size:10},formatter:t=>`${Math.round(t)}%`,align:"center",anchor:"center"}}},plugins:[w]})})]}),a.jsxs("div",{className:"bg-white p-4 border border-gray-200 rounded-lg",children:[a.jsx("h2",{className:"text-lg font-medium mb-4",children:"LGUs Assessment Category Scores"}),a.jsx("div",{className:"h-[300px]",children:Object.keys(h).length>0&&a.jsx(k,{data:h,options:{maintainAspectRatio:!1,scales:{y:{beginAtZero:!0,max:100,ticks:{callback:function(t){return t+"%"}}}},plugins:{legend:{position:"bottom",labels:{boxWidth:12}},tooltip:{callbacks:{label:function(t){return t.dataset.label+": "+t.raw+"%"}}}}}})})]})]})]})]})})}export{W as default};
