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
                    window.location.href = './public/views/afterLogin/home.html';
                } catch (error) {
                    throw error;
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // mutation observer para verificar se o elementos ja foram carregados
    const observer = new MutationObserver((_, observer) => {
        const dataHoje = document.getElementById('data-hoje');
        const loginComponent = document.getElementById('login-component');
        if (dataHoje) {
            Controller.exibirDataAtual();
            observer.disconnect();
        }
        if (loginComponent) {
            Controller.fazerLogin();
        }
    });
    observer.observe(document, { childList: true, subtree: true });
});