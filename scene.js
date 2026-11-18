/* 雨夜 · 灯里 — a handmade, explorable miniature. No UI, no external assets. */
'use strict';
const scene=new THREE.Scene();scene.background=new THREE.Color('#101923');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;document.body.appendChild(renderer.domElement);
const camera=new THREE.PerspectiveCamera(35,innerWidth/innerHeight,.1,150),world=new THREE.Group();scene.add(world);
const palette={ink:0x182932,cream:0xd6d9c5,green:0x548e7f,teal:0x80dac1,road:0x263647,curb:0x6b7a80,gold:0xffd495};
const ramp=new THREE.DataTexture(new Uint8Array([65,65,65,255,145,145,145,255,210,210,210,255,255,255,255,255]),4,1,THREE.RGBAFormat);ramp.needsUpdate=true;ramp.minFilter=ramp.magFilter=THREE.NearestFilter;
const mats=new Map();function mat(c){if(!mats.has(c))mats.set(c,new THREE.MeshToonMaterial({color:c,gradientMap:ramp}));return mats.get(c)}
function glow(c,p=.55){return new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:p,roughness:.45})}
const outline=new THREE.LineBasicMaterial({color:0x15232d,transparent:true,opacity:.6});
const pieces=[];let current=world;function stage(delay,fn){let g=new THREE.Group();world.add(g);current=g;fn(g);pieces.push({g,delay,y:g.position.y});current=world;return g}
function mesh(geo,m,x,y,z,edge=false){let o=new THREE.Mesh(geo,typeof m==='number'?mat(m):m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;current.add(o);if(edge){let e=new THREE.LineSegments(new THREE.EdgesGeometry(geo,25),outline);o.add(e)}return o}
function box(x,y,z,w,h,d,c,edge=true){return mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,edge)}
function cyl(x,y,z,r,h,c,n=12){return mesh(new THREE.CylinderGeometry(r,r,h,n),c,x,y,z)}
function line(points,r,c){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return mesh(new THREE.TubeGeometry(curve,Math.max(12,points.length*8),r,6,false),c,0,0,0)}
function torus(x,y,z,r,t,c,rx=0,ry=0){let o=mesh(new THREE.TorusGeometry(r,t,6,32),c,x,y,z);o.rotation.set(rx,ry,0);return o}
function label(text,w,h,bg,fg='#203c3c',size=90){const cv=document.createElement('canvas');cv.width=1024;cv.height=Math.round(1024*h/w);const ctx=cv.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,cv.width,cv.height);ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`700 ${size}px "Yu Gothic","Microsoft YaHei",sans-serif`;text.split('\n').forEach((t,i,a)=>ctx.fillText(t,512,cv.height/2+(i-(a.length-1)/2)*size*1.35,970));const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;const m=new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide});return new THREE.Mesh(new THREE.PlaneGeometry(w,h),m)}
function sign(text,x,y,z,w,h,bg,fg,size){let o=label(text,w,h,bg,fg,size);o.position.set(x,y,z);current.add(o);return o}
function lamp(x,y,z,c,intensity,range){let l=new THREE.PointLight(c,intensity,range,2);l.position.set(x,y,z);current.add(l)}
let seed=147;function rand(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646}
scene.add(new THREE.HemisphereLight(0x9fc9e4,0x334958,2.1));let moon=new THREE.DirectionalLight(0xb8d8f0,2.8);moon.position.set(-6,13,4);moon.castShadow=true;moon.shadow.mapSize.set(2048,2048);Object.assign(moon.shadow.camera,{left:-10,right:10,top:10,bottom:-10});moon.shadow.bias=-.0008;scene.add(moon);
// Entire world lives on one square plinth. Roads meet at the front-left corner.
stage(0,()=>{box(0,-.38,0,12,.7,12,0x182c39);box(0,-.055,0,12,.08,12,palette.road);box(1.2,.055,-1.05,9.6,.15,7.8,0x68787e);box(1.2,.13,-1.05,9.55,.06,7.75,0x8a9290);for(let i=0;i<19;i++){box(-3.5+i*.5,.09,2.85,.46,.18,.19,0xa1aaa5)}for(let i=0;i<15;i++)box(-3.65,.09,-4.65+i*.5,.19,.18,.46,0xa1aaa5);
for(let x=-3.25;x<5.9;x+=.45)for(let z=-4.7;z<2.7;z+=.45){box(x,.165,z,.435,.012,.435,(Math.round(x*7+z*5)%3===0)?0x808e8d:0x899694,false)}
for(let i=0;i<7;i++){box(-4.75,.005,-1.7+i*.57,1.85,.012,.28,0xb1c6c7,false)}for(let i=0;i<5;i++)box(-2.45+i*.7,.008,4.5,.34,.018,1.5,0xc3d0ca,false);
for(let z=-5;z<5.4;z+=1.6)box(-5.05,.007,z,.055,.015,.65,0xe7c890,false);
box(3.85,.008,4.45,2.3,.012,.05,0xc2cebb,false);box(2.72,.008,4.06,.05,.012,.8,0xc2cebb,false);box(4.99,.008,4.06,.05,.012,.8,0xc2cebb,false);
for(let j=0;j<4;j++){box(-3.45+j*2.8,.176,2.51,.65,.02,.23,0x243944);for(let i=0;i<7;i++)box(-3.71+j*2.8+i*.08,.19,2.51,.025,.015,.2,0x6c7c7e,false)}
// Paint-like reflective puddles, kept flat and bounded by the base.
for(let i=0;i<65;i++){let x=rand()*11.5-5.75,z=rand()*11.5-5.75;if(x>-3.7&&z<2.85)continue;let c=[0x52747f,0x456875,0x77969b,0x3e586a][i%4];const p=mesh(new THREE.CircleGeometry(.18+rand()*.5,24),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.23,depthWrite:false}),x,.025,z);p.rotation.x=-Math.PI/2;p.scale.set(1.6,.23+rand()*.45,1)}
});
// Warm interior: the rear wall, tiled floor, refrigerators and two stocked aisles.
stage(.65,()=>{box(.65,.26,-1.1,6.8,.18,5.2,0xded7bd);for(let x=-2.55;x<3.9;x+=.43)for(let z=-3.4;z<1.4;z+=.43)box(x,.36,z,.41,.012,.41,0xc8c8ae,false);box(.65,1.82,-3.65,6.8,3.05,.15,palette.cream);box(-2.73,1.82,-1.1,.15,3.05,5.2,palette.cream);box(4.03,1.82,-2.9,.15,3.05,1.5,0xabbcaf);
for(let x=-2.45;x<3.9;x+=.45)box(x,.7,-3.55,.025,.66,.015,0xa5b5a5,false);
sign('お弁当   ・   おにぎり   ・   お飲みもの',.6,2.95,-3.54,5.9,.26,'#518775','#f3edd0',40);
});
function products(x,y,z,count,spacing,kind=0){const cols=[0xd9a15c,0xb65c50,0x739c7a,0xe3d3a3,0x6598b1,0xdac17a];for(let i=0;i<count;i++){let xx=x+i*spacing,h=.15+rand()*.10;if(kind===1){cyl(xx,y+h/2,z,.048,h,cols[i%6],8);cyl(xx,y+h+.015,z,.028,.025,0xdedcc9,8)}else{box(xx,y+h/2,z,.12,h,.12,cols[(i+kind)%6],false);box(xx,y+h*.55,z+.063,.09,.045,.004,0xf0e6c9,false)}}}
stage(1.5,()=>{for(let x=-1.9;x<3.5;x+=1.02){box(x,1.45,-3.24,.98,2.12,.6,0x5e7e7b);box(x,1.48,-2.918,.85,1.83,.02,glow(0xb6dac2,.3));for(let y=.7;y<2.2;y+=.39){box(x,y,-3.02,.87,.04,.4,0xd9e1cd);products(x-.34,y+.04,-2.96,5,.155,1)}box(x+.38,1.5,-2.87,.025,.5,.025,0x445c61);box(x,2.4,-2.91,.9,.055,.04,glow(0xffedc5,1))}
for(let z of[-1.35,.05]){box(.4,.46,z,3.35,.22,.68,0x667b6e);for(let y of[.65,1.12,1.59]){box(.4,y,z,3.45,.055,.76,0xc9cbb4);products(-1.15,y+.03,z+.23,17,.185,Math.round(y));products(-1.15,y+.03,z-.16,17,.185,2);box(.4,y+.045,z+.395,3.4,.07,.015,0xe5d09d)}box(.4,1.94,z,3.25,.24,.05,0x769a80);sign(z<0?'お菓子 ・ スナック':'毎日の、おいしい。',.4,1.94,z+.035,3,.17,'#769a80','#fff4d6',45)}
// Cash register, hot-food display, coffee maker, magazine rack.
box(2.99,.84,.55,1.42,.94,.72,0xbcbda2);box(2.99,1.34,.55,1.56,.08,.85,0x6a7469);box(3.25,1.55,.48,.33,.35,.15,0x344950);box(3.25,1.6,.57,.26,.18,.012,glow(0x94c4b6,.3));box(2.56,1.6,.53,.48,.44,.4,0xd7b87a);box(2.56,1.62,.745,.4,.28,.01,new THREE.MeshBasicMaterial({color:0xffd890,transparent:true,opacity:.45}));for(let i=0;i<3;i++)box(2.43+i*.13,1.52,.76,.09,.06,.1,0xca8b42,false);box(3.5,1.65,-.25,.39,.55,.35,0x34454b);cyl(3.5,1.43,-.03,.07,.13,0xf5ead0);for(let j=0;j<4;j++){box(-2.35,.65+j*.28,.72,.45,.06,.58,0xb5b8a5);for(let k=0;k<3;k++){let a=box(-2.48+k*.13,.8+j*.28,.85,.11,.24,.035,[0xd88b77,0xaac5ab,0xe1cc83][k]);a.rotation.x=-.2}}
lamp(.6,2.6,-1.4,0xffd69d,35,6);lamp(2.7,2.5,.3,0xffe2ab,22,4);
});
// A low fascia and generous glazing leave the aisles visible from the viewing angle.
stage(2.5,()=>{for(let x of[-2.76,-.8,1.15,4.05])box(x,1.76,1.53,.085,2.82,.09,0x54766e);box(.65,.46,1.53,6.8,.24,.15,0x688479);box(.65,2.99,1.53,6.9,.15,.15,0x54766e);
const glass=new THREE.MeshPhysicalMaterial({color:0xb8e4de,transparent:true,opacity:.085,roughness:.12,metalness:.1,depthWrite:false,side:THREE.DoubleSide});
for(let [x,w] of[[-1.75,1.8],[.15,1.8],[2.59,2.75]])box(x,1.77,1.53,w,2.42,.022,glass,false);
// Sliding doors on the right, with mint safety stripes.
for(let x of[1.85,3.25]){box(x,1.76,1.56,1.36,2.68,.025,glass,false);box(x-.68,1.76,1.58,.04,2.68,.05,0xb7c8bd);box(x+.68,1.76,1.58,.04,2.68,.05,0xb7c8bd);box(x,1.3,1.6,1.3,.09,.015,0x77ae92);box(x+(x<2?-1:1)*.45,1.55,1.63,.035,.35,.035,0xd3d7c6)}
sign('自動',2.55,2.67,1.61,.5,.18,'#597c6d','#f7edd4',160);
// Deliberate little graphic reflections rather than opaque blue glass.
for(let x of[-2,-.15]){let r=box(x,2.2,1.554,.035,.75,.004,new THREE.MeshBasicMaterial({color:0xcbeee5,transparent:true,opacity:.3}),false);r.rotation.z=-.48}
box(4.05,1.8,-.45,.065,2.8,3.85,glass,false);for(let z of[-2.25,-.9,.5,1.5])box(4.08,1.8,z,.07,2.8,.07,0x54766e);
box(2.55,.19,1.95,2.35,.035,.55,0x3d5557);for(let i=0;i<18;i++)box(1.45+i*.13,.211,1.95,.035,.008,.48,0x688076,false);
});
stage(3.5,()=>{box(.65,3.22,-1.05,7.18,.21,5.65,0x72897f);box(.65,3.37,-1.05,7.05,.14,5.5,0xa6b5a3);box(.65,3.44,-1.05,6.7,.035,5.15,0x6a8280);for(let x of[-2.85,4.15])box(x,3.53,-1.05,.09,.22,5.5,0xbcc4ab);box(.65,3.53,-3.77,7,.22,.09,0xbcc4ab);
// Illuminated store identity and thin green-orange stripes.
box(.65,3.13,1.86,7.15,.63,.34,glow(0xcfe9ce,.65));box(.65,3.39,2.04,7.16,.075,.015,glow(0x67b89a,.8));box(.65,2.88,2.04,7.16,.07,.015,glow(0x5eac96,.6));box(.65,2.99,2.045,7.16,.035,.015,glow(0xe4ad6e,.6));sign('灯 里  マ ー ト',.25,3.18,2.045,4.5,.33,'#d2e9ce','#316b61',67);sign('24\nOPEN',3.36,3.18,2.05,.62,.33,'#d2e9ce','#39796a',88);
box(.65,2.77,1.96,7.3,.08,.75,0x4b7e71);for(let i=0;i<5;i++)box(-2.3+i*1.45,2.72,2.02,.77,.025,.22,glow(0xffe1a1,1.3));
box(4.23,3.14,-.75,.3,.6,5.2,glow(0xbad6bc,.3));box(4.4,2.94,-.75,.012,.08,5.2,0x5fa98b);
// Rooftop outdoor AC, ducts, roof seams and rain gutters.
box(-1.4,3.71,-2.3,1.45,.48,.9,0xa0b2ad);for(let i=0;i<11;i++)box(-2.02+i*.12,3.72,-1.84,.045,.3,.015,0x4c676a,false);cyl(-1.4,3.98,-2.3,.31,.04,0x4b6668,24);for(let i=0;i<3;i++){let b=box(-1.4,4.01,-2.3,.5,.015,.06,0x8ba19d,false);b.rotation.y=i*Math.PI/3}
for(let z=-3.2;z<1.5;z+=.7)box(.65,3.46,z,6.6,.015,.018,0x819693,false);line([[4.22,3.28,-3.6],[4.4,3.1,-3.6],[4.4,.3,-3.6]],.06,0x5c7b7a);
});
// Street props: vending machine, recycling, umbrellas and posters.
stage(4.2,()=>{box(-2.9,1.06,1.95,.9,1.8,.68,0xb95448);box(-2.9,1.19,2.305,.75,1.12,.025,glow(0xd5e9d0,.45));for(let y of[.89,1.22,1.55]){for(let i=0;i<4;i++){cyl(-3.17+i*.18,y,2.36,.045,.18,[0xd19852,0x72a9a5,0xe6c88e,0x69956f][i],8);box(-3.17+i*.18,y-.13,2.35,.12,.035,.02,0x48626a,false)}}box(-2.9,.43,2.3,.5,.15,.05,0x253e46);sign('DRINK',-2.9,1.86,2.3,.7,.19,'#b95448','#fff2d7',104);box(-2.48,.9,2.34,.07,.16,.02,0x334e55);
for(let i=0;i<2;i++){box(4.68,.61,1.78-i*.62,.52,.85,.51,0x78938e);box(4.68,1.06,1.78-i*.62,.55,.07,.54,0xb4c0ae);box(4.68,.9,2.045-i*.62,.25,.12,.015,0x293f48);sign(i?'びん・缶':'もえるごみ',4.68,.63,2.05-i*.62,.38,.18,'#78938e','#edf2d8',110)}
for(let x of[3.68,4.12])for(let z of[2.16,2.53])cyl(x,.45,z,.018,.52,0xadc6be,6);box(3.9,.65,2.35,.5,.035,.43,0x7e9f95);for(let i=0;i<4;i++){let x=3.73+i*.11;line([[x,.2,2.35],[x,.89+i*.035,2.35],[x+.02,1.02+i*.035,2.35],[x+.09,1.02+i*.035,2.35],[x+.1,.94,2.35]],.018,0xbccfcb);let u=mesh(new THREE.ConeGeometry(.055,.53,6),[0x86a59c,0x627b8f,0xd3c9b2,0x728eae][i],x,.46,2.35);u.rotation.z=.06}
box(-2.795,1.8,-.2,.025,1.14,.88,0x446960);let poster=sign('夜の、おいしい。\nおでん\nあたたかく、いつでも。',0,0,0,.8,.98,'#eadbb2','#995f4a',75);poster.rotation.y=-Math.PI/2;poster.position.set(-2.82,1.8,-.2);
// Small alley beyond the shop, stacked crates and an exterior compressor.
box(4.85,.28,-2.7,1.35,.18,2.3,0x485e68);box(4.62,.65,-2.9,.65,.7,.55,0x91a6a1);for(let i=0;i<8;i++)box(4.62,.4+i*.07,-2.61,.53,.022,.015,0x4d696f,false);for(let i=0;i<3;i++)box(5.35,.35+i*.27,-3.42,.6,.25,.53,0x6c8878);box(5.25,1.35,-4.22,.9,2.1,.12,0x5a7275);sign('灯里町\n町内のお知らせ',5.25,1.85,-4.15,.76,.33,'#526e68','#f1e9cb',95);for(let i=0;i<4;i++)box(5.05+(i%2)*.38,1.12+Math.floor(i/2)*.38,-4.14,.29,.31,.01,[0xd8c5a0,0xadbbb0,0xc2b098,0x91aea9][i],false);
});
stage(4.85,()=>{ // Bicycle, leaned against the west side, fully modeled wheels and frame.
let bike=new THREE.Group();current.add(bike);const old=current;current=bike;bike.position.set(-3.08,.18,.05);bike.rotation.y=Math.PI/2+.14;
for(let x of[-.56,.56]){torus(x,.4,0,.36,.033,0x243b43);torus(x,.4,0,.318,.012,0xa9bdb8);for(let i=0;i<10;i++){let a=i*Math.PI/5;line([[x,.4,0],[x+Math.cos(a)*.31,.4+Math.sin(a)*.31,0]],.006,0x94aaa7)}}
for(let pts of[[[-.56,.4,0],[-.26,.97,0],[.12,.4,0],[-.56,.4,0]],[[-.26,.97,0],[.4,.96,0],[.12,.4,0]],[[.4,.96,0],[.56,.4,0]],[[.12,.4,0],[.03,1.04,0]]])line(pts,.027,0xb4996b);box(-.03,1.08,0,.3,.055,.19,0x3c4d4c);line([[.4,.97,0],[.36,1.2,0],[.38,1.25,.23]],.021,0xa5b8ae);box(.49,1.03,.08,.27,.23,.33,new THREE.MeshBasicMaterial({color:0x8baba4,wireframe:true}));line([[.1,.4,0],[.24,.34,.14],[.36,.34,.14]],.018,0x546e6c);current=old;
// Corner guardrails and reflective poles.
for(let x of[-2.1,1.5,5.3]){for(let xx of[x-.55,x+.55])cyl(xx,.52,3.0,.035,.95,0xbcc8b4);line([[x-.55,.6,3],[x-.55,.92,3],[x+.55,.92,3],[x+.55,.6,3]],.042,0xc7cdb6);for(let xx of[x-.55,x+.55])cyl(xx,.86,3.0,.039,.12,0xe5b576)}
// Utility pole, cross arms, ceramic insulators, sagging wires.
cyl(-4.1,2.68,-2.95,.095,5.4,0x687b7d);cyl(-4.1,.7,-2.95,.12,1.3,0x4b6269);for(let y of[4.55,5.03]){box(-4.1,y,-2.95,1.1,.075,.09,0x556a72);for(let x of[-4.54,-4.1,-3.66]){cyl(x,y+.12,-2.95,.042,.19,0xc1cdbf,8)}}box(-4.1,3.95,-2.95,.34,.64,.36,0x91a09b);for(let j=0;j<3;j++)line([[-4.54+j*.44,5.2,-2.95],[-1.9,4.75,-4.5],[2.1,4.7,-5.45],[5.5,5.1,-5.6]],.012,0x263b49);
box(-4.09,2.2,-2.81,.26,.5,.035,0xe9d3a4);sign('灯里町\n二丁目',-4.09,2.2,-2.78,.22,.42,'#e9d3a4','#3c625c',175);
// A real corner streetlight, casting a warm pool onto wet asphalt.
cyl(-3.77,1.95,2.75,.045,3.9,0x537674);line([[-3.77,3.83,2.75],[-3.77,4.08,2.75],[-3.45,4.14,2.75],[-3.12,4.14,2.75]],.045,0x6e8e83);box(-3.12,4.09,2.75,.56,.1,.28,0x7f9e8f);box(-3.12,4.03,2.75,.48,.018,.22,glow(0xffdc9b,2));lamp(-3.12,3.8,2.75,0xffcf85,36,6);
// Road sign and small hanging convenience sign.
cyl(5.4,1.6,2.88,.035,3.1,0x8faeaa);box(5.4,2.92,2.88,.84,.29,.065,0x527f94);sign('あかり通り →',5.4,2.92,2.925,.76,.2,'#527f94','#e6edce',99);
box(-2.92,3.96,.84,.09,1.12,.09,0x55746d);box(-2.92,4.4,.84,1.2,.7,.21,glow(0xcde2bd,.7));sign('灯里\n24 HOUR',-2.92,4.4,.953,1.05,.56,'#cde2bd','#377369',116);
});
// Luminous puddle strokes and rain ripple rings, always resting on the plinth.
stage(5.15,()=>{for(let i=0;i<33;i++){let x=-2.6+rand()*6,z=3.1+rand()*2.4;box(x,.028,z,.18+rand()*.6,.008,.015,new THREE.MeshBasicMaterial({color:[0x9dd5bd,0xe7c38d,0x8fb5b5][i%3],transparent:true,opacity:.13+rand()*.17}),false)}for(let i=0;i<16;i++){let x=rand()*10-5,z=3+rand()*2.7;let o=torus(x,.035,z,.04+rand()*.1,.005,new THREE.MeshBasicMaterial({color:0x9fc4cb,transparent:true,opacity:.2}),Math.PI/2);o.userData.ripple=i}}
);
// Fine rain is clipped to the square model, with no world beyond its edges.
const rainCount=650,rainPos=new Float32Array(rainCount*6),rainSpeed=[];for(let i=0;i<rainCount;i++){let x=rand()*11.7-5.85,z=rand()*11.7-5.85,y=rand()*7.4;rainPos.set([x,y,z,x-.035,y+.16,z],i*6);rainSpeed.push(2.3+rand()*2.8)}let rainGeo=new THREE.BufferGeometry();rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPos,3));const rain=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0xa6c8d8,transparent:true,opacity:.2,depthWrite:false}));world.add(rain);
// Orbit, pan, zoom: pointer capture and pinch work with mouse, pen and touch.
let az=.72,el=.57,distance=23.5,targetAz=az,targetEl=el,targetD=distance;const aim=new THREE.Vector3(0,1.2,0);const pointers=new Map();let previous=null,previousPinch=0;const canvas=renderer.domElement;
canvas.addEventListener('contextmenu',e=>e.preventDefault());canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});previous={x:e.clientX,y:e.clientY};if(pointers.size===2){let a=[...pointers.values()];previousPinch=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}});
canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){let a=[...pointers.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);targetD=Math.max(10,Math.min(42,targetD*previousPinch/Math.max(d,1)));previousPinch=d}else{let dx=e.clientX-previous.x,dy=e.clientY-previous.y;if(e.buttons===2||e.shiftKey){aim.x-=dx*.009*Math.cos(az);aim.z+=dx*.009*Math.sin(az);aim.y+=dy*.009;aim.y=Math.max(-1,Math.min(4,aim.y))}else{targetAz-=dx*.006;targetEl=Math.max(.15,Math.min(1.35,targetEl+dy*.004))}}previous={x:e.clientX,y:e.clientY}});
function up(e){pointers.delete(e.pointerId);if(pointers.size===1)previous=[...pointers.values()][0]}canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('wheel',e=>{e.preventDefault();targetD=Math.max(10,Math.min(42,targetD*Math.exp(e.deltaY*.001)))},{passive:false});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const clock=new THREE.Clock();let last=0;
function frame(){requestAnimationFrame(frame);let t=clock.getElapsedTime(),dt=Math.min(t-last,.05);last=t;az+=(targetAz-az)*.09;el+=(targetEl-el)*.09;distance+=(targetD-distance)*.09;let responsive=innerWidth/innerHeight<1?1.5:1;camera.position.set(aim.x+Math.sin(az)*Math.cos(el)*distance*responsive,aim.y+Math.sin(el)*distance*responsive,aim.z+Math.cos(az)*Math.cos(el)*distance*responsive);camera.lookAt(aim);
for(let p of pieces){let k=reduced?1:Math.max(0,Math.min(1,(t-p.delay)/1.5)),ease=1-Math.pow(1-k,3);p.g.visible=k>0;p.g.position.y=p.y+(1-ease)*(p.delay===0?-1.4:3.5);p.g.scale.setScalar(.85+.15*ease);if(p.delay===0){p.g.position.y=p.y-(1-ease)*1.4}}
rain.visible=t>4||reduced;if(!reduced){for(let i=0;i<rainCount;i++){let n=i*6;rainPos[n+1]-=dt*rainSpeed[i];rainPos[n+4]=rainPos[n+1]+.16;if(rainPos[n+1]<.2){rainPos[n+1]=7;rainPos[n+4]=7.16}}rainGeo.attributes.position.needsUpdate=true}renderer.render(scene,camera)}frame();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
window.__diorama={scene,renderer,camera,pieces,stats:()=>({meshes:renderer.info.render.calls,triangles:renderer.info.render.triangles,assembled:clock.getElapsedTime()>7})};
