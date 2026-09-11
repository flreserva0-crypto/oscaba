const canvas=document.getElementById("particles");
const ctx=canvas.getContext("2d");
let w,h,dpr,mouse={x:-9999,y:-9999};
const particles=[];
const COUNT=145;

function resize(){
  dpr=Math.min(window.devicePixelRatio||1,2);
  w=canvas.clientWidth=innerWidth;
  h=canvas.clientHeight=innerHeight;
  canvas.width=w*dpr; canvas.height=h*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
function make(){
  particles.length=0;
  for(let i=0;i<COUNT;i++){
    particles.push({
      x:Math.random()*w,y:Math.random()*h,
      ox:Math.random()*w,oy:Math.random()*h,
      vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,
      r:Math.random()*1.7+.5
    });
  }
}
function draw(){
  ctx.clearRect(0,0,w,h);
  for(const p of particles){
    const dx=p.x-mouse.x,dy=p.y-mouse.y,dist=Math.hypot(dx,dy);
    if(dist<125){
      const force=(125-dist)/125;
      p.vx+=(dx/(dist||1))*force*.9;
      p.vy+=(dy/(dist||1))*force*.9;
    }else{
      p.vx+=(p.ox-p.x)*.000025;
      p.vy+=(p.oy-p.y)*.000025;
    }
    p.vx*=.985;p.vy*=.985;
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<-20)p.x=w+20;if(p.x>w+20)p.x=-20;
    if(p.y<-20)p.y=h+20;if(p.y>h+20)p.y=-20;
    const alpha=dist<180?.75:.42;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(101,216,255,${alpha})`;ctx.fill();
  }
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a=particles[i],b=particles[j],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<75){
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        ctx.strokeStyle=`rgba(101,216,255,${(1-d/75)*.08})`;ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
addEventListener("resize",()=>{resize();make()});
addEventListener("mousemove",e=>{mouse.x=e.clientX;mouse.y=e.clientY});
addEventListener("mouseleave",()=>{mouse.x=-9999;mouse.y=-9999});
resize();make();draw();
