// entrada
let cep = document.getElementById(`cep`);
let botao = document.getElementById(`botao`);
 
// cartão de informações
let num = document.getElementById(`numero`);
let log = document.getElementById(`logadouro`);
let cidade = document.getElementById(`cidade`);
let estado = document.getElementById(`estado`);
 
// tabela
let registros = document.getElementById(`registros`);
let tbody = document.getElementById(`corpo-tabela`);
 
 
// guardar dados
 
let infos = [];
 
 
//funcoes do cartao
 
function limparCampos(){
    num.textContent = "";
    log.textContent = "";
    cidade.textContent = "";
    estado.textContent = "";
}
 
 
 
// cria UMA linha com os dados e devolve ela
function criarLinha(dado){
    let linha = document.createElement(`tr`);
    let coluna1 = document.createElement(`td`);
    let coluna2 = document.createElement(`td`);
    let coluna3 = document.createElement(`td`);
    let coluna4 = document.createElement(`td`);
 
    coluna1.textContent = dado.cep;
    coluna2.textContent = dado.logradouro;
    coluna3.textContent = dado.localidade;
    coluna4.textContent = dado.uf;
 
    linha.appendChild(coluna1);
    linha.appendChild(coluna2);
    linha.appendChild(coluna3);
    linha.appendChild(coluna4);
 
    return linha;
}
 
// limpa o corpo da tabela e coloca uma linha para cada registro
function mostrarTabela(){
    tbody.innerHTML = "";
 
    infos.forEach(dado => {
        tbody.appendChild(criarLinha(dado));
    });
}
 
// pega o que está no cartão, guarda e atualiza a tabela
function salvarRegistro(){
    const jaExiste = infos.some(item => item.cep === num.textContent);

    if(jaExiste){
        return;
    }

    const registro = {
        cep: num.textContent,
        logradouro: log.textContent,
        localidade: cidade.textContent,
        uf: estado.textContent
    };
 
    infos.push(registro);
    localStorage.setItem("dadosGuardados", JSON.stringify(infos));
 
    registros.classList.add("aparecer");
    mostrarTabela();
}
 
 
//busca o cep
 
async function buscarCeps(){
    let valorCep = cep.value
 
    if(valorCep.length !== 8){
        window.alert(`digite um numero valido`)
        limparCampos()
        return;
    }
 
    try{
        let response = await fetch(`https://viacep.com.br/ws/${valorCep}/json/`)
 
        if(!response.ok){
            throw new Error(`CEP errado ou erro ao tentar realizar resuisição ${response.status}`);
        }
 
        let dados = await response.json();
 
        if(dados.erro){
            window.alert("CEP não encontrado.");
            limparCampos();
            return;
        }
 
        num.textContent = valorCep;
        log.textContent = dados.logradouro || "Não informado";
        cidade.textContent = dados.localidade;
        estado.textContent = dados.uf;
 
        salvarRegistro()
 
    }
    catch(erro){
        console.error("Falhou, ", erro.message);
        window.alert("Não foi possível consultar o CEP. Tente novamente.");
        limparCampos();
 
    }
}
 
 
//mostra quando abra a pagina
 
let dadosRecuperados = localStorage.getItem("dadosGuardados");
 
if (dadosRecuperados) {
    infos = JSON.parse(dadosRecuperados);
    registros.classList.add(`aparecer`);
    mostrarTabela()
}
 