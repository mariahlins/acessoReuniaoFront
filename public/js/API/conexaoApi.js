function formatarDataBr(dataEUA) {
    if (typeof dataEUA !== 'string') {
        dataEUA = dataEUA.toISOString().split('T')[0];
    }
    const [ano, mes, dia] = dataEUA.split('-');
    return `${dia}/${mes}/${ano}`;
}

function formatarDataEUA(dataBR) {
    const [dia, mes, ano] = dataBR.split('/');
    return `${ano}-${mes}-${dia}`;
}

function ocultarDocumento(documento) {
    const inicio = documento.slice(0, 3);
    const meio = '***.***';
    const fim = documento.slice(-2);    
    return `${inicio}.${meio}-${fim}`;
}

function setId(id){
    localStorage.setItem('id', id);
}


function parseDate(dataReservada) {
    const [day, month, year] = dataReservada.split('/');
    return new Date(year, month - 1, day);
}

function ehHoje(dataReserva) {
    const dataAtual = new Date();
    const dataAtualFormatada = `${dataAtual.getFullYear().toString()}-${(dataAtual.getMonth() + 1).toString().padStart(2, '0')}-${dataAtual.getDate().toString().padStart(2, '0')}`;
    return dataReserva===dataAtualFormatada;
}


function converterAndar(andar) {
    switch (andar) {
        case 0: return 'Térreo';
        case 1: return 'Primeiro andar';
        case 2: return 'Segundo andar';
        case 3: return 'Terceiro andar';
        case 4: return 'Quarto andar';
        default: return 'informação invalida';
    }
}

function converterStatusSala(statusSala){
    switch (statusSala){
        case 'D': return 'Disponivel';
        case 'I': return 'Indisponível';
        case 'M' : return 'Manutenção';
        default: return 'informação invalida';
    }
}

function exibirDataAtual(){
    const dataAtual=document.getElementById('data-hoje');
    if(dataAtual){
        const data=new Date();
        dataAtual.innerText=formatarDataBr(data);
    }
}
/*
* listar = getAll
* obter = getById
* mostrar = retorno formato para HTML
* 
*/

function formataAtivo(ativo){
    return ativo?'Ativo':'Inativo';
}

function setElementInputValueById(id, value) {
    document.getElementById(id).value=value;
}
/*Formatação de listagem*/
function vetorizacao(...args) {
        const data = [...args[0]]; 
        const qtnTela = args[1] || 6;
        const  vetor = [];
    
        for (let i = 0; i < data.length; i += qtnTela) {
            vetor.push( data.slice(i, i + qtnTela));
        }
        Math.ceil(data.length / qtnTela);
        const numeroPaginas = vetor.length;
        localStorage.setItem('numeroPaginas', numeroPaginas);
        return vetor;
    }

