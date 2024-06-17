function formatarDataBr(data) {
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
function formatarData(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
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
    
                const concluirButton = document.createElement('button');
                concluirButton.textContent = 'Editar';
                concluirButton.addEventListener('click', () => this.editarUsuario(usuario.id));
                acoesCell.appendChild(concluirButton);
    
                const cancelarButton = document.createElement('button');
                cancelarButton.textContent = 'Excluir';
                cancelarButton.addEventListener('click', () => this.deletarUsuario(usuario.id));
                acoesCell.appendChild(cancelarButton);
    
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
            await axios.put(`http://localhost:3000/reserva/${id}`, { statusReserva: 'Concluída', dataModificacaoStatus: new Date()}, {headers: { 'Authorization': `Bearer ${token}`}});
       }catch(error){
            console.error('Erro ao concluir reserva', error);
        }
    }

    
    static async mostrarTodasReservas(){
        try {
            const reservas = await this.listarReservas();
            const tableBody = document.getElementById('after-login-reservas');
            if (!tableBody) {
                console.error('Elemento tbody não encontrado');
                return;
            }
            tableBody.innerHTML = '';
    
            for (const reserva of reservas) {
                try {
                    const usuario = await this.consultarUsuarioPorId(reserva.idUsuario);
    
                    const row = document.createElement('tr');
    
                    const colunas = [
                        reserva.idSala,
                        `${usuario.nome} ${usuario.sobrenome}`,
                        ocultarDocumento(usuario.identificador),
                        reserva.motivoReserva,
                        formatarData(reserva.horaInicio),
                        formatarData(reserva.horaFimReserva),
                    ];
    
                    for (const coluna of colunas) {
                        const td = document.createElement('td');
                        td.textContent = coluna;
                        row.appendChild(td);
                    }
    
                    const acoesCell = document.createElement('td');
    
                    const concluirButton = document.createElement('button');
                    concluirButton.textContent = 'Concluir';
                    concluirButton.addEventListener('click', () => this.concluirReserva(reserva.id));
                    acoesCell.appendChild(concluirButton);
    
                    const cancelarButton = document.createElement('button');
                    cancelarButton.textContent = 'Cancelar';
                    cancelarButton.addEventListener('click', () => this.cancelarReserva(reserva.id));
                    acoesCell.appendChild(cancelarButton);
    
                    row.appendChild(acoesCell);
    
                    tableBody.appendChild(row);
                } catch (userError) {
                    console.error(`Erro ao listar usuário para a reserva ${reserva.id}:`, userError);
                }
            }
        } catch (error) {
            console.error('Erro ao mostrar reservas:', error);
        }
    }

    static async mostrarReservasHoje(){
        try {
            const reservas = await this.obterReservas();
            const reservasHoje = reservas.data.filter((reserva) => {
                const dataReserva = new Date(reserva.horaInicio);
                const dataAtual = new Date();
                return dataReserva.getDate() === dataAtual.getDate() &&
                    dataReserva.getMonth() === dataAtual.getMonth() &&
                    dataReserva.getFullYear() === dataAtual.getFullYear();
            });
    
            const tabela = document.getElementById('reservas-hoje-tabela');
            if (tabela){
                for (const reserva of reservasHoje){
                    const usuario = await this.consultarUsuarioPorId(reserva.idUsuario);
                    const linha = document.createElement('tr');
                    const colunas = [
                        reserva.idSala,
                        `${usuario.nome} ${usuario.sobrenome}`,
                        ocultarDocumento(usuario.identificador),
                        reserva.motivoReserva,
                        formatarData(reserva.horaInicio),
                        formatarData(reserva.horaFimReserva),
                    ];

                    for (const coluna of colunas){
                        const td = document.createElement('td');
                        td.textContent = coluna;
                        linha.appendChild(td);
                    }
                    const acoesCell = document.createElement('td');
    
                    const concluirButton = document.createElement('button');
                    concluirButton.textContent = 'Concluir';
                    concluirButton.addEventListener('click', () => this.concluirReserva(reserva.id));
                    acoesCell.appendChild(concluirButton);
    
                    const cancelarButton = document.createElement('button');
                    cancelarButton.textContent = 'Cancelar';
                    cancelarButton.addEventListener('click', () => this.cancelarReserva(reserva.id));
                    acoesCell.appendChild(cancelarButton);
    
                    linha.appendChild(acoesCell);
    
                    tabela.appendChild(linha);
                }
            }
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

    static async listarRecepcionistas(){
        try{
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/recepcionista', {headers: { 'Authorization': `Bearer ${token}` }});
            if (response.status === 200) return response.data;
            throw new Error('Erro ao buscar recepcionistas');
        }catch(error){
            console.error('Erro ao listar recepcionistas:', error);
            throw error;
        }
    }

    static async mostrarRecepcionistas(){
        try{
            const recepcionistas = await this.listarRecepcionistas();
            const tableBody = document.getElementById('after-login-recepcionistas');
            if (!tableBody){
                console.error('Elemento tbody não encontrado');
                return;
            }
            tableBody.innerHTML = '';
            for (const recepcionista of recepcionistas){
                const row = document.createElement('tr');
                const colunas = [
                    `${recepcionista.nome} ${recepcionista.sobrenome}`,
                    recepcionista.nivelAcesso,
                    recepcionista.ativo,
                ];
                for (const coluna of colunas){
                    const td = document.createElement('td');
                    td.textContent = coluna;
                    row.appendChild(td);
                }
                tableBody.appendChild(row);
            }
        }catch(error){
            console.error('Erro ao mostrar recepcionistas:', error);
        }
    
    }

    static async verificarDisponibilidade(salaId, horaInicio, horaFim){
        try{
            const reservas = await this.obterReservas();
            const reservasSala = reservas.data.filter((reserva) => reserva.idSala === salaId);
            for (const reserva of reservasSala){
                const reservaInicio = new Date(reserva.horaInicio);
                const reservaFim = new Date(reserva.horaFimReserva);
                const inicio = new Date(horaInicio);
                const fim = new Date(horaFim);
                if (inicio >= reservaInicio && inicio < reservaFim) return false;
                if (fim > reservaInicio && fim <= reservaFim) return false;
            }
            return true;
        }catch(error){
            console.error('Erro ao verificar disponibilidade:', error);
            return false;
        }
    }

    static async selecionarSalaModalCoworking(){
        try{
            let salas = await this.listarSalas();
            salas = salas.filter(sala => sala.andar === 0);
            const container = document.getElementById('selecao-salas-modal');
    
            container.innerHTML = '';
    
            let salaSelecionadaId;
            let defaultInput = null;
            let primeiraSalaId = null;
    
            salas.forEach((sala, index) => {
    
                const input = document.createElement('input');
                input.type = 'radio';
                input.className = 'btn-check';
                input.name = 'roomOptions';
                input.id = `option${index + 1}`;
                input.autocomplete = 'off';
                if (index === 0) {
                    input.checked = true;
                    defaultInput = input;
                    primeiraSalaId = sala.id;
                }
    
                input.addEventListener('change', () => {
                    salaSelecionadaId = sala.id;  
                });
    
                const label = document.createElement('label');
                label.className = 'btn btn-outline-primary';
                label.htmlFor = `option${index + 1}`;
                label.textContent = sala.nome;
    
                container.appendChild(input);
                container.appendChild(label);
            });
    
            if (defaultInput){
                defaultInput.dispatchEvent(new Event('change'));
            }
    
            return salaSelecionadaId || primeiraSalaId;  
        }catch(error){
            console.error('Erro ao mostrar modal coworking:', error);
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
            pesquisaFiltro.addEventListener('input', () => Controller.filtrarTabela('reservas-hoje-tabela'));
        }
        const modalCoworking = document.getElementById('selecao-salas-modal');
        if (modalCoworking) {
            Controller.selecionarSalaModalCoworking();
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