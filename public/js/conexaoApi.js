function formatarDataBr(data) {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0'); 
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function ocultarDocumento(documento) {
    const inicio = documento.slice(0, 3);
    const fim = documento.slice(-2);
    const asteriscos = '*'.repeat(documento.length - 5);
    return inicio + asteriscos + fim;
}

class Controller{

    static async exibirDataAtual(){
        const dataAtual = document.getElementById('data-hoje');
        if(dataAtual){
            const data = new Date();
            dataAtual.innerText = formatarDataBr(data);
        }
    }

    static async fazerLogin() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (event) => {
                event.preventDefault(); 
                const formData = new FormData(loginForm);
                const data={
                    login:formData.get('login'),
                    senha:formData.get('senha'),
                };
                try {
                    const response = await axios.post(`http://localhost:3000/recepcionista/login`, data);
                    if(response.status === 200) 
                        window.location.href = './public/views/afterLogin/home.html';
                } catch (error) {
                    throw error;
                }
            });
        }
    }

    static async filtrarTabela(){
        console.log('Filtrando tabela...');
        const valorFiltro = document.getElementById('pesquisa-filtro').value;
        const tabela = document.getElementById('reservas-hoje-tabela');
        const linhas = tabela.getElementsByTagName('tr');
        const idColunaAcao = 'coluna-acao'; 
    
        for (let i = 1; i < linhas.length; i++){
            const colunas = linhas[i].getElementsByTagName('td');
            let corresponde = false;
        
            for (let j = 0; j < colunas.length; j++){
                if (colunas[j].id === idColunaAcao) continue;
        
                const coluna = colunas[j];
                if(coluna){
                    if(coluna.textContent.toLowerCase().includes(valorFiltro.toLowerCase())){
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

    }
}

document.addEventListener('DOMContentLoaded', () => {
    // mutation observer para verificar se o elementos ja foram carregados
    const observer = new MutationObserver((_, observer) => {
        const dataHoje = document.getElementById('data-hoje');
        const loginComponent = document.getElementById('login-component');
        const pesquisaFiltro = document.getElementById('pesquisa-filtro');
        const reservasHojeTabela = document.getElementById('reservas-hoje-tabela');

        if (dataHoje) {
            Controller.exibirDataAtual();
        }
        if (loginComponent) {
            Controller.fazerLogin();
        }
        if (pesquisaFiltro && reservasHojeTabela) {
            pesquisaFiltro.addEventListener('input', Controller.filtrarTabela);
            observer.disconnect();
        }
    });
    observer.observe(document, { childList: true, subtree: true });
});