class RecepcionistaController {
    static async fazerLogin(login, senha) {
        document.getElementById('login-form').addEventListener('submit', async (event) => {
            event.preventDefault(); 
            console.log("AQUI UM");
            const formData = new FormData(document.getElementById('login-form'));
            const data={
                login:formData.get('login'),
                senha:formData.get('senha'),
            };
            console.log(data);
            /*try {
                const response = await axios.post(`http://localhost:3000/recepcionista/login`, data);
                // Coloque aqui o que fazer após o login bem-sucedido
                console.log('Login bem-sucedido:', response);
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                throw error;
            }*/
        });
    }
}
console.log("AQUI PORRA");
document.addEventListener('DOMContentLoaded', () => {
    RecepcionistaController.fazerLogin();
});
