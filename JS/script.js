const modal = document.getElementById('modal');
const tituloModal = document.getElementById('tituloModal');
const textoModal = document.getElementById('textoModal');
document.getElementById('fechar').onclick = () => {modal.style.display = "none"};
let despesasListadas = document.getElementById('despesasListadas');


class Despesas{
    constructor(dia, mes, ano, tipo, descricao, valor){
        this.dia = dia;
        this.mes = mes;
        this.ano = ano;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    };

    validarValores(){
        for(let i in this){
            if(this[i] == '' || this[i] == null || this[i] == undefined){
                return false;
            } else{
                return true;
            }
        }
    }
}

class Bd {
    constructor(){
        let id = localStorage.getItem('id');
        if(id === null){
            localStorage.setItem('id', 0);
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }
    
    gravar(d){
        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(d));
        localStorage.setItem('id', id);
    }

    recuperarRegistros(){
        let arrayDespesas = []
        let id = localStorage.getItem('id');
        for(let i = 1; i <= id; i++){
            let valorDespesa = JSON.parse(localStorage.getItem(i));
            if(valorDespesa === null){
                continue;
            }
            valorDespesa.id = i;
            arrayDespesas.push(valorDespesa);
        }

        return arrayDespesas;
    }

    remover(id){
        localStorage.removeItem(id);
    }

    pesquisar(despesas){
        let despesasFiltradas = [];
        despesasFiltradas = this.recuperarRegistros();
        if(despesas.dia != ''){despesasFiltradas = despesasFiltradas.filter(f => f.dia == despesas.dia);};
        if(despesas.mes != ''){despesasFiltradas = despesasFiltradas.filter(f => f.mes == despesas.mes);};
        if(despesas.ano != ''){despesasFiltradas = despesasFiltradas.filter(f => f.ano == despesas.ano);};
        if(despesas.tipo != ''){despesasFiltradas = despesasFiltradas.filter(f => f.tipo == despesas.tipo);};
        if(despesas.descricao != ''){despesasFiltradas = despesasFiltradas.filter(f => f.descricao == despesas.descricao);};
        if(despesas.valor != ''){despesasFiltradas = despesasFiltradas.filter(f => f.valor == despesas.valor);};

        return despesasFiltradas;

        
    }
}

let bd = new Bd();

function adicioanarDespesa(){
    let dia = document.getElementById('dia').value;
    let mes = document.getElementById('mes').value;
    let ano = document.getElementById('ano').value;
    let tipo = document.getElementById('tipo').value; 
    let descricao = document.getElementById('descricao').value;
    let valor = Number(document.getElementById('valor').value);

    let despesas = new Despesas(dia, mes, ano, tipo, descricao, valor);

    if(despesas.validarValores() === true){
        bd.gravar(despesas);
        criarModalConcluido();
    } else{
        criarModalErro();
    }
}

function criarModalConcluido(){
    modal.style.display = "block";
    tituloModal.innerHTML = 'Despesa adicionada';
    textoModal.innerHTML = 'Os dados foram lançados com sucesso.';
    modal.style.backgroundColor = 'rgba(38, 192, 0, 0.945)';
    limparCampos();
}

function criarModalErro(){
    modal.style.display = "block";
    tituloModal.innerHTML = 'Dados invalidos';
    textoModal.innerHTML = 'Não foi possivel lançar os dados, verifique os mesmos, e tente novamente.';
    modal.style.backgroundColor = 'rgba(192, 0, 0, 0.945)';
}

function carregarDespesas(){
    let despesas = [];
    
    despesas = bd.recuperarRegistros();
    gerarLinhasTabela(despesas);
    console.log(despesas)
}

function pesquisarDespesa(){
    let dia = document.getElementById('dia').value;
    let mes = document.getElementById('mes').value;
    let ano = document.getElementById('ano').value;
    let tipo = document.getElementById('tipo').value; 
    let descricao = document.getElementById('descricao').value;
    let valor = Number(document.getElementById('valor').value);

    let despesa = new Despesas(dia, mes, ano, tipo, descricao, valor);
    let despesas = bd.pesquisar(despesa);
    despesasListadas.innerHTML = '';
    gerarLinhasTabela(despesas);
}

function limparCampos() {
    dia.value = "";
    mes.value = "";
    ano.value = "";
    tipo.value = "";
    descricao.value = "";
    valor.value = "";
}

function gerarLinhasTabela(despesas){
    despesas.forEach(d => {
        if (d.dia < 10) {
            d.dia = '0' + d.dia;
        }
        let linhaTabela = despesasListadas.insertRow();
        linhaTabela.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        linhaTabela.insertCell(1).innerHTML = d.tipo;
        linhaTabela.insertCell(2).innerHTML = d.descricao;
        linhaTabela.insertCell(3).innerHTML = `R$ ${d.valor}`;

        let btn = document.createElement('button');
        btn.className = 'removeButton';
        btn.innerHTML = '<span>X</span>'
        btn.id = `id_despesas${d.id}`;
        btn.onclick = function(){
            let id = this.id.replace('id_despesas', '');
            console.log(id)
            bd.remover(id);
            window.location.reload();
        }
        linhaTabela.insertCell(4).append(btn);
    });
}

