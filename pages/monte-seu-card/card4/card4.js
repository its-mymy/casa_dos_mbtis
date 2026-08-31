document.addEventListener("DOMContentLoaded",()=>{

    const $=id=>document.getElementById(id);

    const card=$("card4");
    const phone=document.querySelector(".phone");
    const phoneBase=document.querySelector(".phone-base");
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


    /* ==============================
       CORES
    ============================== */

    function configurarCor(inputId,hexId,callback){

        const input=$(inputId);
        const hex=$(hexId);

        const atualizar=()=>{
            const cor=input.value.toUpperCase();
            hex.textContent=cor;
            callback(cor);
        };

        input.addEventListener("input",atualizar);
        atualizar();
    }


    configurarCor("corFundo","corFundoHex",cor=>{
        card.style.backgroundColor=cor;
    });


    configurarCor("corCelular","corCelularHex",cor=>{

        /* COR REAL DO TELEFONE */
        phoneBase.style.backgroundColor=cor;

    });


    configurarCor("corBotoes","corBotoesHex",cor=>{

        document.querySelectorAll(".info-button").forEach(button=>{
            button.style.backgroundColor=cor;
        });

    });


    configurarCor("corBrilhos","corBrilhosHex",cor=>{

        document.querySelectorAll(".sparkle,.phone-star").forEach(element=>{
            element.style.color=cor;
        });

    });


    /* ==============================
       FOTO
    ============================== */

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


    /* ==============================
       ENFEITE DO CANTO
    ============================== */

    $("cantoEmoji").addEventListener("change",event=>{
        $("cornerCharm").textContent=event.target.value;
    });


    /* ==============================
       ACESSÓRIOS
    ============================== */

    const accessoryButtons=
        document.querySelectorAll(".accessory");

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

            const existente=
                [...accessoryLayer.children]
                .find(el=>el.dataset.emoji===emoji);


            if(existente){

                existente.remove();
                button.classList.remove("active");

            }else{

                const acessorio=
                    document.createElement("span");

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

            el.className=
                `card-accessory ${posicoes[index%posicoes.length]}`;

        });

    }


    $("limparAcessorios").addEventListener("click",()=>{

        accessoryLayer.innerHTML="";

        accessoryButtons.forEach(button=>{
            button.classList.remove("active");
        });

    });


    /* ==============================
       PREVIEW RESPONSIVO
    ============================== */

    function ajustarPreview(){

        const larguraDisponivel=
            Math.min(
                wrapper.clientWidth,
                window.innerWidth-20
            );

        const escala=
            Math.min(
                .78,
                Math.max(
                    .25,
                    (larguraDisponivel-10)/800
                )
            );

        card.style.transform=`scale(${escala})`;

        wrapper.style.height=
            `${980*escala}px`;

    }


    window.addEventListener(
        "resize",
        ajustarPreview
    );

    ajustarPreview();


    /* ==============================
       ESPERAR O CARD PINTAR
    ============================== */

    function esperarRenderizacao(){

        return new Promise(resolve=>{

            requestAnimationFrame(()=>{
                requestAnimationFrame(()=>{
                    resolve();
                });
            });

        });

    }


    /* ==============================
       ESPERAR IMAGENS
    ============================== */

    async function esperarImagens(){

        const imagens=
            [...card.querySelectorAll("img")];

        await Promise.all(
            imagens.map(img=>{

                if(img.complete){
                    return Promise.resolve();
                }

                return new Promise(resolve=>{
                    img.addEventListener(
                        "load",
                        resolve,
                        {once:true}
                    );

                    img.addEventListener(
                        "error",
                        resolve,
                        {once:true}
                    );
                });

            })
        );

    }


    /* ==============================
       DOWNLOAD
    ============================== */

    $("baixarCard").addEventListener(
        "click",
        async()=>{

            const botao=$("baixarCard");

            const nome=
                $("nome").value.trim()||
                "meu-card";

            const transformOriginal=
                card.style.transform;


            botao.disabled=true;

            botao.innerHTML=
                "✨ GERANDO CARD...";


            try{

                await document.fonts.ready;

                await esperarImagens();


                /* PEGA AS CORES DIRETO DOS INPUTS */

                const corFundo=
                    $("corFundo").value;

                const corCelular=
                    $("corCelular").value;

                const corBotoes=
                    $("corBotoes").value;

                const corBrilhos=
                    $("corBrilhos").value;


                /* REMOVE A ESCALA VISUAL */

                card.style.transform="none";


                /* APLICA DIRETAMENTE */

                card.style.backgroundColor=
                    corFundo;

                phoneBase.style.backgroundColor=
                    corCelular;


                document
                    .querySelectorAll(".info-button")
                    .forEach(button=>{
                        button.style.backgroundColor=
                            corBotoes;
                    });


                document
                    .querySelectorAll(".sparkle,.phone-star")
                    .forEach(element=>{
                        element.style.color=
                            corBrilhos;
                    });


                await esperarRenderizacao();


                const canvas=
                    await html2canvas(
                        card,
                        {
                            scale:3,
                            useCORS:true,
                            allowTaint:false,
                            backgroundColor:corFundo,
                            imageTimeout:0,
                            logging:false,
                            foreignObjectRendering:false
                        }
                    );


                const link=
                    document.createElement("a");


                link.download=
                    `${nome}-card4.png`;


                link.href=
                    canvas.toDataURL(
                        "image/png",
                        1
                    );


                document.body.appendChild(link);

                link.click();

                link.remove();


            }catch(erro){

                console.error(
                    "Erro ao gerar Card 4:",
                    erro
                );

                alert(
                    "Não foi possível gerar o card. Tente novamente."
                );

            }finally{

                card.style.transform=
                    transformOriginal;

                ajustarPreview();

                botao.disabled=false;

                botao.innerHTML=
                    "<span>💗</span> BAIXAR CARD EM PNG";

            }

        }
    );

});