const psychosophyTypes = [
{quadra:"Primeira quadra",types:[["Andersen","ELVF"],["Gazali","EVLF"],["Goethe","FVLE"],["Aristippus","FLVE"]]},
{quadra:"Segunda quadra",types:[["Pushkin","EFVL"],["Pasternak","EVFL"],["Laozi","LVFE"],["Plato","LFVE"]]},
{quadra:"Terceira quadra",types:[["Russo","ELFV"],["Bukharin","EFLV"],["Napoleon","VFLE"],["Lenin","VLFE"]]},
{quadra:"Quarta quadra",types:[["Augustin","LEFV"],["Bertye","LFEV"],["Tvardovsky","VFEL"],["Tolstoy","VEFL"]]},
{quadra:"Quinta quadra",types:[["Epicurus","FLEV"],["Borgia","FELV"],["Ahmatova","VELF"],["Socrates","VLEF"]]},
{quadra:"Sexta quadra",types:[["Chekhov","FVEL"],["Duma","FEVL"],["Pascal","LEVF"],["Einstein","LVEF"]]}
];
const aspectNames={F:"Física",V:"Vontade",E:"Emoção",L:"Lógica"};
const typeDescriptions = {
  "ELVF": "A combinação parte de uma referência emocional própria e estável. A Lógica criativa permite explorar ideias em diálogo; a Vontade vulnerável torna decisões e autonomia um campo de atenção sensível; a Física inferior recebe menor investimento deliberado.",
  "EVLF": "A Emoção ocupa a referência mais estável, enquanto a Vontade aparece como espaço flexível de iniciativa e negociação. A Lógica vulnerável pode concentrar preocupação em argumentos e avaliações; a Física inferior tende a ficar em segundo plano.",
  "FVLE": "A Física estabelece uma referência material própria, e a Vontade criativa permite experimentar caminhos para realizar objetivos. A Lógica vulnerável concentra atenção em coerência e explicações; a Emoção inferior recebe menos investimento consciente.",
  "FLVE": "A relação com o mundo material tende a seguir uma referência própria, enquanto a Lógica criativa favorece investigação e troca de ideias. A Vontade vulnerável pode tornar escolhas uma área de autocobrança; a Emoção inferior é menos priorizada.",
  "EFVL": "A Emoção funciona como referência estável e a Física criativa permite responder com flexibilidade a necessidades concretas. A Vontade vulnerável pode sentir pressão em decisões; a Lógica inferior tende a exigir menos atenção.",
  "EVFL": "A referência emocional própria se combina com uma Vontade criativa, voltada a explorar decisões e objetivos. A Física vulnerável concentra atenção em conforto e recursos; a Lógica inferior recebe menor investimento deliberado.",
  "LVFE": "A Lógica oferece uma referência estável para ideias e conclusões, enquanto a Vontade criativa explora possibilidades de ação. A Física vulnerável pode gerar preocupação com condições materiais; a Emoção inferior recebe menos atenção.",
  "LFVE": "A Lógica dominante sustenta critérios próprios, e a Física criativa favorece soluções práticas e flexíveis. A Vontade vulnerável torna autonomia e decisões áreas sensíveis; a Emoção inferior tende a ficar menos presente na atenção deliberada.",
  "ELFV": "A referência emocional própria se combina com uma Lógica criativa, aberta à exploração de ideias. A Física vulnerável pode concentrar preocupação em conforto e recursos; a Vontade inferior recebe pouco investimento consciente.",
  "EFLV": "A Emoção dominante preserva uma referência afetiva própria, enquanto a Física criativa permite interação flexível com o ambiente material. A Lógica vulnerável pode gerar autocobrança intelectual; a Vontade inferior tende a não ser prioridade.",
  "VFLE": "A Vontade estabelece uma direção própria, e a Física criativa permite experimentar maneiras de atender necessidades concretas. A Lógica vulnerável pode sentir pressão diante de questionamentos; a Emoção inferior recebe menor atenção.",
  "VLFE": "A direção pessoal da Vontade se combina com uma Lógica criativa, aberta a desenvolver e compartilhar ideias. A Física vulnerável concentra atenção em recursos e conforto; a Emoção inferior tende a receber pouco investimento.",
  "LEFV": "A Lógica forma uma referência própria para conhecimento, enquanto a Emoção criativa favorece expressão e troca afetiva. A Física vulnerável pode gerar preocupação com necessidades materiais; a Vontade inferior recebe menos atenção.",
  "LFEV": "A referência lógica estável se combina com uma Física criativa e adaptável. A Emoção vulnerável pode tornar expressão e avaliação afetiva áreas sensíveis; a Vontade inferior tende a não exigir investimento constante.",
  "VFEL": "A Vontade dominante sustenta objetivos próprios e a Física criativa permite buscar soluções materiais flexíveis. A Emoção vulnerável pode concentrar preocupação na expressão afetiva; a Lógica inferior recebe menor investimento.",
  "VEFL": "A Vontade oferece uma direção pessoal, enquanto a Emoção criativa favorece expressão e interação. A Física vulnerável pode gerar autocobrança sobre conforto e recursos; a Lógica inferior tende a permanecer em segundo plano.",
  "FLEV": "A Física estabelece uma referência própria para o mundo material, e a Lógica criativa favorece investigação e troca de conhecimentos. A Emoção vulnerável pode tornar manifestações afetivas sensíveis; a Vontade inferior recebe menos atenção.",
  "FELV": "A referência física estável se combina com uma Emoção criativa, voltada à expressão e à troca de sentimentos. A Lógica vulnerável pode gerar preocupação com argumentos e explicações; a Vontade inferior recebe menor investimento.",
  "VELF": "A Vontade estabelece uma direção própria e a Emoção criativa favorece a expressão e a interação. A Lógica vulnerável pode tornar opiniões e avaliações sensíveis; a Física inferior tende a receber pouca atenção deliberada.",
  "VLEF": "A Vontade dominante sustenta decisões e objetivos, enquanto a Lógica criativa permite explorar ideias e compartilhar conclusões. A Emoção vulnerável pode sentir pressão na expressão afetiva; a Física inferior recebe menor investimento.",
  "FVEL": "A Física dominante estabelece uma referência própria para conforto e recursos, enquanto a Vontade criativa explora caminhos para realizar objetivos. A Emoção vulnerável pode concentrar preocupação em sentimentos; a Lógica inferior recebe pouca atenção.",
  "FEVL": "A referência material própria se combina com uma Emoção criativa e expressiva. A Vontade vulnerável pode tornar decisões e autonomia áreas sensíveis; a Lógica inferior tende a receber menor investimento consciente.",
  "LEVF": "A Lógica dominante sustenta critérios próprios, enquanto a Emoção criativa favorece compartilhar experiências. A Vontade vulnerável pode gerar autocobrança em decisões; a Física inferior tende a não ser prioridade.",
  "LVEF": "A Lógica oferece uma referência própria para conhecimento, e a Vontade criativa permite explorar metas e decisões. A Emoção vulnerável pode tornar expressão afetiva uma área sensível; a Física inferior recebe menor investimento deliberado."
};
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
   intro.textContent=typeDescriptions[code] || (name+" ("+code+") organiza os quatro aspectos nesta sequência.");
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
