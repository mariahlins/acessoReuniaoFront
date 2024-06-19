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

    /*Login*/
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
        
    /*Mostrar */
        static async mostrarUsuarios() {
            try {
                const usuarios=await this.listarUsuarios();
                const tableBody=document.getElementById('after-login-usuarios');
                this.preencherTabela(usuarios, tableBody, (item) => [
                        `${item.nome} ${item.sobrenome}`,
                        ocultarDocumento(item.identificador),
                        item.email,
                ], 'editarUsuario', 'excluirUsuario');
            } catch (error) {
                console.error('Erro ao mostrar Usuarios:', error);
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
                ], 'editarSala', 'excluirSala');
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
        
        static async mostrarNivelAcesso(){
            try{
                const nivelAcesso = await this.listarNivelAcesso();
                const tableBody = document.getElementById('after-login-nivelAcesso');
                this.preencherTabela(nivelAcesso, tableBody, (item) => [
                    item.id,
                    item.nivelAcesso,
                    item.glossarioNivel,
                ], 'editarNivelAcesso', 'excluirNivelAcesso');
            }catch(error){
                console.error('Erro ao mostrar nivel de acesso:', error);
                throw error;
            }
        }              

        static async mostrarRecepcionista() {
            try {
                const recepcionistas = await this.listarRecepcionista();
                const tableBody = document.getElementById('after-login-recepcionista');
                this.preencherTabela(recepcionistas, tableBody, (item) => {
                    return [
                        item.id,
                        `${item.nome} ${item.sobrenome}`,
                        item.login,
                        formataAtivo(item.ativo),
                        item.nivelAcesso,
                    ];
                }, 'editarRecepcionista', 'desativarRecepcionista');
            } catch (error) {
                console.error('Erro ao mostrar recepcionistas:', error);
                throw error;
            }
        }

        static async mostrarListaNegra() {
            try {
                const listasNegra = await this.listarListaNegra();
                const listaPromises = await this.listaNegraComDetalhes(listasNegra);
        
                const tableBody = document.getElementById('after-login-listaNegra');
        
                listaPromises.forEach(item => {
                    const colunasDefinicao = [
                        item.codBloqueio,
                        `${item.reservista.nome} ${item.reservista.sobrenome}`,
                        ocultarDocumento(item.reservista.identificador),
                        `${item.reservaMotivo.dataReservada} ${item.reservaMotivo.horaInicio} - ${item.reservaMotivo.horaFimReserva}`,
                        item.reservaMotivo.salaReserva.nome,
                        item.motivo,
                    ];
        
                    const row = document.createElement('tr');
                    colunasDefinicao.forEach(coluna => {
                        const td = document.createElement('td');
                        td.textContent = coluna;
                        row.appendChild(td);
                    });
        
                    // Add Editar and Excluir buttons
                    const acoesCell = document.createElement('td');
                    acoesCell.classList.add('d-flex', 'justify-content-around');
        
                    const editarButton = document.createElement('button');
                    editarButton.textContent = 'Editar';
                    editarButton.classList.add('btn', 'btn-confirmar', 'bg-azul', 'peso-500', 'fc-branco');
                    editarButton.addEventListener('click', () => this.editarListaNegra(item.id));
                    acoesCell.appendChild(editarButton);
        
                    const excluirButton = document.createElement('button');
                    excluirButton.textContent = 'Excluir';
                    excluirButton.classList.add('btn', 'btn-cancelar', 'bg-cinza', 'peso-500', 'fc-branco');
                    excluirButton.addEventListener('click', () => this.excluirListaNegra(item.id));
                    acoesCell.appendChild(excluirButton);
        
                    row.appendChild(acoesCell);
                    tableBody.appendChild(row);
                });
        
            } catch (error) {
                console.error('Erro ao mostrar lista negra:', error);
                throw error;
            }
        }

        //Mostrar com opções de cancelar e confirmar
        static async mostrarTodasReservas() {
            try {
                const reservas = await this.listarReservas();
                const tableBody = document.getElementById('reservas');
                tableBody.innerHTML = '';
                await this.preencherTabelaReserva(reservas, tableBody);
            } catch (error) {
                console.error('Erro ao mostrar reservas:', error);
            }
        }

        static async mostrarReservasHoje(){
            try{
                const reservasHoje = await this.listarReservasHoje();           
                const tabela = document.getElementById('reservas-tabela');
                tabela.innerHTML = '';
                await this.preencherTabelaReserva(reservasHoje, tabela);
            } catch (error) {
                console.error('Erro ao mostrar reservas de hoje:', error);
            }
        }   
        static async preencherSelectComAPI() {
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
        
        static async createRecepcionista() {
                const nome = document.getElementById('confirmNome').textContent;
                const sobrenome = document.getElementById('confirmSobrenome').textContent;
                const login = document.getElementById('confirmLogin').textContent;
                const nivelAcesso = document.getElementById('confirmNivelAcesso').textContent === 'recepcionista' ? 1 : 2;
              
                const formData = {
                  nome: nome,
                  sobrenome: sobrenome,
                  login: login,
                  nivelAcesso: nivelAcesso,
                  ativo: true,
                };
              
                console.log('Dados do formulário:', formData);
              
                try {
                  const token = localStorage.getItem('token');
                  const response = await axios.post('http://localhost:3000/recepcionista', formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
                  if (response.status === 200) nextStep('modalCadastrarRecepcionista',3);
                } catch (error) {
                  console.error('Erro ao criar recepcionista:', error);
                  alert('Erro ao criar recepcionista. Por favor, tente novamente.');
                }
              };
              
        
       //Formatar tabelas
        //->Tabela cancelar e concluir
        static async preencherTabelaReserva(reservas, corpoTabela) {
            const promessas = reservas.map(async (reserva) => {
                try {
                    const usuario = await this.obterUsuario(reserva.idUsuario);
                    const linha = document.createElement('tr');
                    const colunas = [
                        reserva.idSala,
                        `${usuario.nome} ${usuario.sobrenome}`,
                        ocultarDocumento(usuario.identificador),
                        reserva.motivoReserva,
                        `${reserva.dataReservada} ${reserva.horaInicio}`,
                        `${reserva.dataReservada} ${reserva.horaFimReserva}`,
                    ];
        
                    colunas.forEach(coluna => {
                        const td = document.createElement('td');
                        td.textContent = coluna;
                        linha.appendChild(td);
                    });
        
                    const acoesCell = document.createElement('td');
                    acoesCell.classList.add('d-flex', 'justify-content-around');
                    switch (reserva.statusReserva) {
                        case 'PENDENTE':
                            var confirmarButton = document.createElement('button');
                            confirmarButton.textContent = 'Confirmar';
                            confirmarButton.classList.add('btn', 'btn-confirmar', 'bg-azul', 'peso-500', 'fc-branco');
                            confirmarButton.addEventListener('click', () => this.confirmarReserva(reserva.id));
                            acoesCell.appendChild(confirmarButton);
        
                            var cancelarButton = document.createElement('button');
                            cancelarButton.textContent = 'Cancelar';
                            cancelarButton.classList.add('btn', 'btn-cancelar', 'bg-cinza', 'peso-500', 'fc-branco');
                            cancelarButton.addEventListener('click', () => this.cancelarReserva(reserva.id));
                            acoesCell.appendChild(cancelarButton);
                            break;
        
                        case 'CONFIRMADO':
                            var concluirButton = document.createElement('button');
                            concluirButton.textContent = 'Concluir';
                            concluirButton.classList.add('btn', 'bg-azul', 'btn-confirmar', 'peso-500', 'fc-branco');
                            concluirButton.addEventListener('click', () => this.concluirReserva(reserva.id));
                            acoesCell.appendChild(concluirButton);
                            break;
        
                        case 'CONCLUIDO':
                            var msgConfirmado = document.createElement('h6');
                            msgConfirmado.textContent = 'Reserva já concluida';
                            acoesCell.appendChild(msgConfirmado);
                            break;
        
                        case 'CANCELADO':
                            var msgConfirmado = document.createElement('h6');
                            msgConfirmado.textContent = 'Reserva cancelada';
                            acoesCell.appendChild(msgConfirmado);
                            break;
    
                        default:
                            var msgErro = document.createElement('h6');
                            msgErro.textContent = 'Status desconhecido';
                            acoesCell.appendChild(msgErro);
                            break;
                    }
                    linha.appendChild(acoesCell);
                    corpoTabela.appendChild(linha);
                } catch (error) {
                    console.error('Erro ao formatar tabela de reservas:', error);
                }
            });
        
            await Promise.all(promessas);
        }
        //->Tabela excluir e editar
        static preencherTabela(items, tableBody, colunasDefinicao, metodoEditar, metodoExcluir) {
            try {
                if (!tableBody) {
                    console.error('Elemento tbody não encontrado');
                    return;
                }
                tableBody.innerHTML = '';
                items.forEach(item => {
                    const row = document.createElement('tr');
                    colunasDefinicao(item).forEach(coluna => {
                        const td = document.createElement('td');
                        td.textContent = coluna;
                        row.appendChild(td);
                    });
    
                    const acoesCell = document.createElement('td');
                    acoesCell.classList.add('d-flex', 'justify-content-around');
    
                    const editarButton = document.createElement('button');
                    editarButton.textContent = 'Editar';
                    editarButton.classList.add('btn', 'btn-confirmar', 'bg-azul', 'peso-500', 'fc-branco');
                    editarButton.addEventListener('click', () => this[metodoEditar](item.id));
                    acoesCell.appendChild(editarButton);
    
                    const excluirButton = document.createElement('button');
                    excluirButton.textContent = 'Excluir';
                    excluirButton.classList.add('btn', 'btn-cancelar', 'bg-cinza', 'peso-500', 'fc-branco');
                    excluirButton.addEventListener('click', () => this[metodoExcluir](item.id));
                    acoesCell.appendChild(excluirButton);
    
                    row.appendChild(acoesCell);
                    tableBody.appendChild(row);
                });
            } catch (error) {
                console.error(`Erro ao preencher tabela:`, error);
            }
        }

        /* Estados de uma reservas */
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

        //estilização de lista negra
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
    
        // Desativar recepcionista
        static async desativarRecepcionista(id) {
            const dado = { ativo: false };  // Correção: formato do dado como objeto
            return this.atualizarEntidade('recepcionista', id, dado);
        }

        static async editarUsuario(id){
            return this.atualizarEntidade('usuario', id, data);
        }
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

    observeElement('step3', ()=>{
        const confirmarButton = document.getElementById('confirmarRecepcionista');
        if(confirmarButton) confirmarButton.addEventListener('click', ()=>{ Controller.createRecepcionista();});
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