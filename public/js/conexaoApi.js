
class Controller{

    static async fazerLogin() {
        document.getElementById('login-form').addEventListener('submit', async (event) => {
            event.preventDefault(); 
            const formData = new FormData(document.getElementById('login-form'));
            const data={
                login:formData.get('login'),
                senha:formData.get('senha'),
            };
            try {
                const response = await axios.post(`http://localhost:3000/recepcionista/login`, data);
                console.log('Login bem-sucedido:', response);
                window.location.href = './public/views/afterLogin/home.html';
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                throw error;
            }
        });
    }

}

document.addEventListener('DOMContentLoaded', () => {
    Controller.fazerLogin();
});
