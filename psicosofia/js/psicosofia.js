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
  "ELVF": "A Emoção é uma referência importante e estável. A Lógica criativa ajuda a trocar ideias; a Vontade vulnerável pode trazer insegurança na hora de decidir; e a Física costuma ficar em segundo plano.",
  "EVLF": "A pessoa tende a confiar na própria forma de sentir e expressar emoções. Usa a Vontade com flexibilidade, mas pode ficar mais sensível quando precisa lidar com argumentos e explicações. A parte física recebe menos atenção.",
  "FVLE": "A pessoa costuma ter uma relação firme com conforto e assuntos materiais. A Vontade criativa ajuda a encontrar caminhos para alcançar objetivos. Já explicações e demonstrações emocionais podem gerar mais preocupação ou receber menos atenção.",
  "FLVE": "A Física é uma referência estável, enquanto a Lógica criativa abre espaço para pesquisar e conversar sobre ideias. Decisões podem ser um ponto delicado, e a Emoção tende a ficar menos em foco.",
  "EFVL": "A pessoa tende a confiar na própria maneira de sentir e se expressar. A Física criativa ajuda a se adaptar ao ambiente; decisões podem gerar insegurança, enquanto a Lógica costuma receber menos atenção.",
  "EVFL": "A Emoção é uma referência forte, e a Vontade aparece de forma flexível na busca por objetivos. Conforto e recursos podem ser motivo de preocupação, enquanto a Lógica fica mais em segundo plano.",
  "LVFE": "A pessoa confia bastante na própria maneira de pensar. A Vontade criativa ajuda a experimentar caminhos e tomar iniciativa. Assuntos materiais podem gerar preocupação, e a Emoção recebe menos atenção.",
  "LFVE": "A Lógica é uma referência estável, e a Física criativa ajuda a encontrar soluções práticas. Decisões e autonomia podem ser pontos sensíveis; a Emoção costuma ficar menos em foco.",
  "ELFV": "A pessoa tem uma forma própria e estável de lidar com emoções e gosta de explorar ideias. Conforto e recursos podem gerar preocupação, enquanto a Vontade tende a não ser prioridade.",
  "EFLV": "A Emoção é uma referência forte, e a Física criativa ajuda a lidar com situações práticas de vários jeitos. A pessoa pode se cobrar bastante em assuntos de lógica, enquanto a Vontade fica em segundo plano.",
  "VFLE": "A pessoa costuma ter objetivos e decisões bem definidos. A Física criativa ajuda a encontrar soluções práticas. Questionamentos podem gerar tensão, e a expressão emocional tende a receber menos atenção.",
  "VLFE": "A Vontade dá direção aos objetivos, enquanto a Lógica criativa ajuda a explorar e compartilhar ideias. Conforto e recursos podem ser pontos de preocupação; a Emoção costuma ficar menos em foco.",
  "LEFV": "A pessoa confia na própria maneira de pensar e usa a Emoção com criatividade para se expressar e se conectar. Assuntos materiais podem gerar preocupação, enquanto a Vontade recebe menos atenção.",
  "LFEV": "A Lógica é uma referência estável, e a Física criativa ajuda a encontrar soluções práticas. A pessoa pode ficar mais sensível a avaliações emocionais; a Vontade tende a não ser prioridade.",
  "VFEL": "A Vontade dá uma direção firme, e a Física criativa ajuda a encontrar formas de alcançar objetivos. Expressar sentimentos pode ser mais delicado, enquanto a Lógica fica em segundo plano.",
  "VEFL": "A pessoa costuma saber o que quer e usa a Emoção com flexibilidade para se expressar e interagir. Conforto e recursos podem gerar preocupação; a Lógica recebe menos atenção.",
  "FLEV": "A Física é uma referência estável, e a Lógica criativa ajuda a pesquisar e trocar conhecimentos. A expressão emocional pode ser um ponto sensível, enquanto a Vontade fica menos em foco.",
  "FELV": "A pessoa tende a confiar na própria relação com conforto e assuntos materiais. A Emoção criativa ajuda a expressar e compartilhar sentimentos. Debates podem gerar tensão, e a Vontade fica em segundo plano.",
  "VELF": "A Vontade dá direção aos objetivos, e a Emoção criativa facilita a expressão e a troca com outras pessoas. Opiniões e argumentos podem ser pontos sensíveis; a Física recebe menos atenção.",
  "VLEF": "A pessoa costuma ter objetivos claros e usa a Lógica com flexibilidade para explorar ideias. Expressar sentimentos pode ser mais delicado, enquanto a Física fica em segundo plano.",
  "FVEL": "A Física é uma referência estável, e a Vontade criativa ajuda a encontrar caminhos para realizar objetivos. A pessoa pode ficar mais sensível em assuntos emocionais, enquanto a Lógica recebe menos atenção.",
  "FEVL": "A pessoa confia na própria relação com o mundo material e usa a Emoção com criatividade para se expressar. Decisões podem gerar insegurança, e a Lógica tende a ficar em segundo plano.",
  "LEVF": "A Lógica é uma referência estável, e a Emoção criativa ajuda a compartilhar experiências e sentimentos. A pessoa pode se cobrar ao tomar decisões, enquanto a Física recebe menos atenção.",
  "LVEF": "A pessoa confia na própria maneira de pensar e usa a Vontade com criatividade para explorar metas e decisões. Expressar sentimentos pode ser um ponto sensível, e a Física tende a ficar em segundo plano."
};
const positionNames=["Dominante","Criativa","Vulnerável","Inferior"];
const positionSummaries=[
"costuma confiar na própria maneira de lidar com esse assunto e prefere manter as coisas estáveis.",
"gosta de explorar esse assunto, testar possibilidades e trocar experiências com outras pessoas.",
"presta bastante atenção nesse assunto, mas pode ficar insegura com críticas, opiniões alheias ou medo de errar.",
"não costuma gastar tanta energia com esse assunto e muitas vezes prefere lidar com ele de forma simples, conforme a situação pede."
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
