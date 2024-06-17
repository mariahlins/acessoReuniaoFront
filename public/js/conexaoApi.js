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
    const inicio=documento.slice(0, 3);
    const fim=documento.slice(-2);
    const asteriscos='*'.repeat(documento.length - 5);
    return inicio + asteriscos + fim;
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


class Controller{

    static async exibirDataAtual(){
        const dataAtual=document.getElementById('data-hoje');
        if(dataAtual){
            const data=new Date();
            dataAtual.innerText=formatarDataBr(data);
        }
    }

    static async fazerLogin(){
        const loginForm=document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (event) => {
                event.preventDefault(); 
                const formData=new FormData(loginForm);
                const data={
                    login: formData.get('login'),
                    senha: formData.get('senha'),
                };
                try {
                    const response=await axios.post('http://localhost:3000/recepcionista/login', data);
                    if (response.status === 200) {
                        localStorage.setItem('token', response.data);
                        window.location.href='./public/views/afterLogin/home.html';
                    }
                } catch (error) {
                    const errorMsg=document.getElementById('error-msg');
                    if (errorMsg) errorMsg.textContent='Login ou senha inválidos.';
                }
            });
        }
    }

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

    static async obterReservas(){
        try{
            return await axios.get(`http://localhost:3000/reserva`);
        }catch(error){
            console.error('Erro ao obter reservas', error);
        }
    }

    static async obterReservaPorId(id){
        try{
            return await axios.get(`http://localhost:3000/reserva/${id}`);
        }catch(error){
            console.error('Erro ao obter reserva por id', error);
        }
    }

    static async cancelarReserva(id){
        try{
            let token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/reserva/${id}`, { statusReserva: 'Cancelada', dataModificacaoStatus: new Date()}, {headers: { 'Authorization': `Bearer ${token}`}});
        }catch(error){
            console.error('Erro ao cancelar reserva', error);
        }
    }

    static async listarReservas(){
        try{
            const token=localStorage.getItem('token');
            const response=await axios.get('http://localhost:3000/reserva', {headers: { 'Authorization': `Bearer ${token}` }});
            if (response.status===200) return response.data;
            throw new Error('Token inválido ou erro ao buscar reservas');
        }catch (error){
            console.error('Erro ao listar reservas:', error);
            throw error;
        }
    }

    static async listarUsuarios(){
        try{
            const token=localStorage.getItem('token');
            const response=await axios.get('http://localhost:3000/usuario', {headers: { 'Authorization': `Bearer ${token}` }});
            if (response.status===200) return response.data;
            throw new Error('Token inválido ou erro ao buscar usuários');
        }catch (error){
            console.error('Erro ao listar usuários:', error);
            throw error;
        }
    }
    
    static async consultarUsuarioPorId(id){
        try {
            const token = localStorage.getItem('token'); 
            const response = await axios.get(`http://localhost:3000/usuario/${id}`,{headers: { 'Authorization': `Bearer ${token}` }});
            if (response.status === 200) return response.data;
            else throw new Error('Erro ao consultar usuário por ID');
        } catch (error) {
            console.error('Erro ao consultar usuário por ID:', error);
            throw error;
        }
    }
    
    static async mostrarUsuarios(){
        try{
            const usuarios=await this.listarUsuarios();
            const tableBody=document.getElementById('after-login-usuarios');
            if (!tableBody){
                console.error('Elemento tbody não encontrado');
                return;
            }
            tableBody.innerHTML='';
            for (const usuario of usuarios){
                const row=document.createElement('tr');
                const colunas=[
                    `${usuario.nome} ${usuario.sobrenome}`,
                    ocultarDocumento(usuario.identificador),
                    usuario.email,
                ];
                for (const coluna of colunas){
                    const td=document.createElement('td');
                    td.textContent=coluna;
                    row.appendChild(td);
                }
                
                const acoesCell = document.createElement('td');
                acoesCell.classList.add('d-flex', 'justify-content-around');

                const editarButton = document.createElement('button');
                editarButton.textContent = 'Editar';
                editarButton.addEventListener('click', () => this.editarUsuario(usuario.id));
                acoesCell.appendChild(editarButton);
    
                const excluirButton = document.createElement('button');
                excluirButton.textContent = 'Excluir';
                excluirButton.addEventListener('click', () => this.deletarUsuario(usuario.id));
                acoesCell.appendChild(excluirButton);
    
                row.appendChild(acoesCell);
    
                tableBody.appendChild(row);
    
            }
        }catch(error){
            console.error('Erro ao mostrar usuários:', error);
        }
    }

    static async concluirReserva(id){
        try{
            let token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/reserva/concluir/${id}`, { statusReserva: 'Concluída', dataModificacaoStatus: new Date()}, {headers: { 'Authorization': `Bearer ${token}`}});
       }catch(error){
            console.error('Erro ao concluir reserva', error);
        }
    }

    static async confirmarReserva(id){
        try{
            let token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/reserva/confirmar/${id}`, { statusReserva: 'Confirmada', dataModificacaoStatus: new Date()}, {headers: { 'Authorization': `Bearer ${token}`}});
        }catch(error){
            console.error('Erro ao confirmar reserva', error);
        }
    }
    
    static async formatarTabelaResresas(reservas, corpoTabela) {
        const promessas = reservas.map(async (reserva) => {
            try {
                const usuario = await this.consultarUsuarioPorId(reserva.idUsuario);
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
                        msgConfirmado.textContent = 'RESERVA JÁ CONCLUÍDA';
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

    static async mostrarTodasReservas() {
        try {
            const reservas = await this.listarReservas();
            const tableBody = document.getElementById('reservas');
            tableBody.innerHTML = '';
            await this.formatarTabelaResresas(reservas, tableBody);
        } catch (error) {
            console.error('Erro ao mostrar reservas:', error);
        }
    }

    static async mostrarReservasHoje(){
        try{
            const reservas = await this.obterReservas();
            const reservasHoje = reservas.data.filter((reserva) => {
                const dataReserva = parseDate(reserva.dataReservada);
                return ehHoje(dataReserva);
            });
            console.log(reservasHoje);
            const tabela = document.getElementById('reservas');
            tabela.innerHTML = '';
            await this.formatarTabelaResresas(reservasHoje, tabela);
        } catch (error) {
            console.error('Erro ao mostrar reservas de hoje:', error);
        }
    }

    static async listarSalas(){
        try{
            const response = await axios.get('http://localhost:3000/sala');
            if (response.status === 200) return response.data;
            throw new Error('Erro ao buscar salas');
        }catch(error){
            console.error('Erro ao listar salas:', error);
            throw error;
        }
    }

    static async mostrarSalas(){
        try{
            const salas = await this.listarSalas();
            const tableBody = document.getElementById('after-login-salas'); // Mudado para 'after-login-salas'
            if (!tableBody){
                console.error('Elemento tbody não encontrado');
                return;
            }
            tableBody.innerHTML = '';
            salas.forEach(sala=>{

            });
            for (const sala of salas){
                const row = document.createElement('tr');
                const colunas = [
                    sala.nome,
                    sala.andar,
                    sala.situacao,
                    sala.capMax,
                ];
                for (const coluna of colunas){
                    const td = document.createElement('td');
                    td.textContent = coluna;
                    row.appendChild(td);
                }
    
                const acoesCell = document.createElement('td');
                acoesCell.classList.add('d-flex', 'justify-content-around');
    
                const editarButton = document.createElement('button');
                editarButton.textContent = 'Editar';
                editarButton.addEventListener('click', () => this.editarSala(sala.id));
                acoesCell.appendChild(editarButton);
    
                const excluirButton = document.createElement('button');
                excluirButton.textContent = 'Excluir';
                excluirButton.addEventListener('click', () => this.excluirSala(sala.id));
                acoesCell.appendChild(excluirButton);
    
                row.appendChild(acoesCell);
    
                tableBody.appendChild(row);
            }
        }catch(error){
            console.error('Erro ao mostrar salas:', error);
        }
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

    observeElement('login-component', () => {
        Controller.fazerLogin();
    });

    observeElement('after-login-home', () => {
        const pesquisaFiltro = document.getElementById('pesquisa-filtro');
        if (pesquisaFiltro) {
            Controller.mostrarReservasHoje();
            Controller.exibirDataAtual();
            pesquisaFiltro.addEventListener('input', () => Controller.filtrarTabela('reservas'));
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
});