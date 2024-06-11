class RecepcionistaController{

    static async fazerLogin(){
        document.getElementById('login-form').addEventListener('submit', async(event) => {
            event.preventDefault();
            const formData = new FormData(document.getElementById('login-form'));
            const data = { login : formData.get('login'), senha : formData.get('senha') }; 
            try{
                await axios.post(`http://localhost:3000/recepcionista/login`, data);
                //colocar aqui o que fazer após o login
            }catch(error){
                console.error('Erro ao fazer login', error);
            }
        });
    }


}
module.exports = RecepcionistaController;