class Controller{
    /*Acesso */
        
// Método para realizar o login
static async fazerLogin() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const data = {
                login: formData.get('login'),
                senha: formData.get('senha'),
            };
            try {
                const response = await axios.post('http://localhost:3000/recepcionista/login', data);
                console.log(response.status===403);
                if (response.status===200) {
                    const responseFormatado=response.data;
                    localStorage.setItem('token', responseFormatado.token);
                    localStorage.setItem('idRecepcionista', responseFormatado.id);
                    const nivelAcesso=responseFormatado.nivelAcesso;
                    if (nivelAcesso===2) window.location.href='/public/views/dashboard/homeUniversal.html';
                    else window.location.href='/public/views/dashboard/homeRecepcionista.html';
                }
            } catch (error) {
                alert(error.response.data.message);
                throw error;
                }
        });
    }
}

        
        //Logout
            static async fazerLogout() {
                const logoutLink = document.getElementById('logout');
                logoutLink.addEventListener('click', async (event) => {
                    event.preventDefault(); 
                    try {
                        localStorage.removeItem('token'); 
                        window.location.href = '/';
                    } catch (error) {
                        console.error('Erro ao fazer logout:', error);
                        throw error;
                    }
                });
            }

    /*Acesso */
    
    /* Pegar todos */

        static async listarTodos(endPoint){
            try{
                const token=localStorage.getItem('token');
                const response=await axios.get(`http://localhost:3000/${endPoint}`, {headers: { 'Authorization': `Bearer ${token}` }});
                if(response.status===200) return response.data;
                throw new Error('Token inválido ou erro ao buscar todos');
            }catch(error){
                console.error(`Erro ao listar ${endPoint}:`, error);
                throw error;
            }
        }

        /* Métodos específicos utilizando obterPorId */
            static async listarReservas(){
                return this.listarTodos('reserva');
            }

            static async listarUsuarios(){
                return this.listarTodos('usuario');
            }

            static async listarSalas(){
                return this.listarTodos('sala');
            }

            static async listarListaNegra(){
                return this.listarTodos('listaNegra');
            }

            static async listarReuniao(){
                return this.listarTodos('reuniao');  
            }

            static async listarNivelAcesso(){
                return this.listarTodos('nivelAcesso');
            }
            
            static async listarRecepcionista(){
                return this.listarTodos('recepcionista');
            }

        //Metodo não expecifico
        static async listarReservasHoje() {
            try {
                const reservas = await this.listarReservas();
                return reservas.filter((reserva) => {
                    return ehHoje(reserva.dataReservada);
                });
            } catch (error) {
                console.error('Erro ao listar reservas de hoje:', error);
                throw error;
            }
        }
            
    /* Pegar todos */
        
    /* consular por ID*/

        /* Pegar por ID */
        static async obterPorId(endPoint, id){
            try {
                const token = localStorage.getItem('token'); 
                const response = await axios.get(`http://localhost:3000/${endPoint}/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.status===200) return response.data;
                throw new Error(`Token inválido ou erro ao consultar ${endPoint} por ID`);
            } catch (error) {
                console.error(`Erro ao obter ${endPoint} por ID:`, error);
                throw error;
            }
        }
        
        /* Métodos específicos utilizando obterPorId */
        static async obterReserva(id) {
            return this.obterPorId('reserva', id);
        }
        
        static async obterUsuario(id) {
            return this.obterPorId('usuario', id);
        }
        
        static async obterListaNegra(id) {
            return this.obterPorId('listaNegra', id);
        }
        
        static async obterReuniao(id) {
            return this.obterPorId('reuniao', id);
        }
        
        static async obterNivelAcesso(id) {
            return this.obterPorId('nivelAcesso', id);
        }
        
        static async obterRecepcionista(id) {
            return this.obterPorId('recepcionista', id);
        }

        static async obterSala(id){
            return this.obterPorId('sala', id);
        }
    
    /* consular por ID*/
        
    /*Mostrar */
        static async mostrarUsuarios() {
            const response = await this.listarUsuarios();
            const usuarios = vetorizacao(response);
            localStorage.setItem('entidade', 'usuario');

            try {
                const tableBody = document.getElementById('after-login-usuarios');
                this.preencherTabela(usuarios[Number(localStorage.getItem('indexPaginacao'))], tableBody, 
                    (item) => [
                        `${item.nome} ${item.sobrenome}`,
                        ocultarDocumento(item.identificador),
                        item.email
                    ],
                    (item) => {
                        return { texto: 'Editar', funcao: 'editarUsuario'};
                    },
                    (item) => {
                        return { texto: 'Excluir', funcao: 'excluirUsuario' };
                    }
                );
            } catch (error) {
                console.error('Erro ao mostrar Usuários:', error);
                throw error;
            }
        }

        static async mostrarSalas() {
            const response = await this.listarSalas();
            const salas = vetorizacao(response);
            try {
                const tableBody = document.getElementById('after-login-salas');
                this.preencherTabela(salas[Number(localStorage.getItem('indexPaginacao'))], tableBody, (item) => [
                    item.nome,
                    converterAndar(item.andar),
                    converterStatusSala(item.situacao),
                    item.capMax,
                ],
                //d- Disponivel, I- interditado, M- manutenção
                (item) => {
                    switch (item.situacao) {
                        case 'D':
                            return { texto: 'Interditar', funcao: 'interditarSala' };
                        case 'I':
                            return { texto: 'Manutenção', funcao: 'manutencaoSala' };
                        case 'M':
                            return { texto: 'Desinterditar', funcao: 'desinterditarSala' };
                        default:
                            return [];
                    }
                },
                (item) => {
                    switch (item.situacao) {
                        case 'D':
                            return { texto: 'Editar', funcao: 'editarSala', modal: 'modal', modalFuncao: '#modalEditarSala',};
                        case 'I':
                            return { texto: 'Desinterditar', funcao: 'desinterditarSala' };
                        case 'M':
                            return { texto: 'Excluir', funcao: 'excluirSala' };
                        default:
                            return [];
                    }
                }
                );
            } catch (error) {
                console.error('Erro ao mostrar Salas:', error);
                throw error;
            }
        }

        static async mostrarReuniao() {
            const response = await this.listarReuniao();
            const reunioes = vetorizacao(response);
            try {
                const tableBody = document.getElementById('reuniao');
                this.preencherTabela(reunioes[Number(localStorage.getItem('indexPaginacao'))], tableBody, (item) => [
                    item.nome,
                    item.data,
                    item.horaInicio,
                    item.horaFim
                ], 'editarReuniao', 'excluirReuniao');
            } catch (error) {
                console.error('Erro ao mostrar reuniões:', error);
                throw error;
            }
        }

        static async mostrarNivelAcesso() {
            const response = await this.listarNivelAcesso();
            const nivelAcesso = vetorizacao(response);
            try {
                const tableBody = document.getElementById('after-login-nivelAcesso');
                this.preencherTabela(nivelAcesso[Number(localStorage.getItem('indexPaginacao'))], tableBody, (item) => [
                    item.id,
                    item.nivelAcesso,
                    item.glossarioNivel,
                ],
                /* qunado for sanado a necessidade do caso de uso, creio que ficará assim a função
                (item) => {
                    switch (item.recurso) {
                        case true:
                            return { texto: 'status do recurso:', funcao: 'recursoStatus(id)' };
                        case false:
                            { texto: 'Desbloquear', funcao: 'desbloquearListaNegra' };;
                        default:
                            return [];
                    }
                },
                (item) => {
                    switch (item.recurso) {
                        case true:
                            return null;
                        case false:
                            return { texto: 'Recorer', funcao: 'recorerListaNegra' };
                        default:
                            return [];
                    }
                }
                );*/
                { texto: 'Editar', funcao: 'editarNivelACesso' },{ texto: 'Excluir', funcao: 'excluirNivelACesso' });

            } catch (error) {
                console.error('Erro ao mostrar nivel de acesso:', error);
                throw error;
            }
        }

        static async mostrarRecepcionista() {
            const response = await this.listarRecepcionista();
            const recepcionistas = vetorizacao(response);
            try {
                const tableBody = document.getElementById('after-login-recepcionista');
                
                this.preencherTabela(recepcionistas[Number(localStorage.getItem('indexPaginacao'))], tableBody, 
                    (item) => [
                        item.id,
                        `${item.nome} ${item.sobrenome}`,
                        item.login,
                        formataAtivo(item.ativo),
                        item.nivelAcesso
                    ],
                    (item) => {
                        switch (item.ativo) {
                            case true:
                                return { texto: 'Desativar', funcao: 'desativarRecepcionista' };
                            case false:
                                return { texto: 'Ativar', funcao: 'ativarRecepcionista' };
                            default:
                                return [];
                        }
                    },
                    (item) => {
                        switch (item.ativo) {
                            case true:
                                return { texto: 'Editar', funcao: 'editarRecepcionista', modal: 'modal', modalFuncao: '#modalEditarRecepcionista'};
                            case false:
                                return { texto: 'Excluir', funcao: 'excluirRecepcionista' };
                            default:
                                return [];
                        }
                    }
                );
            } catch (error) {
                console.error('Erro ao mostrar recepcionistas:', error);
                throw error;
            }
        }
        
        static async mostrarListaNegra(){
            const listaNegra = await this.listarListaNegra();
            const listaNegraComDetalhes = await this.listaNegraComDetalhes(listaNegra);
            const listaNegraFormatada = vetorizacao(listaNegraComDetalhes);
            const tableBody = document.getElementById('after-login-listaNegra');
            try{
                this.preencherTabela(listaNegraFormatada[Number(localStorage.getItem('indexPaginacao'))], tableBody, (item) => [
                    item.codBloqueio,
                    `${item.reservista.nome} ${item.reservista.sobrenome}`,
                    ocultarDocumento(item.reservista.identificador),
                    `${item.reservaMotivo.dataReservada} - ${item.reservaMotivo.horaInicio} - ${item.reservaMotivo.horaFimReserva}`,
                    item.reservaMotivo.salaReserva.nome,
                    item.motivo,
                ],
                (item) => {
                    if(item.estadoBloqueio) return { texto: 'Desbloquear', funcao: 'desbloquearListaNegra' };
                    return { texto: 'Recorrer', funcao: 'recorerListaNegra' };
                },
                (item) => {
                    if (!item.estadoBloqueio) return { texto: 'Excluir', funcao: 'excluirListaNegra' };
                    return [];
                }
                );
            } catch (error) {
                console.error('Erro ao mostrar lista negra:', error);
            }
        }

        static async mostrarTodasReservas() {
            try {
                const response = await this.listarReservas();
                return this.mostrarReservas(response);
            } catch (error) {
                console.error('Erro ao mostrar todas as reservas:', error);
            }
        }
        
        static async mostrarReservasHoje() {
            try {
                const response = await this.listarReservasHoje();
                return this.mostrarReservas(response, 4);
            } catch (error) {
                console.error('Erro ao mostrar reservas de hoje:', error);
            }
        }
        
        static async paginacao(id){
            localStorage.setItem('indexPaginacao', id);
            window.location.reload();
        }
     
        static async mostrarReservas(...reservas) {
            const rese=[...reservas[0]];
            try {
                const reservasComDetalhes = await this.reservaComDetalhes(rese);
                const req = vetorizacao(reservasComDetalhes, reservas[1]); 
                const tabela = document.getElementById('reservas-tabela');
                
                this.preencherTabela(
                    req[Number(localStorage.getItem('indexPaginacao'))], tabela, (item) => [
                        item.sala.nome,
                        `${item.usuario.nome} ${item.usuario.sobrenome}`,
                        ocultarDocumento(item.usuario.identificador),
                        item.motivoReserva,
                        `${formatarDataBr(item.dataReservada)} ${item.horaInicio}`,
                        `${formatarDataBr(item.dataReservada)} ${item.horaFimReserva}`,
                    ],
                    (item) => {
                        switch (item.statusReserva) {
                            case 'PENDENTE':
                                return { texto: 'Confirmar', funcao: 'confirmarReserva' };
                            case 'CONFIRMADO':
                                return { texto: 'Concluir', funcao: 'concluirReserva' };
                            case 'CONCLUIDO':
                                return { texto: 'Reserva já concluída' };
                            case 'CANCELADO':
                                return { texto: 'Reserva cancelada' };
                            default:
                                return {};
                        }
                    },
                    (item) => {
                        if (item.statusReserva === 'PENDENTE') {
                            return { texto: 'Cancelar', funcao: 'cancelarReserva' };
                        }
                        return {};
                    }
                );
            } catch (error) {
                console.error('Erro ao mostrar reservas:', error);
            }
        }
        
    /*Mostrar */

    /* Preencher Tabelas */
        
    static async preencherTabela(items, tableBody, colunasDefinicao, metodoUm, metodoDois) {
        tableBody.innerHTML = '';
        if(!items) return tableBody.innerHTML = '<tr><td colspan="6">Nenhum registro ativo, para sanar isso, cadastre algum</td></tr>';
        try {
            items.forEach(item => {
                const linha = this.enviarInfoParaTabela(colunasDefinicao(item));
                const acoesCell = document.createElement('td');
                acoesCell.classList.add('d-flex', 'justify-content-around');
                if (metodoUm(item).texto) {
                    const buttonPrimario = this.criarBotao(metodoUm(item), 'btn btn-confirmar bg-azul peso-500 fc-branco', item.id);
                    acoesCell.appendChild(buttonPrimario);
                }
                if (metodoDois(item).texto) {
                    const buttonSecundario = this.criarBotao(metodoDois(item), 'btn btn-cancelar bg-cinza peso-500 fc-branco', item.id);
                    acoesCell.appendChild(buttonSecundario);
                }
                linha.appendChild(acoesCell);
                tableBody.appendChild(linha);
            });
    
            // Criação da navegação de páginação
           const paginacaoUl = document.getElementById('paginacao');

            for (let i=0; i<localStorage.getItem('numeroPaginas'); i++) {
                let classButton='page-link page-item button-paginacao';
                if(i===Number(localStorage.getItem('indexPaginacao'))) classButton='button-paginacao page-link page-item active';
                paginacaoUl.appendChild(this.criarBotao({texto: i+1, funcao: 'paginacao'}, classButton, i));
            }
            localStorage.setItem('indexPaginacao', 0);
        } catch (error) {
            console.error(`Erro ao preencher tabela:`, error);
        }
    }
    
    static enviarInfoParaTabela(colunasDefinicao) {
        const row = document.createElement('tr');
        colunasDefinicao.forEach(coluna => {
            const td = document.createElement('td');
            if(coluna===null) td.textContent = 'Não informado';
            else td.textContent = coluna;
            row.appendChild(td);
        });
        return row;
    }

    static criarBotao(metodo, classes, id) {
        let elemento;
    //metodo = {texto: index, funcao: 'funcao no code recarregar a pagina e atualizar o id no local store'}, page-item disabled, index
        if (typeof metodo === 'object' && metodo.funcao) {
            const botao = document.createElement('button');
            botao.textContent = metodo.texto;
            botao.classList.add(...classes.split(' '));
            if (metodo.texto==='Editar') {
                botao.setAttribute('data-toggle', metodo.modal);
                botao.setAttribute('data-target', metodo.modalFuncao);
            }
            botao.addEventListener('click', () => this[metodo.funcao](id));
            elemento = botao;
        } else {
            const elementoPadrao = document.createElement('span');
            elementoPadrao.textContent = metodo.texto;
            elemento = elementoPadrao;
        }
    
        return elemento;
    }

    /* Preencher Tabelas */

    /* SubConsultas */

        static async listaNegraComDetalhes(listaNegra) {
            const listaPromises = listaNegra.map(async (item) => {
                const [reservista, reservaMotivo] = await Promise.all([
                    this.obterUsuario(item.idResponsavel),
                    this.obterReserva(item.idReservaMotivo),
                ]);
                let salaReserva = await this.obterSala(reservaMotivo.idSala);
                return { 
                    ...item,
                    reservista,
                    reservaMotivo: {
                        ...reservaMotivo,
                        salaReserva
                    }
                };
            });
            return Promise.all(listaPromises);
        }

        static async reservaComDetalhes(reserva) {
            const listaPromises = reserva.map(async (item) => {
                const [usuario, sala] = await Promise.all([
                    this.obterUsuario(item.idUsuario),
                    this.obterSala(item.idSala),
                ]);
                return { 
                    ...item,
                    usuario,
                    sala
                };
            });
            return Promise.all(listaPromises);
        }
    /* SubConsultas */
 
        /*Filtrar tabelas*/
        static async filtrarTabela(idTabela){
            const valorFiltro = document.getElementById('pesquisa-filtro').value;
            const tabela = document.getElementById(idTabela);
        
            const linhas = tabela.getElementsByTagName('tr');
            const idColunaAcao = 'coluna-acao';
        
            const normalizarTexto = (texto) =>{
                return texto.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
            };
        
            const textoFiltro = normalizarTexto(valorFiltro);
        
            for (let i = 0; i < linhas.length; i++){
                const colunas = linhas[i].getElementsByTagName('td');                
                const cabecalho = linhas[i].getElementsByTagName('th').length > 0;        
                if (cabecalho){
                    linhas[i].style.display = "";
                    continue;
                }
                let corresponde = false;
                if (textoFiltro === ''){
                    linhas[i].style.display = "";
                    continue;
                }
        
                for (let j = 0; j < colunas.length; j++){
                    if (colunas[j].id === idColunaAcao) continue;
                    const coluna = colunas[j];
                    if (coluna){
                        const textoColuna = normalizarTexto(coluna.textContent);
                        if (textoFiltro === "disponivel" || textoFiltro === "indisponivel"){
                            if (textoColuna === textoFiltro) {
                                corresponde = true;
                                break;
                            }
                        } 
                        else{
                            const regex = new RegExp(`\\b${textoFiltro}`, 'i');
                            if (textoColuna.includes(textoFiltro) || regex.test(textoColuna)) {
                                corresponde = true;
                                break;
                            }
                        }
                    }
                }
                if (corresponde){
                    linhas[i].style.display = "";
                }
                else{
                    linhas[i].style.display = "none";
                }
            }
        }
                      
        /*Filtrar tabelas*/

        /*Excluir*/

            static async excluirEntidade(endPoint, id){
                try{
                    const token = localStorage.getItem('token');
                    await axios.delete(`http://localhost:3000/${endPoint}/${id}`,{headers: { 'Authorization': `Bearer ${token}`}});
                    window.location.reload();
                }catch(error){
                    console.error(`Erro ao excluir ${endPoint}`, error);
                }
            }

            static async excluirRecepcionista(id){
                return this.excluirEntidade('recepcionista', id);
            }

            static async excluirUsuario(id){
                return this.excluirEntidade('usuario', id);
            }

            static async excluirSala(id){
                return this.excluirEntidade('sala', id);
            }

            static async excluirListaNegra(id){
                return this.excluirEntidade('listaNegra', id);
            }

            static async excluirReuniao(id){
                return this.excluirEntidade('reuniao', id);
            }

            static async excluirNivelAcesso(id){
                return this.excluirEntidade('nivelAcesso', id);
            }

        /*Excluir */

        /*Atualizar*/
            static async atualizarEntidade(endPoint, id, data) {
                try {
                    const token = localStorage.getItem('token');
                    await axios.put(`http://localhost:3000/${endPoint}/${id}`, data, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    window.location.reload();
                } catch (error) {
                    console.error(`Erro ao atualizar ${endPoint}`, error);
                }
            }
        
            static async desativarRecepcionista(id) {
                const dado = {ativo:false};
                return this.atualizarEntidade('recepcionista', id, dado);
            }

            static async ativarRecepcionista(id) {
                const dado = {ativo:true};
                return this.atualizarEntidade('recepcionista', id, dado);
            }

            static async editarUsuario(id){
                return this.atualizarEntidade('usuario', id, data);
            }

            static async desbloquearListaNegra(id){
                return this.atualizarEntidade('listaNegra', id, {estadoBloqueio:false});
            }

            static async recorerListaNegra(id){
                alert('função não implementada');
            }
    
            static async interditarSala(id){
                return this.atualizarEntidade('sala', id, {situacao:'I'});
            }
    
            static async desinterditarSala(id){
                return this.atualizarEntidade('sala', id, {situacao:'D'});
            }
    
            static async manutencaoSala(id){
                return this.atualizarEntidade('sala', id, {situacao:'M'});
            }

            static async estadoReserva(endPoint, id) {
                try {
                    const token = localStorage.getItem('token');
                    await axios.put(`http://localhost:3000/${endPoint}/${id}`, {},{ headers: { Authorization: `Bearer ${token}`}});
                    window.location.reload();
                } catch (error) {
                    console.error(`Erro ao alterar estado da reserva`, error);
                }
            }
            
            static async cancelarReserva(id) {
                return this.estadoReserva('reserva/cancelar', id);
            }
            
            static async confirmarReserva(id) {
                return this.estadoReserva('reserva/confirmar', id);
            }
            
            static async concluirReserva(id){
                try{
                    let token = localStorage.getItem('token');
                    await axios.put(`http://localhost:3000/reserva/concluir/${id}`, {infracao:false}, {headers: { 'Authorization': `Bearer ${token}`}});
                    window.location.reload();
                }catch(error){
                    console.error('Erro ao concluir reserva', error);
                }
            }
              
            static async editarSala(id){
                const entity=await this.obterSala(id);
                setId(id);  
                setElementInputValueById('editNomeSala', entity.nome);
                setElementInputValueById('editAndar', entity.andar);
                setElementInputValueById('editArea', entity.area);
                setElementInputValueById('editCapMax', entity.capMax);
            }

            static async editarRecepcionista(id){
                const entity=await this.obterRecepcionista(id);
                setId(id);
                setElementInputValueById('editNome', entity.nome);
                setElementInputValueById('editSobrenome', entity.sobrenome);
                setElementInputValueById('editLogin', entity.login);
            }

            static async preencherModalComAPI(entityType) {
                const selectElement = document.getElementById(entityType);
                let data;
                try {
                    switch (entityType) {
                        case 'nivelAcesso':
                        case 'editNivelAcesso':
                            data = await this.listarNivelAcesso();
                            data.forEach(item => {
                                const option = document.createElement('option');
                                option.value = item.id;
                                option.textContent = item.glossarioNivel;
                                selectElement.appendChild(option);
                            });
                            break;
                        case 'andar':
                        case 'editAndar':
                            const andares = {
                                0: 'Térreo',
                                1: 'Primeiro andar',
                                2: 'Segundo andar',
                                3: 'Terceiro andar',
                                4: 'Quarto andar'
                            };
                            Object.keys(andares).forEach(key => {
                                const option = document.createElement('option');
                                option.value = key;
                                option.textContent = andares[key];
                                selectElement.appendChild(option);
                            });
                            break;
                            case 'selecao-salas-modal':
                                const dataSalas = await this.listarSalas();
                                let firstSala = true;
                    
                                dataSalas.forEach(async (sala) => {
                                    if (!sala.andar && sala.situacao === 'D') {
                                        const inputSala = document.createElement('input');
                                        inputSala.type = 'radio';
                                        inputSala.className = 'btn-check';
                                        inputSala.name = 'salaOptions';
                                        inputSala.id = sala.nome;
                                        inputSala.value = sala.id;
                                        inputSala.autocomplete = 'off';
                    
                                        if(firstSala){
                                            inputSala.checked = true;
                                            firstSala = false;
                                        }
                    
                                        const labelSala = document.createElement('label');
                                        labelSala.className = 'btn btn-outline-primary';
                                        labelSala.htmlFor = sala.nome;
                                        labelSala.textContent = sala.nome;
                    
                                        selectElement.appendChild(inputSala);
                                        selectElement.appendChild(labelSala);
                                    }
                                });
                                break;
                        default:
                            throw new Error('ID do elemento select não suportado');
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados da API:', error);
                }
            }
          
            static async getSelectedDate(selectedDay) {
                const today = new Date();
                if (selectedDay === 'hoje') {
                    return today.toISOString().split('T')[0];
                } else if (selectedDay === 'amanha') {
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    return tomorrow.toISOString().split('T')[0];
                }
            }

            static async dinamizarAgenda(dia, idReserva) {
                try {
                    const reservas = await axios.get(`http://localhost:3000/reserva/${idReserva}/${dia}`);
                    const reservasData = reservas.data;
                    //pegar só o dia
                    const hoje=new Date().toISOString().split('T')[0];
            
                    const selectContainer = document.getElementById('selecao-horario-modal');
                    const spaces = Array.from(document.querySelectorAll('div.row.blocks .col-1'));
                    const currentHour = new Date().getHours();
            
                    const resetarBlocos=()=>{
                        spaces.forEach(space=>{
                            if(hoje===dia){
                                if(currentHour>=parseInt(space.id)) space.style.backgroundColor='lightgray';
                            }else space.style.backgroundColor='lightgreen';
                        });
                        Array.from(selectContainer.children).forEach(child => {
                            if(hoje===dia){
                                if(parseInt(child.value)>=currentHour) child.style.display='block';
                                else child.style.display='none';
                            }else{
                                child.style.display='block';
                            }
                        });
                    };

                    resetarBlocos();
            
                    reservasData.forEach(reserva => {
                        if (reserva.horaInicio && typeof reserva.horaInicio === 'string') {
                            const horaReservada=reserva.horaInicio.slice(0, 3) + '00';
                            const timeBlockIndex=spaces.findIndex(space => space.id === horaReservada);
                            if (timeBlockIndex!==-1) {
                                for (let i=timeBlockIndex; i<timeBlockIndex+3 && i<spaces.length; i++) {
                                    spaces[i].style.backgroundColor = 'lightgray';
                                    selectContainer.children[i+1].style.display = 'none';
                                }
                            } else console.warn('Bloco de tempo não encontrado para:', reservedHour);
                        } else console.warn('Hora reservada inválida:', reserva.horaInicio);
                    });
                } catch (error) {
                    console.error('Erro ao colorir agenda:', error);
                }
            }
            
            
            
        /*Atualizar*/

        
} 
document.addEventListener('DOMContentLoaded', () => {
    const observeElement = (elementId, callback) => {
        const observer = new MutationObserver((_, observer) => {
            const element = document.getElementById(elementId);
            if (element) {
                callback(element);
                observer.disconnect();
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    };

    if(!localStorage.getItem('token') && window.location.pathname !== '/') {
        window.location.href = '/';
    }

    observeElement('login-form', () => {
        Controller.fazerLogin();
    });

    observeElement('logout', () => {
        Controller.fazerLogout();        
    });

    observeElement('nivelAcesso', ()=>{
        Controller.preencherModalComAPI('nivelAcesso');
    });

    observeElement('editNivelAcesso', ()=>{
        Controller.preencherModalComAPI('editNivelAcesso');
    });

    observeElement('selecao-salas-modal', async () => {
        await Controller.preencherModalComAPI('selecao-salas-modal');
    
        const salaOptions = document.querySelectorAll('input[name="salaOptions"]');
    
        if (salaOptions.length > 0) {
            const firstRadio = salaOptions[0];
            firstRadio.checked = true;

            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem('diaEscolhido', today);
            localStorage.setItem('nomeSala', firstRadio.id);
            localStorage.setItem('idReserva', firstRadio.value);
    
            await Controller.dinamizarAgenda(today, firstRadio.value);
    
            salaOptions.forEach(radio => {
                radio.addEventListener('change', async () => {
                    localStorage.setItem('idReserva', radio.value);
                    localStorage.setItem('nomeSala', radio.id);
                    const selectedDate = localStorage.getItem('diaEscolhido');
                    const idReserva = localStorage.getItem('idReserva');
                    await Controller.dinamizarAgenda(selectedDate, idReserva);
                });
            });
        }
    });
    
    
    observeElement('selecao-dia-modal', () => {
        const dayOptions = document.querySelectorAll('input[name="dayOptions"]');

        dayOptions.forEach(radio => {
            radio.addEventListener('change', () => {
                Controller.getSelectedDate(radio.id).then(valor => {
                    localStorage.setItem('diaEscolhido', valor);
                    const selectedDate = localStorage.getItem('diaEscolhido');
                    const idReserva = localStorage.getItem('idReserva');
                    Controller.dinamizarAgenda(selectedDate, idReserva);
                });
            });
        });
    });

    observeElement('andar', ()=>{
        Controller.preencherModalComAPI('andar');
    });

    observeElement('editAndar', ()=>{
        Controller.preencherModalComAPI('editAndar');
    });

    observeElement('after-login-home', () => {
        const pesquisaFiltro = document.getElementById('pesquisa-filtro');
        if (pesquisaFiltro) {
            Controller.mostrarReservasHoje();
            this.exibirDataAtual();
            pesquisaFiltro.addEventListener('input', () => Controller.filtrarTabela('reservas-tabela'));
        }
         
    });

    observeElement('after-login-reservas', () => {
        const pesquisaFiltro = document.getElementById('pesquisa-filtro');
        if (pesquisaFiltro) {
            Controller.mostrarTodasReservas();
            pesquisaFiltro.addEventListener('input', () => Controller.filtrarTabela('reservas-tabela'));
        }
    });

    observeElement('after-login-salas', () => {
        const pesquisaFiltro = document.getElementById('pesquisa-filtro');
        if (pesquisaFiltro) {
            Controller.mostrarSalas();
            pesquisaFiltro.addEventListener('input', () => Controller.filtrarTabela('salas-tabela'));
        }
    });

    observeElement('after-login-usuarios', () => {
        const pesquisaFiltro = document.getElementById('pesquisa-filtro');
        if (pesquisaFiltro) {
            Controller.mostrarUsuarios();
            pesquisaFiltro.addEventListener('input', () => Controller.filtrarTabela('usuarios-tabela'));
        }
    });

    observeElement('after-login-listaNegra', () => {
        const pesquisaFiltro = document.getElementById('pesquisa-filtro');
        if (pesquisaFiltro) {
            Controller.mostrarListaNegra();
            pesquisaFiltro.addEventListener('input', () => Controller.filtrarTabela('listaNegra-tabela'));
        }
    });
    
    
    observeElement('after-login-recepcionista', () => {
        const pesquisaFiltro = document.getElementById('pesquisa-filtro');
        if (pesquisaFiltro) {
            Controller.mostrarRecepcionista();
            pesquisaFiltro.addEventListener('input', () => Controller.filtrarTabela('recepcionista-tabela'));
        }
    });
    
    observeElement('reuniao', () => {
        const pesquisaFiltro = document.getElementById('pesquisa-filtro');
        if (pesquisaFiltro) {
            Controller.mostrarReuniao();
            pesquisaFiltro.addEventListener('input', () => Controller.filtrarTabela('reuniao-tabela'));
        }
    });

    observeElement('after-login-nivelAcesso', () => {
        const pesquisaFiltro = document.getElementById('pesquisa-filtro');
        if (pesquisaFiltro) {
            Controller.mostrarNivelAcesso();
            pesquisaFiltro.addEventListener('input', () => Controller.filtrarTabela('nivelAcesso-tabela'));
        }
    });

});