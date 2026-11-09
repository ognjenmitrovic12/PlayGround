
import * as THREE from 'three';

const $=id=>document.getElementById(id);
const ui=Object.fromEntries(['hud','intro','pauseScreen','playBtn','pauseBtn','mobilePause','resumeBtn','loading','speed','speedFill','gear','progressFill','progressText','money','toast','stars','streetName','distance'].map(id=>[id,$(id)]));
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const rand=(min,max)=>min+Math.random()*(max-min);
const mat=(color,roughness=.8,emissive=0,intensity=0)=>new THREE.MeshStandardMaterial({color,roughness,emissive,emissiveIntensity:intensity});
const scene=new THREE.Scene();scene.background=new THREE.Color(0x101a2a);scene.fog=new THREE.Fog(0x101a2a,110,440);
const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,900);
const renderer=new THREE.WebGLRenderer({canvas:$('scene'),antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
scene.add(new THREE.HemisphereLight(0x91b6d0,0x27323a,1.4));const moon=new THREE.DirectionalLight(0x9fc8ff,1.5);moon.position.set(-80,120,-40);scene.add(moon);
const cube=new THREE.BoxGeometry(1,1,1);
function box(parent,name,size,pos,material){const m=new THREE.Mesh(cube,material);m.name=name;m.scale.set(...size);m.position.set(...pos);parent.add(m);return m;}
function cylinder(parent,r1,r2,h,pos,material,sides=8){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,sides),material);m.position.set(...pos);parent.add(m);return m;}
const mats={road:mat(0x252b35),sidewalk:mat(0x59616a),concrete:mat(0x303b48),sand:mat(0x8c7967),grass:mat(0x253d3b),glass:new THREE.MeshStandardMaterial({color:0x162638,metalness:.5,roughness:.23}),lime:mat(0xc9f16a,.32,0x9aca45,.55)};
const city=new THREE.Group();scene.add(city);const ground=new THREE.Mesh(new THREE.PlaneGeometry(900,900),mats.grass);ground.rotation.x=-Math.PI/2;ground.position.y=-.16;city.add(ground);
const dash=mat(0xd9d3bb,.8,0x756b4b,.12);
for(let n=-4;n<=4;n++){const p=n*50;box(city,'avenue',[900,.12,15],[0,-.045,p],mats.road);box(city,'avenue',[15,.12,900],[p,-.045,0],mats.road);for(let k=-8;k<=8;k++){box(city,'lane dash',[8,.025,.22],[k*48,.025,p],dash);box(city,'lane dash',[.22,.025,8],[p,.025,k*48],dash);}for(const side of [-1,1]){box(city,'sidewalk',[900,.18,2.1],[0,.02,p+side*9.1],mats.sidewalk);box(city,'sidewalk',[2.1,.18,900],[p+side*9.1,.02,0],mats.sidewalk);}}
box(city,'coast boulevard',[900,.12,16],[0,-.03,231],mats.road);box(city,'beach',[900,.16,62],[0,-.1,270],mats.sand);
const sea=new THREE.Mesh(new THREE.PlaneGeometry(1200,400),new THREE.MeshStandardMaterial({color:0x102e42,roughness:.25,metalness:.18,emissive:0x082436,emissiveIntensity:.42}));sea.rotation.x=-Math.PI/2;sea.position.set(0,-.22,500);city.add(sea);
const palette=[0x465465,0x59616b,0x343f50,0x6a6261,0x3c5260,0x776b63,0x414858,0x4f5965].map(c=>mat(c));
const windowMats=[mat(0xffc985,.4,0xffa14c,1.15),mat(0xa6d7ef,.4,0x67bfe4,.75),mat(0x283444)];const buildings=[],windows=[];
function makeBuilding(x,z){const w=rand(9,15),d=rand(9,15),h=Math.floor(rand(2,10))*rand(2.6,3.8),bodyMat=palette[Math.floor(Math.random()*palette.length)];const body=box(city,'building',[w,h,d],[x,h/2-.02,z],bodyMat);body.userData.bounds={x,z,w:w/2,d:d/2};buildings.push(body);box(city,'roof ledge',[w+.5,.38,d+.5],[x,h+.12,z],palette[(palette.indexOf(bodyMat)+1)%palette.length]);if(h>15)box(city,'rooftop unit',[w*.38,1.1,d*.34],[x+rand(-2,2),h+.85,z+rand(-2,2)],mats.concrete);for(let row=0;row<Math.max(1,Math.floor((h-2)/2.55));row++){const y=1.5+row*2.5;for(let wx=-w/2+1.15;wx<w/2-.55;wx+=2.15)if(Math.random()>.19){const mi=Math.random()<.25?0:Math.random()<.38?1:2;windows.push({size:[.72,1.12,.08],pos:[x+wx,y,z+d/2+.055],mi},{size:[.72,1.12,.08],pos:[x+wx,y,z-d/2-.055],mi});}for(let wz=-d/2+1.15;wz<d/2-.55;wz+=2.15)if(Math.random()>.2){const mi=Math.random()<.25?0:Math.random()<.38?1:2;windows.push({size:[.08,1.12,.72],pos:[x+w/2+.055,y,z+wz],mi},{size:[.08,1.12,.72],pos:[x-w/2-.055,y,z+wz],mi});}}}
function palm(x,z,s=1){cylinder(city,.28*s,.42*s,5.2*s,[x,2.6*s,z],mat(0x55483f),7);for(let i=0;i<7;i++){const a=i*Math.PI*2/7,leaf=box(city,'palm frond',[.34*s,.13*s,3.5*s],[x+Math.sin(a)*1.3*s,5.1*s,z+Math.cos(a)*1.3*s],mat(0x557064));leaf.rotation.set(.22,-a,-.42);}cylinder(city,.8*s,.2*s,.45*s,[x,5.1*s,z],mat(0x56725f),7);}
for(let ix=-4;ix<4;ix++)for(let iz=-4;iz<4;iz++){const cx=ix*50+25,cz=iz*50+25;if(cz>210)continue;const count=Math.random()<.34?1:Math.floor(rand(2,5));for(let j=0;j<count;j++){const x=cx+rand(-10,10),z=cz+rand(-10,10);if(!(Math.abs(x)<10&&Math.abs(z)<10))makeBuilding(x,z);}if(cz<190&&Math.random()<.72)palm(cx+rand(-14,14),cz+rand(-14,14),rand(.75,1.15));}
const batches=new Map();for(const item of windows){const key=`${item.size[0]<item.size[2]}-${item.mi}`;if(!batches.has(key))batches.set(key,{size:item.size,mi:item.mi,positions:[]});batches.get(key).positions.push(item.pos);}const dummy=new THREE.Object3D();for(const batch of batches.values()){const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(...batch.size),windowMats[batch.mi],batch.positions.length);batch.positions.forEach((p,i)=>{dummy.position.set(...p);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});mesh.instanceMatrix.needsUpdate=true;city.add(mesh);}
for(let i=0;i<54;i++){const x=rand(-420,420),z=rand(-420,-300),h=rand(18,76),w=rand(12,28);box(city,'distant skyline',[w,h,w],[x,h/2,z],palette[i%palette.length]);}
const car=new THREE.Group();scene.add(car);const paint=new THREE.MeshStandardMaterial({color:0xb8c9d6,metalness:.72,roughness:.27}),tire=mat(0x101217,.9),rim=new THREE.MeshStandardMaterial({color:0xaeb8bc,metalness:.82,roughness:.22}),wheels=[];
box(car,'chassis',[2.05,.58,4.35],[0,.78,0],paint);box(car,'hood',[1.95,.22,1.15],[0,1.1,-1.25],paint);box(car,'cabin',[1.58,.78,1.95],[0,1.35,.1],mats.glass);box(car,'roof',[1.48,.12,1.18],[0,1.78,.08],paint);box(car,'front bumper',[2.02,.2,.16],[0,.55,-2.16],mats.concrete);box(car,'rear bumper',[2.02,.2,.16],[0,.55,2.16],mats.concrete);
for(const side of [-1,1]){box(car,'side window',[.05,.42,1.18],[side*.82,1.43,.05],mats.glass);for(const z of [-1.4,1.4]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.28,14),tire);wheel.rotation.z=Math.PI/2;wheel.position.set(side*1.03,.47,z);car.add(wheel);wheels.push(wheel);const hub=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.3,12),rim);hub.rotation.z=Math.PI/2;hub.position.set(side*1.05,.47,z);car.add(hub);}const head=new THREE.Mesh(new THREE.BoxGeometry(.48,.16,.04),new THREE.MeshBasicMaterial({color:0xe6f3ff}));head.position.set(side*.68,1.03,-2.19);car.add(head);const tail=new THREE.Mesh(new THREE.BoxGeometry(.5,.16,.04),new THREE.MeshBasicMaterial({color:0xff3448}));tail.position.set(side*.68,.95,2.2);car.add(tail);const spot=new THREE.SpotLight(0xdcecff,18,42,.35,.55,1.5);spot.position.set(side*.68,.95,-2.08);spot.target.position.set(side*.68,.3,-24);car.add(spot,spot.target);}
const traffic=[],trafficColors=[0x59798b,0x8c4d48,0xb7b5a7,0x3c4656,0xc0a773,0x4f706b];
function makeTrafficCar(x,z,axis,direction){const group=new THREE.Group();scene.add(group);box(group,'body',[1.8,.56,3.8],[0,.68,0],mat(trafficColors[Math.floor(Math.random()*trafficColors.length)],.38));box(group,'cabin',[1.4,.62,1.7],[0,1.2,.05],mats.glass);for(const side of [-1,1])for(const zz of [-1.25,1.25]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.23,10),tire);wheel.rotation.z=Math.PI/2;wheel.position.set(side*.91,.38,zz);group.add(wheel);}group.position.set(x,0,z);group.rotation.y=axis==='x'?(direction>0?Math.PI/2:-Math.PI/2):(direction>0?Math.PI:0);traffic.push({group,axis,direction,speed:rand(7,15)});}
for(let i=0;i<24;i++){const axis=Math.random()<.5?'x':'z',avenue=Math.floor(rand(-4,5))*50,direction=Math.random()<.5?1:-1,lane=avenue+(Math.random()<.5?-3.8:3.8);makeTrafficCar(axis==='x'?rand(-390,390):lane,axis==='z'?rand(-390,390):lane,axis,direction);}
const checkpoints=[new THREE.Vector3(0,0,-92),new THREE.Vector3(96,0,-145),new THREE.Vector3(150,0,-54),new THREE.Vector3(51,0,43),new THREE.Vector3(-101,0,94)],checkpointGroup=new THREE.Group();scene.add(checkpointGroup);let checkpointIndex=0,money=12450,toastTimer=0;
function makeCheckpoint(){checkpointGroup.clear();const p=checkpoints[checkpointIndex%checkpoints.length];checkpointGroup.position.set(p.x,0,p.z);const ring=new THREE.Mesh(new THREE.TorusGeometry(4.5,.18,8,36),new THREE.MeshBasicMaterial({color:0xc9f16a}));ring.position.y=2.2;checkpointGroup.add(ring);const beam=new THREE.Mesh(new THREE.CylinderGeometry(.1,2.3,6,16,1,true),new THREE.MeshBasicMaterial({color:0xc9f16a,transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false}));beam.position.y=3;checkpointGroup.add(beam);const marker=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.08,24),new THREE.MeshBasicMaterial({color:0xc9f16a}));marker.position.y=.04;checkpointGroup.add(marker);}
makeCheckpoint();let started=false,paused=false,speed=0,heading=0,drift=0;const keys=new Set(),touch=new Set(),carPosition=new THREE.Vector3();
function startGame(){started=true;paused=false;ui.intro.classList.add('hidden');ui.hud.classList.remove('hidden');ui.pauseScreen.classList.add('hidden');}
function togglePause(){if(!started)return;paused=!paused;ui.pauseScreen.classList.toggle('hidden',!paused);}
function resetCar(){carPosition.set(0,0,0);speed=0;heading=0;drift=0;car.position.copy(carPosition);car.rotation.set(0,0,0);}
ui.playBtn.addEventListener('click',startGame);ui.pauseBtn.addEventListener('click',togglePause);ui.mobilePause.addEventListener('click',togglePause);ui.resumeBtn.addEventListener('click',togglePause);
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase());if(e.key==='Escape'||e.key.toLowerCase()==='p')togglePause();if(e.key.toLowerCase()==='r')resetCar();if(e.key==='Enter'&&!started)startGame();});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
for(const button of document.querySelectorAll('[data-control]')){const control=button.dataset.control;const down=e=>{e.preventDefault();button.setPointerCapture?.(e.pointerId);touch.add(control);};const up=e=>{e.preventDefault();touch.delete(control);};button.addEventListener('pointerdown',down);button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('lostpointercapture',up);}

