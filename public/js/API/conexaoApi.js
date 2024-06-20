let salaSelecionadaGlobal = null;
let dataSelecionadaGlobal;

function formatarDataBr(dataEUA) {
    const data = new Date(dataEUA);
    const dia=data.getDate().toString().padStart(2, '0');
    const mes=(data.getMonth() + 1).toString().padStart(2, '0'); 
    const ano=data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function ocultarDocumento(documento) {
    const inicio = documento.slice(0, 3);
    const meio = '***.***';
    const fim = documento.slice(-2);    
    return `${inicio}.${meio}-${fim}`;
}

function parseDate(dataReservada) {
    const [day, month, year] = dataReservada.split('/');
    return new Date(year, month - 1, day);
}

function ehHoje(dataReserva) {
    const dataAtual = new Date();
    return (
        dataReserva.getDate() === dataAtual.getDate() &&
        dataReserva.getMonth() === dataAtual.getMonth() &&
        dataReserva.getFullYear() === dataAtual.getFullYear()
    );
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
class Controller{
    /*Acesso */
        
        //Login
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
                            if (response.status===200) {
                                const responseFormatado = response.data;
                                localStorage.setItem('token', responseFormatado.token);
                                const nivelAcesso = responseFormatado.nivelAcesso; 
            
                                if (nivelAcesso===2) window.location.href = '/public/views/dashboard/homeUniversal.html';
                                else window.location.href = '/public/views/dashboard/homeRecepcionista.html';
                            }
                        } catch (error) {
                            const errorMsg = document.getElementById('error-msg');
                            if (errorMsg) errorMsg.textContent = 'Login ou senha inválidos.';
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
            static async listarReservasHoje(){
                try{
                    const reservas = await this.listarReservas();
                    return reservas.filter((reserva) => {
                        const dataReserva = parseDate(reserva.dataReservada);
                        return ehHoje(dataReserva);
                    });
                }catch(error){
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
                if (response.status === 200) return response.data;
                throw new Error(`Token inválido ou erro ao consultar ${endPoint} por ID`);
            } catch (error) {
                console.error(`Erro ao obter ${endPoint} por ID:`, error);
                throw error;
            }
        }
        
        /* Métodos específicos utilizando obterPorId */
        static async obterReserv(id) {
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
            try {
                const usuarios = await this.listarUsuarios();
                const tableBody = document.getElementById('after-login-usuarios');
                this.preencherTabela(usuarios, tableBody, 
                    (item) => [
                        `${item.nome} ${item.sobrenome}`,
                        ocultarDocumento(item.identificador),
                        item.email
                    ],
                    (item) => {
                        return { texto: 'Editar', funcao: 'editarUsuario' };
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
            try {
                const salas = await this.listarSalas();
                const tableBody = document.getElementById('after-login-salas');
                this.preencherTabela(salas, tableBody, (item) => [
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
                            return { texto: 'Editar', funcao: 'editarSala' };
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
            try {
                const reunioes = await this.listarReuniao();
                const tableBody = document.getElementById('reuniao');
                this.preencherTabela(reunioes, tableBody, (item) => [
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
            try {
                const nivelAcesso = await this.listarNivelAcesso();
                const tableBody = document.getElementById('after-login-nivelAcesso');
                this.preencherTabela(nivelAcesso, tableBody, (item) => [
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
            try {
                const recepcionistas = await this.listarRecepcionista();
                const tableBody = document.getElementById('after-login-recepcionista');
                
                this.preencherTabela(recepcionistas, tableBody, 
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
                                return { texto: 'Editar', funcao: 'editarRecepcionista' };
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
            try{
                const listaNegra = await this.listarListaNegra();
                const listaNegraComDetalhes = await this.listaNegraComDetalhes(listaNegra);
                const tableBody = document.getElementById('after-login-listaNegra');
                this.preencherTabela(listaNegraComDetalhes, tableBody, (item) => [
                    `${item.reservista.nome} ${item.reservista.sobrenome}`,
                    ocultarDocumento(item.reservista.identificador),
                    item.reservaMotivo.salaReserva.nome,
                    item.reservaMotivo.dataReservada,
                    item.reservaMotivo.horaInicio,
                    item.reservaMotivo.horaFimReserva,
                ],
                (item) => {
                    switch (item.estadoBloqueio) {
                        case true:
                            return { texto: 'Desbloquear', funcao: 'desbloquearListaNegra' };
                        case false:
                            return { texto: 'Recorer', funcao: 'recorerListaNegra' };
                        default:
                            return [];
                    }
                },
                (item) => {
                    switch (item.estadoBloqueio) {
                        case true:
                            return null;
                        case false:
                            return { texto: 'Excluir', funcao: 'excluirListaNegra' };
                        default:
                            return [];
                    }
                }
                );
            } catch (error) {
                console.error('Erro ao mostrar lista negra:', error);
            }
        }

        static async mostrarTodasReservas(){
            return this.mostrarReservas(await this.listarReservas());
        }
        
        static async mostrarReservasHoje(){
            return this.mostrarReservas(await this.listarReservasHoje());
        }

        static async mostrarReservas(reservas) {
            try {
                const reservasComDetalhes= await this.reservaComDetalhes(reservas);
                const tabela = document.getElementById('reservas-tabela');
                this.preencherTabela(reservasComDetalhes, tabela, (item) => [
                        item.sala.nome,
                        `${item.usuario.nome} ${item.usuario.nome}`,
                        ocultarDocumento(item.usuario.identificador),
                        item.motivoReserva,
                        `${item.dataReservada} ${item.horaInicio}`,
                        `${item.dataReservada} ${item.horaFimReserva}`,
                    ],
                    (item) => {
                        switch (item.statusReserva) {
                            case 'PENDENTE':
                                return { texto: 'Confirmar', funcao: 'confirmarReserva' };
                            case 'CONFIRMADO':
                                return { texto: 'Concluir', funcao: 'concluirReserva' };
                            case 'CONCLUIDO':
                                return {texto: 'Reserva já concluída'};
                            case 'CANCELADO':
                                return {texto: 'Reserva cancelada'};
                            default:
                                return [];
                        }
                    },
                    (item) => {
                        switch (item.statusReserva) {
                            case 'PENDENTE':
                                return { texto: 'Cancelar', funcao: 'cancelarReserva' };
                            default:
                                return [];
                        }
                    }
                );
            } catch (error) {
                console.error('Erro ao mostrar todas as reservas:', error);
            }
        }

    /*Mostrar */

    /* Preencher Tabelas */
        
    static async preencherTabela(items, tableBody, colunasDefinicao, metodoUm, metodoDois) {
        try {
            if (!tableBody) {
                console.error('Elemento tbody não encontrado');
                return;
            }
            tableBody.innerHTML = '';
            items.forEach(item => {
                const linha = this.enviarInfoParaTabela(colunasDefinicao(item));
                const acoesCell = document.createElement('td');
                acoesCell.classList.add('d-flex', 'justify-content-around');
                if (metodoUm(item).texto) {
                    const buttonPrimario = this.criarBotao(metodoUm(item), 'btn-confirmar bg-azul peso-500 fc-branco', item.id);
                    acoesCell.appendChild(buttonPrimario);
                }
                if (metodoDois(item).texto) {
                    const buttonSecundario = this.criarBotao(metodoDois(item), 'btn-cancelar bg-cinza peso-500 fc-branco', item.id);
                    acoesCell.appendChild(buttonSecundario);
                }
                linha.appendChild(acoesCell);
                tableBody.appendChild(linha);
            });
        } catch (error) {
            console.error(`Erro ao preencher tabela:`, error);
        }
    }
    
    static enviarInfoParaTabela(colunasDefinicao) {
        const row = document.createElement('tr');
        colunasDefinicao.forEach(coluna => {
            const td = document.createElement('td');
            td.textContent = coluna;
            row.appendChild(td);
        });
        return row;
    }
    
    static criarBotao(metodo, classes, id) {
        let elemento;
        if (typeof metodo === 'object' && metodo.funcao) {
            const botao = document.createElement('button');
            botao.textContent = metodo.texto;
            botao.classList.add(...classes.split(' ')); 
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
                    this.obterReserv(item.idReservaMotivo),
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
                
                if (!tabela) {
                    console.error(`Tabela com id "${idTabela}" não encontrada`);
                    return;
                }
            
                const linhas = tabela.getElementsByTagName('tr');
                const idColunaAcao = 'coluna-acao'; 
            
                const isFiltroNumero = !isNaN(valorFiltro);
            
                for (let i = 1; i < linhas.length; i++){
                    const colunas = linhas[i].getElementsByTagName('td');
                    let corresponde = false;
                
                    if(valorFiltro === ''){
                        linhas[i].style.display = "";
                        continue;
                    }

                    for (let j = 0; j < colunas.length; j++){
                        if (colunas[j].id === idColunaAcao) continue;
                
                        const coluna = colunas[j];
                        if(coluna){
                            if(isFiltroNumero){
                                if(coluna.textContent === valorFiltro){
                                    corresponde = true;
                                    break;
                                }
                            }
                            else if(coluna.textContent.toLowerCase().includes(valorFiltro.toLowerCase())){
                                corresponde = true;
                                break;
                            }
                        }
                    }
                    if(corresponde){
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
        /*Atualizar*/

        /*Complemento modal */        
            static async preencherSelectComAPI() {
                //Adicionar sala, nivelDeAcesso, HorarioLivre
                const selectElement = document.getElementById('nivelAcesso');
                try {
                    const response = await this.listarNivelAcesso();
                    const data = await response;

                    data.forEach(item => {
                        const option = document.createElement('option');
                        option.value = item.id;
                        option.textContent = item.glossarioNivel;
                        selectElement.appendChild(option);
                    });
                } catch (error) {
                    console.error('Erro ao buscar dados da API:', error);
                }
            }
        /*Complemento modal */

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

    observeElement('login-form', () => {
        Controller.fazerLogin();
    });

    observeElement('logout', () => {
        Controller.fazerLogout();        
    });

    observeElement('nivelAcesso', ()=>{
        Controller.preencherSelectComAPI();
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