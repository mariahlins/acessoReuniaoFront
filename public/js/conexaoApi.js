class Controller{

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
                    console.log('Login bem-sucedido:', response);
                    window.location.href = './public/views/afterLogin/home.html';
                } catch (error) {
                    throw error;
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Controller.fazerLogin();
});
