
(() => {
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const scoreEl=document.getElementById('score'),bestEl=document.getElementById('best');
const overlay=document.getElementById('overlay'),titleEl=document.getElementById('overlayTitle'),textEl=document.getElementById('overlayText');
const startBtn=document.getElementById('startBtn'),pauseBtn=document.getElementById('pauseBtn'),toast=document.getElementById('toast');
const W=960,H=540,ground=438;

const berryImg=new Image();
berryImg.src='assets/berry.png';

const dogImg=new Image();
dogImg.src='assets/cachorro.png';

let state='ready',last=0,score=0,best=Number(localStorage.getItem('correBerryBest')||0),speed=350,spawn=0,shake=0,world=0;

if(!Number.isFinite(best)||best<0||best>1000000){
    best=0;
    localStorage.setItem('correBerryBest','0');
}

let player={x:520,y:ground-104,w:54,h:104,vy:0,onGround:true,frame:0};
let dog={x:290,y:ground-126,w:180,h:126,run:0};

let obstacles=[],particles=[],stars=Array.from({length:70},()=>({x:Math.random()*W,y:Math.random()*330,r:Math.random()*2+1,a:Math.random()}));

bestEl.textContent=Math.floor(best)+' m';

const rand=(a,b)=>a+Math.random()*(b-a);

function reset(){
    score=0;
    speed=350;
    spawn=1.1;
    world=0;
    obstacles=[];
    particles=[];
    player={x:520,y:ground-104,w:54,h:104,vy:0,onGround:true,frame:0};
    dog={x:290,y:ground-126,w:180,h:126,run:0};
    scoreEl.textContent='0 m';
    pauseBtn.textContent='Ⅱ';
}

function start(){
    reset();
    state='playing';
    overlay.classList.add('hidden');
    toast.classList.remove('show');
    last=performance.now();
}

function gameOver(){
    if(state!=='playing')return;

    state='over';

    if(score>best){
        best=Math.floor(score);
        localStorage.setItem('correBerryBest',best);
        bestEl.textContent=best+' m';
    }

    titleEl.textContent='BERRY FOI DE BASE!';
    textEl.textContent='Os obstáculos pegaram você! Tente novamente.';
    startBtn.textContent='TENTAR DE NOVO ↻';
    overlay.classList.remove('hidden');
}

function jump(){
    if(state==='playing'&&player.onGround){
        player.vy=-780;
        player.onGround=false;

        for(let i=0;i<7;i++){
            particles.push({
                x:player.x+40,
                y:ground-5,
                vx:rand(-100,80),
                vy:rand(-180,-40),
                life:.45
            });
        }
    }
}

function move(dir){
    if(state!=='playing')return;
    player.x=Math.max(430,Math.min(650,player.x+dir*34));
}

function togglePause(){
    if(state==='playing'){
        state='paused';
        toast.classList.add('show');
        pauseBtn.textContent='▶';
    }else if(state==='paused'){
        state='playing';
        toast.classList.remove('show');
        pauseBtn.textContent='Ⅱ';
        last=performance.now();
    }
}

startBtn.addEventListener('click',start);
pauseBtn.addEventListener('click',togglePause);

window.addEventListener('keydown',e=>{
    if(['ArrowUp',' ','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();

    if(e.key===' '||e.key==='ArrowUp'||e.key==='w')jump();
    if(e.key==='ArrowLeft'||e.key==='a')move(-1);
    if(e.key==='ArrowRight'||e.key==='d')move(1);
    if(e.key==='Escape'||e.key==='p')togglePause();
    if(e.key==='Enter'&&(state==='ready'||state==='over'))start();
});

let touchX=null;

canvas.addEventListener('touchstart',e=>{
    touchX=e.touches[0].clientX;
},{passive:true});

canvas.addEventListener('touchend',e=>{
    if(touchX===null)return;

    let dx=e.changedTouches[0].clientX-touchX;

    if(Math.abs(dx)>35)move(dx>0?1:-1);
    else jump();

    touchX=null;
},{passive:true});

function rect(x,y,w,h,c){
    ctx.fillStyle=c;
    ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
}

function text(t,x,y,size,color,align='left'){
    ctx.font=`bold ${size}px "Baloo 2",sans-serif`;
    ctx.textAlign=align;
    ctx.fillStyle=color;
    ctx.fillText(t,x,y);
}

// CACHORRO PNG
function drawDog(x,y){
    if(!dogImg.complete||!dogImg.naturalWidth)return;

    ctx.save();
    ctx.imageSmoothingEnabled=false;

    let bob=Math.sin(dog.run*14)*3;

    ctx.drawImage(
        dogImg,
        x,
        y+bob,
        dog.w,
        dog.h
    );

    ctx.restore();
}

// BERRY PNG
function drawBerry(){
    let x=player.x,y=player.y;
    ctx.save();

    if(berryImg.complete&&berryImg.naturalWidth){
        ctx.imageSmoothingEnabled=false;
        ctx.drawImage(berryImg,x,y,player.w,player.h);
    }else{
        rect(x+20,y,50,65,'#f23acb');
        rect(x+10,y+55,70,70,'#e92ac5');
        rect(x+18,y+120,18,22,'#19051f');
        rect(x+55,y+120,18,22,'#19051f');
    }

    let pulse=Math.sin(world*13);

    rect(x+player.w-1,y+18,4,10,'#8beaff');
    rect(x+player.w+4,y+12,4,7,'#d9f8ff');

    text('!!',x+player.w+2,y+22+Math.max(0,pulse*3),18,'#fff2ff');

    rect(x-8,y+28,5,3,'#fff0ff');
    rect(x-12,y+37,7,3,'#ff8be9');

    ctx.restore();
}

function spawnObstacle(){
    let type=Math.random()<.62?'spikes':'crate';
    let w=type==='spikes'?rand(48,75):rand(42,58);
    let h=type==='spikes'?35:rand(38,55);

    obstacles.push({x:W+20,y:ground-h,w,h,type});
}

function drawObstacle(o){
    if(o.type==='spikes'){
        for(let i=0;i<3;i++){
            let sx=o.x+i*o.w/3;

            ctx.fillStyle='#ffb8fa';
            ctx.beginPath();
            ctx.moveTo(sx,o.y+o.h);
            ctx.lineTo(sx+o.w/6,o.y);
            ctx.lineTo(sx+o.w/3,o.y+o.h);
            ctx.fill();

            ctx.strokeStyle='#6e1a8d';
            ctx.lineWidth=3;
            ctx.stroke();
        }
    }else{
        rect(o.x,o.y,o.w,o.h,'#a72ac5');
        rect(o.x+5,o.y+5,o.w-10,o.h-10,'#ed4ad9');
        rect(o.x+o.w/2-3,o.y+5,6,o.h-10,'#8b1aab');
    }
}

function drawBackground(){
    let g=ctx.createLinearGradient(0,0,0,H);

    g.addColorStop(0,'#160624');
    g.addColorStop(.65,'#45105f');
    g.addColorStop(1,'#170522');

    ctx.fillStyle=g;
    ctx.fillRect(0,0,W,H);

    stars.forEach(s=>{
        ctx.globalAlpha=.45+.45*Math.sin(world*2+s.a*8);
        rect(s.x,s.y,s.r,s.r,'#ffd5ff');
    });

    ctx.globalAlpha=1;

    ctx.fillStyle='#f4a9ff';
    ctx.beginPath();
    ctx.arc(790,105,45,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle='#45105f';
    ctx.beginPath();
    ctx.arc(808,88,42,0,Math.PI*2);
    ctx.fill();

    for(let i=0;i<12;i++){
        let x=((i*110-world*24)%1250+1250)%1250-140;
        let h=90+(i*37)%115;

        rect(x,ground-h,55,h,'#260b3c');

        for(let wy=0;wy<4;wy++){
            for(let wx=0;wx<2;wx++){
                rect(x+10+wx*20,ground-h+14+wy*22,7,10,'#b72bbd');
            }
        }
    }

    for(let i=0;i<5;i++){
        let x=((i*250-world*42)%1200+1200)%1200-100;

        rect(x,300,90,20,'#581477');
        rect(x+20,285,55,20,'#581477');
    }

    rect(0,ground,W,H-ground,'#260b3d');
    rect(0,ground,W,9,'#f24bdc');

    for(let x=-(world*speed*.5%48);x<W;x+=48){
        rect(x,ground+22,24,5,'#4b155e');
        rect(x+22,ground+53,17,5,'#4b155e');
    }
}

function update(dt){
    world+=dt;

    score+=dt*speed*.09;

    // Velocidade inicial 350 e máxima 640
    speed=Math.min(640,350+score*.42);

    scoreEl.textContent=Math.floor(score)+' m';

    player.vy+=1900*dt;
    player.y+=player.vy*dt;

    if(player.y>=ground-player.h){
        player.y=ground-player.h;
        player.vy=0;
        player.onGround=true;
    }

    player.frame+=dt*12;

    // Cachorro permanece atrás do Berry
    dog.run+=dt;
    dog.x=player.x-230;
    dog.y=ground-dog.h;

    // Obstáculos
    spawn-=dt;

    if(spawn<=0){
        spawnObstacle();
        spawn=rand(1.0,1.65)*Math.max(.64,390/speed);
    }

    obstacles.forEach(o=>o.x-=speed*dt);
    obstacles=obstacles.filter(o=>o.x+o.w>-20);

    for(const o of obstacles){
        let px=player.x+8;
        let py=player.y+player.h-22;

        if(
            px+player.w-16>o.x+7&&
            px<o.x+o.w-7&&
            py+18>o.y+7&&
            player.y+player.h-4>o.y+7
        ){
            gameOver();
            break;
        }
    }

    particles.forEach(p=>{
        p.x+=p.vx*dt;
        p.y+=p.vy*dt;
        p.vy+=500*dt;
        p.life-=dt;
    });

    particles=particles.filter(p=>p.life>0);
}

function draw(){
    drawBackground();

    obstacles.forEach(drawObstacle);

    particles.forEach(p=>{
        ctx.globalAlpha=Math.max(0,p.life*2);
        rect(p.x,p.y,5,5,'#ff9bed');
    });

    ctx.globalAlpha=1;

    drawDog(dog.x,dog.y);
    drawBerry();

    let vg=ctx.createLinearGradient(0,0,0,100);

    vg.addColorStop(0,'#10031dbb');
    vg.addColorStop(1,'#10031d00');

    ctx.fillStyle=vg;
    ctx.fillRect(0,0,W,100);

    text('CORRE BERRY!',25,42,25,'#ff73e8');
    text('PONTUAÇÃO  '+Math.floor(score)+' m',W-24,42,19,'#fff0ff','right');
}

function loop(t){
    let dt=Math.min(.033,(t-last)/1000||0);
    last=t;

    if(state==='playing')update(dt);

    draw();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
})();
