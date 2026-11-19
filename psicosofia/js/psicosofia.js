const psychosophyTypes = [
{quadra:"Primeira quadra",types:[["Andersen","ELVF"],["Gazali","EVLF"],["Goethe","FVLE"],["Aristippus","FLVE"]]},
{quadra:"Segunda quadra",types:[["Pushkin","EFVL"],["Pasternak","EVFL"],["Laozi","LVFE"],["Plato","LFVE"]]},
{quadra:"Terceira quadra",types:[["Russo","ELFV"],["Bukharin","EFLV"],["Napoleon","VFLE"],["Lenin","VLFE"]]},
{quadra:"Quarta quadra",types:[["Augustin","LEFV"],["Bertye","LFEV"],["Tvardovsky","VFEL"],["Tolstoy","VEFL"]]},
{quadra:"Quinta quadra",types:[["Epicurus","FLEV"],["Borgia","FELV"],["Ahmatova","VELF"],["Socrates","VLEF"]]},
{quadra:"Sexta quadra",types:[["Chekhov","FVEL"],["Duma","FEVL"],["Pascal","LEVF"],["Einstein","LVEF"]]}
];
const aspectNames={F:"Física",V:"Vontade",E:"Emoção",L:"Lógica"};
const positionNames=["Dominante","Criativa","Vulnerável","Inferior"];
const positionSummaries=[
"tende a preservar o próprio estado do aspecto com autonomia, tratando-o como algo relativamente natural e estável.",
"costuma explorar o aspecto de forma ativa e flexível, com interesse em interagir e estimular o estado de outras pessoas.",
"mantém atenção consciente ao aspecto, mas pode sentir tensão diante da influência externa, avaliações ou resultados indesejados.",
"investe menos atenção deliberada no aspecto e tende a responder às demandas e referências oferecidas pelo ambiente."
];
const root=document.getElementById("type-groups");
const search=document.getElementById("type-search");
const count=document.getElementById("type-count");
function renderTypes(query=""){
 const term=query.trim().toLocaleLowerCase("pt-BR");
 root.innerHTML="";
 let visible=0;
 psychosophyTypes.forEach((group,index)=>{
  const section=document.createElement("section");
  section.className="type-group";
  const heading=document.createElement("div");
  heading.className="type-group__head";
  const title=document.createElement("h3");
  title.textContent=group.quadra;
  const total=document.createElement("span");
  total.textContent="04 COMBINAÇÕES";
  heading.append(title,total);
  section.append(heading);
  group.types.forEach(([name,code])=>{
   const matches=!term||name.toLocaleLowerCase("pt-BR").includes(term)||code.toLowerCase().includes(term)||group.quadra.toLocaleLowerCase("pt-BR").includes(term);
   const item=document.createElement("article");
   item.className="type-item";
   item.hidden=!matches;
   if(matches)visible++;
   const button=document.createElement("button");
   button.type="button";
   button.className="type-toggle";
   button.setAttribute("aria-expanded","false");
   const codeEl=document.createElement("span");codeEl.className="type-code";codeEl.textContent=code;
   const nameEl=document.createElement("span");nameEl.className="type-name";nameEl.textContent=name;
   const arrow=document.createElement("span");arrow.className="type-chevron";arrow.textContent="⌄";
   button.append(codeEl,nameEl,arrow);
   const detail=document.createElement("div");detail.className="type-detail";detail.hidden=true;
   const intro=document.createElement("p");
   intro.textContent=name+" ("+code+") organiza os quatro aspectos nesta sequência. A leitura abaixo descreve a estrutura do código; não é uma descrição fechada de personalidade nem uma avaliação de capacidades.";
   const list=document.createElement("div");list.className="type-order";
   [...code].forEach((letter,i)=>{const tag=document.createElement("span");tag.textContent=(i+1)+"ª "+letter+" — "+aspectNames[letter];list.append(tag)});
   const explanation=document.createElement("p");
   explanation.innerHTML="<strong>Leitura das posições:</strong> ";
   explanation.append(document.createTextNode([...code].map((letter,i)=>(i+1)+"ª "+aspectNames[letter]+" "+positionSummaries[i]).join(" ")));
   detail.append(intro,list,explanation);
   button.addEventListener("click",()=>{const open=button.getAttribute("aria-expanded")==="true";button.setAttribute("aria-expanded",String(!open));detail.hidden=open});
   item.append(button,detail);section.append(item);
  });
  if(section.querySelector(".type-item:not([hidden])"))root.append(section);
 });
 if(!visible){const empty=document.createElement("p");empty.className="type-empty";empty.textContent="Nenhum tipo encontrado. Tente buscar pelo código ou pelo nome.";root.append(empty)}
 count.textContent=visible+" de 24 tipos";
}
if(root&&search){renderTypes();search.addEventListener("input",()=>renderTypes(search.value))}
