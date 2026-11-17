(() => {
"use strict";
const $ = (id) => document.getElementById(id);
const slots = ["mbti","food","character","color","subtype","main","anime","hobby","music","temperament","flower","animal","favorite"];
const photos = new Map();
const card = $("cardPreview");
const toast = $("toast");
let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600)}
function safeText(value,fallback){return value.trim()||fallback}
function updateText(){
 $("previewName").textContent=safeText($("nameInput").value,"Name");
 $("previewAge").textContent=safeText($("ageInput").value,"Age");
 $("previewSubtype").textContent=safeText($("subtypeInput").value,"Subtipo");
 $("previewEnnea").textContent=safeText($("enneaInput").value,"Eneagrama");
}
["nameInput","ageInput","subtypeInput","enneaInput"].forEach(id=>$(id).addEventListener("input",updateText));
function updatePhoto(slot,dataUrl){
 const cell=document.querySelector('[data-slot="'+slot+'"]');
 const img=cell.querySelector("img");
 if(dataUrl){img.src=dataUrl;cell.classList.add("has-image");photos.set(slot,dataUrl)}
 else{img.removeAttribute("src");cell.classList.remove("has-image");photos.delete(slot)}
 const input=document.querySelector('[data-photo="'+slot+'"]');
 const item=input.closest(".upload-item");
 item.classList.toggle("selected",Boolean(dataUrl));
 item.querySelector(".upload-action").textContent=dataUrl?"Selecionada":"Escolher foto";
 $("photoCounter").textContent=photos.size+"/13";
}
function readImage(file){
 return new Promise((resolve,reject)=>{
  const reader=new FileReader();
  reader.onerror=()=>reject(new Error("Não foi possível ler esta imagem."));
  reader.onload=()=>{const img=new Image();img.onload=()=>resolve(reader.result);img.onerror=()=>reject(new Error("Formato de imagem inválido."));img.src=reader.result};
  reader.readAsDataURL(file);
 });
}
document.querySelectorAll("[data-photo]").forEach(input=>input.addEventListener("change",async()=>{
 const file=input.files&&input.files[0];if(!file)return;
 if(!file.type.startsWith("image/")){notify("Escolha um arquivo de imagem.");input.value="";return}
 if(file.size>15*1024*1024){notify("A imagem deve ter no máximo 15 MB.");input.value="";return}
 try{const data=await readImage(file);updatePhoto(input.dataset.photo,data)}
 catch(error){notify(error.message||"Erro ao carregar a foto.");input.value=""}
}));
function updateAppearance(){
 card.style.setProperty("--text-color",$("textColor").value);
 card.style.setProperty("--line-color",$("lineColor").value);
 card.style.setProperty("--line-width",$("lineWidth").value+"px");
 card.style.setProperty("--gap",$("spacing").value+"px");
 card.style.setProperty("--photo-filter",$("photoFilter").value);
 $("lineWidthValue").textContent=$("lineWidth").value+" px";
 $("spacingValue").textContent=$("spacing").value+" px";
}
["textColor","lineColor","lineWidth","spacing","photoFilter"].forEach(id=>$(id).addEventListener("input",updateAppearance));
document.querySelectorAll(".swatches button").forEach(button=>button.addEventListener("click",()=>{
 const input=$(button.closest(".swatches").dataset.for);input.value=button.dataset.color;input.dispatchEvent(new Event("input",{bubbles:true}));
}));
function loadImage(src){
 return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error("Uma das fotos não pôde ser preparada para salvar."));img.src=src});
}
function cropImage(ctx,img,x,y,w,h,filter){
 const scale=Math.max(w/img.naturalWidth,h/img.naturalHeight);
 const sw=w/scale,sh=h/scale,sx=(img.naturalWidth-sw)/2,sy=(img.naturalHeight-sh)/2;
 ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.filter=filter;
 ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);ctx.restore();ctx.filter="none";
}
async function exportCard(){
 const button=$("downloadBtn");button.disabled=true;button.textContent="Preparando imagem…";
 try{
  const W=1500,H=1800,canvas=document.createElement("canvas");canvas.width=W;canvas.height=H;
  const ctx=canvas.getContext("2d",{alpha:false});if(!ctx)throw new Error("Seu navegador não conseguiu preparar a imagem.");
  const textColor=$("textColor").value,lineColor=$("lineColor").value,lineWidth=Number($("lineWidth").value)*2.2,gap=Number($("spacing").value)*2.2,filter=$("photoFilter").value||"none";
  const margin=52,headerH=270,gridX=margin,gridY=headerH,gridW=W-margin*2,gridH=H-headerH-margin,cellW=gridW/4,rowH=gridH/4;
  ctx.fillStyle="#ffffff";ctx.fillRect(0,0,W,H);ctx.fillStyle=textColor;
  ctx.textAlign="left";ctx.textBaseline="alphabetic";ctx.font='italic 500 112px "Playfair Display", Georgia, serif';
  ctx.fillText(safeText($("nameInput").value,"Name").slice(0,28),margin,120);
  ctx.font='500 36px "DM Sans", Arial, sans-serif';ctx.fillText(safeText($("ageInput").value,"Age"),margin+4,194);
  let sx=margin+132;ctx.font='800 38px "DM Sans", Arial, sans-serif';
  for(const val of [safeText($("subtypeInput").value,"Subtipo"),safeText($("enneaInput").value,"Eneagrama")]){ctx.fillText(val,sx,194);sx+=ctx.measureText(val).width+42}
  ctx.textAlign="right";ctx.font='800 35px "DM Sans", Arial, sans-serif';ctx.fillText("Casa dos mbtis",W-margin,112);ctx.textAlign="left";
  const boxes={
   mbti:[0,0,1,1],food:[1,0,1,1],character:[2,0,1,1],color:[3,0,1,1],
   subtype:[0,1,1,1],main:[1,1,2,2],anime:[3,1,1,1],hobby:[0,2,1,1],music:[3,2,1,1],
   temperament:[0,3,1,1],flower:[1,3,1,1],animal:[2,3,1,1],favorite:[3,3,1,1]
  };
  const labels={mbti:"mbti",food:"food",character:"Character",color:"color",subtype:"Subtipo",main:"foto",anime:"Anime",hobby:"hobby",music:"music",temperament:"Temperamento",flower:"flower",animal:"animal",favorite:"fav app\nor game"};
  const loaded=new Map();await Promise.all([...photos.entries()].map(async([key,src])=>loaded.set(key,await loadImage(src))));
  for(const slot of slots){
   const [col,row,cols,rows]=boxes[slot],x=gridX+col*cellW,y=gridY+row*rowH,w=cols*cellW,h=rows*rowH;
   const inset=gap/2+lineWidth/2,ix=x+inset,iy=y+inset,iw=w-2*inset,ih=h-2*inset;
   ctx.fillStyle="#f5f3f7";ctx.fillRect(ix,iy,iw,ih);
   if(loaded.has(slot))cropImage(ctx,loaded.get(slot),ix,iy,iw,ih,filter);
   ctx.strokeStyle=lineColor;ctx.lineWidth=lineWidth;ctx.strokeRect(x+lineWidth/2,y+lineWidth/2,w-lineWidth,h-lineWidth);

  }
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/png"));
  if(!blob)throw new Error("Não foi possível gerar o PNG. Tente novamente.");
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="casa-dos-mbtis-card7.png";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);notify("Card salvo em PNG com sucesso!");
 }catch(error){console.error(error);notify(error.message||"Não foi possível salvar o card.")}
 finally{button.disabled=false;button.textContent="↓ Salvar imagem PNG"}
}
$("downloadBtn").addEventListener("click",exportCard);
$("resetBtn").addEventListener("click",()=>{
 ["nameInput","ageInput","subtypeInput","enneaInput"].forEach(id=>$(id).value="");
 document.querySelectorAll("[data-photo]").forEach(input=>{input.value="";updatePhoto(input.dataset.photo,null)});
 $("textColor").value="#17131d";$("lineColor").value="#242029";$("lineWidth").value=2;$("spacing").value=0;$("photoFilter").value="none";updateText();updateAppearance();notify("Personalização restaurada.");
});
updateText();updateAppearance();
})();