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
            await axios.put(`http://localhost:3000/reserva/${id}`, { statusReserva: 'Cancelada', dataModificacaoStatus: new Date()});
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

    static async listarUsuario(){
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

    static async concluirReserva(id){
        try{
            await axios.put(`http://localhost:3000/reserva/${id}`, { statusReserva: 'Concluída', dataModificacaoStatus: new Date()}, {headers: { 'Authorization': `Bearer ${token}` }});
        }
        catch(error){
            console.error('Erro ao concluir reserva', error);
        }
    }

    static async consultarUsuarioPorId(id) {
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
    
    static async mostrarTodasReservas() {
        try {
            const reservas = await this.listarReservas();
            const tableBody = document.getElementById('reservas-tabela');
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

    static async mostrarReservasHoje() {
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


}

document.addEventListener('DOMContentLoaded', () => {
    // mutation observer para verificar se o elementos ja foram carregados
    const observer=new MutationObserver((_, observer) => {

        const loginComponent=document.getElementById('login-component');
        const pesquisaFiltro=document.getElementById('pesquisa-filtro');
        const afterLoginHome=document.getElementById('after-login-home');
        const afterLoginReservas=document.getElementById('after-login-reservas');

        if (loginComponent){
            Controller.fazerLogin();
            observer.disconnect();
        }
        if(afterLoginHome){
            Controller.mostrarReservasHoje();
            Controller.exibirDataAtual();
            pesquisaFiltro.addEventListener('input', () => Controller.filtrarTabela('reservas-hoje-tabela'));
            observer.disconnect();
        }
        if(afterLoginReservas && pesquisaFiltro){
            Controller.mostrarTodasReservas();
            pesquisaFiltro.addEventListener('input', () => Controller.filtrarTabela('reservas-tabela'));
            observer.disconnect();
        }
    });
    observer.observe(document, { childList: true, subtree: true });
});