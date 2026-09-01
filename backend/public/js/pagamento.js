if(!verificarLogin()){

    throw new Error("Usuário não autenticado.");

}

const parametros=new URLSearchParams(window.location.search);

const id=parametros.get("id");

async function carregarPix(){

    const resposta=await api("/api/pagamento/pix/"+id);

    if(!resposta)return;

    const dados=await resposta.json();

    document.getElementById("cliente").textContent=dados.cliente;

    document.getElementById("modalidade").textContent="🏖 "+dados.modalidade;

    document.getElementById("data").textContent="📅 "+dados.data;

    document.getElementById("horario").textContent="⏰ "+dados.horario;

    document.getElementById("valor").textContent=

    Number(dados.valor).toLocaleString(

        "pt-BR",

        {

            style:"currency",

            currency:"BRL"

        }

    );

    document.getElementById("pix").value=dados.copiaecola;

    document.getElementById("qrcode").src=dados.qrcode;

}

document.getElementById("copiar").onclick=()=>{

    navigator.clipboard.writeText(

        document.getElementById("pix").value

    );

    alert("Código PIX copiado.");

};

document.getElementById("confirmar").onclick=async()=>{

    const resposta=await api(

        "/api/pagamento/confirmar/"+id,

        {

            method:"PUT"

        }

    );

    if(!resposta)return;

    const dados=await resposta.json();

    alert(dados.mensagem);

    location.href="/minhas-reservas";

};

document.getElementById("voltar").onclick=()=>{

    history.back();

};

carregarPix();