const mapPlayer=document.querySelector('.map-player'),mapTarget=document.querySelector('.map-target');
function updateMap(){
  const target=checkpoints[checkpointIndex%checkpoints.length];
  mapPlayer.style.left=`${clamp(50+carPosition.x/10,-10,90)}%`;
  mapPlayer.style.top=`${clamp(50+carPosition.z/10,-10,90)}%`;
  mapTarget.style.left=`${clamp(50+(target.x-carPosition.x)/10,8,88)}%`;
  mapTarget.style.top=`${clamp(50+(target.z-carPosition.z)/10,8,88)}%`;
  const distance=carPosition.distanceTo(target);
  ui.distance.textContent=`${(distance/1609).toFixed(1)} mi`;
  ui.streetName.textContent=Math.abs(carPosition.x)>150?'OCEAN DRIVE':Math.abs(carPosition.z)>150?'VESPUCCI BLVD':'PACIFIC BLVD';
}
function collideBuildings(){
  for(const building of buildings){
    const a=building.userData.bounds,dx=carPosition.x-a.x,dz=carPosition.z-a.z;
    if(Math.abs(dx)>a.w+3||Math.abs(dz)>a.d+3)continue;
    if(Math.abs(dx)<a.w+1.15&&Math.abs(dz)<a.d+2.05){
      const px=a.w+1.15-Math.abs(dx),pz=a.d+2.05-Math.abs(dz);
      if(px<pz)carPosition.x+=Math.sign(dx||1)*(px+.08);else carPosition.z+=Math.sign(dz||1)*(pz+.08);
      speed*=.42;
    }
  }
  carPosition.x=clamp(carPosition.x,-435,435);carPosition.z=clamp(carPosition.z,-435,224);
}
const clock=new THREE.Timer();clock.connect(document);
const cameraLook=new THREE.Vector3(),cameraPosition=new THREE.Vector3();
let uiTick=0;
function held(...names){return names.some(name=>keys.has(name)||touch.has(name));}
function showToast(title,copy){
  const toastTitle=ui.toast.querySelector('b'),toastCopy=ui.toast.querySelector('small');
  toastTitle.textContent=title;toastCopy.textContent=copy;ui.toast.classList.add('show');toastTimer=2.2;
}
function updateDriving(dt){
  if(!started||paused)return;
  const forward=held('w','arrowup','gas'),reverse=held('s','arrowdown','brake');
  const left=held('a','arrowleft','left'),right=held('d','arrowright','right'),handbrake=held(' ');
  if(forward)speed+=20*dt;
  if(reverse)speed-=speed>1?34*dt:12*dt;
  if(!forward&&!reverse)speed*=Math.exp(-.72*dt);
  if(handbrake)speed*=Math.exp(-1.3*dt);
  speed=clamp(speed,-9,39);
  const steer=(right?1:0)-(left?1:0);
  if(Math.abs(speed)>.35)heading+=steer*dt*(.6+Math.min(Math.abs(speed)/15,1.3))*(speed>=0?1:-1)*(handbrake?1.35:1);
  drift+=(steer*Math.abs(speed)*.025-drift*2.3)*dt;
  const forwardX=-Math.sin(heading),forwardZ=-Math.cos(heading);
  carPosition.x+=(forwardX*speed+Math.cos(heading)*drift)*dt;
  carPosition.z+=(forwardZ*speed-Math.sin(heading)*drift)*dt;
  collideBuildings();
  car.position.set(carPosition.x,.02+Math.sin(clock.getElapsed()*12)*Math.min(Math.abs(speed)*.0008,.025),carPosition.z);
  car.rotation.y=heading;car.rotation.z=clamp(-steer*speed*.0018,-.055,.055);
  for(const wheel of wheels)wheel.rotation.x-=speed*dt*1.6;
  traffic.forEach(item=>{
    const p=item.group.position,travel=item.direction*item.speed*dt;
    if(item.axis==='x'){p.x+=travel;if(p.x>450)p.x=-450;if(p.x< -450)p.x=450;}
    else{p.z+=travel;if(p.z>450)p.z=-450;if(p.z< -450)p.z=450;}
    if(Math.abs(p.x-carPosition.x)<2.7&&Math.abs(p.z-carPosition.z)<3.7&&Math.abs(speed)>7)speed*=.88;
  });
  if(carPosition.distanceTo(checkpoints[checkpointIndex%checkpoints.length])<7){
    checkpointIndex++;money+=500;ui.money.textContent=`$${money.toLocaleString('en-US')}`;
    ui.progressText.textContent=`${checkpointIndex%6} / 5 CHECKPOINTS`;
    ui.progressFill.style.width=`${(checkpointIndex%5)*20}%`;
    if(checkpointIndex%5===0){money+=2500;ui.money.textContent=`$${money.toLocaleString('en-US')}`;ui.progressText.textContent='5 / 5 CHECKPOINTS';ui.progressFill.style.width='100%';showToast('RUN COMPLETE','+$2,500 · KEEP EXPLORING');}
    else showToast('CHECKPOINT',`+$500 · ${5-(checkpointIndex%5)} TO GO`);
    makeCheckpoint();
  }
  if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)ui.toast.classList.remove('show');}
  uiTick-=dt;
  if(uiTick<=0){
    uiTick=.08;const mph=Math.round(Math.abs(speed)*2.237);
    ui.speed.textContent=String(mph).padStart(3,'0');ui.speedFill.style.width=`${clamp(mph/140*100,0,100)}%`;
    ui.gear.textContent=speed<-.5?'R':handbrake?'N':'D';
    const stars=mph>105?3:mph>75?2:mph>45?1:0;ui.stars.textContent='✦ '.repeat(stars)+'· '.repeat(5-stars);
    updateMap();
  }
}
function frame(timestamp){
  requestAnimationFrame(frame);
  clock.update(timestamp);
  const dt=Math.min(clock.getDelta(),.05);
  updateDriving(dt);
  const forwardX=-Math.sin(heading),forwardZ=-Math.cos(heading);
  cameraPosition.set(carPosition.x-forwardX*10,5.1,carPosition.z-forwardZ*10);
  camera.position.lerp(cameraPosition,1-Math.exp(-4.2*dt));
  cameraLook.set(carPosition.x+forwardX*4,1.1,carPosition.z+forwardZ*4);
  camera.lookAt(cameraLook);
  renderer.render(scene,camera);
}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);}
window.addEventListener('resize',resize);
window.addEventListener('orientationchange',()=>setTimeout(resize,120));
resetCar();updateMap();
setTimeout(()=>ui.loading.classList.add('hidden'),450);
frame();
