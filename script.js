const endereco = "http://localhost:3000/gerar";

const botao = document.querySelector(".botao-gerar");

botao.addEventListener("click", gerarCodigo);

async function gerarCodigo() {
    const textarea = document.querySelector(".texto-pagina");
    const espacoCodigo = document.querySelector(".bloco-codigo");
    const espacoSite = document.querySelector(".bloco-site");

    const texto = textarea.value.trim();

    if (texto === "") {
        espacoCodigo.textContent = "Digite uma descrição primeiro.";
        return;
    }

    espacoCodigo.textContent = "Gerando...";

    try {
        const resposta = await fetch(endereco, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                texto: texto
            })
        });

        const dados = await resposta.json();

        console.log(dados);

        if (!resposta.ok) {
            throw new Error(dados.erro || "Erro na requisição.");
        }

        const resultado = dados.resultado;

        espacoCodigo.textContent = resultado;
        espacoSite.srcdoc = resultado;

    } catch (erro) {
        console.error(erro);
        espacoCodigo.textContent = "Erro: " + erro.message;
        
    }
}