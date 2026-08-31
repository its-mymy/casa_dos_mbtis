document.addEventListener("DOMContentLoaded",()=>{
    const $=id=>document.getElementById(id);
    const card=$("card4");
    const phone=document.querySelector(".phone");
    const wrapper=document.querySelector(".card4-wrapper");
    const accessoryLayer=$("accessoryLayer");

    const campos=[
        ["nome","nomePreview"],
        ["mbti","mbtiPreview"],
        ["eneagrama","eneagramaPreview"],
        ["tritype","tritypePreview"],
        ["instinto","instintoPreview"],
        ["temperamento","temperamentoPreview"],
        ["bigfive","bigfivePreview"]
    ];

    campos.forEach(([inputId,previewId])=>{
        const input=$(inputId);
        const preview=$(previewId);

        input.addEventListener("input",()=>{
            preview.textContent=input.value||"";
        });
    });

    function configurarCor(inputId,hexId,callback){
        const input=$(inputId);
        const hex=$(hexId);

        const atualizar=()=>{
            const valor=input.value.toUpperCase();
            hex.textContent=valor;
            callback(valor);
        };

        input.addEventListener("input",atualizar);
        atualizar();
    }

    configurarCor("corFundo","corFundoHex",cor=>{
        card.style.backgroundColor=cor;
    });

    configurarCor("corCelular","corCelularHex",cor=>{
        card.style.setProperty("--phone-color",cor);
    });

    configurarCor("corBotoes","corBotoesHex",cor=>{
        card.style.setProperty("--button-color",cor);
    });

    configurarCor("corBrilhos","corBrilhosHex",cor=>{
        card.style.setProperty("--sparkle-color",cor);
        document.querySelectorAll(".sparkle,.phone-star").forEach(el=>{
            el.style.color=cor;
        });
    });

    $("foto").addEventListener("change",event=>{
        const arquivo=event.target.files[0];

        if(!arquivo)return;

        if(!arquivo.type.startsWith("image/")){
            alert("Escolha uma imagem válida.");
            return;
        }

        const reader=new FileReader();

        reader.onload=e=>{
            const container=$("fotoContainer");

            container.innerHTML="";

            const img=document.createElement("img");

            img.src=e.target.result;
            img.alt="Foto do card";

            container.appendChild(img);
        };

        reader.readAsDataURL(arquivo);
    });

    $("cantoEmoji").addEventListener("change",event=>{
        $("cornerCharm").textContent=event.target.value;
    });

    const accessoryButtons=document.querySelectorAll(".accessory");

    const posicoes=[
        "accessory-position-1",
        "accessory-position-2",
        "accessory-position-3",
        "accessory-position-4",
        "accessory-position-5",
        "accessory-position-6",
        "accessory-position-7",
        "accessory-position-8"
    ];

    accessoryButtons.forEach(button=>{
        button.addEventListener("click",()=>{
            const emoji=button.dataset.emoji;

            const existente=[...accessoryLayer.children].find(el=>el.dataset.emoji===emoji);

            if(existente){
                existente.remove();
                button.classList.remove("active");
            }else{
                const acessorio=document.createElement("span");

                acessorio.className="card-accessory";
                acessorio.dataset.emoji=emoji;
                acessorio.textContent=emoji;

                accessoryLayer.appendChild(acessorio);
                button.classList.add("active");
            }

            reorganizarAcessorios();
        });
    });

    function reorganizarAcessorios(){
        [...accessoryLayer.children].forEach((el,index)=>{
            el.className=`card-accessory ${posicoes[index%posicoes.length]}`;
        });
    }

    $("limparAcessorios").addEventListener("click",()=>{
        accessoryLayer.innerHTML="";

        accessoryButtons.forEach(button=>{
            button.classList.remove("active");
        });
    });

    function ajustarPreview(){
        const larguraDisponivel=Math.min(
            wrapper.clientWidth,
            window.innerWidth-20
        );

        const escala=Math.min(
            .78,
            Math.max(.25,(larguraDisponivel-10)/800)
        );

        card.style.transform=`scale(${escala})`;
        wrapper.style.height=`${980*escala}px`;
    }

    window.addEventListener("resize",ajustarPreview);
    ajustarPreview();

    $("baixarCard").addEventListener("click",async()=>{
        const botao=$("baixarCard");
        const nome=$("nome").value.trim()||"meu-card";
        const transformOriginal=card.style.transform;

        botao.disabled=true;
        botao.innerHTML="✨ GERANDO CARD...";

        try{
            await document.fonts.ready;

            card.style.transform="none";

            const computedCard=getComputedStyle(card);
            const fundo=computedCard.backgroundColor;
            const phoneColor=computedCard.getPropertyValue("--phone-color").trim();
            const buttonColor=computedCard.getPropertyValue("--button-color").trim();
            const sparkleColor=computedCard.getPropertyValue("--sparkle-color").trim();

            const canvas=await html2canvas(card,{
                scale:3,
                useCORS:true,
                allowTaint:false,
                backgroundColor:fundo||null,
                imageTimeout:0,
                logging:false,
                foreignObjectRendering:false,
                removeContainer:true,

                onclone:clonedDocument=>{
                    const clonedCard=clonedDocument.getElementById("card4");

                    if(!clonedCard)return;

                    clonedCard.style.transform="none";
                    clonedCard.style.backgroundColor=fundo;
                    clonedCard.style.setProperty("--phone-color",phoneColor);
                    clonedCard.style.setProperty("--button-color",buttonColor);
                    clonedCard.style.setProperty("--sparkle-color",sparkleColor);

                    const clonedPhone=clonedCard.querySelector(".phone");

                    if(clonedPhone){
                        clonedPhone.style.setProperty("--phone-color",phoneColor);
                    }

                    clonedCard.querySelectorAll(".sparkle,.phone-star").forEach(element=>{
                        element.style.color=sparkleColor;
                    });

                    clonedCard.querySelectorAll(".info-button").forEach(element=>{
                        element.style.backgroundColor=buttonColor;
                    });
                }
            });

            const link=document.createElement("a");

            link.download=`${nome}-card4.png`;
            link.href=canvas.toDataURL("image/png",1);

            document.body.appendChild(link);
            link.click();
            link.remove();

        }catch(erro){
            console.error("Erro ao gerar Card 4:",erro);
            alert("Não foi possível gerar o card. Tente novamente.");
        }finally{
            card.style.transform=transformOriginal;
            ajustarPreview();

            botao.disabled=false;
            botao.innerHTML="<span>💗</span> BAIXAR CARD EM PNG";
        }
    });
});